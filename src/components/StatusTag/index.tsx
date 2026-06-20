import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatusTagProps {
  text: string;
  type?: 'pending' | 'reviewing' | 'pass' | 'modify' | 'reject' | 'light' | 'medium' | 'serious' | 'deep' | 'high' | 'large';
}

const StatusTag: React.FC<StatusTagProps> = ({ text, type = 'pending' }) => {
  return (
    <View className={classnames(styles.statusTag, styles[type])}>
      <Text>{text}</Text>
    </View>
  );
};

export default StatusTag;
