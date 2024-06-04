import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { FaClock } from "react-icons/fa";
import { FaFilter, FaLocationDot } from "react-icons/fa6";
import { getActivities2 } from "../../../app/api/api";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/store/store";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns";
import Calendar from "react-calendar";
import InfiniteScroll from "react-infinite-scroller";
import { DataConnection, MediaConnection } from "peerjs";
import Video from "../../../app/common/Video/Video";
import LoadingApp from "../../../app/common/LoadingApp";

export default function ActivityDashboard() {
  const [params, setParams] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const { activityStore, userStore, peerStore } = useStore();
  const currentUserVideo = useRef<HTMLVideoElement>();
  const userRef = useRef<HTMLVideoElement>();
  const [onCall, setOnCall] = useState<MediaConnection | undefined>();
  const [conn, setConn] = useState<DataConnection | undefined>();
  const [calling, setCalling] = useState<boolean>(false);
  const mutatate = useInfiniteQuery({
    queryKey: ["ListActivities", startDate, params],
    queryFn: ({ pageParam }) =>
      getActivities2({ pageParam, startDate, params }),
    initialPageParam: 1,
    getNextPageParam: (data) => {
      if (data.hasNextPage) {
        // setLoadingNext(data.hasNextPage);
        return data.pageNumber + 1;
      }
    },
  });
  useEffect(() => {
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
            setCalling(false);

            mediaStream.getTracks().forEach((e) => e.stop());
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
  useEffect(() => {
    activityStore.activitRegistry.clear();
  }, [params, startDate]);

  if (mutatate.isLoading) {
    return <LoadingApp />;
  }

  if (mutatate.isSuccess) {

    activityStore.saveActivities(
      mutatate.data.pages[mutatate.data.pages.length - 1]
    );
  }
  const handleGetNext = () => {
    return mutatate.fetchNextPage();
  };

  const limitWords = (setences: string) => {
    if (setences.length > 60) {
      return setences.slice(0, 60) + "...";
    }
    return setences;
  };

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
        <div className="container px-10 py-24">
          <div className="sm:grid sm:gap-4 sm:grid-cols-5">
            <div className="activities flex-col sm:col-span-3">
              <InfiniteScroll
                hasMore={mutatate.hasNextPage}
                pageStart={0}
                initialLoad={false}
                loadMore={handleGetNext}
              >
                {activityStore.groupedActivities.map(([group, activities]) => (
                  <>
                    <p className="text-blue-500 font-semibold mb-2 text-sm sm:text-base">
                      {group}
                    </p>
                    {activities.map((activity: Activity) => (
                      <div className="bg-white mb-5 w-[100%]  sm:w-[75%] sm:ml-20 rounded">
                        <div className="border-b-2 flex p-4">
                          <img
                            src={activity.host?.image || "/assets/user.png"}
                            className="sm:w-20  sm:h-20 w-14 h-14 rounded-full"
                          />
                          <section className="sm:ml-10 ml-5">
                            <p className="sm:text-xl text-lg font-semibold">
                              {activity.title}
                            </p>
                            <p className="sm:text-sm text-xs">
                              Hosted By
                              <Link
                                to={`/profile/${activity.hostUsername}`}
                                className="hover:text-blue-500"
                              >
                                {" "}
                                {activity.hostDisplayName}
                              </Link>
                            </p>
                            {activity.isHost ? (
                              <p className="font-semibold text-xs px-2 py-1 border text-center mt-2 border-blue-500 text-blue-500">
                                You Are Host In This Activity
                              </p>
                            ) : activity.isCanceled ? (
                              <p className="text-xs font-semibold px-2 py-1 border text-center mt-2 border-red-500 text-red-500">
                                This Activity Is Canceled
                              </p>
                            ) : (
                              activity.isGoing && (
                                <p className="text-xs px-2 py-1 font-semibold border text-center mt-2 border-green-500 text-green-500">
                                  You Are Going This Activity
                                </p>
                              )
                            )}
                          </section>
                        </div>
                        <div className="p-4 border-b-2 text-xs sm:text-sm">
                          <div>
                            <p>
                              <FaClock className="inline text-blue-600" />{" "}
                              {format(activity.date!, "dd MMM yyyy h:mm aa")},{" "}
                            </p>
                            <p>
                              <FaLocationDot className="inline text-blue-600" />{" "}
                              {activity.venue}, {activity.city}
                            </p>
                          </div>
                        </div>
                        <div className="flex p-2 justify">
                          {activity.attendees.map((d: any) => (
                            <div className="image p-2">
                              <Link to={`/profile/${d.username}`}>
                                <img
                                  src={d.image || "/assets/user.png"}
                                  className="w-10 rounded-full hover:ring-1 hover:ring-blue-500 active:ring-2"
                                />
                              </Link>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between p-4 border-t-2 text-sm">
                          <p>{limitWords(activity.description)}</p>
                          {activity.isCanceled && !activity.isHost ? (
                            <button
                              className="bg-red-500 py-2 px-2 text-sm text-white rounded-lg hover:outline"
                              disabled
                            >
                              Canceled
                            </button>
                          ) : (
                            <Link
                              to={`/activities/${activity.id}`}
                              className="bg-blue-500 py-2 px-3 text-sm text-white rounded-lg hover:outline hover:outline-blue-300 active:outline-blue-200"
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ))}
                {mutatate.isFetchingNextPage && (
                  <div
                    className="ml-52 mt-20 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                )}
              </InfiniteScroll>
            </div>
            <div className="filter col-span-2 hidden sm:inline">
              <div className="w-80 bg-white mt-8 mb-5 rounded">
                <div className="text-blue-500 font-semibold p-3 border-b-2 flex items-center">
                  <FaFilter />
                  <p> Filter</p>
                </div>
                <ul>
                  <li
                    className={`p-2 border-b-2 hover:bg-blue-500 hover:text-white active:bg-blue-400 ${
                      params == "all" && "bg-blue-500 text-white"
                    }`}
                    onClick={() => setParams("all")}
                  >
                    All Activities
                  </li>
                  <li
                    className={`p-2 border-b-2 hover:bg-blue-500 hover:text-white active:bg-blue-400 ${
                      params == "going" && "bg-blue-500 text-white"
                    }`}
                    onClick={() => setParams("going")}
                  >
                    I'm Going
                  </li>
                  <li
                    className={`p-2 border-b-2 hover:bg-blue-500 hover:text-white active:bg-blue-400 ${
                      params == "hosting" && "bg-blue-500 text-white"
                    }`}
                    onClick={() => setParams("hosting")}
                  >
                    I'm Hosting
                  </li>
                </ul>
              </div>
              <Calendar
                value={new Date().toISOString()}
                className="rounded"
                onChange={(e) => {
                  setStartDate((e as Date).toISOString());
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
