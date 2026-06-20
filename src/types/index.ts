export type MeetingStatus = 'pending' | 'reviewing' | 'pass' | 'modify' | 'reject';

export type SeverityLevel = 'light' | 'medium' | 'serious';

export type ConclusionType = 'pass' | 'modify' | 'reject';

export type DangerCategory = 'deep' | 'high' | 'large';

export interface Meeting {
  id: string;
  projectName: string;
  projectCode: string;
  dangerCategory: DangerCategory;
  dangerName: string;
  meetingTime: string;
  meetingLocation: string;
  organizer: string;
  organizerPhone: string;
  status: MeetingStatus;
  participantUnits: ParticipantUnit[];
  materials: MaterialItem[];
  expertReviewItems: ExpertReviewItem[];
  problems: ProblemItem[];
  conclusion?: ConclusionType;
  rectificationResponsible?: string;
  rectificationDeadline?: string;
  rectificationMaterials?: MaterialItem[];
  createTime: string;
}

export interface ParticipantUnit {
  id: string;
  name: string;
  role: string;
  contact: string;
  phone: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  type: 'plan' | 'calculation' | 'drawing' | 'review' | 'rectification';
  size: string;
  uploadTime: string;
  url?: string;
}

export interface ExpertReviewItem {
  id: string;
  title: string;
  category: string;
  checked: boolean;
  description?: string;
}

export interface ProblemItem {
  id: string;
  content: string;
  severity: SeverityLevel;
  category: string;
  discussion?: string;
  conclusion?: ConclusionType;
  rectificationResponsible?: string;
  isRectified?: boolean;
  expertId?: string;
  expertName?: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialty: string;
  phone: string;
}

export interface MeetingMinute {
  id: string;
  meetingId: string;
  host: string;
  recorder: string;
  startTime: string;
  endTime?: string;
  problems: ProblemItem[];
  overallConclusion?: ConclusionType;
  signList: string[];
}
