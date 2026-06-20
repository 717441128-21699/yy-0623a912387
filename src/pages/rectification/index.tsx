import React, { useState } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { mockMeetings, severityMap, conclusionMap } from '@/data/mockData';
import type { Meeting, ProblemItem } from '@/types';
import styles from './index.module.scss';

interface ProblemConfirm extends ProblemItem {
  isClosed?: boolean | null;
  response?: string;
}

const RectificationPage: React.FC = () => {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [problems, setProblems] = useState<ProblemConfirm[]>([]);
  const [expertOpinion, setExpertOpinion] = useState('');

  useDidShow(() => {
    const id = router.params.id;
    const found = mockMeetings.find(m => m.id === id);
    if (found) {
      setMeeting(found);
      const probs: ProblemConfirm[] = found.problems.map(p => ({
        ...p,
        isClosed: p.isRectified ? true : null,
        response: p.isRectified ? '已按要求完成整改，补充了相关计算和图纸。' : ''
      }));
      setProblems(probs);
    }
  });

  const handleConfirm = (problemId: string, isClosed: boolean) => {
    setProblems(prev => prev.map(p => 
      p.id === problemId ? { ...p, isClosed } : p
    ));
  };

  const handleViewMaterial = (name: string) => {
    Taro.showToast({ title: `查看${name}`, icon: 'none' });
  };

  const handleUploadMaterial = () => {
    Taro.showToast({ title: '上传整改材料', icon: 'none' });
  };

  const closedCount = problems.filter(p => p.isClosed === true).length;
  const pendingCount = problems.filter(p => p.isClosed === null || p.isClosed === false).length;
  const totalCount = problems.length;

  const handleSubmit = () => {
    const unconfirmed = problems.filter(p => p.isClosed === null).length;
    
    if (unconfirmed > 0) {
      Taro.showModal({
        title: '提示',
        content: `还有 ${unconfirmed} 项问题未确认是否闭合，确认提交？`,
        success: (res) => {
          if (res.confirm) {
            doSubmit();
          }
        }
      });
    } else {
      doSubmit();
    }
  };

  const doSubmit = () => {
    Taro.showLoading({ title: '提交中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '提交成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }, 1000);
  };

  const handleSaveDraft = () => {
    Taro.showToast({ title: '保存成功', icon: 'success' });
  };

  if (!meeting) {
    return (
      <View className={styles.pageContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.headerCard}>
        <Text className={styles.projectName}>{meeting.projectName}</Text>
        <Text className={styles.dangerName}>{meeting.dangerName}</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.number}>{totalCount}</Text>
            <Text className={styles.label}>问题总数</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.number}>{closedCount}</Text>
            <Text className={styles.label}>已闭合</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.number}>{pendingCount}</Text>
            <Text className={styles.label}>待确认</Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📁</Text>
            整改材料
          </Text>
          {meeting.rectificationMaterials && (
            <Text className={styles.sectionCount}>
              {meeting.rectificationMaterials.length} 份
            </Text>
          )}
        </View>
        
        <View className={styles.materialList}>
          {meeting.rectificationMaterials && meeting.rectificationMaterials.length > 0 ? (
            meeting.rectificationMaterials.map(mat => (
              <View key={mat.id} className={styles.materialItem} onClick={() => handleViewMaterial(mat.name)}>
                <View className={styles.materialIcon}>
                  <Text>✏️</Text>
                </View>
                <View className={styles.materialInfo}>
                  <Text className={styles.materialName}>{mat.name}</Text>
                  <View className={styles.materialMeta}>
                    <Text className={styles.newTag}>整改版</Text>
                    <Text>{mat.size} · {mat.uploadTime}</Text>
                  </View>
                </View>
                <View className={styles.viewBtn}>
                  <Text>查看</Text>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.uploadBtn} onClick={handleUploadMaterial}>
              <Text className={styles.uploadIcon}>+</Text>
              <Text>上传整改材料</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📋</Text>
            问题整改对照
          </Text>
          <Text className={styles.sectionCount}>共 {totalCount} 项</Text>
        </View>
        
        <View className={styles.problemList}>
          {problems.map((problem, index) => (
            <View key={problem.id} className={styles.problemItem}>
              <View className={styles.problemHeader}>
                <View>
                  <Text className={styles.index}>{index + 1}.</Text>
                  <Text className={styles.category}>{problem.category}</Text>
                </View>
                <StatusTag text={severityMap[problem.severity]} type={problem.severity as any} />
              </View>
              
              <Text className={styles.problemContent}>{problem.content}</Text>
              <Text className={styles.expertInfo}>专家：{problem.expertName}</Text>
              
              <View className={styles.responseBox}>
                <Text className={styles.boxTitle}>
                  整改回复
                  {problem.response && <Text className={styles.tag}>已回复</Text>}
                </Text>
                <Text className={styles.boxContent}>
                  {problem.response || '施工单位尚未提交整改回复'}
                </Text>
              </View>
              
              <View className={styles.confirmRow}>
                <Text className={styles.label}>是否闭合</Text>
                <View className={styles.confirmOptions}>
                  <View
                    className={`${styles.option} ${styles.yes} ${problem.isClosed === true ? styles.active : ''}`}
                    onClick={() => handleConfirm(problem.id, true)}
                  >
                    <Text>✓ 闭合</Text>
                  </View>
                  <View
                    className={`${styles.option} ${styles.no} ${problem.isClosed === false ? styles.active : ''}`}
                    onClick={() => handleConfirm(problem.id, false)}
                  >
                    <Text>✕ 未闭合</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.summaryCard}>
        <Text className={styles.summaryTitle}>整改确认汇总</Text>
        <View className={styles.summaryRow}>
          <Text className={styles.label}>问题总数</Text>
          <Text className={styles.value}>{totalCount} 项</Text>
        </View>
        <View className={styles.summaryRow}>
          <Text className={styles.label}>已闭合</Text>
          <Text className={`${styles.value} ${styles.success}`}>{closedCount} 项</Text>
        </View>
        <View className={styles.summaryRow}>
          <Text className={styles.label}>未闭合</Text>
          <Text className={`${styles.value} ${styles.warning}`}>{pendingCount} 项</Text>
        </View>
        <View className={styles.summaryRow}>
          <Text className={styles.label}>整改责任人</Text>
          <Text className={styles.value}>{meeting.rectificationResponsible || '待确认'}</Text>
        </View>
        <View className={styles.summaryRow}>
          <Text className={styles.label}>整改期限</Text>
          <Text className={styles.value}>{meeting.rectificationDeadline || '待确认'}</Text>
        </View>
        
        <View className={styles.expertInput}>
          <Text className={styles.inputLabel}>专家确认意见</Text>
          <Textarea
            className={styles.inputBox}
            placeholder="请输入专家确认意见..."
            value={expertOpinion}
            onInput={(e) => setExpertOpinion(e.detail.value)}
            maxlength={500}
            autoHeight
          />
        </View>
      </View>

      <View style={{ height: '40rpx' }}></View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={handleSaveDraft}>
          <Text>保存草稿</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleSubmit}>
          <Text>提交确认意见</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RectificationPage;
