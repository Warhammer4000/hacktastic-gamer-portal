export interface UploadStatus {
  email: string;
  status: 'processing' | 'success' | 'failed';
  error?: string;
  details?: {
    mentorId?: string;
    techStacksAdded?: number;
    institutionFound?: boolean;
  };
}

export interface UploadProgress {
  processed: number;
  total: number;
  startTime?: Date;
  currentEmail?: string;
}

export interface UploadSummary {
  total: number;
  successful: number;
  failed: number;
  processingTime: number;
}