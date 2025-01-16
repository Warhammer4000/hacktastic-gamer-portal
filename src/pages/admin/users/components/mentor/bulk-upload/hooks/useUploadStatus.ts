import { useState, useCallback } from 'react';
import { UploadStatus, UploadProgress, UploadSummary } from '../types/upload';

export function useUploadStatus() {
  const [statuses, setStatuses] = useState<UploadStatus[]>([]);
  const [progress, setProgress] = useState<UploadProgress>({
    processed: 0,
    total: 0,
  });
  const [summary, setSummary] = useState<UploadSummary | null>(null);

  const initializeUpload = useCallback((total: number) => {
    const startTime = new Date();
    setProgress({ processed: 0, total, startTime });
    setStatuses([]);
    setSummary(null);
  }, []);

  const updateStatus = useCallback((status: UploadStatus) => {
    setStatuses(prev => {
      const index = prev.findIndex(s => s.email === status.email);
      if (index >= 0) {
        const newStatuses = [...prev];
        newStatuses[index] = status;
        return newStatuses;
      }
      return [...prev, status];
    });

    if (status.status === 'processing') {
      setProgress(prev => ({
        ...prev,
        currentEmail: status.email,
      }));
    } else if (status.status === 'success' || status.status === 'failed') {
      setProgress(prev => ({
        ...prev,
        processed: prev.processed + 1,
      }));
    }
  }, []);

  const finishUpload = useCallback(() => {
    const endTime = new Date();
    const successful = statuses.filter(s => s.status === 'success').length;
    const failed = statuses.filter(s => s.status === 'failed').length;
    
    setSummary({
      total: statuses.length,
      successful,
      failed,
      processingTime: endTime.getTime() - (progress.startTime?.getTime() || endTime.getTime()),
    });
  }, [statuses, progress.startTime]);

  const getFailedEntries = useCallback(() => {
    return statuses.filter(s => s.status === 'failed');
  }, [statuses]);

  return {
    statuses,
    progress,
    summary,
    initializeUpload,
    updateStatus,
    finishUpload,
    getFailedEntries,
  };
}