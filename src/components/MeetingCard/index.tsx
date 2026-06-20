import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { dangerCategoryMap, getBusinessStatus } from '@/data/mockData';
import type { Meeting } from '@/types';
import styles from './index.module.scss';

interface MeetingCardProps {
  meeting: Meeting;
  onClick?: () => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/meeting-detail/index?id=${meeting.id}`
      });
    }
  };
  
  const bizStatus = getBusinessStatus(meeting);

  return (
    <View className={styles.meetingCard} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <Text className={styles.projectName}>{meeting.projectName}</Text>
        <StatusTag text={bizStatus.label} type={bizStatus.type as any} />
      </View>
      
      <View className={styles.dangerInfo}>
        <StatusTag text={dangerCategoryMap[meeting.dangerCategory]} type={meeting.dangerCategory as any} />
        <Text className={styles.dangerName}>{meeting.dangerName}</Text>
      </View>
      
      <View className={styles.infoRow}>
        <Text className={styles.label}>项目编号</Text>
        <Text className={styles.value}>{meeting.projectCode}</Text>
      </View>
      
      <View className={styles.infoRow}>
        <Text className={styles.label}>会议时间</Text>
        <Text className={styles.value}>{meeting.meetingTime}</Text>
      </View>
      
      <View className={styles.infoRow}>
        <Text className={styles.label}>会议地点</Text>
        <Text className={styles.value}>{meeting.meetingLocation}</Text>
      </View>
      
      <View className={styles.cardFooter}>
        <Text className={styles.time}>创建时间：{meeting.createTime}</Text>
        <Text className={styles.arrow}>{'>'}</Text>
      </View>
    </View>
  );
};

export default MeetingCard;
