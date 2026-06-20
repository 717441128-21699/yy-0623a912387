import { create } from 'zustand';
import Taro from '@tarojs/taro';
import { mockMeetings, defaultReviewItems } from '@/data/mockData';
import { generateId } from '@/utils';
import type {
  Meeting,
  ExpertReviewItem,
  ProblemItem,
  MaterialItem,
  ParticipantUnit,
  DangerCategory,
  ConclusionType,
  SeverityLevel
} from '@/types';

const STORAGE_KEY = 'danger_project_meetings';

interface MeetingState {
  meetings: Meeting[];
  initialized: boolean;
  
  initFromStorage: () => void;
  saveToStorage: () => void;
  
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createTime' | 'expertReviewItems' | 'problems' | 'status'> & {
    participantUnits: ParticipantUnit[];
    materials: MaterialItem[];
  }) => Meeting;
  
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  
  getMeetingById: (id: string) => Meeting | undefined;
  
  updateReviewItem: (meetingId: string, itemId: string, updates: Partial<ExpertReviewItem>) => void;
  
  addProblem: (meetingId: string, problem: Omit<ProblemItem, 'id'>) => ProblemItem;
  
  updateProblem: (meetingId: string, problemId: string, updates: Partial<ProblemItem>) => void;
  
  deleteProblem: (meetingId: string, problemId: string) => void;
  
  addMaterial: (meetingId: string, material: Omit<MaterialItem, 'id'>) => MaterialItem;
  
  addRectificationMaterial: (meetingId: string, material: Omit<MaterialItem, 'id'>) => MaterialItem;
  
  setProblemRectified: (meetingId: string, problemId: string, isRectified: boolean) => void;
  
  setOverallConclusion: (meetingId: string, conclusion: ConclusionType) => void;
}

const initReviewItems = (): ExpertReviewItem[] => {
  return defaultReviewItems.map(item => ({
    ...item,
    id: generateId(),
    checked: false
  }));
};

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetings: [],
  initialized: false,
  
  initFromStorage: () => {
    if (get().initialized) return;
    
    try {
      const stored = Taro.getStorageSync(STORAGE_KEY);
      if (stored && Array.isArray(stored) && stored.length > 0) {
        console.log('[MeetingStore] 从本地存储加载数据，共', stored.length, '条');
        set({ meetings: stored, initialized: true });
      } else {
        console.log('[MeetingStore] 本地存储无数据，使用 Mock 数据初始化');
        const initialMeetings = [...mockMeetings];
        set({ meetings: initialMeetings, initialized: true });
        Taro.setStorageSync(STORAGE_KEY, initialMeetings);
      }
    } catch (e) {
      console.error('[MeetingStore] 初始化失败:', e);
      set({ meetings: [...mockMeetings], initialized: true });
    }
  },
  
  saveToStorage: () => {
    try {
      const { meetings } = get();
      Taro.setStorageSync(STORAGE_KEY, meetings);
      console.log('[MeetingStore] 数据已保存到本地存储，共', meetings.length, '条');
    } catch (e) {
      console.error('[MeetingStore] 保存失败:', e);
    }
  },
  
  addMeeting: (data) => {
    const newMeeting: Meeting = {
      id: generateId(),
      projectName: data.projectName,
      projectCode: data.projectCode || '',
      dangerCategory: data.dangerCategory as DangerCategory,
      dangerName: data.dangerName,
      meetingTime: data.meetingTime || '',
      meetingLocation: data.meetingLocation || '',
      organizer: data.organizer || '',
      organizerPhone: data.organizerPhone || '',
      status: 'pending',
      participantUnits: data.participantUnits || [],
      materials: data.materials || [],
      expertReviewItems: initReviewItems(),
      problems: [],
      createTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-')
    };
    
    set(state => ({ meetings: [newMeeting, ...state.meetings] }));
    get().saveToStorage();
    console.log('[MeetingStore] 新增论证事项:', newMeeting.projectName);
    return newMeeting;
  },
  
  updateMeeting: (id, updates) => {
    set(state => ({
      meetings: state.meetings.map(m => 
        m.id === id ? { ...m, ...updates } : m
      )
    }));
    get().saveToStorage();
  },
  
  getMeetingById: (id) => {
    return get().meetings.find(m => m.id === id);
  },
  
  updateReviewItem: (meetingId, itemId, updates) => {
    set(state => ({
      meetings: state.meetings.map(m => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          expertReviewItems: m.expertReviewItems.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        };
      })
    }));
    get().saveToStorage();
  },
  
  addProblem: (meetingId, problem) => {
    const newProblem: ProblemItem = {
      ...problem,
      id: generateId()
    };
    
    set(state => ({
      meetings: state.meetings.map(m => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          problems: [...m.problems, newProblem]
        };
      })
    }));
    get().saveToStorage();
    return newProblem;
  },
  
  updateProblem: (meetingId, problemId, updates) => {
    set(state => ({
      meetings: state.meetings.map(m => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          problems: m.problems.map(p =>
            p.id === problemId ? { ...p, ...updates } : p
          )
        };
      })
    }));
    get().saveToStorage();
  },
  
  deleteProblem: (meetingId, problemId) => {
    set(state => ({
      meetings: state.meetings.map(m => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          problems: m.problems.filter(p => p.id !== problemId)
        };
      })
    }));
    get().saveToStorage();
  },
  
  addMaterial: (meetingId, material) => {
    const newMaterial: MaterialItem = {
      ...material,
      id: generateId()
    };
    
    set(state => ({
      meetings: state.meetings.map(m => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          materials: [...m.materials, newMaterial]
        };
      })
    }));
    get().saveToStorage();
    return newMaterial;
  },
  
  addRectificationMaterial: (meetingId, material) => {
    const newMaterial: MaterialItem = {
      ...material,
      id: generateId()
    };
    
    set(state => ({
      meetings: state.meetings.map(m => {
        if (m.id !== meetingId) return m;
        const current = m.rectificationMaterials || [];
        return {
          ...m,
          rectificationMaterials: [...current, newMaterial]
        };
      })
    }));
    get().saveToStorage();
    return newMaterial;
  },
  
  setProblemRectified: (meetingId, problemId, isRectified) => {
    set(state => ({
      meetings: state.meetings.map(m => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          problems: m.problems.map(p =>
            p.id === problemId ? { ...p, isRectified } : p
          )
        };
      })
    }));
    get().saveToStorage();
  },
  
  setOverallConclusion: (meetingId, conclusion) => {
    let status: Meeting['status'] = 'reviewing';
    if (conclusion === 'pass') status = 'pass';
    if (conclusion === 'modify') status = 'modify';
    if (conclusion === 'reject') status = 'reject';
    
    set(state => ({
      meetings: state.meetings.map(m => {
        if (m.id !== meetingId) return m;
        return {
          ...m,
          conclusion,
          status
        };
      })
    }));
    get().saveToStorage();
  }
}));
