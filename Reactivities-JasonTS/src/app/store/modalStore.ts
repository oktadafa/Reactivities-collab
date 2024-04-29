import { makeAutoObservable } from "mobx";

interface Modal{
    open:boolean;
    body:JSX.Element |null
}

export default class ModalStore{
    modal:Modal = {
        open:true,
        body:null
    }

    constructor()
    {
        makeAutoObservable(this)
    }

    openModal = (content:JSX.Element) => {
        this.modal.open = false,
        this.modal.body = content
    }

    closeModal = () => {
        this.modal.open = true;
        this.modal.body = null;
    }
}