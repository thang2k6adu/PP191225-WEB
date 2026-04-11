import apiClient from '@/utils/api';
import { API_ENDPOINTS } from '@/constants';
import { ApiResponse } from './userService';

export interface UploadedFileData {
  id: string;
  url: string;
  key: string;
  size: number;
  mimetype: string;
}

export const storageService = {
  uploadAvatar: async (file: File): Promise<ApiResponse<UploadedFileData>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'avatar');

    const response = await apiClient.post<ApiResponse<UploadedFileData>>(
      API_ENDPOINTS.STORAGE.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};
