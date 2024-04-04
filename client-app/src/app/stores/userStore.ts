import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;
    buttonSendBackVrify:boolean = true
    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user;        
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/activities');  
            store.modalStore.closeModal();
        }catch (error) {
            throw error;
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
           router.navigate("/verify-email")
           store.modalStore.closeModal()
        }catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        // localStorage.removeItem('jwt');
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
            console.log(user);
            
        } catch (error) {
            console.log(error)
        }
    }
    
    setImage = (image : string) => {
        if(this.user) this.user.image = image
    }

    setDisplayName = (name: string) => {
        if(this.user) this.user.displayName = name
    }

    loginGoogle = async(data:UserFormValues) => {
      try {
        // console.log(data)
        const user = await agent.Account.google(data)
        store.commonStore.setToken(user.token);
        runInAction(() => {
            this.user = user
            router.navigate('/activities')
        })
        console.log(user);
        
      } catch (error) {
            console.log(error)        
      }        
    }

    sendTokenVerify = async(code:any) => 
    {
        try {
             agent.Account.verificationEmail(code).then((_) =>
               router.navigate("/activities")
             );
            
        } catch (error) {
            console.log(error);
        }
    }
    sendTokenToEmail = async() => {
        try {
            await agent.Account.sendemail().then(async() =>{
            await this.getUser()
            this.setButtonSendToken(true)
            })
            
        } catch (error) {
            console.error(error);
            
        }
    }

    setButtonSendToken = (values:boolean) => {
        this.buttonSendBackVrify  = values
    }
}

