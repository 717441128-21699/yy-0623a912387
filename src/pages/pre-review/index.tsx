import React, { useState } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { useMeetingStore } from '@/store/useMeetingStore';
import { dangerCategoryMap, severityMap, getBusinessStatus } from '@/data/mockData';
import type { Meeting } from '@/types';
import styles from './index.module.scss';

const statusFilters = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待预审' },
  { key: 'reviewing', label: '预审中' },
  { key: 'modify', label: '整改中' },
  { key: 'closed', label: '已闭环' },
  { key: 'reject', label: '重新论证' }
];

const PreReviewPage: React.FC = () => {
  const meetings = useMeetingStore(state => state.meetings);
  const initFromStorage = useMeetingStore(state => state.initFromStorage);
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  useDidShow(() => {
    console.log('[PreReviewPage] useDidShow - 刷新数据');
    initFromStorage();
  });

  const getFilteredMeetings = () => {
    let result = meetings;
    
    if (activeFilter !== 'all') {
      result = result.filter(m => {
        const bs = getBusinessStatus(m);
        if (activeFilter === 'pending') return m.status === 'pending' && bs.type === 'pending';
        if (activeFilter === 'reviewing') return bs.type === 'reviewing';
        if (activeFilter === 'modify') return bs.type === 'modify' || bs.type === 'rectifying';
        if (activeFilter === 'closed') return bs.type === 'closed';
        if (activeFilter === 'reject') return bs.type === 'reject';
        if (activeFilter === 'pass') return bs.type === 'pass';
        return true;
      });
    }
    
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter(m => 
        m.projectName.toLowerCase().includes(kw) ||
        m.projectCode.toLowerCase().includes(kw) ||
        m.dangerName.toLowerCase().includes(kw)
      );
    }
    
    return result;
  };

  const filteredMeetings = getFilteredMeetings();

  const stats = {
    total: meetings.length,
    pending: meetings.filter(m => m.status === 'pending' && getBusinessStatus(m).type === 'pending').length,
    reviewing: meetings.filter(m => getBusinessStatus(m).type === 'reviewing').length,
    rectification: meetings.filter(m => {
      const t = getBusinessStatus(m).type;
      return t === 'modify' || t === 'rectifying';
    }).length,
    closed: meetings.filter(m => getBusinessStatus(m).type === 'closed').length,
    reject: meetings.filter(m => getBusinessStatus(m).type === 'reject').length
  };

  const getReviewProgress = (meeting: Meeting) => {
    const total = meeting.expertReviewItems.length;
    const checked = meeting.expertReviewItems.filter(item => item.checked).length;
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  const getCheckedCount = (meeting: Meeting) => {
    return meeting.expertReviewItems.filter(item => item.checked).length;
  };

  const getProblemCount = (meeting: Meeting) => {
    return meeting.problems.length;
  };

  const getSeriousProblemCount = (meeting: Meeting) => {
    return meeting.problems.filter(p => p.severity === 'serious').length;
  };

  const getMaterialCount = (meeting: Meeting) => {
    return meeting.materials.length;
  };

  const handleCardClick = (meeting: Meeting) => {
    const bs = getBusinessStatus(meeting);
    if (bs.type === 'closed' && meeting.rectificationSubmitted) {
      Taro.navigateTo({
        url: `/pages/rectification/index?id=${meeting.id}`
      });
    } else if (bs.type === 'modify' || bs.type === 'rectifying') {
      Taro.navigateTo({
        url: `/pages/rectification/index?id=${meeting.id}`
      });
    } else if (bs.type === 'reject') {
      Taro.navigateTo({
        url: `/pages/minute-detail/index?id=${meeting.id}`
      });
    } else {
      Taro.navigateTo({
        url: `/pages/review-detail/index?id=${meeting.id}`
      });
    }
  };

  const getMaterialTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      plan: '📄',
      calculation: '📊',
      drawing: '📐',
      review: '📝'
    };
    return icons[type] || '📁';
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>材料预审</Text>
        <Text className={styles.pageSubtitle}>专家逐项审查，高效专业</Text>
        
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.total}</Text>
            <Text className={styles.statLabel}>项目总数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.pending}</Text>
            <Text className={styles.statLabel}>待预审</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.reviewing}</Text>
            <Text className={styles.statLabel}>预审中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.rectification}</Text>
            <Text className={styles.statLabel}>整改中</Text>
          </View>
        </View>
        <View className={styles.statsRowSecond}>
          <View className={styles.statItemSmall}>
            <Text className={styles.statNumberSmall}>{stats.closed}</Text>
            <Text className={styles.statLabelSmall}>已闭环</Text>
          </View>
          <View className={styles.statItemSmall}>
            <Text className={styles.statNumberSmall}>{stats.reject}</Text>
            <Text className={styles.statLabelSmall}>重新论证</Text>
          </View>
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.searchRow}>
          <Input
            className={styles.searchInput}
            placeholder="搜索项目编号或名称"
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
        </View>
        <View className={styles.filterRow}>
          {statusFilters.map(item => (
            <View
              key={item.key}
              className={`${styles.filterItem} ${activeFilter === item.key ? styles.active : ''}`}
              onClick={() => setActiveFilter(item.key)}
            >
              <Text>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.listSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>预审项目</Text>
          <Text className={styles.count}>共 {filteredMeetings.length} 项</Text>
        </View>
        
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map(meeting => {
            const progress = getReviewProgress(meeting);
            const checkedCount = getCheckedCount(meeting);
            const totalCount = meeting.expertReviewItems.length;
            const problemCount = getProblemCount(meeting);
            const seriousCount = getSeriousProblemCount(meeting);
            const bizStatus = getBusinessStatus(meeting);
            
            return (
              <View
                key={meeting.id}
                className={styles.reviewCard}
                onClick={() => handleCardClick(meeting)}
              >
                <View className={styles.cardHeader}>
                  <Text className={styles.projectName}>{meeting.projectName}</Text>
                  <View className={styles.cardTags}>
                    <StatusTag text={bizStatus.label} type={bizStatus.type as any} />
                  </View>
                </View>
                
                <View className={styles.cardSubHeader}>
                  <StatusTag text={dangerCategoryMap[meeting.dangerCategory]} type={meeting.dangerCategory as any} />
                  <Text className={styles.dangerName}>{meeting.dangerName}</Text>
                </View>
                
                <View className={styles.progressBar}>
                  <View className={styles.progressFill} style={{ width: `${progress}%` }}></View>
                </View>
                
                <View className={styles.progressInfo}>
                  <Text className={styles.progressText}>已审查 {checkedCount}/{totalCount} 项</Text>
                  <Text className={styles.progressPercent}>{progress}%</Text>
                </View>
                
                <View className={styles.problemStatsRow}>
                  <View className={styles.problemStat}>
                    <Text className={styles.problemStatLabel}>发现问题</Text>
                    <Text className={`${styles.problemStatNum} ${problemCount > 0 ? styles.hasProblem : ''}`}>{problemCount}</Text>
                  </View>
                  {problemCount > 0 && (
                    <>
                      <View className={styles.problemStat}>
                        <Text className={styles.problemStatLabel}>严重</Text>
                        <Text className={`${styles.problemStatNum} ${seriousCount > 0 ? styles.serious : ''}`}>{seriousCount}</Text>
                      </View>
                      <View className={styles.problemStat}>
                        <Text className={styles.problemStatLabel}>一般/轻微</Text>
                        <Text className={styles.problemStatNum}>{problemCount - seriousCount}</Text>
                      </View>
                    </>
                  )}
                </View>
                
                <View className={styles.materialPreview}>
                  {meeting.materials.slice(0, 3).map(mat => (
                    <View key={mat.id} className={styles.materialItem}>
                      <Text className={styles.materialIcon}>{getMaterialTypeIcon(mat.type)}</Text>
                      <Text>{mat.name.split('.').pop()}</Text>
                    </View>
                  ))}
                  {getMaterialCount(meeting) > 3 && (
                    <View className={styles.materialItem}>
                      <Text>等{getMaterialCount(meeting)}份材料</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无相关项目</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PreReviewPage;
