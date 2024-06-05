import { DataConnection, MediaConnection } from "peerjs";
import React, { LegacyRef } from "react";
import { useStore } from "../../store/store";
import { FaPhoneFlip, FaPhoneSlash } from "react-icons/fa6";
import { observer } from "mobx-react-lite";
interface Props {
  currentRef: React.MutableRefObject<HTMLVideoElement | undefined>;
  userRef: React.MutableRefObject<HTMLVideoElement | undefined>;
  call: MediaConnection;
  setCalling: React.Dispatch<React.SetStateAction<boolean>>;
  // setCon: React.Dispatch<React.SetStateAction<DataConnection | undefined>>;
  conn: DataConnection | undefined;
}

export default observer(function Video({
  currentRef,
  userRef,
  call,
  setCalling,
  conn,
}: Props) {
  const { peerStore, conversationStore } = useStore();

  const handleAcceptCall = () => {
    call.answer(peerStore.currentMediaStream!);
    call.on("stream", (remoteStream) => {
      peerStore.userMediaStream = remoteStream;
      userRef.current!.srcObject = remoteStream;
    });
    peerStore.AcceptCall = true;
  };

  const handleRejectCall = () => {
    // call.off("willCloseOnRemote")
    // call.close();
    conn?.close();
    currentRef.current = undefined;
    peerStore.userCall = null;
    peerStore.onCallUser = false;
    setCalling(false);
  };
  const handleRejectedCall = () => {
    call.close();
    setCalling(false);
    currentRef.current = undefined;
    peerStore.userCall = null;
    peerStore.onCallUser = false;
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <video
        className="w-full h-full"
        autoPlay
        playsInline
        ref={currentRef as LegacyRef<HTMLVideoElement>}
      />
      {peerStore.userMediaStream ? (
        <div className="w-40 absolute mt-10 left-10">
          <video
            className="w-full h-full"
            playsInline
            autoPlay
            ref={userRef as LegacyRef<HTMLVideoElement>}
          />
          <p className="absolute bottom-0 text-white">
            {peerStore.userCall?.DisplayName ||
              conversationStore.ProfileMessage?.displayName}
          </p>
        </div>
      ) : (
        <>
          {(peerStore.userCall || conversationStore.ProfileMessage) && (
            <div className="absolute w-60">
              <img
                src={
                  peerStore.userCall?.image ||
                  conversationStore.ProfileMessage?.image ||
                  "/assets/user.png"
                }
                className="rounded-full w-44 mx-auto"
              />
              <p className="text-center text-2xl font-semibold">
                {peerStore.userCall?.DisplayName ||
                  conversationStore.ProfileMessage?.displayName}
              </p>
              {/* <p>{peerStore.userCall.status == "call" && "Calling..."}</p> */}
              {peerStore.userCall?.status == "called" ? (
                <div className="  flex justify-between mt-10">
                  <button
                    className="p-4 bg-red-500 rounded-full"
                    onClick={() => handleRejectCall()}
                  >
                    <FaPhoneSlash size={40} />
                  </button>
                  <button
                    onClick={() => handleAcceptCall()}
                    className="p-4  bg-green-500 rounded-full"
                  >
                    <FaPhoneFlip size={40} />
                  </button>
                </div>
              ) : (
                <p className="text-center text-white">Calling...</p>
              )}
            </div>
          )}
        </>
      )}
      {peerStore.userMediaStream && (
        <>
          <div className="absolute bottom-24 ">
            <button
              className="p-4 bg-red-500 text-red-800 rounded-full"
              onClick={() => handleRejectedCall()}
            >
              <FaPhoneSlash size={40} />
            </button>
          </div>
        </>
      )}
    </div>
  );
});
