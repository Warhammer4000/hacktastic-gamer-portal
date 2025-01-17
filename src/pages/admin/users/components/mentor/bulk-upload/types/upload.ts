export interface UploadStatus {
  email: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  error?: string;
  details?: {
    mentorId?: string;
    techStacksAdded?: number;
    institutionFound?: boolean;
  }
}

export interface UploadProgress {
  processed: number;
  total: number;
  currentEmail?: string;
  startTime?: Date;
}

export interface UploadSummary {
  total: number;
  successful: number;
  failed: number;
  processingTime: number;
}

export interface CreateMentorResponse {
  success: boolean;
  user_id?: string;
  message?: string;
  error?: string;
  email?: string;
}