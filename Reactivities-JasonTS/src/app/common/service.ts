import { useMutation, useQuery } from "@tanstack/react-query";
import {
  SendComment,
  deleteMessage,
  deletePhoto,
  getActivityById,
  getActivityByPredicate,
  getProfile,
  listConversations,
  listFollowing,
  listMessage,
  sendMessage,
  setMain,
  updateAttendance,
  updateFollow,
  updateProfile,
  uploadPhoto,
} from "../api/api";
import Swal from "sweetalert2";
import { Profile } from "../models/profile";

export const useQueryActivityById = (id: string) => {
  return useQuery({
    queryKey: ["activityById", id],
    queryFn: () => getActivityById(id),
  });
};

export const useMutationDeleteMessage = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return deleteMessage(id);
    },
  });
};

export const useQueryProfile = (username: string) => {
  return useQuery({
    queryKey: ["getProfiles", username],
    queryFn: () => getProfile(username),
  });
};

export const useMutationUpdateAttendance = () => {
  return useMutation({
    mutationFn: (id: any) => {
      return updateAttendance(id);
    },
  });
};
export const useQueryGetActivityByPredicate = (
  username: string,
  predicate: string
) => {
  return useQuery({
    queryFn: () => getActivityByPredicate(username, predicate),
    queryKey: ["getActivityByPredicate", username, predicate],
  });
};

export const useQueryGetFollow = (username: string, predicate: string) => {
  return useQuery({
    queryFn: () => listFollowing(username, predicate),
    queryKey: ["listFollowing", username, predicate],
  });
};

export const useMutationUpdateFollow = () => {
  return useMutation({
    mutationFn: (username: string) => updateFollow(username),
    mutationKey: ["updateFollow"],
  });
};

export const useMutationUploadPhoto = () => {
  return useMutation({
    mutationFn: (base64: string) => uploadPhoto(base64),
    mutationKey: ["uploadPhoto"],
    onSuccess: () => {
      Swal.fire({
        title: "Success",
        text: "Success Upload Photo",
        icon: "success",
      });
    },
    onError: () => {
      Swal.fire({
        title: "Failed",
        text: "Failed To Upload Photo",
        icon: "error",
      });
    },
  });
};

export const useMutationSetMainPhoto = () => {
  return useMutation({
    mutationFn: (id: string) => setMain(id),
    mutationKey: ["setMain"],
    onError: () => {
      Swal.fire({
        title: "Failed",
        text: "Failed To Set Main Photo",
        icon: "error",
      });
    },
  });
};

export const useMutationDeletePhoto = () => {
  return useMutation({
    mutationFn: (id: string) => deletePhoto(id),
    mutationKey: ["deletePhoto"],

    onError: () => {
      Swal.fire({
        title: "Failed",
        text: "Failed To Delete Photo",
        icon: "error",
      });
    },
  });
};
export const useMutationUpdateProfile = () => {
  return useMutation({
    mutationFn: (profile: Partial<Profile>) => updateProfile(profile),
    mutationKey: ["updateProfil"],
  });
};

export const useMutationSendComment = () => {
  return useMutation({
    mutationFn: (values: any) => SendComment(values),
    mutationKey: ["sendComment"],
  });
};

export const useQueryListConversations = () => {
  return useQuery({
    queryKey: ["listConversations"],
    queryFn: () => listConversations(),
  });
};

export const useQueryListMessages = (username: string) => {
  return useQuery({
    queryKey: ["listMessages", username],
    queryFn: () => listMessage(username),
  });
};

export const useMutationSendMessage = () => {
  return useMutation({
    mutationFn: (message: any) => sendMessage(message),
  });
};
