import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { useMeetingStore } from '@/store/useMeetingStore';
import { dangerCategoryMap, getBusinessStatus } from '@/data/mockData';
import { getMaterialTypeLabel } from '@/utils';
import styles from './index.module.scss';

const MeetingDetailPage: React.FC = () => {
  const router = useRouter();
  const meetingId = router.params.id || '';
  
  const meeting = useMeetingStore(state => 
    state.meetings.find(m => m.id === meetingId)
  );
  const initFromStorage = useMeetingStore(state => state.initFromStorage);

  useDidShow(() => {
    console.log('[MeetingDetailPage] useDidShow - 刷新数据');
    initFromStorage();
  });

  const getMaterialIcon = (type: string) => {
    const icons: Record<string, string> = {
      plan: '📄',
      calculation: '📊',
      drawing: '📐',
      review: '📝',
      rectification: '✏️'
    };
    return icons[type] || '📁';
  };

  const getUnitIcon = (role: string) => {
    if (role.includes('设计')) return '🎨';
    if (role.includes('施工')) return '🏗️';
    if (role.includes('监理')) return '👁️';
    if (role.includes('勘察')) return '🔍';
    return '🏢';
  };

  const handleViewMaterial = (name: string) => {
    Taro.showToast({ title: `查看${name}`, icon: 'none' });
  };

  const handleCall = (phone: string) => {
    Taro.makePhoneCall({ phoneNumber: phone });
  };

  const handleStartReview = () => {
    Taro.navigateTo({
      url: `/pages/review-detail/index?id=${meetingId}`
    });
  };

  const handleViewMinutes = () => {
    Taro.navigateTo({
      url: `/pages/minute-detail/index?id=${meetingId}`
    });
  };

  const handleViewRectification = () => {
    Taro.navigateTo({
      url: `/pages/rectification/index?id=${meetingId}`
    });
  };

  if (!meeting) {
    return (
      <View className={styles.pageContainer}>
        <Text style={{ padding: '100rpx', textAlign: 'center', color: '#86909c' }}>未找到该会议信息</Text>
      </View>
    );
  }

  const bizStatus = getBusinessStatus(meeting);
  const hasRect = meeting.conclusion === 'modify' || meeting.conclusion === 'reject' || meeting.status === 'modify' || !!(meeting.rectificationMaterials && meeting.rectificationMaterials.length > 0) || meeting.rectificationSubmitted === true;

  return (
    <ScrollView scrollY className={styles.pageContainer}>
      <View className={styles.headerCard}>
        <Text className={styles.projectName}>{meeting.projectName}</Text>
        <Text className={styles.projectCode}>项目编号：{meeting.projectCode}</Text>
        <View className={styles.statusRow}>
          <View className={styles.statusTag}>
            <Text>{bizStatus.label}</Text>
          </View>
          <View className={styles.categoryTag}>
            <Text>{dangerCategoryMap[meeting.dangerCategory]}</Text>
          </View>
        </View>
        <Text className={styles.dangerName}>{meeting.dangerName}</Text>
      </View>

      <View className={styles.infoSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📅</Text>
          会议信息
        </Text>
        <View className={styles.infoItem}>
          <Text className={styles.label}>会议时间</Text>
          <Text className={styles.value}>{meeting.meetingTime}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.label}>会议地点</Text>
          <Text className={styles.value}>{meeting.meetingLocation}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.label}>组织人</Text>
          <Text className={styles.value}>{meeting.organizer}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.label}>联系电话</Text>
          <Text className={styles.value}>{meeting.organizerPhone}</Text>
        </View>
      </View>

      <View className={styles.infoSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>🏢</Text>
          参会单位
        </Text>
        <View className={styles.participantList}>
          {meeting.participantUnits.map(unit => (
            <View key={unit.id} className={styles.participantItem}>
              <View className={styles.unitIcon}>
                <Text>{getUnitIcon(unit.role)}</Text>
              </View>
              <View className={styles.unitInfo}>
                <Text className={styles.unitName}>{unit.name}</Text>
                <View className={styles.unitMeta}>
                  <Text className={styles.roleTag}>{unit.role}</Text>
                  <Text>联系人：{unit.contact}</Text>
                </View>
              </View>
              <View className={styles.phoneBtn} onClick={() => handleCall(unit.phone)}>
                <Text>📞</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.infoSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.titleIcon}>📁</Text>
          材料清单 ({meeting.materials.length})
        </Text>
        <View className={styles.materialList}>
          {meeting.materials.map(mat => (
            <View key={mat.id} className={styles.materialItem} onClick={() => handleViewMaterial(mat.name)}>
              <View className={styles.materialIcon}>
                <Text>{getMaterialIcon(mat.type)}</Text>
              </View>
              <View className={styles.materialInfo}>
                <Text className={styles.materialName}>{mat.name}</Text>
                <View className={styles.materialMeta}>
                  <Text className={styles.typeTag}>{getMaterialTypeLabel(mat.type)}</Text>
                  <Text>{mat.size} · {mat.uploadTime}</Text>
                </View>
              </View>
              <View className={styles.viewBtn}>
                <Text>查看</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {meeting.rectificationMaterials && meeting.rectificationMaterials.length > 0 && (
        <View className={styles.infoSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>✏️</Text>
            整改材料 ({meeting.rectificationMaterials.length})
          </Text>
          <View className={styles.materialList}>
            {meeting.rectificationMaterials.map(mat => (
              <View key={mat.id} className={styles.materialItem} onClick={() => handleViewMaterial(mat.name)}>
                <View className={styles.materialIcon}>
                  <Text>{getMaterialIcon(mat.type)}</Text>
                </View>
                <View className={styles.materialInfo}>
                  <Text className={styles.materialName}>{mat.name}</Text>
                  <View className={styles.materialMeta}>
                    <Text className={styles.typeTag}>{getMaterialTypeLabel(mat.type)}</Text>
                    <Text>{mat.size} · {mat.uploadTime}</Text>
                  </View>
                </View>
                <View className={styles.viewBtn}>
                  <Text>查看</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={{ height: '120rpx' }}></View>

      <View className={styles.actionBar}>
        {meeting.status === 'pending' || meeting.status === 'reviewing' ? (
          <>
            <View className={styles.secondaryBtn} onClick={handleViewMinutes}>
              <Text>查看问题</Text>
            </View>
            <View className={styles.primaryBtn} onClick={handleStartReview}>
              <Text>进入预审</Text>
            </View>
          </>
        ) : hasRect ? (
          <>
            <View className={styles.secondaryBtn} onClick={handleViewMinutes}>
              <Text>查看纪要</Text>
            </View>
            <View className={styles.primaryBtn} onClick={handleViewRectification}>
              <Text>查看整改</Text>
            </View>
          </>
        ) : (
          <>
            <View className={styles.secondaryBtn} onClick={handleStartReview}>
              <Text>查看预审</Text>
            </View>
            <View className={styles.primaryBtn} onClick={handleViewMinutes}>
              <Text>查看纪要</Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default MeetingDetailPage;
