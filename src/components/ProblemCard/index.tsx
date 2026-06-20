import React from 'react';
import { View, Text } from '@tarojs/components';
import StatusTag from '@/components/StatusTag';
import { severityMap, conclusionMap } from '@/data/mockData';
import type { ProblemItem } from '@/types';
import styles from './index.module.scss';

interface ProblemCardProps {
  problem: ProblemItem;
  index?: number;
  showDiscussion?: boolean;
  showConclusion?: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  index,
  showDiscussion = false,
  showConclusion = false
}) => {
  return (
    <View className={styles.problemCard}>
      <View className={styles.cardHeader}>
        <View style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {index !== undefined && (
            <Text className={styles.index}>{index + 1}.</Text>
          )}
          <View className={styles.category}>{problem.category}</View>
        </View>
        <View className={styles.severityTag}>
          <StatusTag text={severityMap[problem.severity]} type={problem.severity as any} />
        </View>
      </View>
      
      <Text className={styles.content}>{problem.content}</Text>
      
      {problem.expertName && (
        <Text className={styles.expertInfo}>提出专家：{problem.expertName}</Text>
      )}
      
      {showDiscussion && problem.discussion && (
        <View className={styles.discussionSection}>
          <Text className={styles.sectionTitle}>讨论结论</Text>
          <Text className={styles.sectionContent}>{problem.discussion}</Text>
        </View>
      )}
      
      {showConclusion && problem.conclusion && (
        <View className={styles.conclusionSection}>
          <Text className={styles.label}>论证结论</Text>
          <StatusTag text={conclusionMap[problem.conclusion]} type={problem.conclusion as any} />
        </View>
      )}
      
      {problem.rectificationResponsible && (
        <Text className={styles.responsible}>整改责任人：{problem.rectificationResponsible}</Text>
      )}
      
      {problem.isRectified && (
        <View className={styles.rectifiedBadge}>
          <Text>已整改</Text>
        </View>
      )}
    </View>
  );
};

export default ProblemCard;
