import type { Meeting, Expert, ExpertReviewItem } from '@/types';

export const mockMeetings: Meeting[] = [
  {
    id: 'm001',
    projectName: '城市中心广场地下空间开发项目',
    projectCode: 'GC2024001',
    dangerCategory: 'deep',
    dangerName: '深基坑工程（开挖深度12.5m）',
    meetingTime: '2024-06-25 09:00',
    meetingLocation: '市建设大厦3楼会议室',
    organizer: '张建国',
    organizerPhone: '13800138001',
    status: 'reviewing',
    participantUnits: [
      { id: 'u1', name: '市建筑设计研究院', role: '设计单位', contact: '李明', phone: '13900139001' },
      { id: 'u2', name: '省建工集团有限公司', role: '施工单位', contact: '王强', phone: '13900139002' },
      { id: 'u3', name: '市工程监理有限公司', role: '监理单位', contact: '赵伟', phone: '13900139003' },
      { id: 'u4', name: '华宇勘察设计公司', role: '勘察单位', contact: '陈刚', phone: '13900139004' }
    ],
    materials: [
      { id: 'mat1', name: '深基坑专项施工方案.pdf', type: 'plan', size: '2.5MB', uploadTime: '2024-06-20 14:30' },
      { id: 'mat2', name: '基坑支护计算书.pdf', type: 'calculation', size: '1.8MB', uploadTime: '2024-06-20 14:32' },
      { id: 'mat3', name: '基坑支护图纸.dwg', type: 'drawing', size: '3.2MB', uploadTime: '2024-06-20 14:35' },
      { id: 'mat4', name: '前期审查意见.pdf', type: 'review', size: '0.8MB', uploadTime: '2024-06-22 10:00' }
    ],
    expertReviewItems: [
      { id: 'r1', title: '方案编制依据是否充分', category: '方案依据', checked: true, description: '规范引用正确，依据充分' },
      { id: 'r2', title: '工程概况描述是否准确', category: '方案依据', checked: true },
      { id: 'r3', title: '施工工艺流程是否合理', category: '施工工艺', checked: true },
      { id: 'r4', title: '关键工序质量控制措施', category: '施工工艺', checked: false },
      { id: 'r5', title: '监测点布置是否合理', category: '监测措施', checked: false },
      { id: 'r6', title: '监测预警值设定', category: '监测措施', checked: false },
      { id: 'r7', title: '应急预案组织机构', category: '应急预案', checked: false },
      { id: 'r8', title: '应急物资配备情况', category: '应急预案', checked: false }
    ],
    problems: [
      {
        id: 'p1',
        content: '基坑南侧支护桩嵌固深度不足，建议增加1.5米嵌固深度',
        severity: 'serious',
        category: '施工工艺',
        expertName: '刘教授',
        discussion: '经讨论，南侧靠近地铁线路，安全储备不足，需增加嵌固深度',
        conclusion: 'modify',
        rectificationResponsible: '王强（施工单位）',
        isRectified: false
      },
      {
        id: 'p2',
        content: '降水方案未考虑周边建筑物沉降影响',
        severity: 'medium',
        category: '施工工艺',
        expertName: '陈总工',
        discussion: '需补充降水对周边建筑影响的评估及防护措施',
        conclusion: 'modify',
        rectificationResponsible: '李明（设计单位）',
        isRectified: false
      },
      {
        id: 'p3',
        content: '应急救援队伍联系方式未明确',
        severity: 'light',
        category: '应急预案',
        expertName: '王教授',
        isRectified: false
      }
    ],
    conclusion: 'modify',
    rectificationResponsible: '王强',
    rectificationDeadline: '2024-07-05',
    createTime: '2024-06-18 10:00'
  },
  {
    id: 'm002',
    projectName: '滨江新区综合管廊工程',
    projectCode: 'GC2024002',
    dangerCategory: 'large',
    dangerName: '大型模板工程（高支模8.6m）',
    meetingTime: '2024-06-28 14:00',
    meetingLocation: '项目现场会议室',
    organizer: '刘文华',
    organizerPhone: '13800138002',
    status: 'pending',
    participantUnits: [
      { id: 'u5', name: '市市政设计研究院', role: '设计单位', contact: '周杰', phone: '13900139005' },
      { id: 'u6', name: '中建八局有限公司', role: '施工单位', contact: '吴峰', phone: '13900139006' },
      { id: 'u7', name: '市市政监理公司', role: '监理单位', contact: '郑涛', phone: '13900139007' }
    ],
    materials: [
      { id: 'mat5', name: '高支模专项施工方案.pdf', type: 'plan', size: '3.1MB', uploadTime: '2024-06-23 09:00' },
      { id: 'mat6', name: '模板支撑体系计算书.pdf', type: 'calculation', size: '2.2MB', uploadTime: '2024-06-23 09:05' },
      { id: 'mat7', name: '高支模平面布置图.dwg', type: 'drawing', size: '1.5MB', uploadTime: '2024-06-23 09:10' }
    ],
    expertReviewItems: [
      { id: 'r9', title: '方案编制依据是否充分', category: '方案依据', checked: false },
      { id: 'r10', title: '工程概况描述是否准确', category: '方案依据', checked: false },
      { id: 'r11', title: '模板支撑体系设计', category: '施工工艺', checked: false },
      { id: 'r12', title: '搭设与拆除工艺流程', category: '施工工艺', checked: false },
      { id: 'r13', title: '混凝土浇筑顺序', category: '施工工艺', checked: false },
      { id: 'r14', title: '监测方案是否完善', category: '监测措施', checked: false },
      { id: 'r15', title: '应急组织机构', category: '应急预案', checked: false },
      { id: 'r16', title: '坍塌事故应急处置', category: '应急预案', checked: false }
    ],
    problems: [],
    createTime: '2024-06-22 15:30'
  },
  {
    id: 'm003',
    projectName: '地铁3号线一期工程土建3标',
    projectCode: 'GC2024003',
    dangerCategory: 'high',
    dangerName: '盾构法隧道施工（直径6.2m）',
    meetingTime: '2024-06-15 09:30',
    meetingLocation: '地铁建设指挥中心',
    organizer: '陈志强',
    organizerPhone: '13800138003',
    status: 'pass',
    participantUnits: [
      { id: 'u8', name: '中铁隧道勘察设计院', role: '设计单位', contact: '孙磊', phone: '13900139008' },
      { id: 'u9', name: '中铁十四局集团', role: '施工单位', contact: '钱勇', phone: '13900139009' },
      { id: 'u10', name: '北京铁城监理', role: '监理单位', contact: '马俊', phone: '13900139010' }
    ],
    materials: [
      { id: 'mat8', name: '盾构施工专项方案.pdf', type: 'plan', size: '4.5MB', uploadTime: '2024-06-10 08:30' },
      { id: 'mat9', name: '盾构机选型计算书.pdf', type: 'calculation', size: '2.8MB', uploadTime: '2024-06-10 08:35' },
      { id: 'mat10', name: '隧道平纵断面图.dwg', type: 'drawing', size: '5.2MB', uploadTime: '2024-06-10 08:40' },
      { id: 'mat11', name: '专家审查意见回复.pdf', type: 'review', size: '1.2MB', uploadTime: '2024-06-12 14:00' }
    ],
    expertReviewItems: [
      { id: 'r17', title: '方案编制依据是否充分', category: '方案依据', checked: true },
      { id: 'r18', title: '工程地质条件分析', category: '方案依据', checked: true },
      { id: 'r19', title: '盾构机选型合理性', category: '施工工艺', checked: true },
      { id: 'r20', title: '始发与接收方案', category: '施工工艺', checked: true },
      { id: 'r21', title: '同步注浆措施', category: '施工工艺', checked: true },
      { id: 'r22', title: '地表沉降监测', category: '监测措施', checked: true },
      { id: 'r23', title: '建筑物保护监测', category: '监测措施', checked: true },
      { id: 'r24', title: '涌水涌砂应急预案', category: '应急预案', checked: true },
      { id: 'r25', title: '盾构脱困应急预案', category: '应急预案', checked: true }
    ],
    problems: [
      {
        id: 'p4',
        content: '建议补充盾构下穿铁路段的专项防护措施',
        severity: 'medium',
        category: '施工工艺',
        expertName: '李院士',
        discussion: '经讨论，铁路段需增加防护措施，施工单位已补充完善',
        conclusion: 'pass',
        rectificationResponsible: '钱勇（施工单位）',
        isRectified: true
      }
    ],
    conclusion: 'pass',
    rectificationMaterials: [
      { id: 'mat12', name: '修改版-盾构施工专项方案.pdf', type: 'rectification', size: '4.8MB', uploadTime: '2024-06-18 10:00' }
    ],
    createTime: '2024-06-08 09:00'
  },
  {
    id: 'm004',
    projectName: '高新区产业园标准厂房项目',
    projectCode: 'GC2024004',
    dangerCategory: 'high',
    dangerName: '起重吊装工程（120t）',
    meetingTime: '2024-06-20 10:00',
    meetingLocation: '项目监理部会议室',
    organizer: '周明辉',
    organizerPhone: '13800138004',
    status: 'modify',
    participantUnits: [
      { id: 'u11', name: '省建筑设计研究院', role: '设计单位', contact: '林峰', phone: '13900139011' },
      { id: 'u12', name: '市建工集团', role: '施工单位', contact: '黄涛', phone: '13900139012' },
      { id: 'u13', name: '市建设监理公司', role: '监理单位', contact: '徐明', phone: '13900139013' }
    ],
    materials: [
      { id: 'mat13', name: '大型起重吊装专项方案.pdf', type: 'plan', size: '2.0MB', uploadTime: '2024-06-15 14:00' },
      { id: 'mat14', name: '吊装受力计算书.pdf', type: 'calculation', size: '1.2MB', uploadTime: '2024-06-15 14:05' }
    ],
    expertReviewItems: [
      { id: 'r26', title: '方案编制依据是否充分', category: '方案依据', checked: true },
      { id: 'r27', title: '吊装设备选型', category: '施工工艺', checked: true },
      { id: 'r28', title: '吊装工艺流程', category: '施工工艺', checked: true },
      { id: 'r29', title: '吊点设置与加固', category: '施工工艺', checked: true },
      { id: 'r30', title: '监测措施是否完善', category: '监测措施', checked: true },
      { id: 'r31', title: '高处坠落应急预案', category: '应急预案', checked: true },
      { id: 'r32', title: '物体打击应急预案', category: '应急预案', checked: true }
    ],
    problems: [
      {
        id: 'p5',
        content: '吊索具安全验算不完整，需补充钢丝绳破断拉力验算',
        severity: 'serious',
        category: '施工工艺',
        expertName: '赵教授',
        discussion: '吊索是关键受力部件，必须完整验算',
        conclusion: 'modify',
        rectificationResponsible: '黄涛（施工单位）',
        isRectified: true
      },
      {
        id: 'p6',
        content: '吊装作业区域警戒范围偏小',
        severity: 'medium',
        category: '施工工艺',
        expertName: '孙总工',
        discussion: '警戒范围需按规范扩大至1.5倍吊装半径',
        conclusion: 'modify',
        rectificationResponsible: '黄涛（施工单位）',
        isRectified: true
      }
    ],
    conclusion: 'modify',
    rectificationResponsible: '黄涛',
    rectificationDeadline: '2024-06-25',
    rectificationMaterials: [
      { id: 'mat15', name: '修改版-起重吊装专项方案.pdf', type: 'rectification', size: '2.3MB', uploadTime: '2024-06-22 16:00' }
    ],
    createTime: '2024-06-13 10:00'
  },
  {
    id: 'm005',
    projectName: '旧城区改造拆迁安置房项目',
    projectCode: 'GC2024005',
    dangerCategory: 'deep',
    dangerName: '深基坑工程（开挖深度9.8m）',
    meetingTime: '2024-06-10 14:30',
    meetingLocation: '区住建局会议室',
    organizer: '吴大海',
    organizerPhone: '13800138005',
    status: 'reject',
    participantUnits: [
      { id: 'u14', name: '市规划建筑设计院', role: '设计单位', contact: '何平', phone: '13900139014' },
      { id: 'u15', name: '省三建集团', role: '施工单位', contact: '罗军', phone: '13900139015' },
      { id: 'u16', name: '市工程监理公司', role: '监理单位', contact: '谢东', phone: '13900139016' }
    ],
    materials: [
      { id: 'mat16', name: '基坑支护专项方案.pdf', type: 'plan', size: '1.8MB', uploadTime: '2024-06-05 11:00' },
      { id: 'mat17', name: '计算书.pdf', type: 'calculation', size: '0.9MB', uploadTime: '2024-06-05 11:05' }
    ],
    expertReviewItems: [
      { id: 'r33', title: '方案编制依据是否充分', category: '方案依据', checked: true },
      { id: 'r34', title: '支护结构选型', category: '施工工艺', checked: true },
      { id: 'r35', title: '降水方案', category: '施工工艺', checked: false },
      { id: 'r36', title: '监测方案', category: '监测措施', checked: false },
      { id: 'r37', title: '应急预案', category: '应急预案', checked: false }
    ],
    problems: [
      {
        id: 'p7',
        content: '基坑北侧紧邻老旧居民楼，支护方案安全储备严重不足，建议重新选型',
        severity: 'serious',
        category: '施工工艺',
        expertName: '周教授',
        discussion: '经专家组讨论，现有方案无法保证周边建筑安全，需重新设计支护方案',
        conclusion: 'reject',
        isRectified: false
      },
      {
        id: 'p8',
        content: '降水方案缺失，需补充完整的降水设计',
        severity: 'serious',
        category: '施工工艺',
        expertName: '王教授',
        discussion: '本工程地下水位高，必须有专项降水方案',
        conclusion: 'reject',
        isRectified: false
      }
    ],
    conclusion: 'reject',
    createTime: '2024-06-03 09:00'
  }
];

export const mockExperts: Expert[] = [
  { id: 'e1', name: '刘教授', title: '教授级高工', specialty: '岩土工程', phone: '13700137001' },
  { id: 'e2', name: '陈总工', title: '高级工程师', specialty: '结构工程', phone: '13700137002' },
  { id: 'e3', name: '王教授', title: '教授', specialty: '施工技术', phone: '13700137003' },
  { id: 'e4', name: '李院士', title: '工程院院士', specialty: '隧道工程', phone: '13700137004' },
  { id: 'e5', name: '赵教授', title: '教授级高工', specialty: '起重吊装', phone: '13700137005' }
];

export const defaultReviewItems: Omit<ExpertReviewItem, 'id' | 'checked'>[] = [
  { title: '方案编制依据是否充分有效', category: '方案依据' },
  { title: '工程概况和周边环境描述是否准确', category: '方案依据' },
  { title: '危险源辨识与风险分析是否全面', category: '方案依据' },
  { title: '施工工艺流程是否合理可行', category: '施工工艺' },
  { title: '关键工序质量控制措施', category: '施工工艺' },
  { title: '施工机械设备选型是否合理', category: '施工工艺' },
  { title: '监测项目与监测点布置', category: '监测措施' },
  { title: '监测频率与预警值设定', category: '监测措施' },
  { title: '监测数据反馈机制', category: '监测措施' },
  { title: '应急组织机构与职责分工', category: '应急预案' },
  { title: '应急物资与设备配备', category: '应急预案' },
  { title: '典型事故应急处置流程', category: '应急预案' }
];

export const dangerCategoryMap: Record<string, string> = {
  deep: '深基坑工程',
  high: '高大模板工程',
  large: '大型吊装工程'
};

export const statusMap: Record<string, string> = {
  pending: '待预审',
  reviewing: '预审中',
  pass: '论证通过',
  modify: '修改后通过',
  reject: '重新论证'
};

export const getBusinessStatus = (meeting: Meeting): { label: string; type: string } => {
  const { status, conclusion, problems, rectificationSubmitted } = meeting;
  const closedCount = problems.filter(p => p.isRectified === true).length;
  const allClosed = problems.length > 0 && closedCount === problems.length;
  
  if (rectificationSubmitted && allClosed) {
    return { label: '已闭环', type: 'closed' };
  }
  if (rectificationSubmitted && !allClosed) {
    return { label: '整改确认中', type: 'rectifying' };
  }
  if ((conclusion === 'reject' || status === 'reject') && !rectificationSubmitted) {
    return { label: '重新论证', type: 'reject' };
  }
  const hasRect = conclusion === 'modify' || status === 'modify' || !!(meeting.rectificationMaterials && meeting.rectificationMaterials.length > 0);
  if (hasRect && !rectificationSubmitted) {
    return { label: '整改中', type: 'modify' };
  }
  if (conclusion === 'pass' && status === 'pass') {
    return { label: '论证通过', type: 'pass' };
  }
  if (status === 'reviewing') {
    return { label: '预审中', type: 'reviewing' };
  }
  return { label: statusMap[status] || '待预审', type: status };
};

export const severityMap: Record<string, string> = {
  light: '轻微',
  medium: '一般',
  serious: '严重'
};

export const conclusionMap: Record<string, string> = {
  pass: '通过',
  modify: '修改后通过',
  reject: '重新论证'
};
