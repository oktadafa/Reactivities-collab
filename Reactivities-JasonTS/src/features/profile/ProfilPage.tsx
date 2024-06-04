import { useEffect, useRef, useState } from "react";
import ProfileAbout from "./ProfileAbout";
import { Tab } from "../../app/models/profile";
import ProfileActivity from "./ProfileActivity";
import ProfilePhoto from "./ProfilePhoto";
import ProfileFollow from "./ProfileFollow";
import { useStore } from "../../app/store/store";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useQueryProfile } from "../../app/common/service";
import ProfileHeader from "./ProfileHeader";
import { DataConnection, MediaConnection } from "peerjs";
import Video from "../../app/common/Video/Video";

export default observer(function ProfilPage() {
  const { username } = useParams();
  const currentUserVideo = useRef<HTMLVideoElement>();
  const userRef = useRef<HTMLVideoElement>();
  const [conn, setConn] = useState<DataConnection | undefined>(undefined);
  const [onCall, setOnCall] = useState<MediaConnection | undefined>();
  const [calling, setCalling] = useState<boolean>(false);
  const {
    modalStore,
    profileStore,
    peerStore,
    userStore: { user },
  } = useStore();
  useEffect(() => {
    profileStore.setActiveTab(tabs[0]);
    modalStore.closeModal();
    peerStore.peer?.on("connection", (conn) => {
      conn.on("data", (data) => {
        const result: UserCall = JSON.parse(data as string);
        peerStore.userCall = result;
      });
      conn.on("open", () => {
        const data: UserCall = {
          DisplayName: user?.displayName!,
          image: user?.image!,
          status: "call",
        };
        conn.send(JSON.stringify(data));
      });
      conn.on("close", () => {
        setCalling(false);
        peerStore.userCall = null;
        peerStore.onCallUser = false;
        peerStore.userMediaStream = null;
      });
      setConn(conn);
    });
    peerStore.peer?.on("disconnected", () => {
      peerStore.userCall = null;
      peerStore.onCallUser = false;
      peerStore.userMediaStream = null;
    });
    peerStore.peer?.on("call", (call) => {
      setCalling(true);
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((mediaStream) => {
          setOnCall(call);
          call.on("close", () => {
            // call.close();

            mediaStream.getTracks().forEach((e) => e.stop());
            setCalling(false);
            currentUserVideo.current = undefined;
            peerStore.userCall = null;
            peerStore.onCallUser = false;
            peerStore.userMediaStream = null;
          });
          call.on("error", () => {
            mediaStream.getTracks().forEach((e) => e.stop());
            peerStore.userCall = null;
            peerStore.onCallUser = false;
            peerStore.userMediaStream = null;
          });
          currentUserVideo.current!.srcObject = mediaStream;
        });
    });
  }, [profileStore, username]);
  const query = useQueryProfile(username!);
  if (query.isSuccess) {
    if (
      profileStore.profile?.username !== query.data.username ||
      !profileStore.profile
    ) {
      profileStore.saveProfile(query.data);
    }
  }
  const tabs: Tab[] = [
    { id: 1, page: <ProfileAbout />, name: "About" },
    { id: 2, page: <ProfileActivity />, name: "Activity" },
    { id: 3, page: <ProfilePhoto />, name: "Photo" },
    { id: 4, page: <ProfileFollow />, name: "Followers" },
    { id: 5, page: <ProfileFollow />, name: "Followings" },
  ];
  return (
    <>
      {calling ? (
        <Video
          conn={conn}
          currentRef={currentUserVideo}
          userRef={userRef}
          call={onCall!}
          setCalling={setCalling}
        />
      ) : (
        <div className="sm:px-60 py-20 px-3 sm:text-base text-sm">
          <ProfileHeader />
          <div className="flex justify-around">
            <div className="bg-white mt-5 w-[75%]  sm:w-[80%] p-4 rounded">
              {profileStore.activeTab?.page}
            </div>
            <div className="bg-white mt-5 w-[22%]  sm:w-[17%] sm:max-h-52 max-h-40 rounded">
              {tabs.map((e) => (
                <div
                  className={`px-2 py-2 border-b text-xs sm:text-base hover:bg-gray-100 ${
                    e.id == profileStore.activeTab?.id && "bg-gray-100"
                  }`}
                  onClick={() => profileStore.setActiveTab(e)}
                >
                  <p>{e.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
});
