import React from "react";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";

export default observer(function ModalContainer() {
  const { modalStore } = useStore();
  return (
    <div
      className="top-0 bottom-0 left-0 right-0 z-50 fixed shadow-2xl bg-[rgb(0,0,0,0.7)]"
      hidden={modalStore.modal.open}
    >
      {modalStore.modal.body}
    </div>
  );
});
