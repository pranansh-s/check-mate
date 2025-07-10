import axios, { AxiosResponse } from 'axios';

import { axiosConfig } from '@/constants/config';

import { handleAPIErrors } from './utils/error';
import { CreateRoomResponse, GetRoomResponse } from '@/types/api';

const client = axios.create(axiosConfig);

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: Error) => {
    handleAPIErrors(error);
    return Promise.reject(error);
  }
);

export function get_room(id: string) {
  return client.get<GetRoomResponse>(`/room/${id}`);
}

export function post_create_room() {
  return client.post<CreateRoomResponse>('/new-room');
}
