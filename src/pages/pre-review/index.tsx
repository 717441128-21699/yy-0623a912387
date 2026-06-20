import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { useMeetingStore } from '@/store/useMeetingStore';
import { dangerCategoryMap } from '@/data/mockData';
import type { Meeting } from '@/types';
import styles from './index.module.scss';

const statusFilters = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待预审' },
  { key: 'reviewing', label: '预审中' }
];

const PreReviewPage: React.FC = () => {
  const meetings = useMeetingStore(state => state.meetings);
  const initFromStorage = useMeetingStore(state => state.initFromStorage);
  
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useDidShow(() => {
    console.log('[PreReviewPage] useDidShow - 刷新数据');
    initFromStorage();
  });

  const reviewMeetings = meetings.filter(m => 
    m.status === 'pending' || m.status === 'reviewing'
  );

  const filteredMeetings = reviewMeetings.filter(meeting => {
    if (activeFilter === 'all') return true;
    return meeting.status === activeFilter;
  });

  const stats = {
    total: reviewMeetings.length,
    pending: reviewMeetings.filter(m => m.status === 'pending').length,
    reviewing: reviewMeetings.filter(m => m.status === 'reviewing').length
  };

  const getReviewProgress = (meeting: Meeting) => {
    const total = meeting.expertReviewItems.length;
    const checked = meeting.expertReviewItems.filter(item => item.checked).length;
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  const getCheckedCount = (meeting: Meeting) => {
    return meeting.expertReviewItems.filter(item => item.checked).length;
  };

  const getMaterialCount = (meeting: Meeting) => {
    return meeting.materials.length;
  };

  const handleCardClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/review-detail/index?id=${id}`
    });
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
            <Text className={styles.statLabel}>待预审项目</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.pending}</Text>
            <Text className={styles.statLabel}>未开始</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.reviewing}</Text>
            <Text className={styles.statLabel}>预审中</Text>
          </View>
        </View>
      </View>

      <View className={styles.filterSection}>
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
            
            return (
              <View
                key={meeting.id}
                className={styles.reviewCard}
                onClick={() => handleCardClick(meeting.id)}
              >
                <View className={styles.cardHeader}>
                  <Text className={styles.projectName}>{meeting.projectName}</Text>
                  <StatusTag text={dangerCategoryMap[meeting.dangerCategory]} type={meeting.dangerCategory as any} />
                </View>
                
                <Text className={styles.dangerName}>{meeting.dangerName}</Text>
                
                <View className={styles.progressBar}>
                  <View className={styles.progressFill} style={{ width: `${progress}%` }}></View>
                </View>
                
                <View className={styles.progressInfo}>
                  <Text className={styles.progressText}>已审查 {checkedCount}/{totalCount} 项</Text>
                  <Text className={styles.progressPercent}>{progress}%</Text>
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
            <Text className={styles.emptyText}>暂无待预审项目</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PreReviewPage;
