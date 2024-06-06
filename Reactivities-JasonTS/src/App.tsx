import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./app/layout/Navbar";
import HomePage from "./features/home/homePage";
import ModalContainer from "./app/common/ModalContainer";
import { useEffect } from "react";
import { useStore } from "./app/store/store";
import "../src/assets/css/loader.css";
import { observer } from "mobx-react-lite";
import "react-toastify/dist/ReactToastify.css";
import {
  FaFileAudio,
  FaFileImage,
  FaFileLines,
  FaFilePdf,
  FaFileVideo,
} from "react-icons/fa6";
import LoadingApp from "./app/common/LoadingApp";
function App() {
  const location = useLocation();
  const { userStore, commonStore, conversationStore, peerStore } = useStore();
  const isChatRoute = location.pathname.startsWith("/chat");
  const isVideoRoute = location.pathname.startsWith("/video");
  useEffect(() => {
    if (commonStore.bearer) {
      userStore
        .getUser()
        .then(() => {
          // peerStore.newPeer();
          if (!peerStore.peer) {
            // peerStore.peer = new Peer(userStore.user?.id!, {
            //   host: "localhost",
            //   port: 9000,
            //   path: "/",
            // });
            peerStore.newPeer();
          }
        })
        .finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
    return () => {
      peerStore.peer?.destroy();
    };
  }, [peerStore, userStore]);
  const limitWords = (setences: string) => {
    if (setences.length > 20) {
      return setences.slice(0, 20) + "...";
    }
    return setences;
  };

  const ekstenstion = [
    "application/pdf",
    "video/mp4",
    "video/mkv",
    "audio/mpeg",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (!commonStore.appLoaded) {
    return <LoadingApp />;
  }
  return (
    <div className="overflow-hidden">
      <ModalContainer />
      {location.pathname == "/" ? (
        <HomePage />
      ) : (
        <div className="bg-[#EAEAEA] min-h-screen">
          {!isChatRoute &&
            !isVideoRoute &&
            (!peerStore.userCall || peerStore.onCallUser) && (
              <>
                <Navbar />
              </>
            )}
          <Outlet />
        </div>
      )}
      <div className="absolute z-50 bottom-10 right-10">
        {conversationStore.newMessage.map((e) => (
          <div
            className=" bg-white p-3 rounded mt-5"
            onClick={() => {
              conversationStore.newMessage =
                conversationStore.newMessage.filter((x) => x.id !== e.id);
            }}
          >
            <div className="flex">
              <div className="flex items-center">
                <img
                  src={e.image || "/assets/user.png"}
                  width={40}
                  className="rounded-full mr-5"
                />
              </div>
              <div>
                <p className="font-semibold">{e.fromDisplayName}</p>
                <div className="flex items-center">
                  {e.file !== null &&
                    (e.file.contentType == "image/jpeg" ||
                      e.file.contentType == "image/png" ||
                      e.file.contentType == "image/jpg") && <FaFileImage />}
                  {e.file?.contentType &&
                    e.file.contentType == "audio/mpeg" && <FaFileAudio />}
                  {e.file !== null &&
                    (e.file.contentType == "video/mp4" ||
                      e.file.contentType == "video/mkv") && <FaFileVideo />}
                  {e.file?.contentType &&
                    e.file.contentType == "application/pdf" && <FaFilePdf />}
                  {e.file == null ||
                    (e.file == undefined &&
                      !ekstenstion.some((x) => x == e.file?.contentType) && (
                        <FaFileLines />
                      ))}

                  <p className="ml-2">
                    {e.body.trim().length > 0
                      ? limitWords(e.body)
                      : limitWords(e.file?.name!)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default observer(App);
