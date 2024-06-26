import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";
import { Photo, Profile, userActivity } from "../models/profile";
import { PaginatedResult } from "../models/pagination";
import { INotification } from "../models/notification";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token; 
    if (token && config.headers) config.headers!.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {  //loading setelah refresh menjadi kotak kecil
        if (import.meta.env.DEV) await sleep(1000);
        const pagination = response.headers['pagination'];
        if (pagination) {
            response.data = new PaginatedResult(response.data, JSON.parse(pagination));
            return response as AxiosResponse<PaginatedResult<any>>
        }
        return response;
},(error: AxiosError) => {
    console.log(error);
    
    const {data, status, config} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('/not-found');
            }
            if (data.errors) {
                const modalStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorized')
            break;
        case 403:
            toast.error('forbidden')
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error); //.response
})


const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody), 
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params})
    .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities/tambah', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/edit/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
    kick :(activityId:string, username:string) => requests.post<void>(`/activities/${activityId}/attend/kick/${username}`,{}),
    addAttend : (activityId:string, username:string) => requests.post<void>(`/activities/${activityId}/attend/add/${username}`, {})

}

const Account = {
    current: () => requests.get<User>('/accounc'),
    login: (user: UserFormValues) => requests.post<User>('/accounc/login', user),
    register: (user: UserFormValues) => requests.post<User>('/accounc/register', user)
}

const Profiles= {
    get: (username: string) => requests.get<Profile>(`/profile/${username}`),
    uploudPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file)
        return axios.post<Photo>('photo', formData, {
            headers: {'Comtent-Type': 'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photo/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photo?id=${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profile`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => 
    requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => 
        requests.get<userActivity[]>(`/profile/${username}/activities?Predikat=${predicate}`)
}
const Notifications= {
    get:() => requests.get<INotification[]>('/notifications')
}

const agent = {
    Activities, 
    Account,
    Profiles,
    Notifications
}

export default agent;