import React, { useState } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { severityMap, conclusionMap, getBusinessStatus } from '@/data/mockData';
import { generateId, getMaterialTypeLabel } from '@/utils';
import { useMeetingStore } from '@/store/useMeetingStore';
import type { ProblemItem, MaterialItem } from '@/types';
import styles from './index.module.scss';

const RectificationPage: React.FC = () => {
  const router = useRouter();
  const meetingId = router.params.id || '';
  
  const meeting = useMeetingStore(state => 
    state.meetings.find(m => m.id === meetingId)
  );
  const initFromStorage = useMeetingStore(state => state.initFromStorage);
  const setProblemRectified = useMeetingStore(state => state.setProblemRectified);
  const updateProblem = useMeetingStore(state => state.updateProblem);
  const addRectificationMaterial = useMeetingStore(state => state.addRectificationMaterial);
  const updateMeeting = useMeetingStore(state => state.updateMeeting);
  
  const [expertOpinion, setExpertOpinion] = useState('');
  const [editingResponseId, setEditingResponseId] = useState('');
  const [editingResponse, setEditingResponse] = useState('');

  useDidShow(() => {
    console.log('[RectificationPage] useDidShow - 刷新数据');
    initFromStorage();
    if (meeting) {
      setExpertOpinion(meeting.rectificationExpertOpinion || '');
    }
  });

  const problems: ProblemItem[] = meeting?.problems || [];
  const isArchived = meeting?.rectificationSubmitted === true;
  const bizStatus = meeting ? getBusinessStatus(meeting) : { label: '', type: '' };

  const closedCount = problems.filter(p => p.isRectified === true).length;
  const pendingCount = problems.filter(p => p.isRectified !== true).length;
  const totalCount = problems.length;

  const handleConfirm = (problemId: string, isClosed: boolean) => {
    if (isArchived) return;
    setProblemRectified(meetingId, problemId, isClosed);
  };

  const handleViewMaterial = (name: string) => {
    Taro.showToast({ title: `查看${name}`, icon: 'none' });
  };

  const handleUploadMaterial = () => {
    if (isArchived) return;
    const newMaterial: Omit<MaterialItem, 'id'> = {
      name: `整改方案_${meeting?.projectName || '项目'}_v2.pdf`,
      type: 'rectification',
      size: `${(Math.random() * 3 + 1).toFixed(1)}MB`,
      uploadTime: new Date().toLocaleString()
    };
    addRectificationMaterial(meetingId, newMaterial);
    Taro.showToast({ title: '上传成功', icon: 'success' });
  };

  const handleEditResponse = (problem: ProblemItem) => {
    if (isArchived) return;
    setEditingResponseId(problem.id);
    setEditingResponse(problem.rectificationResponse || '');
  };

  const handleSaveResponse = () => {
    updateProblem(meetingId, editingResponseId, { rectificationResponse: editingResponse });
    setEditingResponseId('');
    setEditingResponse('');
    Taro.showToast({ title: '保存成功', icon: 'success' });
  };

  const handleSubmit = () => {
    const unconfirmed = problems.filter(p => p.isRectified === undefined).length;
    
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
    
    const allClosed = problems.length > 0 && problems.every(p => p.isRectified === true);
    const newStatus = allClosed ? 'pass' : 'modify';
    
    updateMeeting(meetingId, {
      status: newStatus,
      rectificationExpertOpinion: expertOpinion,
      rectificationSubmitted: true
    });
    
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '提交成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    }, 500);
  };

  const handleSaveDraft = () => {
    updateMeeting(meetingId, {
      rectificationExpertOpinion: expertOpinion
    });
    Taro.showToast({ title: '保存成功', icon: 'success' });
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
        <View className={styles.statusRow}>
          <StatusTag text={bizStatus.label} type={bizStatus.type as any} />
          {isArchived && (
            <View className={styles.archivedTag}>
              <Text>📋 已归档</Text>
            </View>
          )}
        </View>
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
            <Text className={styles.label}>未闭合</Text>
          </View>
        </View>
      </View>

      {isArchived && (
        <View className={styles.archiveNotice}>
          <Text className={styles.noticeIcon}>📋</Text>
          <View className={styles.noticeContent}>
            <Text className={styles.noticeTitle}>整改确认已归档</Text>
            <Text className={styles.noticeDesc}>本记录已提交确认意见并归档，内容仅供查阅</Text>
          </View>
        </View>
      )}

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
            <View className={styles.noData}>
              <Text>{isArchived ? '未上传整改材料' : ''}</Text>
            </View>
          )}
          {!isArchived && (
            <View className={styles.uploadBtn} onClick={handleUploadMaterial}>
              <Text className={styles.uploadIcon}>+</Text>
              <Text>{meeting.rectificationMaterials && meeting.rectificationMaterials.length > 0 ? '继续上传' : '上传整改材料'}</Text>
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
              
              {problem.discussion && (
                <View className={styles.discussionBox}>
                  <Text className={styles.boxTitle}>讨论结论</Text>
                  <Text className={styles.boxContent}>{problem.discussion}</Text>
                </View>
              )}
              
              {problem.conclusion && (
                <View className={styles.conclusionBox}>
                  <Text className={styles.boxTitle}>论证结论</Text>
                  <StatusTag text={conclusionMap[problem.conclusion]} type={problem.conclusion as any} />
                </View>
              )}
              
              <View className={styles.responseBox}>
                <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text className={styles.boxTitle}>
                    整改回复
                    {problem.rectificationResponse && <Text className={styles.tag}>已回复</Text>}
                  </Text>
                  {!isArchived && (
                    <View className={styles.editBtn} onClick={() => handleEditResponse(problem)}>
                      <Text>编辑</Text>
                    </View>
                  )}
                </View>
                {editingResponseId === problem.id ? (
                  <>
                    <Textarea
                      value={editingResponse}
                      onInput={(e) => setEditingResponse(e.detail.value)}
                      placeholder="请输入整改回复内容..."
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
                    <View style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16rpx' }}>
                      <View
                        style={{
                          padding: '8rpx 24rpx',
                          background: '#165dff',
                          color: '#fff',
                          borderRadius: '32rpx',
                          fontSize: '24rpx'
                        }}
                        onClick={handleSaveResponse}
                      >
                        <Text>保存</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <Text className={styles.boxContent}>
                    {problem.rectificationResponse || '施工单位尚未提交整改回复'}
                  </Text>
                )}
              </View>
              
              <View className={styles.confirmRow}>
                <Text className={styles.label}>闭合状态</Text>
                <View className={styles.confirmOptions}>
                  <View
                    className={`${styles.option} ${styles.yes} ${problem.isRectified === true ? styles.active : ''}`}
                    onClick={() => handleConfirm(problem.id, true)}
                  >
                    <Text>✓ 闭合</Text>
                  </View>
                  <View
                    className={`${styles.option} ${styles.no} ${problem.isRectified === false ? styles.active : ''}`}
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
        <Text className={styles.summaryTitle}>
          {isArchived ? '整改确认归档记录' : '整改确认汇总'}
        </Text>
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
        <View className={styles.summaryRow}>
          <Text className={styles.label}>总体结论</Text>
          <Text className={styles.value}>
            {meeting.conclusion ? conclusionMap[meeting.conclusion] : '未设置'}
          </Text>
        </View>
        
        <View className={styles.expertInput}>
          <Text className={styles.inputLabel}>专家确认意见</Text>
          {isArchived ? (
            <View className={styles.opinionDisplay}>
              <Text>{meeting.rectificationExpertOpinion || '无'}</Text>
            </View>
          ) : (
            <Textarea
              className={styles.inputBox}
              placeholder="请输入专家确认意见..."
              value={expertOpinion}
              onInput={(e) => setExpertOpinion(e.detail.value)}
              maxlength={500}
              autoHeight
            />
          )}
        </View>
      </View>

      <View style={{ height: '40rpx' }}></View>

      {!isArchived && (
        <View className={styles.bottomBar}>
          <View className={styles.secondaryBtn} onClick={handleSaveDraft}>
            <Text>保存草稿</Text>
          </View>
          <View className={styles.primaryBtn} onClick={handleSubmit}>
            <Text>提交确认意见</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default RectificationPage;
