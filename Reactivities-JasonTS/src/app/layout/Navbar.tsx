import { useState } from "react";
import {
  FaBell,
  FaChevronDown,
  FaChevronUp,
  FaPeopleGroup,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../store/store";
import { observer } from "mobx-react-lite";
import { BsFillChatFill } from "react-icons/bs";
// import { getUser } from '../api/api';

export default observer(function Navbar() {
  const [dropHidden, setDropHidden] = useState(true);
  const { userStore, conversationStore } = useStore();
  return (
    <>
      <div className="z-10 navbar w-full sm:py-3 bg-blue-600 text-white sm:px-7 px-4 text-xs sm:text-base shadow-2xl flex justify-between fixed py-3">
        <div className="flex items-center">
          <NavLink to={"/"} className="font-bold sm:text-base">
            Reactivities
          </NavLink>
          <NavLink to={"/activities"} className="ml-10 sm:inline hidden">
            Activities
          </NavLink>
          <NavLink
            to={"/createActivity"}
            className="bg-green-500 py-2 px-2  ml-5 text-xs sm:text-base rounded-md hover:ring-green-300 hover:ring-2 active:ring-green-200"
          >
            Create Activity
          </NavLink>
        </div>

        <div className="flex items-center">
          <div className="mr-5 hidden sm:inline">
            <Link to={"/chat"}>
              <BsFillChatFill />
              <p className="text-small absolute -translate-y-8 translate-x-3 font-semibold">
                {conversationStore.CountNewMessage > 0 &&
                  conversationStore.CountNewMessage}
              </p>
            </Link>
          </div>
          <div className="flex items-center">
            <button className="mr-1" onClick={() => setDropHidden(!dropHidden)}>
              {userStore.user?.displayName}
            </button>
            {dropHidden ? <FaChevronDown /> : <FaChevronUp />}
            {!dropHidden && (
              <div className="bg-white absolute sm:translate-y-10 translate-y-16 sm:translate-x-5 translate-x-0  text-blue-900 sm:text-sm text-xs text-center w-28">
                <ul>
                  <Link to={`/activities`} className="sm:hidden inline">
                    <li className="py-1 border flex items-center justify-center hover:bg-gray-200">
                      <FaPeopleGroup />
                      <p className="ml-2">Activities</p>
                    </li>
                  </Link>
                  <Link to={`/profile/${userStore.user?.userName}`}>
                    <li className="py-1 flex items-center justify-center hover:bg-gray-200">
                      <FaUser />
                      <p className="ml-2"> Profil</p>
                    </li>
                  </Link>
                  <Link to={`/chat`} className="sm:hidden inline">
                    <li className="py-1 border flex items-center justify-center hover:bg-gray-200">
                      <BsFillChatFill />
                      <p className="ml-2"> Chat</p>
                    </li>
                  </Link>
                  <li>
                    <button
                      className="bg-red-500 text-white py-1  flex items-center justify-center hover:bg-red-700 w-full"
                      onClick={userStore.logout}
                    >
                      <FaRightFromBracket />
                      <p className="ml-2"> Logout</p>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});
