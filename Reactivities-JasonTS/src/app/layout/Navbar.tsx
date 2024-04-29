import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { FaBell, FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';
import { BiNotification } from 'react-icons/bi';
// import { getUser } from '../api/api';

export default observer(function Navbar() {
  const [dropHidden, setDropHidden] = useState(true);
  const [hiddenNot, setHiddenNot] = useState(true);
  const { userStore } = useStore();
  return (
    <>
      <div className=" z-10 navbar w-full py-2 bg-blue-600 text-white px-7 shadow-2xl flex justify-between fixed">
        <div className="flex items-center">
          <NavLink to={"/"} className="font-bold">
            Reactivities
          </NavLink>
          <NavLink to={"/activities"} className="ml-10">
            Activities
          </NavLink>
          <NavLink
            to={"/createActivity"}
            className="bg-green-500 py-2 px-2 ml-5 rounded-md hover:ring-green-300 hover:ring-2 active:ring-green-200"
          >
            Create Activity
          </NavLink>
        </div>

        <div className="flex items-center">
          <div className="mr-5">
            <FaBell onClick={() => setHiddenNot(!hiddenNot)} />
            {!hiddenNot && (
              <div className="bg-white p-2 absolute -translate-x-60 text-black w-60 text-sm">
                <p>Okta daffa Ramdi</p>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <button className="mr-1" onClick={() => setDropHidden(!dropHidden)}>
              {userStore.user?.displayName}
            </button>
            {dropHidden ? <FaChevronDown /> : <FaChevronUp />}
            {!dropHidden && (
              <div className="bg-white absolute translate-y-10 translate-x-5 text-black text-sm">
                <ul>
                  <li className="py-1 px-10">
                    <Link to={`/profile/${userStore.user?.userName}`}>
                      Profil
                    </Link>
                  </li>
                  <li>
                    <button
                      className="bg-red-500 text-white py-1 px-10"
                      onClick={userStore.logout}
                    >
                      Logout
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