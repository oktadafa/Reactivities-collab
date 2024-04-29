import React from 'react'
import { useStore } from '../store/store'
import { observer } from 'mobx-react-lite'

export default observer(function ModalContainer() {
  const { modalStore } = useStore();
  return (
    <div
      className="w-screen h-screen z-10 absolute shadow-2xl"
      hidden={modalStore.modal.open}
    >
        {modalStore.modal.body}
    </div>
  );
}); 
