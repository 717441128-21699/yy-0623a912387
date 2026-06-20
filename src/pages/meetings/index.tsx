import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import MeetingCard from '@/components/MeetingCard';
import { useMeetingStore } from '@/store/useMeetingStore';
import type { MeetingStatus } from '@/types';
import styles from './index.module.scss';

const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待预审' },
  { key: 'reviewing', label: '预审中' },
  { key: 'pass', label: '已通过' },
  { key: 'modify', label: '待整改' },
  { key: 'reject', label: '重新论证' }
];

const MeetingsPage: React.FC = () => {
  const meetings = useMeetingStore(state => state.meetings);
  const initFromStorage = useMeetingStore(state => state.initFromStorage);
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  useDidShow(() => {
    console.log('[MeetingsPage] useDidShow - 刷新数据');
    initFromStorage();
  });

  const filteredMeetings = meetings.filter(meeting => {
    const statusMatch = activeFilter === 'all' || meeting.status === activeFilter;
    const searchMatch = !searchText || 
      meeting.projectName.includes(searchText) || 
      meeting.projectCode.includes(searchText);
    return statusMatch && searchMatch;
  });

  const handleCreate = () => {
    Taro.navigateTo({
      url: '/pages/meeting-create/index'
    });
  };

  const handleFilterClick = (key: string) => {
    setActiveFilter(key);
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>危大工程论证</Text>
        <Text className={styles.pageSubtitle}>专业协同 · 高效论证 · 全程追溯</Text>
        
        <View className={styles.searchBox}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索项目名称/编号"
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>
      </View>

      <ScrollView scrollX className={styles.filterTabs}>
        {filterOptions.map(item => (
          <View
            key={item.key}
            className={`${styles.tabItem} ${activeFilter === item.key ? styles.active : ''}`}
            onClick={() => handleFilterClick(item.key)}
          >
            <Text>{item.label}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.listSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>论证会议</Text>
          <Text className={styles.count}>共 {filteredMeetings.length} 项</Text>
        </View>
        
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map(meeting => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无相关论证会议</Text>
          </View>
        )}
      </View>

      <View className={styles.fabButton} onClick={handleCreate}>
        <Text className={styles.fabIcon}>+</Text>
      </View>
    </View>
  );
};

export default MeetingsPage;
