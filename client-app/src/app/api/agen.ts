import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activities";
import { toast } from "react-toastify";
import { router } from "../router/router";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";

axios.defaults.baseURL = "http://localhost:5000/api/"

const responseBody =<T>(response : AxiosResponse<T>) => response.data;

const sleep = (delay:number) =>{
  return new Promise(resolve => {
    setTimeout(resolve,delay)
  })
}

axios.interceptors.response.use(async response => {
    await  sleep(1000);
    return response;
  },(error : AxiosError) => {
    const {data,status,config} = error.response as AxiosResponse;
    switch (status) {
      case 400:
          if(config.method == 'get'  && Object.prototype.hasOwnProperty.call(data.errors, 'id')){
            router.navigate('/not-found')
          }
          if (data.errors) {
            const modalStateErrors = [];
            for (const key in data.errors) {
              if (data.errors[key]) {
                modalStateErrors.push(data.errors[key])
              }
            }
            throw modalStateErrors.flat()
          }else {
            toast.error(data)
          }
          break;
      case 401:
          toast.error("UnAuthorizes")
          break;
      case 403:
          toast.error("Forbidden")
          break;
      case 404:
          router.navigate("/not-found")
          break;
      case 405:
          toast.error("Bad Validation")
          break;
      case 500:
          store.commonStore.setServerError(data);
          router.navigate('/server-error')
          break;
    }
    return Promise.reject(error);
  })

const request = {
    get : <T>(url:string) => axios.get<T>(url).then(responseBody),
    post : <T>(url:string,body:{}) => axios.post<T>(url,body).then(responseBody),
    put : <T>(url:string, body :{}) => axios.put<T>(url,body).then(responseBody),
    del: <T>(url:string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
  list: () => request.get<Activity[]>("activities"),
  details: (id: string) => request.get<Activity>(`activities/${id}`),
  create: (activity: Activity) =>
    request.post<void>("activities/tambah", activity),
  update: (activity: Activity) =>
    request.put<void>(`Activities/edit/${activity.id}`, activity),
  delete: (id: string) => request.del<void>(`activities/delete/${id}`),
};

const Account = {
  current: () => request.get<User>('/accounc'),
  login : (user:UserFormValues) => request.post<User>('/accounc/login', user),
  register : (user:UserFormValues) => request.post<User>('/accounc/register', user)
}

export const agent = {
    Activities,
    Account
}