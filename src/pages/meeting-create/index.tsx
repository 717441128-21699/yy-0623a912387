import React, { useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { dangerCategoryMap } from '@/data/mockData';
import { generateId, getMaterialTypeLabel } from '@/utils';
import type { DangerCategory, MaterialItem } from '@/types';
import styles from './index.module.scss';

const categories = [
  { key: 'deep', label: '深基坑工程' },
  { key: 'high', label: '高大模板工程' },
  { key: 'large', label: '大型吊装工程' }
];

const materialTypes = [
  { key: 'plan', label: '专项施工方案' },
  { key: 'calculation', label: '计算书' },
  { key: 'drawing', label: '图纸' },
  { key: 'review', label: '前期审查意见' }
];

const MeetingCreatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectCode: '',
    dangerCategory: 'deep' as DangerCategory,
    dangerName: '',
    meetingTime: '',
    meetingLocation: '',
    organizer: '',
    organizerPhone: '',
    participantUnits: [] as any[],
    description: ''
  });

  const [materials, setMaterials] = useState<MaterialItem[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (key: DangerCategory) => {
    setFormData(prev => ({ ...prev, dangerCategory: key }));
  };

  const handleAddMaterial = (type: string) => {
    const newMaterial: MaterialItem = {
      id: generateId(),
      name: `${dangerCategoryMap[formData.dangerCategory]}${getMaterialTypeLabel(type)}.pdf`,
      type: type as any,
      size: `${(Math.random() * 3 + 1).toFixed(1)}MB`,
      uploadTime: new Date().toLocaleString()
    };
    setMaterials(prev => [...prev, newMaterial]);
    Taro.showToast({ title: '上传成功', icon: 'success' });
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const handleSubmit = () => {
    if (!formData.projectName) {
      Taro.showToast({ title: '请输入项目名称', icon: 'none' });
      return;
    }
    if (!formData.dangerName) {
      Taro.showToast({ title: '请输入危大工程名称', icon: 'none' });
      return;
    }
    
    Taro.showModal({
      title: '提示',
      content: '确认创建该论证事项？',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '创建成功', icon: 'success' });
            setTimeout(() => {
              Taro.navigateBack();
            }, 1500);
          }, 1000);
        }
      }
    });
  };

  const handleCancel = () => {
    Taro.navigateBack();
  };

  const getMaterialIcon = (type: string) => {
    const icons: Record<string, string> = {
      plan: '📄',
      calculation: '📊',
      drawing: '📐',
      review: '📝'
    };
    return icons[type] || '📁';
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>工程概况</Text>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>项目名称
          </Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入项目名称"
              value={formData.projectName}
              onInput={(e) => handleInputChange('projectName', e.detail.value)}
            />
          </View>
        </View>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>项目编号</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入项目编号"
              value={formData.projectCode}
              onInput={(e) => handleInputChange('projectCode', e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>危大类别</Text>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>工程类别
          </Text>
          <View className={styles.inputWrapper}>
            <View className={styles.categoryList}>
              {categories.map(cat => (
                <View
                  key={cat.key}
                  className={`${styles.categoryItem} ${formData.dangerCategory === cat.key ? styles.active : ''}`}
                  onClick={() => handleCategorySelect(cat.key as DangerCategory)}
                >
                  <Text>{cat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>工程名称
          </Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入危大工程具体名称及参数"
              value={formData.dangerName}
              onInput={(e) => handleInputChange('dangerName', e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>会议信息</Text>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>
            <Text className={styles.required}>*</Text>会议时间
          </Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请选择会议时间"
              value={formData.meetingTime}
              onInput={(e) => handleInputChange('meetingTime', e.detail.value)}
            />
          </View>
          <Text className={styles.arrow}>{'>'}</Text>
        </View>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>会议地点</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入会议地点"
              value={formData.meetingLocation}
              onInput={(e) => handleInputChange('meetingLocation', e.detail.value)}
            />
          </View>
        </View>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>组织人</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入组织人姓名"
              value={formData.organizer}
              onInput={(e) => handleInputChange('organizer', e.detail.value)}
            />
          </View>
        </View>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>联系电话</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入联系电话"
              type="number"
              value={formData.organizerPhone}
              onInput={(e) => handleInputChange('organizerPhone', e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>参会单位</Text>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>设计单位</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入设计单位名称"
            />
          </View>
          <Text className={styles.arrow}>{'>'}</Text>
        </View>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>施工单位</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入施工单位名称"
            />
          </View>
          <Text className={styles.arrow}>{'>'}</Text>
        </View>
        
        <View className={styles.formItem}>
          <Text className={styles.label}>监理单位</Text>
          <View className={styles.inputWrapper}>
            <Input
              className={styles.input}
              placeholder="请输入监理单位名称"
            />
          </View>
          <Text className={styles.arrow}>{'>'}</Text>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>材料上传</Text>
        
        <View className={styles.formItem}>
          <View className={styles.inputWrapper} style={{ width: '100%' }}>
            <View className={styles.materialList}>
              {materials.length > 0 && materials.map(mat => (
                <View key={mat.id} className={styles.materialItem}>
                  <View className={styles.materialIcon}>
                    <Text>{getMaterialIcon(mat.type)}</Text>
                  </View>
                  <View className={styles.materialInfo}>
                    <Text className={styles.materialName}>{mat.name}</Text>
                    <Text className={styles.materialMeta}>{mat.size} · {mat.uploadTime}</Text>
                  </View>
                  <View className={styles.deleteBtn} onClick={() => handleDeleteMaterial(mat.id)}>
                    <Text>删除</Text>
                  </View>
                </View>
              ))}
              
              {materialTypes.map(type => {
                const hasType = materials.some(m => m.type === type.key);
                if (hasType) return null;
                return (
                  <View
                    key={type.key}
                    className={styles.uploadBtn}
                    onClick={() => handleAddMaterial(type.key)}
                  >
                    <Text className={styles.uploadIcon}>+</Text>
                    <Text>上传{type.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={handleCancel}>
          <Text>取消</Text>
        </View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text>创建论证事项</Text>
        </View>
      </View>
    </View>
  );
};

export default MeetingCreatePage;
