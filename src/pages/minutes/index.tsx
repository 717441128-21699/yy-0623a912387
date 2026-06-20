import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { useMeetingStore } from '@/store/useMeetingStore';
import { dangerCategoryMap, statusMap } from '@/data/mockData';
import type { Meeting } from '@/types';
import styles from './index.module.scss';

const tabOptions = [
  { key: 'all', label: '全部' },
  { key: 'reviewing', label: '预审中' },
  { key: 'rectification', label: '整改中' },
  { key: 'completed', label: '已闭环' }
];

const MinutesPage: React.FC = () => {
  const meetings = useMeetingStore(state => state.meetings);
  const initFromStorage = useMeetingStore(state => state.initFromStorage);
  
  const [activeTab, setActiveTab] = useState<string>('all');

  useDidShow(() => {
    console.log('[MinutesPage] useDidShow - 刷新数据');
    initFromStorage();
  });

  const minuteMeetings = meetings.filter(m => 
    m.status !== 'pending' && m.problems.length > 0
  );

  const hasRectification = (m: Meeting) => {
    return m.conclusion === 'modify' || m.conclusion === 'reject' || m.status === 'modify' || !!(m.rectificationMaterials && m.rectificationMaterials.length > 0);
  };

  const getClosedCount = (m: Meeting) => {
    return m.problems.filter(p => p.isRectified === true).length;
  };

  const getUnclosedCount = (m: Meeting) => {
    return m.problems.filter(p => p.isRectified !== true).length;
  };

  const getFilteredMeetings = () => {
    switch (activeTab) {
      case 'reviewing':
        return minuteMeetings.filter(m => m.status === 'reviewing');
      case 'rectification':
        return minuteMeetings.filter(m => hasRectification(m) && getUnclosedCount(m) > 0);
      case 'completed':
        return minuteMeetings.filter(m => hasRectification(m) && getUnclosedCount(m) === 0);
      default:
        return minuteMeetings;
    }
  };

  const filteredMeetings = getFilteredMeetings();

  const stats = {
    total: minuteMeetings.length,
    reviewing: minuteMeetings.filter(m => m.status === 'reviewing').length,
    rectification: minuteMeetings.filter(m => hasRectification(m) && getUnclosedCount(m) > 0).length,
    completed: minuteMeetings.filter(m => hasRectification(m) && getUnclosedCount(m) === 0).length
  };

  const getSeriousCount = (meeting: Meeting) => {
    return meeting.problems.filter(p => p.severity === 'serious').length;
  };

  const getMediumCount = (meeting: Meeting) => {
    return meeting.problems.filter(p => p.severity === 'medium').length;
  };

  const getLightCount = (meeting: Meeting) => {
    return meeting.problems.filter(p => p.severity === 'light').length;
  };

  const handleCardClick = (meeting: Meeting) => {
    if (hasRectification(meeting)) {
      Taro.navigateTo({
        url: `/pages/rectification/index?id=${meeting.id}`
      });
    } else {
      Taro.navigateTo({
        url: `/pages/minute-detail/index?id=${meeting.id}`
      });
    }
  };

  const isUrgent = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>纪要整改</Text>
        <Text className={styles.pageSubtitle}>会议纪要 · 问题跟踪 · 整改闭环</Text>
        
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.total}</Text>
            <Text className={styles.statLabel}>纪要总数</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.rectification}</Text>
            <Text className={styles.statLabel}>整改中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.completed}</Text>
            <Text className={styles.statLabel}>已闭环</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{stats.reviewing}</Text>
            <Text className={styles.statLabel}>预审中</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabSection}>
        {tabOptions.map(item => (
          <View
            key={item.key}
            className={`${styles.tabItem} ${activeTab === item.key ? styles.active : ''}`}
            onClick={() => setActiveTab(item.key)}
          >
            <Text>{item.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.listSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>论证项目</Text>
          <Text className={styles.count}>共 {filteredMeetings.length} 项</Text>
        </View>
        
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map(meeting => {
            const closedCount = getClosedCount(meeting);
            const unclosedCount = getUnclosedCount(meeting);
            const isRect = hasRectification(meeting);
            
            return (
              <View
                key={meeting.id}
                className={styles.minuteCard}
                onClick={() => handleCardClick(meeting)}
              >
                <View className={styles.cardHeader}>
                  <Text className={styles.projectName}>{meeting.projectName}</Text>
                  <StatusTag text={statusMap[meeting.status]} type={meeting.status as any} />
                </View>
                
                <Text className={styles.dangerName}>{meeting.dangerName}</Text>
                
                <View className={styles.infoRow}>
                  <Text className={styles.label}>会议时间</Text>
                  <Text className={styles.value}>{meeting.meetingTime}</Text>
                </View>
                
                <View className={styles.infoRow}>
                  <Text className={styles.label}>问题数量</Text>
                  <Text className={styles.value}>{meeting.problems.length} 项</Text>
                </View>
                
                {meeting.problems.length > 0 && (
                  <View className={styles.problemSummary}>
                    <View className={styles.problemItem}>
                      <Text className={`${styles.count} ${styles.serious}`}>{getSeriousCount(meeting)}</Text>
                      <Text className={styles.label}>严重</Text>
                    </View>
                    <View className={styles.problemItem}>
                      <Text className={`${styles.count} ${styles.medium}`}>{getMediumCount(meeting)}</Text>
                      <Text className={styles.label}>一般</Text>
                    </View>
                    <View className={styles.problemItem}>
                      <Text className={`${styles.count} ${styles.light}`}>{getLightCount(meeting)}</Text>
                      <Text className={styles.label}>轻微</Text>
                    </View>
                  </View>
                )}
                
                {isRect && (
                  <View className={styles.rectificationProgress}>
                    <View className={styles.progressHeader}>
                      <Text className={styles.progressTitle}>闭环进度</Text>
                      <Text className={styles.progressPercent}>
                        {meeting.problems.length > 0 ? Math.round((closedCount / meeting.problems.length) * 100) : 0}%
                      </Text>
                    </View>
                    <View className={styles.progressBar}>
                      <View 
                        className={styles.progressFill} 
                        style={{ width: `${meeting.problems.length > 0 ? Math.round((closedCount / meeting.problems.length) * 100) : 0}%` }}
                      ></View>
                    </View>
                    <View className={styles.progressStats}>
                      <View className={styles.progressStat}>
                        <Text className={styles.statDotClosed}></Text>
                        <Text className={styles.statText}>已闭合 {closedCount} 项</Text>
                      </View>
                      <View className={styles.progressStat}>
                        <Text className={styles.statDotUnclosed}></Text>
                        <Text className={styles.statText}>未闭合 {unclosedCount} 项</Text>
                      </View>
                    </View>
                  </View>
                )}
                
                {isRect && meeting.rectificationDeadline && (
                  <View className={styles.rectificationInfo}>
                    <View className={styles.infoLine}>
                      <Text className={styles.label}>整改责任人</Text>
                      <Text className={styles.value}>{meeting.rectificationResponsible || '待确认'}</Text>
                    </View>
                    <View className={styles.infoLine}>
                      <Text className={styles.label}>整改期限</Text>
                      <Text className={`${styles.value} ${styles.deadline} ${isUrgent(meeting.rectificationDeadline) ? styles.urgent : ''}`}>
                        {meeting.rectificationDeadline}
                        {isUrgent(meeting.rectificationDeadline) && ' (临近)'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>暂无相关纪要</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MinutesPage;
