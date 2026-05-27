import apiClient from '@/utils/api';
import { API_ENDPOINTS } from '@/constants';
import { ActivateTaskResponse } from '@/types/trackingSession';

export const trackingSessionService = {
  activateTask: async (taskId: string): Promise<ActivateTaskResponse> => {
    const response = await apiClient.post<ActivateTaskResponse>(
      API_ENDPOINTS.TRACKING_SESSIONS.ACTIVATE(taskId)
    );
    return response.data;
  },
};
