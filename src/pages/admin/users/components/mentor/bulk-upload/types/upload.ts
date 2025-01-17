export type UploadStatus = {
  email: string;
  status: 'processing' | 'success' | 'failed';
  error?: string;
  details?: {
    techStacksAdded: number;
    institutionFound: boolean;
  };
};

export type UploadProgress = {
  processed: number;
  total: number;
  currentEmail?: string;
  startTime?: Date;
};

export type UploadSummary = {
  total: number;
  successful: number;
  failed: number;
  processingTime: number;
};

export type BulkUploadJob = {
  id: string;
  created_by: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_records: number | null;
  processed_records: number;
  successful_records: number;
  failed_records: number;
  error_log: Array<{ email: string; error: string }>;
  created_at: string;
  updated_at: string;
};

export type UploadResponse = {
  jobId: string;
  message: string;
};