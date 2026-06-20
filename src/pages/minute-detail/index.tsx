import React, { useState } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { statusMap, severityMap, conclusionMap } from '@/data/mockData';
import { useMeetingStore } from '@/store/useMeetingStore';
import type { ProblemItem, ConclusionType } from '@/types';
import styles from './index.module.scss';

const MinuteDetailPage: React.FC = () => {
  const router = useRouter();
  const meetingId = router.params.id || '';
  
  const meeting = useMeetingStore(state => 
    state.meetings.find(m => m.id === meetingId)
  );
  const initFromStorage = useMeetingStore(state => state.initFromStorage);
  const updateProblem = useMeetingStore(state => state.updateProblem);
  const updateMeeting = useMeetingStore(state => state.updateMeeting);
  const setOverallConclusion = useMeetingStore(state => state.setOverallConclusion);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingDiscussion, setEditingDiscussion] = useState('');
  const [editingId, setEditingId] = useState('');

  useDidShow(() => {
    console.log('[MinuteDetailPage] useDidShow - 刷新数据');
    initFromStorage();
  });

  const problems: ProblemItem[] = meeting?.problems || [];
  const overallConclusion = meeting?.conclusion || null;

  const handleConclusionChange = (problemId: string, conclusion: ConclusionType) => {
    updateProblem(meetingId, problemId, { conclusion });
  };

  const handleEditDiscussion = (problem: ProblemItem) => {
    setEditingId(problem.id);
    setEditingDiscussion(problem.discussion || '');
    setIsEditing(true);
  };

  const handleSaveDiscussion = () => {
    updateProblem(meetingId, editingId, { discussion: editingDiscussion });
    setIsEditing(false);
    setEditingId('');
    Taro.showToast({ title: '保存成功', icon: 'success' });
  };

  const handleSetResponsible = (problemId: string) => {
    Taro.showActionSheet({
      itemList: ['王强（施工单位）', '李明（设计单位）', '赵伟（监理单位）'],
      success: (res) => {
        const names = ['王强（施工单位）', '李明（设计单位）', '赵伟（监理单位）'];
        updateProblem(meetingId, problemId, { rectificationResponsible: names[res.tapIndex] });
      }
    });
  };

  const handleSave = () => {
    Taro.showLoading({ title: '保存中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '保存成功', icon: 'success' });
    }, 500);
  };

  const handleSubmit = () => {
    Taro.showModal({
      title: '提示',
      content: '确认提交会议纪要？提交后将通知相关单位进行整改。',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          
          if (overallConclusion) {
            setOverallConclusion(meetingId, overallConclusion);
          } else {
            updateMeeting(meetingId, { status: 'modify' });
          }
          
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '提交成功', icon: 'success' });
            setTimeout(() => {
              Taro.navigateBack();
            }, 1000);
          }, 500);
        }
      }
    });
  };

  if (!meeting) {
    return (
      <View className={styles.pageContainer}>
        <Text style={{ padding: '100rpx', textAlign: 'center', color: '#86909c' }}>未找到该会议信息</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.headerCard}>
        <Text className={styles.projectName}>{meeting.projectName}</Text>
        <Text className={styles.dangerName}>{meeting.dangerName}</Text>
        <View className={styles.conclusionRow}>
          <Text className={styles.label}>当前状态</Text>
          <StatusTag text={statusMap[meeting.status]} type={meeting.status as any} />
        </View>
      </View>

      <View className={styles.infoSection}>
        <Text className={styles.sectionTitle}>会议信息</Text>
        <View className={styles.infoItem}>
          <Text className={styles.label}>会议时间</Text>
          <Text className={styles.value}>{meeting.meetingTime}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.label}>会议地点</Text>
          <Text className={styles.value}>{meeting.meetingLocation}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.label}>主持人</Text>
          <Text className={styles.value}>{meeting.organizer}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.label}>记录人</Text>
          <Text className={styles.value}>（待填写）</Text>
        </View>
      </View>

      <View className={styles.problemsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>问题讨论记录</Text>
          <Text className={styles.count}>共 {problems.length} 项</Text>
        </View>
        
        {problems.map((problem, index) => (
          <View key={problem.id} className={styles.problemCard}>
            <View className={styles.cardHeader}>
              <View>
                <Text className={styles.index}>{index + 1}.</Text>
                <Text className={styles.category}>{problem.category}</Text>
              </View>
              <StatusTag text={severityMap[problem.severity]} type={problem.severity as any} />
            </View>
            
            <Text className={styles.content}>{problem.content}</Text>
            <Text className={styles.expertInfo}>提出专家：{problem.expertName}</Text>
            
            <View className={styles.discussionBox}>
              <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text className={styles.boxTitle}>讨论结论</Text>
                <View className={styles.editBtn} onClick={() => handleEditDiscussion(problem)}>
                  <Text>编辑</Text>
                </View>
              </View>
              {isEditing && editingId === problem.id ? (
                <Textarea
                  value={editingDiscussion}
                  onInput={(e) => setEditingDiscussion(e.detail.value)}
                  placeholder="请输入讨论结论..."
                  style={{
                    width: '100%',
                    minHeight: '120rpx',
                    fontSize: '28rpx',
                    padding: '16rpx',
                    background: '#fff',
                    borderRadius: '8rpx',
                    marginTop: '16rpx'
                  }}
                  autoHeight
                />
              ) : (
                <Text className={styles.boxContent}>
                  {problem.discussion || '暂无讨论记录'}
                </Text>
              )}
              {isEditing && editingId === problem.id && (
                <View style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16rpx' }}>
                  <View
                    style={{
                      padding: '8rpx 24rpx',
                      background: '#165dff',
                      color: '#fff',
                      borderRadius: '32rpx',
                      fontSize: '24rpx'
                    }}
                    onClick={handleSaveDiscussion}
                  >
                    <Text>保存</Text>
                  </View>
                </View>
              )}
            </View>
            
            <View className={styles.conclusionRow}>
              <Text className={styles.label}>论证结论</Text>
            </View>
            
            <View className={styles.conclusionSelector}>
              {(['pass', 'modify', 'reject'] as ConclusionType[]).map(type => (
                <View
                  key={type}
                  className={`${styles.option} ${styles[type]} ${problem.conclusion === type ? styles.active : ''}`}
                  onClick={() => handleConclusionChange(problem.id, type)}
                >
                  <StatusTag text={conclusionMap[type]} type={type as any} />
                  <Text className={styles.optionLabel}>{conclusionMap[type]}</Text>
                </View>
              ))}
            </View>
            
            {(problem.conclusion === 'modify' || problem.conclusion === 'reject') && (
              <View className={styles.responsibleInfo}>
                <Text>整改责任人：</Text>
                {problem.rectificationResponsible ? (
                  <Text style={{ color: '#4e5969' }}>{problem.rectificationResponsible}</Text>
                ) : (
                  <Text
                    style={{ color: '#165dff' }}
                    onClick={() => handleSetResponsible(problem.id)}
                  >
                    设置责任人
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.overallSection}>
        <Text className={styles.sectionTitle}>总体论证结论</Text>
        <View className={styles.conclusionOptions}>
          {(['pass', 'modify', 'reject'] as ConclusionType[]).map(type => (
            <View
              key={type}
              className={`${styles.option} ${overallConclusion === type ? styles.active : ''}`}
              onClick={() => setOverallConclusion(meetingId, type)}
            >
              <Text className={styles.optionIcon}>
                {type === 'pass' ? '✅' : type === 'modify' ? '📝' : '❌'}
              </Text>
              <Text className={styles.optionLabel}>{conclusionMap[type]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: '40rpx' }}></View>

      <View className={styles.bottomBar}>
        <View className={styles.secondaryBtn} onClick={handleSave}>
          <Text>保存草稿</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleSubmit}>
          <Text>提交纪要</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MinuteDetailPage;
