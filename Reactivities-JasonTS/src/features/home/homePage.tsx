import { Link, NavLink } from "react-router-dom";
import { useStore } from "../../app/store/store";
import LoginForm from "../users/LoginForm";
import { observer } from "mobx-react-lite";
import RegisterForm from "../users/RegisterForm";
import { useEffect, useRef, useState } from "react";
import { DataConnection, MediaConnection } from "peerjs";
import Video from "../../app/common/Video/Video";

export default observer(function HomePage() {
  const currentUserVideo = useRef<HTMLVideoElement>();
  const [conn, setConn] = useState<DataConnection | undefined>(undefined);
  const userRef = useRef<HTMLVideoElement>();
  const [onCall, setOnCall] = useState<MediaConnection | undefined>();
  const [calling, setCalling] = useState<boolean>(false);
  const {
    peerStore,
    modalStore,
    userStore: { IsLoggedIn, user },
  } = useStore();
  useEffect(() => {
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
        // console.log("closed conn");
        setCalling(false);
        peerStore.userCall = null;
        peerStore.onCallUser = false;
        peerStore.userMediaStream = null;
      });
      setConn(conn);
    });

    peerStore.peer?.on("error", (err) => {
      console.log(err);
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
  }, []);

  return (
    <>
      {calling ? (
        <Video
          currentRef={currentUserVideo}
          userRef={userRef}
          call={onCall!}
          setCalling={setCalling}
          conn={conn}
        />
      ) : (
        <div className="w-screen h-screen bg-blue-500 flex justify-center items-center">
          <div className="text-center">
            <p className="text-6xl font-bold text-white mb-5">Reactivities</p>
            {IsLoggedIn ? (
              <>
                <p className="text-white text-2xl font-bold mb-3">
                  welcome {user?.displayName}
                </p>
                <Link
                  to={"/activities"}
                  className="py-2 px-4 text-xl text-white border-2 border-white hover:bg-white hover:text-blue-500 font-bold rounded-md"
                >
                  Go To Activities
                </Link>
              </>
            ) : (
              <div className="flex justify-evenly">
                <button
                  onClick={() => modalStore.openModal(<LoginForm />)}
                  className="py-2 px-4 text-xl text-white border-2 border-white hover:bg-white hover:text-blue-500 font-bold rounded-md"
                >
                  Login
                </button>

                <button
                  className="py-2 px-4 text-xl text-white border-2 border-white hover:bg-white hover:text-blue-500 font-bold rounded-md"
                  onClick={() => modalStore.openModal(<RegisterForm />)}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
});
