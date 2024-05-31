import React from "react";
import { Profile } from "../../app/models/profile";
import { Link } from "react-router-dom";
import { FaCircleCheck, FaXmark } from "react-icons/fa6";
import { useStore } from "../../app/store/store";

interface Props {
  attendees: Profile[];
  hostUsername: string;
}
export default function AttendeList({ attendees, hostUsername }: Props) {
  const { modalStore } = useStore();

  return (
    <div className="w-[65%] p-4 rounded-lg mx-auto mt-56">
      <div className="bg-blue-500 text-white text-sm p-2 flex justify-between items-center">
        <p>Attendee List</p>
        <FaXmark fontWeight={5} onClick={() => modalStore.closeModal()} />
      </div>
      <div className="bg-white max-h-60">
        {attendees.map((e) => (
          <>
            <div className="py-2 flex  text-sm px-2">
              <img
                src={e.image || "/assets/user.png"}
                className="w-8 h-8 rounded-full"
              />
              <Link
                to={`/profile/${e.username}`}
                className="font-semibold ml-2"
              >
                {e.displayName}
              </Link>
              {e.username == hostUsername && (
                <FaCircleCheck color="green" size={18} className="ml-1" />
              )}
            </div>
            <hr />
          </>
        ))}
      </div>
    </div>
  );
}
