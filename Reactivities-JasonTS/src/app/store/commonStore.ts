import { makeAutoObservable, reaction } from "mobx";

export default class CommonStore {
  bearer: Token | null | undefined = JSON.parse(localStorage.getItem("bearer")!);
  appLoaded : boolean = false;
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.bearer,
      (bearer) => {
        if (bearer) {
          localStorage.setItem("bearer", JSON.stringify(bearer));
        } else {
          localStorage.removeItem("bearer");
        }
      }
    );
  }

  setBearer = (bearer: Token | null) => {
    this.bearer = bearer;    
  };

  setAppLoaded = () => {
    this.appLoaded = true
  }

}