import { CreateRoomResponse, GetRoomResponse } from '@/types/api';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { axiosConfig } from '@/constants/config';

import { getAccessToken } from './utils/auth';
import { handleAPIErrors } from './utils/error';

const client = axios.create(axiosConfig);

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    handleAPIErrors(error);
    return Promise.reject(error);
  }
);

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

export function get_room(id: string) {
  return client.get<GetRoomResponse>(`/room/${id}`);
}

export function post_create_room() {
  return client.post<CreateRoomResponse>('/new-room');
}
