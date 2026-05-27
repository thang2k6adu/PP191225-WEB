import apiClient from '@/utils/api';
import { API_ENDPOINTS } from '@/constants';
import {
  ActivateTaskResponse,
  SessionResponse,
  SessionsProgressResponse,
} from '@/types/trackingSession';

export const trackingSessionService = {
  /**
   * Activate task and create tracking session
   * @param taskId - Task ID to activate
   */
  activateTask: async (taskId: string): Promise<ActivateTaskResponse> => {
    const response = await apiClient.post<ActivateTaskResponse>(
      API_ENDPOINTS.TRACKING_SESSIONS.ACTIVATE(taskId)
    );
    return response.data;
  },

  /**
   * Stop tracking session (end session)
   * @param sessionId - Session ID to stop
   */
  stopSession: async (sessionId: string): Promise<SessionResponse> => {
    const response = await apiClient.post<SessionResponse>(
      API_ENDPOINTS.TRACKING_SESSIONS.STOP(sessionId)
    );
    return response.data;
  },

  /**
   * Get progress and all sessions of a task
   * @param taskId - Task ID to get progress
   */
  getProgress: async (taskId: string): Promise<SessionsProgressResponse> => {
    const response = await apiClient.get<SessionsProgressResponse>(
      API_ENDPOINTS.TRACKING_SESSIONS.PROGRESS,
      {
        params: { taskId },
      }
    );
    return response.data;
  },
};
