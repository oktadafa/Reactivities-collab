import {
  FaCalendarDays,
  FaCircleCheck,
  FaCircleInfo,
  FaFileImage,
  FaLocationDot,
  FaPaperPlane,
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
import ImgPreview from "../../../app/common/Comment/imgPreview";
import Swal from "sweetalert2";
export default observer(function ActivityDetails() {
  const { id } = useParams();
  const [img, setFile] = useState("");
  const query = useQueryActivityById(id!);
  const { mutateAsync } = useMutationUpdateAttendance();
  const { commentStore } = useStore();
  const sendComment = useMutationSendComment();
  const scrollContainerRef = useRef<any>();
  const [commentParent, setCommentParetn] = useState({
    commentId: "",
    displayName: "",
  });
  useEffect(() => {
    if (id) {
      commentStore.createHubConnection(id);
    }
    const scroll = scrollContainerRef.current;
    if (scroll) {
      scroll.scrollTop = "100px";
    }
    return () => {
      commentStore.clearComments();
    };
  }, [commentStore, id]);

  if (query.isError) {
    console.log(query.error);
  }

  if (query.isSuccess) {
    const updateAttende = () => {
      Store.activityStore.loadingAttendee = true;
      const id = {
        id: query.data.id,
      };
      mutateAsync(id)
        .then((_) => {
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
          //  console.log("dafa");
        })
        .catch((err) => console.log(err));
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
    console.log(query.data.isCanceled);

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
      <div className="py-20 flex justify-around">
        <div className="activity-detail ml-5 w-[50%]">
          <div className="header bg-white rounded ">
            <img
              src="/assets/categoryImages/culture.jpg"
              className="brightness-[30%] rounded-t"
            />
            <div className=" absolute top-[40%] left-[10%] h-auto text-white">
              <h1 className="text-4xl font-bold">{query.data.title}</h1>
              <p>{format(query.data.date!, "dd MMM yyyy h:mm aa")}</p>
              <p>
                Hosted By
                <Link to={`/profile/${query.data.hostUsername}`}>
                  {query.data.hostUsername}
                </Link>
              </p>
            </div>
            <div className="flex justify-between w-full px-3">
              {query.data.isHost ? (
                <>
                  <button
                    className={`ml-4 my-4 bg-gray-300 p-2 rounded-md hover:bg-gray-400 text-gray-700 active:shadow-lg`}
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
                    className="ml-4 my-4 bg-green-500 p-2 rounded-md hover:bg-green-400 text-white active:shadow-lg"
                  >
                    Manage Activity
                  </Link>
                </>
              ) : query.data.isGoing ? (
                <button
                  className="ml-4 my-4 bg-red-500 p-2 rounded-md hover:bg-red-400 text-white active:shadow-lg"
                  onClick={() => updateAttende()}
                  disabled={Store.activityStore.loadingAttendee}
                >
                  Cancel Activity
                  {Store.activityStore.loadingAttendee && <LoadingAddAtendee />}
                </button>
              ) : (
                <button
                  className="ml-4 my-4 bg-green-500 p-2 rounded-md hover:bg-green-400 text-white active:shadow-lg"
                  onClick={() => updateAttende()}
                  disabled={Store.activityStore.loadingAttendee}
                >
                  Join Activity
                  {Store.activityStore.loadingAttendee && <LoadingAddAtendee />}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white mt-5 rounded">
            <div className="p-4 border border-b-2 flex items-center rounded-t">
              <FaCircleInfo className="mr-2 text-blue-500" />
              {query.data.description}
            </div>

            <div className="p-4 border border-b-2 flex items-center">
              <FaCalendarDays className="mr-2 text-blue-500" />
              {format(query.data.date!, "dd MMM yyyy h:mm aa")}
            </div>

            <div className="p-4 border border-b-2 flex items-center rounded-b">
              <FaLocationDot className="mr-2 text-blue-500" />
              {query.data.city} {query.data.venue}
            </div>
          </div>
          <div className="mt-5 bg-white pb-5 rounded-b">
            <div className="bg-blue-500 rounded-t">
              <p className="text-white p-3 font-bold">Activity Chat</p>
            </div>
            <div className="px-4">
              <div className="overflow-y-scroll h-60" ref={scrollContainerRef}>
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
                          <p className="text-sm ml-3 text-gray-500">
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
                          className="font-semibold text-gray-400 text-sm cursor-pointer hover:text-gray-500 inline-block"
                        >
                          Balas
                        </p>
                      </div>
                    </div>
                    <div className="ml-12">
                      {e.replyComments.length > 0 && (
                        <p
                          className="text-gray-500 font-bold text-xs"
                          onClick={() => {
                            commentStore.show(e.id);
                            console.log(e.showReply);
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
                                  {formatDistanceToNow(new Date(s.createdAt))}
                                </p>
                              </div>
                              <p>{s.body}</p>
                              {s.commentImage && (
                                <img src={s.commentImage} className="w-60" />
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {/* {img && <ImgPreview img={img} id={id!} setFile={setFile} />} */}
                <Formik
                  initialValues={{ body: "" }}
                  onSubmit={(values, { resetForm }) => {
                    let data = {
                      body: values.body,
                      commentImage: img,
                      activityId: id!,
                      parentCommentId: commentParent.commentId,
                    };
                    // values.activityId = id!;
                    // values.commentImage = img;
                    // values.parentCommentId = commentParent.commentId;
                    // if(commentParent.commentId)
                    // {
                    //     data = {...data, commentId:commentParent.commentId}
                    // }
                    console.log(data);
                    sendComment
                      .mutateAsync(data)
                      .then(() => console.log("Success"));
                    return resetForm();
                  }}
                >
                  {({ handleSubmit, isSubmitting }) => (
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
                                      convertImageToBase64(e.target.files?.[0]!)
                                        .then((data) => setFile(data as string))
                                        .catch((err) => console.log(err))
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
                                className="p-2 rounded bg-green-500 text-white flex ml-6 items-center"
                              >
                                {" "}
                                <FaPaperPlane />
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {commentParent.displayName && commentParent.commentId && (
                        <p className="text-sm my-1 text-gray-500 font-semibold">
                          Membalas Commentar {commentParent.displayName}
                        </p>
                      )}
                      <div className="flex items-center">
                        <div className="px-4 py-2 w-[50%] border-2 border-blue-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 flex">
                          <label
                            htmlFor="img"
                            className="text-gray-500 active:text-gray-600"
                          >
                            <input
                              type="file"
                              id="img"
                              className="hidden mr-10"
                              onChange={(e) =>
                                convertImageToBase64(e.target.files?.[0]!).then(
                                  (data) => setFile(data as string)
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
                          className="p-2 rounded bg-green-500 text-white flex ml-6 items-center"
                        >
                          {" "}
                          <FaPaperPlane />
                          Send
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>

        <div className="activity-attendee w-[30%]">
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
                    {e.username}
                  </Link>
                  {e.username == query.data?.hostUsername && (
                    <FaCircleCheck color="green" size={18} className="ml-1" />
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
    );
  }
});
