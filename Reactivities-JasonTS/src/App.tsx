import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./app/layout/Navbar";
import HomePage from "./features/home/homePage";
import ModalContainer from "./app/common/ModalContainer";
import { useEffect } from "react";
import { useStore } from "./app/store/store";
import "../src/assets/css/loader.css";
import { observer } from "mobx-react-lite";
function App() {
  const location = useLocation();
  const { userStore, commonStore, conversationStore } = useStore();
  const isChatRoute = location.pathname.startsWith("/chat");
  const isVideoRoute = location.pathname.startsWith("/video");
  useEffect(() => {
    if (commonStore.bearer) {
      userStore
        .getUser()
        .then(() => {})
        .finally(() => commonStore.setAppLoaded());
      // conversationStore.newPeer();
      // conversationStore.PeerConnect();
      // navigator.mediaDevices.getUserMedia({audio:true, video:true}).then
      conversationStore.createHubConnection();
      // conversationStore.getStream();
      // conversationStore.newPeer();
    } else {
      commonStore.setAppLoaded();
    }
  }, []);

  // conversationStore.peerConnection();
  // conversationStore.peerConnection();
  if (!commonStore.appLoaded) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden">
      <ModalContainer />
      {location.pathname == "/" ? (
        <HomePage />
      ) : (
        <div className="bg-[#EAEAEA] min-h-screen">
          {!isChatRoute && !isVideoRoute && (
            <>
              <Navbar />
            </>
          )}
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default observer(App);
