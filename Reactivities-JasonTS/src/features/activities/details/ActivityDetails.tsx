import {
  FaCalendarDays,
  FaCircleCheck,
  FaCircleInfo,
  FaFileImage,
  FaLocationDot,
  FaPaperPlane,
  FaPeopleGroup,
  FaXmark,
} from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Profile } from "../../../app/models/profile";
import { format, formatDistanceToNow } from "date-fns";
import {
  useMutationSendComment,
  useMutationUpdateAttendance,
  useQueryActivityById,
} from "../../../app/common/service";
import { Store, useStore } from "../../../app/store/store";
import LoadingAddAtendee from "../../../app/common/LoadingAddAtendee";
import { useEffect, useRef, useState } from "react";
import { Field, FieldProps, Form, Formik } from "formik";
import Swal from "sweetalert2";
import { DataConnection, MediaConnection } from "peerjs";
import Video from "../../../app/common/Video/Video";
import AttendeList from "../../users/AttendeList";
export default observer(function ActivityDetails() {
  const { id } = useParams();
  const [img, setFile] = useState("");
  const query = useQueryActivityById(id!);
  const { mutateAsync } = useMutationUpdateAttendance();
  const { commentStore, peerStore, userStore, activityStore, modalStore } =
    useStore();
  const sendComment = useMutationSendComment();
  const currentUserVideo = useRef<HTMLVideoElement>();
  const userRef = useRef<HTMLVideoElement>();
  const [onCall, setOnCall] = useState<MediaConnection | undefined>();
  const [conn, setConn] = useState<DataConnection | undefined>(undefined);
  const [calling, setCalling] = useState<boolean>(false);
  const [btnLoad, setBtnLoad] = useState<boolean>(false);
  const [commentParent, setCommentParetn] = useState({
    commentId: "",
    displayName: "",
  });
  useEffect(() => {
    if (id) {
      commentStore.createHubConnection(id);
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
        peerStore.userCall = null;
        peerStore.onCallUser = false;
        peerStore.userMediaStream = null;
      });
      setConn(conn);
    });

    peerStore.peer?.on("error", () => {
      peerStore.userMediaStream?.getTracks().forEach((e) => e.stop());
    });
    peerStore.peer?.on("disconnected", () => {
      peerStore.userMediaStream?.getTracks().forEach((e) => e.stop());

      peerStore.userCall = null;
      peerStore.onCallUser = false;
      peerStore.userMediaStream = null;
    });
    peerStore.peer?.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((mediaStream) => {
          setOnCall(call);
          call.on("close", () => {
            mediaStream.getTracks().forEach((e) => e.stop);
            call.close();
            currentUserVideo.current = undefined;
            peerStore.userMediaStream?.getTracks().forEach((e) => e.stop());
            peerStore.userCall = null;
            peerStore.onCallUser = false;
            peerStore.userMediaStream = null;
          });
          call.on("error", () => {
            // mediaStream.getTracks().forEach((e) => e.stop());
            peerStore.userMediaStream?.getTracks().forEach((e) => e.stop());
            peerStore.userCall = null;
            peerStore.onCallUser = false;
            peerStore.userMediaStream = null;
          });
          currentUserVideo.current!.srcObject = mediaStream;
          setCalling(true);
        });
    });
    return () => {
      commentStore.clearComments();
      // peerStore.peer?.destroy()
    };
  }, [commentStore, id]);

  if (query.isSuccess) {
    if (query.data.isHost) {
      activityStore.selectedActivity = query.data;
    }
    const updateAttende = () => {
      Store.activityStore.loadingAttendee = true;
      const id = {
        id: query.data.id,
      };
      mutateAsync(id)
        .then(() => {
          Store.activityStore.loadingAttendee = false;
          if (!query.data.isHost) {
            if (query.data.isGoing) {
              query.data.attendees = query.data.attendees?.filter(
                (a) => a.username !== user?.userName
              );
              query.data.isGoing = false;
            } else {
              const attendee = new Profile(user!);
              query.data.attendees?.push(attendee);
              query.data.isGoing = true;
            }
          } else {
            query.data.isCanceled = !query.data.isCanceled;
          }
        })
        .catch(() =>
          Swal.fire({
            title: "Error!",
            text: "sorry there's a problem",
            icon: "error",
          })
        );
    };
    const user = Store.userStore.user;
    if (user) {
      query.data.isGoing = query.data.attendees!.some(
        (a) => a.username === user.userName
      );
      query.data.isHost = query.data.hostUsername === user.userName;
      query.data.host = query.data.attendees?.find(
        (x) => x.username === query.data.hostUsername
      );
    }
    query.data.date = new Date(query.data.date!);

    const convertImageToBase64 = (file: File) => {
      const validType = ["image/jpeg", "image/jpg", "image/png"];
      var test = validType.some((x) => x == file.type);
      if (!test) {
        Swal.fire({
          title: "failed",
          icon: "error",
          text: "File Not Valid",
        });
      }
      return new Promise((resolve, reject) => {
        if (!test) {
          reject(new Error("FIle Not Valid"));
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
    return (
      <>
        {calling ? (
          <Video
            setCalling={setCalling}
            conn={conn}
            currentRef={currentUserVideo}
            userRef={userRef}
            call={onCall!}
          />
        ) : (
          <div className="py-20 flex justify-around">
            <div className="activity-detail sm:ml-5 sm:w-[50%] px-5">
              <div className="header bg-white rounded ">
                <img
                  src={`/assets/categoryImages/${query.data.category}.jpg`}
                  className="brightness-[30%] rounded-t"
                />
                <div className=" absolute sm:top-60 sm:left-40 sm:h-auto text-white top-36 left-14">
                  <h1 className="sm:text-4xl font-bold text-lg">
                    {query.data.title}
                  </h1>
                  <p className="text-xs sm:text-base">
                    {format(query.data.date!, "dd MMM yyyy h:mm aa")}
                  </p>
                  <p className="text-xs sm:text-base">
                    Hosted By
                    <Link to={`/profile/${query.data.hostUsername}`}>
                      {" "}
                      {query.data.hostDisplayName}
                    </Link>
                  </p>
                </div>
                <div className="flex justify-between w-full px-3 text-sm sm:text-base">
                  {query.data.isHost ? (
                    <>
                      <button
                        className={`sm:ml-4 sm:my-4 ml-2 my-2 bg-gray-300 p-2 rounded-md hover:bg-gray-400 text-gray-700 active:shadow-lg`}
                        onClick={() => updateAttende()}
                        disabled={Store.activityStore.loadingAttendee}
                      >
                        {query.data.isCanceled ? "Re-Active" : "Canceled"}
                        {Store.activityStore.loadingAttendee && (
                          <LoadingAddAtendee />
                        )}
                      </button>
                      <Link
                        to={`/update/${query.data.id}`}
                        className="sm:ml-4 sm:my-4 ml-2 my-2 bg-green-500 p-2 rounded-md hover:bg-green-400 text-white active:shadow-lg"
                      >
                        Manage Activity
                      </Link>
                    </>
                  ) : (
                    !query.data.isCanceled &&
                    (query.data.isGoing ? (
                      <button
                        className="sm:ml-4 sm:my-4 ml-2 my-2 bg-red-500 p-2 rounded-md hover:bg-red-400 text-white active:shadow-lg"
                        onClick={() => updateAttende()}
                        disabled={Store.activityStore.loadingAttendee}
                      >
                        Cancel Activity
                        {Store.activityStore.loadingAttendee && (
                          <LoadingAddAtendee />
                        )}
                      </button>
                    ) : (
                      <button
                        className="sm:ml-4 sm:my-4 ml-2 my-2 bg-green-500 sm:p-2 p-1  rounded-md hover:bg-green-400 text-white active:shadow-lg"
                        onClick={() => updateAttende()}
                        disabled={Store.activityStore.loadingAttendee}
                      >
                        Join Activity
                        {Store.activityStore.loadingAttendee && (
                          <LoadingAddAtendee />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white mt-5 rounded sm:text-base text-sm">
                <div className="p-4 border border-b-2 flex items-center rounded-t break-words">
                  <div>
                    <FaCircleInfo className="mr-2 text-blue-500" />
                  </div>
                  <div>
                    <p>{query.data.description}</p>
                  </div>
                </div>

                <div className="p-4 border border-b-2 flex items-center">
                  <FaCalendarDays className="mr-2 text-blue-500" />
                  {format(query.data.date!, "dd MMM yyyy h:mm aa")}
                </div>

                <div className="p-4 border border-b-2 flex items-center rounded-b">
                  <FaLocationDot className="mr-2 text-blue-500" />
                  {query.data.venue}, {query.data.city}
                </div>
                <div className="p-4 border border-b-2 sm:hidden flex items-center rounded-b">
                  <FaPeopleGroup className="mr-2 text-blue-500" />
                  <p
                    className="hover:text-blue-500 cursor-pointer"
                    onClick={() =>
                      modalStore.openModal(
                        <AttendeList
                          attendees={query.data.attendees}
                          hostUsername={query.data.hostUsername}
                        />
                      )
                    }
                  >
                    {query.data.attendees.length} Attendee
                  </p>
                </div>
              </div>
              <div className="mt-5 bg-white pb-5 rounded-b sm:text-base text-sm">
                <div className="bg-blue-500 rounded-t">
                  <p className="text-white p-3 font-bold">Activity Chat</p>
                </div>
                <div className="px-4">
                  <div className="overflow-y-scroll h-60">
                    {commentStore.comments.map((e) => (
                      <div>
                        <div className="flex mt-4">
                          <div>
                            <img
                              src={e.image || "/assets/user.png"}
                              className="w-10 rounded-full"
                            />
                          </div>
                          <div className="ml-3 ">
                            <div className="flex">
                              <p className="font-semibold">
                                {e.displayName || "Anonymous"}{" "}
                              </p>
                              <p className="sm:text-sm text-xs ml-3 text-gray-500">
                                {formatDistanceToNow(new Date(e.createdAt))}
                              </p>
                            </div>
                            <p>{e.body}</p>
                            {e.commentImage && (
                              <img src={e.commentImage} className="w-60" />
                            )}
                            <p
                              onClick={() =>
                                setCommentParetn({
                                  commentId: e.id,
                                  displayName: e.displayName,
                                })
                              }
                              className="font-semibold text-gray-400 sm:text-sm text-xs cursor-pointer hover:text-gray-500 inline-block"
                            >
                              Reply
                            </p>
                          </div>
                        </div>
                        <div className="ml-12">
                          {e.replyComments.length > 0 && (
                            <p
                              className="text-gray-500 font-bold text-xs"
                              onClick={() => {
                                commentStore.show(e.id);
                              }}
                            >
                              {e.showReply
                                ? `Hide Reply Comment`
                                : `Show ${e.replyComments.length} Reply Comment`}
                            </p>
                          )}
                          {e.replyComments.length > 0 &&
                            e.showReply &&
                            e.replyComments.map((s) => (
                              <div className="flex mt-4">
                                <div>
                                  <img
                                    src={s.image || "/assets/user.png"}
                                    className="w-10 rounded-full"
                                  />
                                </div>
                                <div className="ml-3 ">
                                  <div className="flex">
                                    <p className="font-semibold">
                                      {s.displayName || "Anonymous"}
                                    </p>
                                    <p className="text-sm ml-3 text-gray-500">
                                      {formatDistanceToNow(
                                        new Date(s.createdAt)
                                      )}
                                    </p>
                                  </div>
                                  <p>{s.body}</p>
                                  {s.commentImage && (
                                    <img
                                      src={s.commentImage}
                                      className="w-60"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Formik
                      initialValues={{ body: "" }}
                      onSubmit={(values, { resetForm }) => {
                        setBtnLoad(true);
                        let data = {
                          body: values.body,
                          commentImage: img,
                          activityId: id!,
                          parentCommentId: commentParent.commentId,
                        };
                        sendComment.mutateAsync(data).then(() => {
                          setBtnLoad(false);
                        });
                        setFile("");
                        return resetForm();
                      }}
                    >
                      {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                          {img && (
                            <div className="bg-[rgb(0,0,0,0.7)] fixed z-30 flex justify-center items-center top-0 bottom-0 right-0 left-0">
                              <div>
                                <div
                                  className="text-white relative left-96"
                                  onClick={() => setFile("")}
                                >
                                  <FaXmark size={28} />
                                </div>
                                <div>
                                  <img src={img} className="w-96" />
                                </div>
                                <div className="flex items-center mt-7">
                                  <div className="px-4 py-2 w-80 border-2 bg-white border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 flex">
                                    <label
                                      htmlFor="img"
                                      className="text-gray-500 active:text-gray-600"
                                    >
                                      <input
                                        type="file"
                                        id="img"
                                        className="hidden mr-10"
                                        onChange={(e) =>
                                          convertImageToBase64(
                                            e.target.files?.[0]!
                                          ).then((data) =>
                                            setFile(data as string)
                                          )
                                        }
                                      />
                                      <FaFileImage size={20} />
                                    </label>
                                    <Field type="text" name="body">
                                      {(props: FieldProps) => (
                                        <input
                                          placeholder="Enter your comment"
                                          className="focus:outline-none focus:ring-0 w-[100%] ml-2"
                                          {...props.field}
                                          onKeyPress={(e) => {
                                            if (
                                              e.key === "Enter" &&
                                              e.shiftKey
                                            ) {
                                              return;
                                            }
                                          }}
                                        />
                                      )}
                                    </Field>
                                  </div>
                                  <button
                                    type="submit"
                                    className="p-2 rounded bg-green-500 text-white flex ml-6 items-center"
                                  >
                                    <FaPaperPlane />
                                    Send
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          {commentParent.displayName &&
                            commentParent.commentId && (
                              <div className=" flex items-center text-sm text-gray-500 font-semibold justify-between sm:w-[50%] w-full my-1">
                                <p>Reply Comment {commentParent.displayName}</p>
                                <p></p>
                                <p
                                  className="hover:cursor-pointer hover:text-black"
                                  onClick={() =>
                                    setCommentParetn({
                                      displayName: "",
                                      commentId: "",
                                    })
                                  }
                                >
                                  <FaXmark />
                                </p>
                              </div>
                            )}
                          <div className="flex items-center">
                            <div className="px-4 py-2 w-[100%] border-2 border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 flex">
                              <label
                                htmlFor="img"
                                className="text-gray-500 active:text-gray-600"
                              >
                                <input
                                  type="file"
                                  id="img"
                                  className="hidden mr-10"
                                  onChange={(e) =>
                                    convertImageToBase64(
                                      e.target.files?.[0]!
                                    ).then((data) => setFile(data as string))
                                  }
                                />
                                <FaFileImage size={20} />
                              </label>
                              <Field type="text" name="body">
                                {(props: FieldProps) => (
                                  <input
                                    placeholder="Enter your comment"
                                    className="focus:outline-none focus:ring-0 w-[100%] ml-2"
                                    {...props.field}
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter" && e.shiftKey) {
                                        return;
                                      }
                                    }}
                                  />
                                )}
                              </Field>
                            </div>
                            <button
                              type="submit"
                              disabled={btnLoad}
                              className="p-2 rounded bg-green-500 text-white flex ml-6 items-center"
                            >
                              {btnLoad ? (
                                <LoadingAddAtendee />
                              ) : (
                                <>
                                  <FaPaperPlane />
                                  Send
                                </>
                              )}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-attendee w-[30%] sm:inline hidden">
              <div className="bg-blue-500 p-2 text-white text-center rounded-t">
                <p>{query.data.attendees.length} People Is Going</p>
              </div>
              <div className="bg-white px-3 rounded">
                {query.data.attendees.map((e: Profile) => (
                  <>
                    <div className="py-2 flex">
                      <img
                        src={e.image || "/assets/user.png"}
                        className="w-16 rounded-full"
                      />
                      <Link
                        to={`/profile/${e.username}`}
                        className="font-semibold ml-4"
                      >
                        {e.displayName}
                      </Link>
                      {e.username == query.data?.hostUsername && (
                        <FaCircleCheck
                          color="green"
                          size={18}
                          className="ml-1"
                        />
                      )}
                    </div>
                    <hr />
                  </>
                ))}
                {/* <div className="py-2 flex">
            <img src="/assets/user.png" className="w-16 rounded-full" />
            <p className="font-semibold ml-4 ">Okta Daffa Ramadani</p>
          </div> */}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
});
