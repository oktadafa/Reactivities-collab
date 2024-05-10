import axios, { AxiosResponse } from "axios";
import { Store } from "../store/store";
import { Activity, ActivityFormValues } from "../models/activity";
import { Pagination } from "../models/pagination";
import { User } from "../models/user";
import { values } from "mobx";
import { Profile, userActivity } from "../models/profile";

axios.defaults.baseURL = "https://localhost:5001";
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = Store.commonStore.bearer?.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getActivities = async (
  params: string,
  startDate: string,
  PageNumber: number
) => {
  const data = await axios.get<Pagination>(
    `/api/Activity?ListId=1&PageNumber=${PageNumber}&PageSize=2&startDate=${startDate}&params=${params}`
  );
  return data.data;
};

export const getActivities2 = async ({ pageNumber }: { pageNumber: any }) => {
  const data = await axios.get<Pagination>(
    `/api/Activity?ListId=1&PageNumber=${pageNumber}&PageSize=2&startDate=2024-04-24T04%3A41%3A28.405Z`
  );
  return data.data;
};

export const loginApi = (user: any) => {
  return axios.post("/api/Users/login", user);
};

export const RegisterApi = async (register: any) => {
  return await axios.post("/api/UserEntity/register", register);
};

export const getCurrentUser = async (): Promise<User> => {
  const data = await axios.get("/api/UserEntity");
  return data.data;
};

export const getActivityById = async (id: string): Promise<Activity> => {
  const result = await axios.get(`/api/Activity/get/${id}`);
  return result.data;
};

export const creacteActivity = async (values: ActivityFormValues) => {
  return axios.post("/api/activity/tambah", values);
};

export const updateActivity = async (values: ActivityFormValues) => {
  return axios.put(`/api/activity/update/${values.id}`, values);
};

export const updateAttendance = (id: any) => {
  return axios.put("/api/activity/attendee", id);
};

export const getProfile = async (username: string): Promise<Profile> => {
  const data = await axios.get(`/api/profiles/${username}`);
  return data.data;
};

export const getActivityByPredicate = async (
  username: string,
  predicate: string
): Promise<userActivity[]> => {
  const data = await axios.get(
    `/api/profiles/${username}/activities?predicate=${predicate}`
  );
  return data.data;
};

export const updateFollow = (username: string) => {
  return axios.put(`/api/follow/${username}`);
};

export const listFollowing = async (
  username: string,
  predicate: string
): Promise<Profile[]> => {
  const data = await axios.get(
    `/api/follow/${username}?predicate=${predicate}`
  );
  return data.data;
};

export const uploadPhoto = (base64: string) => {
  return axios.post("/api/photo", { filename: "test.png", fileBase64: base64 });
};

export const setMain = (id: string) => {
  return axios.put(`/api/photo/${id}`);
};

export const deletePhoto = (id: string) => {
  return axios.delete(`/api/photo/${id}`);
};

export const updateProfile = (profile: Partial<Profile>) => {
  return axios.put("/api/profiles/update", profile);
};

export const SendComment = (comment: any) => {
  return axios.post("/api/chat/send", comment);
};

export const listConversations = async (): Promise<Conversation[]> => {
  const data = await axios.get("/api/conversations");
  return data.data;
};

export const listMessage = async (username: string): Promise<Messages[]> => {
  const data = await axios.get("/api/conversations/messages/" + username);
  return data.data;
};

export const sendMessage = async (message: any) => {
  return axios.post("/api/conversations/send/message", message);
};

export const deleteMessage = (id: string) => {
  return axios.delete("/api/conversations/message/" + id);
};
