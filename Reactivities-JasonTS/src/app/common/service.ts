import { useMutation, useQuery } from "@tanstack/react-query";
import { SendComment, deletePhoto, getActivities, getActivityById, getActivityByPredicate, getProfile, listFollowing, setMain, updateAttendance, updateFollow, updateProfile, uploadPhoto } from "../api/api";
import { Store } from "../store/store";
import Swal from "sweetalert2";
import { Profile } from "../models/profile";

export const useQueryActivityById = (id:string) => {
    return useQuery({
        queryKey:["activityById", id],
        queryFn: () => getActivityById(id)
    })
}

// export const useQueryActity = () => {
//     return useQuery({
//         queryKey:["activities"],
//         queryFn:  getActivities
//     })
// }

export const useQueryProfile =(username:string) => {
    return useQuery({
        queryKey:["getProfiles", username],
        queryFn: () => getProfile(username)
    })
}

export const useMutationUpdateAttendance = () => {
    return useMutation({
        mutationFn: (id:any) => {
            return updateAttendance(id)
        },
        onSuccess: (data) => {
            console.log(data);
        },

        onError:(error) => {
            console.log(error);
        }
    }
    )    
}
export const useQueryGetActivityByPredicate = (
  username: string,
  predicate: string
) => {
  return useQuery({
    queryFn: () => getActivityByPredicate(username, predicate),
    queryKey: ["getActivityByPredicate", username, predicate],
  });
};

export const useQueryGetFollow = (username:string, predicate:string) => {
    return useQuery({
        queryFn:() => listFollowing(username,predicate),
        queryKey: ["listFollowing", username, predicate]
    })
}

export const useMutationUpdateFollow = () => {
    return useMutation({
        mutationFn: (username:string) => updateFollow(username),
        mutationKey: ["updateFollow"],
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        }
    })
}

export const useMutationUploadPhoto = () => {
    return useMutation({
        mutationFn:(base64:string) => uploadPhoto(base64),
        mutationKey:["uploadPhoto"],
        onSuccess:(data) => {
            console.log(data);
            Swal.fire({
              title: "Success",
              text: "Success Upload Photo",
              icon: "success",
            });
        },
        onError: (error) => {
            console.log(error);
            Swal.fire({
                title: 'Failed',
                text:"Failed To Upload Photo",
                icon:"error"
            })
        }
    })
}

export const useMutationSetMainPhoto = () => {
    return useMutation({
        mutationFn:(id:string) => setMain(id),
        mutationKey:["setMain"],
        onSuccess: (data) => {
            console.log(data);
        },
        onError:(data) => {
            console.log(data);
                Swal.fire({
                  title: "Failed",
                  text: "Failed To Set Main Photo",
                  icon: "error",
                });
        }
    })
}

export const useMutationDeletePhoto = () => {
    return useMutation({
        mutationFn:(id:string) => deletePhoto(id),
        mutationKey:["deletePhoto"],
        onSuccess : (data) => {
            console.log(data);
        },
        onError: (data) => {
            console.log(data);
            Swal.fire({
              title: "Failed",
              text: "Failed To Delete Photo",
              icon: "error",
            });
        }
    })
}
export const useMutationUpdateProfile = () => {
    return useMutation({
        mutationFn:(profile:Partial<Profile>) => updateProfile(profile),
        mutationKey:["updateProfil"],
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        }
    })
}

export const useMutationSendComment = () => {
    return useMutation({
        mutationFn:(values:any) => SendComment(values),
        mutationKey:["sendComment"],
        onSuccess:(data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        }
    })
}