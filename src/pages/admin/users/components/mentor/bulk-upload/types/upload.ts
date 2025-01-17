export interface BulkUploadJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_records: number;
  processed_records: number;
  successful_records: number;
  failed_records: number;
  error_log: Array<{
    email: string;
    error: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  jobId: string;
  message: string;
}