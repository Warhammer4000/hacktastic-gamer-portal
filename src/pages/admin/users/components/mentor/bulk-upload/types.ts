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