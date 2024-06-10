import {
  FaArrowLeftLong,
  FaDownload,
  FaEllipsisVertical,
  FaFileAudio,
  FaFileCirclePlus,
  FaFileImage,
  FaFileLines,
  FaFilePdf,
  FaFileVideo,
  FaPaperPlane,
  FaVideo,
  FaX,
} from "react-icons/fa6";
import {
  useMutationDeleteMessage,
  useMutationSendMessage,
} from "../../../app/common/service";
import LoadingApp from "../../../app/common/LoadingApp";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useStore } from "../../../app/store/store";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import ScrollableFeed from "react-scrollable-feed";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { HiMiniCheckCircle } from "react-icons/hi2";
import UploadFile from "../../../app/common/UploadFile/UploadFile";
import LoadingAddAtendee from "../../../app/common/LoadingAddAtendee";
import { DataConnection, MediaConnection } from "peerjs";
import Video from "../../../app/common/Video/Video";
import { router } from "../../../app/router/router";
import Swal from "sweetalert2";
export default observer(function ChatDashboard() {
  const { userStore, conversationStore, peerStore } = useStore();
  const sendMessage = useMutationSendMessage();
  const [files, setFiles] = useState<FileBase64[]>([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileBase64 | null>(null);
  const deleteMessage = useMutationDeleteMessage();
  const currentUserVideo = useRef<HTMLVideoElement>();
  const userRef = useRef<HTMLVideoElement>();
  const [calling, setCalling] = useState<boolean>(false);
  const [conn, setConn] = useState<DataConnection | undefined>(undefined);
  const [onCall, setOnCall] = useState<MediaConnection | undefined>();
  const validationSchema = Yup.object({
    body: Yup.string().required().trim(),
  });
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

  const convertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const getSize = (bytes: number) => {
    let result = bytes / 1000;
    if (result >= 1000) {
      result = result / 1000;
      return `${Number(result).toFixed(2)} Mb`;
    }
    return `${Number(result).toFixed(2)} Kb`;
  };
  useEffect(() => {
    if (conversationStore.selectedUsername) {
      conversationStore.listMessages(conversationStore.selectedUsername);
      setFiles([]);
      setSelectedFile(null);
    }
    peerStore.peer?.on("connection", (conn) => {
      conn.on("data", (data) => {
        const result: UserCall = JSON.parse(data as string);
        peerStore.userCall = result;
      });
      conn.on("open", () => {
        const data: UserCall = {
          DisplayName: userStore.user?.displayName!,
          image: userStore.user?.image!,
          status: "call",
        };
        conn.send(JSON.stringify(data));
      });
      conn.on("close", () => {
        setCalling(false);
        peerStore.userCall = null;
        peerStore.onCallUser = false;
        peerStore.currentMediaStream?.getTracks().forEach((e) => e.stop());
        peerStore.userMediaStream = null;
      });
      conn.on("error", () => {
        setCalling(false);
        peerStore.userCall = null;
        peerStore.onCallUser = false;
        peerStore.currentMediaStream?.getTracks().forEach((e) => e.stop());
        peerStore.userMediaStream = null;
      });
      setConn(conn);
    });

    peerStore.peer?.on("error", () => {
      setCalling(false);
      peerStore.userCall = null;
      peerStore.onCallUser = false;
      peerStore.userMediaStream = null;
      peerStore.currentMediaStream?.getTracks().forEach((e) => e.stop());
    });
    //
    peerStore.peer?.on("disconnected", () => {
      setCalling(false);
      peerStore.userCall = null;
      peerStore.onCallUser = false;
      peerStore.currentMediaStream?.getTracks().forEach((e) => e.stop());
      peerStore.userMediaStream = null;
    });
    peerStore.peer?.on("call", (call) => {
      setCalling(true);
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((mediaStream) => {
          peerStore.currentMediaStream = mediaStream;
          call.on("close", () => {
            mediaStream.getTracks().forEach((e) => e.stop());
            setCalling(false);
            peerStore.userCall = null;
            peerStore.onCallUser = false;
            peerStore.currentMediaStream?.getTracks().forEach((e) => e.stop());
            peerStore.userMediaStream = null;
          });
          call.on("error", () => {
            peerStore.userCall = null;
            peerStore.onCallUser = false;
            peerStore.currentMediaStream?.getTracks().forEach((e) => e.stop());
            peerStore.userMediaStream = null;
          });
          setOnCall(call);
          currentUserVideo.current!.srcObject = mediaStream;
        });
    });
  }, []);

  const callUser = (id: string) => {
    setCalling(true);
    peerStore.onCallUser = true;
    const conn = peerStore.peer?.connect(id);
    conn?.on("open", () => {
      const dataCurrentUser: UserCall = {
        DisplayName: userStore.user?.displayName!,
        image: userStore.user?.image!,
        status: "called",
      };
      conn.send(JSON.stringify(dataCurrentUser));
    });
    conn?.on("data", (data) => {
      const result: UserCall = JSON.parse(data as string);
      peerStore.userCall = result;
    });
    conn?.on("close", () => {
      peerStore.currentMediaStream?.getTracks().forEach((e) => e.stop());
      setCalling(false);
      peerStore.userCall = null;
      peerStore.onCallUser = false;
      peerStore.currentMediaStream = null;
      peerStore.userMediaStream = null;
    });
    setConn(conn);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((data) => {
        peerStore.currentMediaStream = data;
        currentUserVideo.current!.srcObject = peerStore.currentMediaStream;
        var call = peerStore.peer?.call(id, data);
        setOnCall(call);
        call?.on("stream", (remoteStream) => {
          peerStore.userMediaStream = remoteStream;
          userRef.current!.srcObject = remoteStream;
        });
        call?.on("error", () => {
          data.getTracks().forEach((e) => e.stop());
          peerStore.userCall = null;
          peerStore.onCallUser = false;
          peerStore.currentMediaStream = null;
          peerStore.userMediaStream = null;
        });

        call?.on("close", () => {
          peerStore.currentMediaStream?.getTracks().forEach((e) => e.stop());
          setCalling(false);
          peerStore.userCall = null;
          peerStore.onCallUser = false;
          peerStore.currentMediaStream = null;
          peerStore.userMediaStream = null;
        });
      });
  };
  const getExtension = (contentType: string) => {
    return contentType.split("/")[1];
  };
  if (conversationStore.loadingConversation) {
    return <LoadingApp />;
  }
  return (
    <>
      {calling ? (
        <Video
          setCalling={setCalling}
          currentRef={currentUserVideo}
          userRef={userRef}
          call={onCall!}
          conn={conn}
        />
      ) : (
        <div className="container sm:grid-cols-3 sm:grid h-screen">
          <div
            className="border bg-white sm:inline"
            hidden={conversationStore.ProfileMessage !== null}
          >
            <h1 className="p-4 text-xl flex items-center font font-bold border-b-2 bg-blue-700 text-white">
              <button
                className="mr-2"
                onClick={() => {
                  conversationStore.selectedUsername = null;
                  conversationStore.ProfileMessage = null;
                  return router.navigate("/activities");
                }}
              >
                <FaArrowLeftLong />
              </button>
              Reactivities-Chat
            </h1>
            <div className="overflow-y-auto h-[40rem]">
              {conversationStore.Conversation.map((e) => (
                <div
                  className={`flex justify-between py-3 border-b-2 ${
                    conversationStore.selectedUsername == e.username &&
                    "bg-gray-200"
                  }`}
                  onClick={() => conversationStore.setSelectedUser(e.username)}
                >
                  <div className="flex ml-4">
                    <img
                      src={e.image || `/assets/user.png`}
                      className="rounded-full w-12"
                    />
                    <div className="ml-4">
                      <p className="font-semibold">{e.displayName}</p>
                      <p
                        className={`${
                          userStore.user?.userName !== e.fromUsername &&
                          !e.isRead
                            ? "font-bold"
                            : ""
                        } flex items-center`}
                      >
                        {e.file !== null &&
                          (e.fileType == "image/jpeg" ||
                            e.fileType == "image/png" ||
                            e.fileType == "image/jpg") && (
                            <FaFileImage className="mr-1" />
                          )}
                        {e.fileType && e.fileType == "audio/mpeg" && (
                          <FaFileAudio className="mr-1" />
                        )}
                        {e.file !== null &&
                          (e.fileType == "video/mp4" ||
                            e.fileType == "video/mkv") && (
                            <FaFileVideo className="mr-1" />
                          )}
                        {e.fileType && e.fileType == "application/pdf" && (
                          <FaFilePdf className="mr-1" />
                        )}
                        {e.file == null ||
                          (e.file == undefined &&
                            !ekstenstion.some((x) => x == e.fileType) && (
                              <FaFileLines className="mr-1" />
                            ))}
                        {e.message.trim().length > 0
                          ? limitWords(e.message)
                          : limitWords(e.file!)}
                        {userStore.user?.userName == e.fromUsername &&
                          (!e.isRead ? (
                            <HiMiniCheckCircle color="gray" className="ml-1" />
                          ) : (
                            <HiMiniCheckCircle color="blue" className="ml-1" />
                          ))}
                      </p>
                    </div>
                  </div>
                  <div className="inline-block text-center">
                    <p className="mr-4">
                      {formatDistanceToNow(new Date(e.createdAt))}
                    </p>
                    <div className="text-blue-500">
                      {e.noReadCount > 0 && e.noReadCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {conversationStore.laodignChat ? (
            <div className="w-full flex justify-center items-center sm:col-span-2">
              <div
                className=" inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : conversationStore.ProfileMessage ? (
            <div className="border sm:col-span-2 h-screen">
              <div className="bg-white flex items-center px-6 py-3 sticky justify-between w-full top-0">
                <div className="flex items-center">
                  <img
                    src={
                      conversationStore.ProfileMessage?.image ||
                      "/assets/user.png"
                    }
                    className="rounded-full w-10 mr-3"
                  />
                  <Link
                    className="text-lg font-semibold"
                    to={`/profile/${conversationStore.ProfileMessage.userName}`}
                  >
                    {conversationStore.ProfileMessage?.displayName}
                  </Link>
                </div>
                <button
                  onClick={() =>
                    callUser(conversationStore.ProfileMessage?.id!)
                  }
                >
                  <FaVideo />
                </button>
              </div>
              {files.length > 0 ? (
                <div className="h-[500px] mt-20 w-full">
                  <div className="w-full px-10">
                    <button onClick={() => setFiles([])}>
                      <FaX />
                    </button>
                    <p className="text-center text-gray-500">
                      {selectedFile?.name}
                    </p>
                  </div>
                  <div className="w-full  flex justify-center items-center h-[400px]">
                    <div>
                      {selectedFile?.contentType == "video/mp4" ||
                      selectedFile?.contentType == "video/mkv" ||
                      selectedFile?.contentType == "image/jpeg" ||
                      selectedFile?.contentType == "image/png" ||
                      selectedFile?.contentType == "image/jpg" ||
                      selectedFile?.contentType == "audio/mpeg" ? (
                        <UploadFile
                          File={selectedFile}
                          className="block max-w-[400px] h-[300px] mx-auto"
                        />
                      ) : (
                        <>
                          <UploadFile
                            File={selectedFile!}
                            className="block w-[100px] h-[300px] mx-auto"
                          />
                          <p className="text-gray-500 text-center">
                            {getSize(selectedFile?.size!)} |{" "}
                            {getExtension(selectedFile?.contentType!)}
                          </p>
                        </>
                      )}
                      <div className="w-[400px] border rounded-full bg-white mt-3 flex items-center p-2">
                        <input
                          disabled={buttonLoad}
                          type="text"
                          className="outline-none h-6 w-full text-lg"
                          placeholder="Entry Message"
                          value={selectedFile?.message}
                          onChange={(p) => {
                            setSelectedFile({
                              ...selectedFile!,
                              message: p.target.value,
                            });
                            setFiles(
                              files.map((e) => {
                                if (e.name == selectedFile?.name) {
                                  e.message = p.target.value;
                                }
                                return e;
                              })
                            );
                          }}
                        />

                        <button
                          disabled={buttonLoad}
                          className="bg-green-500 p-2 rounded-full"
                          type="submit"
                          onClick={() => {
                            setButtonLoad(true);
                            files.forEach((e) => {
                              const message = {
                                username: conversationStore.selectedUsername,
                                body: e.message,
                                craetedAt: new Date(),
                                file: e,
                              };
                              sendMessage
                                .mutateAsync(message)
                                .then(() => {
                                  const check =
                                    conversationStore.Conversation.some(
                                      (e) =>
                                        e.username ===
                                        conversationStore.selectedUsername
                                    );
                                  if (!check) {
                                    const Conversation: Conversation = {
                                      displayName:
                                        conversationStore.ProfileMessage
                                          ?.displayName!,
                                      username:
                                        conversationStore.ProfileMessage
                                          ?.userName!,
                                      image:
                                        conversationStore.ProfileMessage
                                          ?.image!,
                                      message: message.body,
                                      createdAt: message.craetedAt.toString(),
                                      isRead: false,
                                      fromUsername: userStore.user?.userName!,
                                      noReadCount: 0,
                                      file: e.name,
                                      fileType: e.contentType,
                                    };

                                    conversationStore.Conversation.push(
                                      Conversation
                                    );
                                  }
                                  conversationStore.Conversation.forEach(
                                    (x) => {
                                      if (x.username == message.username) {
                                        x.fromUsername =
                                          userStore.user?.userName!;
                                        x.message = message.body;
                                        x.createdAt =
                                          message.craetedAt.toString();
                                        x.isRead = false;
                                        x.file = e.name;
                                        x.fileType = e.contentType;
                                      }
                                    }
                                  );
                                  const messages: Messages = {
                                    fromUsername: userStore.user?.userName!,
                                    body: message.body,
                                    createdAt: message.craetedAt.toString(),
                                    file: e,
                                    image: null,
                                    fromDisplayName: null,
                                    id: null,
                                    isRead: false,
                                    showOptions: false,
                                  };
                                  conversationStore.ProfileMessage?.messages.push(
                                    messages
                                  );
                                  conversationStore.Conversation.sort(
                                    (a, b) =>
                                      new Date(b.createdAt).getTime() -
                                      new Date(a.createdAt).getTime()
                                  );
                                })
                                .finally(() => {
                                  setButtonLoad(false);
                                  setFiles([]);
                                });
                            });
                          }}
                        >
                          {buttonLoad ? (
                            <LoadingAddAtendee />
                          ) : (
                            <FaPaperPlane size={20} color="white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-center">
                    <div className="w-[600px] flex py-2 overflow-x-scroll">
                      {files.map((e) => (
                        <div
                          className={` ml-2 inline-block border-2 rounded p-2 border-gray-500 ${
                            e.name == selectedFile?.name &&
                            "ring-2 ring-blue-500"
                          }`}
                          onClick={() => setSelectedFile(e)}
                        >
                          {/* <img src={e.base64} className="w-[100px]  h-[100px]" /> */}
                          {/* <UploadFile className="w-[100px]  h-[100px]" File={e} /> */}
                          {selectedFile?.contentType == "video/mp4" ||
                          selectedFile?.contentType == "video/mkv" ||
                          selectedFile?.contentType == "image/jpeg" ||
                          selectedFile?.contentType == "image/png" ||
                          selectedFile?.contentType == "image/jpg" ? (
                            <UploadFile
                              File={e}
                              className="w-[60px] h-[60px]"
                            />
                          ) : (
                            <>
                              <UploadFile
                                File={e}
                                className="w-[60px] h-[60px]"
                              />
                            </>
                          )}
                        </div>
                      ))}
                      <label
                        className={`ml-2 inline-block ${
                          files.length == 2 && "hidden"
                        } rounded border-2 p-2 border-gray-500 active:bg-white`}
                      >
                        <input
                          type="file"
                          multiple
                          hidden
                          onChange={async (e) => {
                            if (e.target.files!.length > 2) {
                              return Swal.fire({
                                text: "You can't upload more than 2 files at a time",
                                title: "Failed",
                              });
                            }
                            for (
                              let index = 0;
                              index < e.target.files!.length;
                              index++
                            ) {
                              var check = files.some(
                                (x) => x.name == e.target.files![index].name
                              );
                              if (!check) {
                                var result = await convertFileToBase64(
                                  e.target.files![index]
                                );
                                const file: FileBase64 = {
                                  name: e.target.files![index].name,
                                  size: e.target.files![index].size,
                                  contentType: e.target.files![index].type,
                                  base64: result as string,
                                  message: "",
                                };
                                setFiles((prevFiles) => [...prevFiles, file]);
                              }
                            }
                          }}
                        />
                        <FaFileCirclePlus
                          className="h-[60px] w-[60px] "
                          color="gray"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-[500px] sm:mt-5">
                    <ScrollableFeed className="px-5">
                      {conversationStore.groupedMessages?.map(
                        ([group, messages]) => (
                          <>
                            <p className="text-center">{group}</p>
                            {messages.map((x) =>
                              x.fromUsername == userStore.user?.userName ? (
                                <div className="flex justify-end mt-3 w-full items-center">
                                  <div hidden={!x.showOptions}>
                                    <button
                                      className="bg-white p-2 text-red-500 font-bold text-sm"
                                      onClick={() =>
                                        deleteMessage
                                          .mutateAsync(x.id!)
                                          .then(() =>
                                            conversationStore.deleteMessage(
                                              x.id!
                                            )
                                          )
                                      }
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                  <button
                                    onClick={() =>
                                      conversationStore.showOption(x.id!)
                                    }
                                  >
                                    <FaEllipsisVertical />
                                  </button>
                                  <div className="px-2 py-2 bg-white max-w-80 rounded-l-lg rounded-br-lg ">
                                    {x.file !== null && (
                                      <>
                                        <UploadFile
                                          File={x.file}
                                          className="text-8xl mx-auto"
                                        />
                                        <p className="font-semibold text-sm">
                                          {x.file.name} | {getSize(x.file.size)}
                                        </p>
                                        <div className="bg-blue-500 w-20 justify-center py-1 text-white rounded-full">
                                          <a
                                            className="flex items-center text-sm justify-center"
                                            href={x.file.base64}
                                            download={x.file.name}
                                          >
                                            Unduh
                                            <FaDownload className="ml-1" />
                                          </a>
                                        </div>
                                      </>
                                    )}
                                    <div className="flex items-center">
                                      <p className="max-w-60  break-words">
                                        {x.body.trim().length > 0 && x.body}
                                      </p>
                                      <p className="text-gray-500 ml-2 flex text-xs font-semibold text-right mt-1 ">
                                        {format(
                                          new Date(x.createdAt),
                                          "hh:mm aa"
                                        )}{" "}
                                        <HiMiniCheckCircle
                                          size={15}
                                          color={x.isRead ? "green" : "gray"}
                                        />
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-start mt-3 w-full">
                                  <div>
                                    <div className="p-2 bg-white max-w-80 rounded-bl-lg rounded-r-lg ">
                                      <div className="max-w-80   inline-block">
                                        {x.file !== null && (
                                          <>
                                            <UploadFile
                                              File={x.file}
                                              className="text-8xl mx-auto"
                                            />
                                            <p className="font-semibold text-sm">
                                              {x.file.name} |
                                              {getSize(x.file.size)}
                                            </p>
                                            <div className="bg-blue-500 w-20 justify-center py-1 text-white rounded-full">
                                              <a
                                                className="flex items-center text-sm justify-center"
                                                href={x.file.base64}
                                                download={x.file.name}
                                              >
                                                Unduh <FaDownload />
                                              </a>
                                            </div>
                                          </>
                                        )}
                                        <div className="flex items-center">
                                          <p className="max-w-80 mr-2  break-words">
                                            {x.body.trim().length > 0 && x.body}
                                          </p>
                                          <p className="text-gray-500 flex text-xs font-semibold text-right mt-1 ">
                                            {format(
                                              new Date(x.createdAt),
                                              "hh:mm aa"
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </>
                        )
                      )}
                    </ScrollableFeed>
                  </div>
                  <Formik
                    initialValues={{ body: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                      const data = {
                        body: values.body,
                        username: conversationStore.selectedUsername,
                        createdAt: new Date().toString(),
                        fromUsername: userStore.user?.userName!,
                        image: null,
                        fromDisplayName: null,
                        id: null,
                        isRead: false,
                        file: null,
                        showOptions: false,
                      };
                      sendMessage
                        .mutateAsync(data)
                        .then(() => {
                          const check = conversationStore.Conversation.some(
                            (e) =>
                              e.username === conversationStore.selectedUsername
                          );
                          if (!check) {
                            const Conversation: Conversation = {
                              displayName:
                                conversationStore.ProfileMessage?.displayName!,
                              username:
                                conversationStore.ProfileMessage?.userName!,
                              image: conversationStore.ProfileMessage?.image!,
                              message: values.body,
                              createdAt: data.createdAt,
                              isRead: false,
                              fromUsername: userStore.user?.userName!,
                              noReadCount: 0,
                              file: null,
                              fileType: null,
                            };

                            conversationStore.Conversation.push(Conversation);
                          }
                          conversationStore.Conversation.forEach((e) => {
                            if (e.username == data.username) {
                              e.fromUsername = userStore.user?.userName!;
                              e.message = data.body;
                              e.createdAt = data.createdAt;
                              e.isRead = false;
                              e.file = null;
                              e.fileType = null;
                            }
                          });
                          conversationStore.ProfileMessage?.messages.push(data);
                          conversationStore.Conversation.sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          );
                        })
                        .finally(() => resetForm());
                    }}
                  >
                    {({ handleSubmit, isValid }) => (
                      <Form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                      >
                        <div className="bg-white w-full fixed bottom-0 p-4 z-0">
                          <div className="bg-white border-2 w-[1000px] rounded-full flex p-2">
                            <label className="p-1 ml-2 hover:text-gray-700 text-gray-500">
                              <FaFileCirclePlus size={28} />
                              <input
                                type="file"
                                multiple
                                hidden
                                onChange={async (e) => {
                                  if (e.target.files!.length > 2) {
                                    return Swal.fire({
                                      text: "You can't upload more than 2 files at a time",
                                      title: "Failed",
                                    });
                                  }

                                  for (
                                    let index = 0;
                                    index < e.target.files!.length;
                                    index++
                                  ) {
                                    var result = await convertFileToBase64(
                                      e.target.files![index]
                                    );
                                    const file: FileBase64 = {
                                      name: e.target.files![index].name,
                                      size: e.target.files![index].size,
                                      contentType: e.target.files![index].type,
                                      base64: result as string,
                                      message: "",
                                    };
                                    if (index == 0) {
                                      setSelectedFile(file);
                                    }
                                    setFiles((prevFiles) => [
                                      ...prevFiles,
                                      file,
                                    ]);
                                  }
                                }}
                              />
                            </label>
                            <Field
                              name="body"
                              type="text"
                              className="text-lg h-8 w-[1000px] focus:outline-none ml-3"
                              placeholder="Enter Your Message"
                            />
                            <button
                              className="bg-green-500 p-2 rounded-full"
                              type="submit"
                              disabled={!isValid}
                            >
                              <FaPaperPlane size={20} color="white" />
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex justify-center items-center col-span-2">
              <p className="text-2xl font-semibold">
                Welcome To Reactivities Chat
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
});
