import axios from "axios";
import { Store } from "../store/store";
import { Activity, ActivityFormValues } from "../models/activity";
import { Pagination } from "../models/pagination";
import { User } from "../models/user";
import { Profile, userActivity } from "../models/profile";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
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
    `Activity?ListId=1&PageNumber=${PageNumber}&PageSize=2&startDate=${startDate}&params=${params}`
  );
  return data.data;
};

export const getActivities2 = async ({
  pageParam,
  startDate,
  params,
}: {
  pageParam: number;
  startDate: string;
  params: string;
}) => {
  const data = await axios.get<Pagination>(
    `Activity?ListId=1&PageNumber=${pageParam}&PageSize=4&startDate=${startDate}&Param=${params}`
  );

  return data.data;
};

export const loginApi = (user: any) => {
  return axios.post("/Users/login", user);
};

export const RegisterApi = async (register: any) => {
  return await axios.post("/Users/register", register);
};

export const getCurrentUser = async (): Promise<User> => {
  const data = await axios.get("/Users");
  return data.data;
};

export const getActivityById = async (id: string): Promise<Activity> => {
  const result = await axios.get(`Activity/get/${id}`);
  return result.data;
};

export const creacteActivity = async (values: ActivityFormValues) => {
  return axios.post("activity/tambah", values);
};

export const updateActivity = async (values: ActivityFormValues) => {
  return axios.put(`activity/update/${values.id}`, values);
};

export const updateAttendance = (id: any) => {
  return axios.put("activity/attendee", id);
};

export const getProfile = async (username: string): Promise<Profile> => {
  const data = await axios.get(`profiles/${username}`);
  return data.data;
};

export const getActivityByPredicate = async (
  username: string,
  predicate: string
): Promise<userActivity[]> => {
  const data = await axios.get(
    `profiles/${username}/activities?predicate=${predicate}`
  );
  return data.data;
};

export const updateFollow = (username: string) => {
  return axios.put(`follow/${username}`);
};

export const listFollowing = async (
  username: string,
  predicate: string
): Promise<Profile[]> => {
  const data = await axios.get(`follow/${username}?predicate=${predicate}`);
  return data.data;
};

export const uploadPhoto = (base64: string) => {
  return axios.post("photo", { filename: "test.png", fileBase64: base64 });
};

export const setMain = (id: string) => {
  return axios.put(`photo/${id}`);
};

export const deletePhoto = (id: string) => {
  return axios.delete(`photo/${id}`);
};

export const updateProfile = (profile: Partial<Profile>) => {
  return axios.put("profiles/update", profile);
};

export const SendComment = (comment: any) => {
  return axios.post("chat/send", comment);
};

export const listConversations = async (): Promise<Conversation[]> => {
  const data = await axios.get("conversations");
  return data.data;
};

export const listMessage = async (username: string): Promise<Messages[]> => {
  const data = await axios.get("conversations/messages/" + username);
  return data.data;
};

export const sendMessage = async (message: any) => {
  return axios.post("conversations/send/message", message);
};

export const deleteMessage = (id: string) => {
  return axios.delete("conversations/message/" + id);
};
