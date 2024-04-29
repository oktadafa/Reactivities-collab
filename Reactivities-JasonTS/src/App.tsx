import {   Outlet, useLocation } from "react-router-dom";
import Navbar from "./app/layout/Navbar";
import HomePage from "./features/home/homePage";
import ModalContainer from "./app/common/ModalContainer";
import { useEffect } from "react";
import { useStore } from "./app/store/store";
import "../src/assets/css/loader.css"
import { observer } from "mobx-react-lite";
function App() {
  const location = useLocation()
  const {userStore, commonStore} = useStore()
  useEffect(() => {   
    if (commonStore.bearer) {
      userStore.getUser().finally(() => commonStore.setAppLoaded())
      }else {
        commonStore.setAppLoaded()
      }
    },[userStore, commonStore]
  )

  if (!commonStore.appLoaded) {
   return(
     <div className="h-screen w-screen flex justify-center items-center">
      <div className="loader"></div>
    </div> 
    )
  }
  return (
    <div className="overflow-hidden">
    <ModalContainer/>
      {location.pathname == "/" ? (
        <HomePage />
      ) : (
        <div className="bg-[#EAEAEA] min-h-screen">
          <Navbar />
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default observer(App)
