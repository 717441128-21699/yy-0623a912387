import React, { useState, useMemo } from 'react';
import { View, Text, Textarea, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { mockMeetings, severityMap } from '@/data/mockData';
import { generateId } from '@/utils';
import type { Meeting, ExpertReviewItem, ProblemItem, SeverityLevel } from '@/types';
import styles from './index.module.scss';

const categoryIcons: Record<string, string> = {
  '方案依据': '📋',
  '施工工艺': '🔧',
  '监测措施': '📊',
  '应急预案': '🚨'
};

const ReviewDetailPage: React.FC = () => {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [reviewItems, setReviewItems] = useState<ExpertReviewItem[]>([]);
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProblem, setNewProblem] = useState('');
  const [newSeverity, setNewSeverity] = useState<SeverityLevel>('medium');
  const [currentCategory, setCurrentCategory] = useState('');

  useDidShow(() => {
    const id = router.params.id;
    const found = mockMeetings.find(m => m.id === id);
    if (found) {
      setMeeting(found);
      setReviewItems([...found.expertReviewItems]);
      setProblems([...found.problems]);
    }
  });

  const groupedItems = useMemo(() => {
    const groups: Record<string, ExpertReviewItem[]> = {};
    reviewItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [reviewItems]);

  const progress = useMemo(() => {
    const total = reviewItems.length;
    const checked = reviewItems.filter(item => item.checked).length;
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  }, [reviewItems]);

  const handleCheckItem = (itemId: string) => {
    setReviewItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAddProblem = (category: string) => {
    setCurrentCategory(category);
    setNewProblem('');
    setNewSeverity('medium');
    setShowAddModal(true);
  };

  const handleConfirmAdd = () => {
    if (!newProblem.trim()) {
      Taro.showToast({ title: '请输入问题描述', icon: 'none' });
      return;
    }
    
    const problem: ProblemItem = {
      id: generateId(),
      content: newProblem,
      severity: newSeverity,
      category: currentCategory,
      expertName: '当前专家'
    };
    
    setProblems(prev => [...prev, problem]);
    setShowAddModal(false);
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const handleDeleteProblem = (id: string) => {
    Taro.showModal({
      title: '提示',
      content: '确认删除此问题？',
      success: (res) => {
        if (res.confirm) {
          setProblems(prev => prev.filter(p => p.id !== id));
        }
      }
    });
  };

  const handleSave = () => {
    Taro.showToast({ title: '保存成功', icon: 'success' });
  };

  const handleSubmit = () => {
    const uncheckedCount = reviewItems.filter(item => !item.checked).length;
    
    if (uncheckedCount > 0) {
      Taro.showModal({
        title: '提示',
        content: `还有 ${uncheckedCount} 项未审查，确认提交预审意见？`,
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

  if (!meeting) {
    return (
      <View className={styles.pageContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <Text className={styles.projectName}>{meeting.projectName}</Text>
        <Text className={styles.dangerName}>{meeting.dangerName}</Text>
        <View className={styles.progressBar}>
          <View className={styles.progressFill} style={{ width: `${progress}%` }}></View>
        </View>
        <Text className={styles.progressText}>
          预审进度 <Text className={styles.percent}>{progress}%</Text>
          （{reviewItems.filter(i => i.checked).length}/{reviewItems.length}）
        </Text>
      </View>

      {Object.entries(groupedItems).map(([category, items]) => {
        const checkedCount = items.filter(i => i.checked).length;
        
        return (
          <View key={category} className={styles.categorySection}>
            <View className={styles.categoryHeader}>
              <View className={styles.categoryIcon}>
                <Text>{categoryIcons[category] || '📄'}</Text>
              </View>
              <Text className={styles.categoryName}>{category}</Text>
              <Text className={styles.categoryProgress}>{checkedCount}/{items.length}</Text>
            </View>
            
            <View className={styles.itemList}>
              {items.map(item => (
                <View key={item.id} className={styles.reviewItem}>
                  <View
                    className={`${styles.checkBox} ${item.checked ? styles.checked : ''}`}
                    onClick={() => handleCheckItem(item.id)}
                  >
                    {item.checked && <Text className={styles.checkIcon}>✓</Text>}
                  </View>
                  <View className={styles.itemContent}>
                    <Text className={styles.itemTitle}>{item.title}</Text>
                    {item.description && (
                      <Text className={styles.itemDesc}>{item.description}</Text>
                    )}
                    <View
                      className={styles.addProblemBtn}
                      onClick={() => handleAddProblem(category)}
                    >
                      <Text className={styles.plusIcon}>+</Text>
                      <Text>添加问题</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      <View className={styles.problemSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>问题清单</Text>
          <Text className={styles.problemCount}>
            共 <Text className={styles.num}>{problems.length}</Text> 项问题
          </Text>
        </View>
        
        <View className={styles.problemList}>
          {problems.length > 0 ? (
            problems.map((problem, index) => (
              <View key={problem.id} className={styles.problemItem}>
                <View className={styles.problemContent}>
                  <Text className={styles.problemText}>
                    {index + 1}. {problem.content}
                  </Text>
                  <View className={styles.problemMeta}>
                    <StatusTag text={severityMap[problem.severity]} type={problem.severity as any} />
                    <Text style={{ fontSize: '22rpx', color: '#86909c' }}>{problem.category}</Text>
                  </View>
                </View>
                <View className={styles.deleteBtn} onClick={() => handleDeleteProblem(problem.id)}>
                  <Text>删除</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={{ padding: '32rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: '#86909c' }}>暂无问题，点击"添加问题"记录</Text>
            </View>
          )}
        </View>
        
        <View className={styles.addProblemBtn} onClick={() => handleAddProblem('其他')}>
          <Text className={styles.plusIcon}>+</Text>
          <Text>添加问题</Text>
        </View>
      </View>

      <View style={{ height: '40rpx' }}></View>

      <View className={styles.bottomBar}>
        <View className={styles.saveBtn} onClick={handleSave}>
          <Text>保存草稿</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text>提交预审意见</Text>
        </View>
      </View>

      {showAddModal && (
        <View className={styles.addProblemModal}>
          <View className={styles.modalContent}>
            <Text className={styles.modalTitle}>添加问题</Text>
            
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>问题描述
            </Text>
            <Textarea
              className={styles.problemInput}
              placeholder="请详细描述发现的问题..."
              value={newProblem}
              onInput={(e) => setNewProblem(e.detail.value)}
              maxlength={500}
            />
            
            <Text className={styles.formLabel}>严重程度</Text>
            <View className={styles.severityList}>
              {(['light', 'medium', 'serious'] as SeverityLevel[]).map(level => (
                <View
                  key={level}
                  className={`${styles.severityItem} ${newSeverity === level ? styles.active : ''}`}
                  onClick={() => setNewSeverity(level)}
                >
                  <View className={`${styles.severityDot} ${styles[level]}`}></View>
                  <Text className={styles.severityLabel}>{severityMap[level]}</Text>
                </View>
              ))}
            </View>
            
            <View className={styles.btnRow}>
              <View className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleConfirmAdd}>
                <Text>确认添加</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ReviewDetailPage;
