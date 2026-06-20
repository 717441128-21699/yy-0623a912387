import React, { useState } from 'react';
import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { statusMap, severityMap, conclusionMap, getBusinessStatus, dangerCategoryMap } from '@/data/mockData';
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
  const [showMinutesPreview, setShowMinutesPreview] = useState(false);
  const [showFormalText, setShowFormalText] = useState(false);

  useDidShow(() => {
    console.log('[MinuteDetailPage] useDidShow - 刷新数据');
    initFromStorage();
  });

  const problems: ProblemItem[] = meeting?.problems || [];
  const overallConclusion = meeting?.conclusion || null;
  const bizStatus = meeting ? getBusinessStatus(meeting) : { label: '', type: '' };

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

  const generateFormalText = (): string => {
    if (!meeting) return '';
    const lines: string[] = [];
    lines.push('危大工程专项方案专家论证会议纪要');
    lines.push('');
    lines.push('一、工程概况');
    lines.push(`项目名称：${meeting.projectName}`);
    lines.push(`项目编号：${meeting.projectCode}`);
    lines.push(`危大类别：${dangerCategoryMap[meeting.dangerCategory]}`);
    lines.push(`工程名称：${meeting.dangerName}`);
    lines.push('');
    lines.push('二、会议信息');
    lines.push(`会议时间：${meeting.meetingTime}`);
    lines.push(`会议地点：${meeting.meetingLocation}`);
    lines.push(`主持人：${meeting.organizer}`);
    if (meeting.participantUnits.length > 0) {
      lines.push(`参会单位：${meeting.participantUnits.map(u => `${u.name}（${u.role}）`).join('、')}`);
    }
    lines.push('');
    lines.push('三、问题讨论及论证结论');
    problems.forEach((problem, index) => {
      lines.push(`问题${index + 1}：${problem.content}`);
      lines.push(`  严重程度：${severityMap[problem.severity]} | 提出专家：${problem.expertName}`);
      if (problem.discussion) {
        lines.push(`  讨论结论：${problem.discussion}`);
      }
      if (problem.conclusion) {
        lines.push(`  论证结论：${conclusionMap[problem.conclusion]}`);
      }
      if (problem.rectificationResponsible) {
        lines.push(`  整改责任人：${problem.rectificationResponsible}`);
      }
      lines.push('');
    });
    lines.push('四、总体论证结论');
    lines.push(overallConclusion ? conclusionMap[overallConclusion] : '（未设置）');
    lines.push('');
    if (meeting.rectificationResponsible) {
      lines.push('五、整改要求');
      lines.push(`整改责任人：${meeting.rectificationResponsible}`);
      if (meeting.rectificationDeadline) {
        lines.push(`整改期限：${meeting.rectificationDeadline}`);
      }
    }
    return lines.join('\n');
  };

  const handleCopyText = () => {
    const text = generateFormalText();
    Taro.setClipboardData({
      data: text,
      success: () => {
        Taro.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  };

  const handleExportText = () => {
    const text = generateFormalText();
    const fs = Taro.getFileSystemManager();
    const filePath = `${Taro.env.USER_DATA_PATH}/会议纪要_${meeting?.projectCode || 'export'}.txt`;
    try {
      fs.writeFileSync(filePath, text, 'utf8');
      Taro.showToast({ title: '导出成功', icon: 'success' });
    } catch (e) {
      Taro.setClipboardData({
        data: text,
        success: () => {
          Taro.showToast({ title: '已复制到剪贴板', icon: 'success' });
        }
      });
    }
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
          <StatusTag text={bizStatus.label} type={bizStatus.type as any} />
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

      <View className={styles.minutesPreviewSection}>
        <View 
          className={styles.previewToggle}
          onClick={() => setShowMinutesPreview(!showMinutesPreview)}
        >
          <Text className={styles.previewTitle}>📋 会议纪要预览</Text>
          <Text className={styles.toggleIcon}>{showMinutesPreview ? '▼' : '▶'}</Text>
        </View>
        
        {showMinutesPreview && (
          <View className={styles.previewContent}>
            <View className={styles.previewHeader}>
              <Text className={styles.previewMainTitle}>危大工程专项方案专家论证会议纪要</Text>
            </View>
            
            <View className={styles.previewBlock}>
              <Text className={styles.blockTitle}>一、工程概况</Text>
              <View className={styles.blockRow}>
                <Text>项目名称：{meeting.projectName}</Text>
              </View>
              <View className={styles.blockRow}>
                <Text>项目编号：{meeting.projectCode}</Text>
              </View>
              <View className={styles.blockRow}>
                <Text>危大类别：{dangerCategoryMap[meeting.dangerCategory]}</Text>
              </View>
              <View className={styles.blockRow}>
                <Text>工程名称：{meeting.dangerName}</Text>
              </View>
            </View>

            <View className={styles.previewBlock}>
              <Text className={styles.blockTitle}>二、会议信息</Text>
              <View className={styles.blockRow}>
                <Text>会议时间：{meeting.meetingTime}</Text>
              </View>
              <View className={styles.blockRow}>
                <Text>会议地点：{meeting.meetingLocation}</Text>
              </View>
              <View className={styles.blockRow}>
                <Text>主持人：{meeting.organizer}</Text>
              </View>
              {meeting.participantUnits.length > 0 && (
                <View className={styles.blockRow}>
                  <Text>参会单位：{meeting.participantUnits.map(u => u.name).join('、')}</Text>
                </View>
              )}
            </View>

            <View className={styles.previewBlock}>
              <Text className={styles.blockTitle}>三、问题讨论及论证结论</Text>
              {problems.map((problem, index) => (
                <View key={problem.id} className={styles.previewProblem}>
                  <Text className={styles.previewProblemIndex}>问题{index + 1}：{problem.content}</Text>
                  <Text className={styles.previewProblemDetail}>
                    严重程度：{severityMap[problem.severity]} | 提出专家：{problem.expertName}
                  </Text>
                  {problem.discussion && (
                    <Text className={styles.previewProblemDetail}>
                      讨论结论：{problem.discussion}
                    </Text>
                  )}
                  {problem.conclusion && (
                    <Text className={styles.previewProblemDetail}>
                      论证结论：{conclusionMap[problem.conclusion]}
                    </Text>
                  )}
                  {problem.rectificationResponsible && (
                    <Text className={styles.previewProblemDetail}>
                      整改责任人：{problem.rectificationResponsible}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            <View className={styles.previewBlock}>
              <Text className={styles.blockTitle}>四、总体论证结论</Text>
              <Text className={styles.blockRow} style={{ fontWeight: 'bold', color: '#1d2129' }}>
                {overallConclusion ? conclusionMap[overallConclusion] : '（未设置）'}
              </Text>
            </View>

            {meeting.rectificationResponsible && (
              <View className={styles.previewBlock}>
                <Text className={styles.blockTitle}>五、整改要求</Text>
                <View className={styles.blockRow}>
                  <Text>整改责任人：{meeting.rectificationResponsible}</Text>
                </View>
                {meeting.rectificationDeadline && (
                  <View className={styles.blockRow}>
                    <Text>整改期限：{meeting.rectificationDeadline}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      <View className={styles.formalTextSection}>
        <View 
          className={styles.formalToggle}
          onClick={() => setShowFormalText(!showFormalText)}
        >
          <Text className={styles.formalTitle}>📝 生成正式纪要文本</Text>
          <Text className={styles.toggleIcon}>{showFormalText ? '▼' : '▶'}</Text>
        </View>
        
        {showFormalText && (
          <View className={styles.formalContent}>
            <View className={styles.formalActions}>
              <View className={styles.formalActionBtn} onClick={handleCopyText}>
                <Text className={styles.actionIcon}>📋</Text>
                <Text className={styles.actionLabel}>复制文本</Text>
              </View>
              <View className={styles.formalActionBtn} onClick={handleExportText}>
                <Text className={styles.actionIcon}>📤</Text>
                <Text className={styles.actionLabel}>导出文件</Text>
              </View>
            </View>
            <View className={styles.formalTextBox}>
              {generateFormalText().split('\n').map((line, i) => (
                <Text key={i} className={styles.formalLine}>{line || '\u00A0'}</Text>
              ))}
            </View>
          </View>
        )}
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
