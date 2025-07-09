import { Duration } from "@/constants";
import axios, { AxiosError, AxiosResponse } from "axios";
import { auth } from "./firebase/client";
import { handleAPIErrors } from "./utils/error";

let userToken = "";

if (auth.currentUser) {
  userToken = auth.currentUser.uid;
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  },
  timeout: Duration.apiTimeout,
  validateStatus: () => true,
});

client.interceptors.response.use((response: AxiosResponse) => response,
  (error: AxiosError) => {
    handleAPIErrors(error);
});

export async function get_room(id: string) {
  return await client.get(`/room/${id}`);
}

export async function post_createRoom() {
  return await client.post("/new-room");
}