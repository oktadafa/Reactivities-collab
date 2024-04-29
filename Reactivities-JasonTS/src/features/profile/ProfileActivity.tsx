import { values } from 'mobx';
import React, { useState } from 'react'
import { FaCalendar } from 'react-icons/fa6'
import { useQueryGetActivityByPredicate } from '../../app/common/service';
import { useStore } from '../../app/store/store';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function ProfileActivity() {
  const {profileStore} = useStore()
  const [selectTab, setSelectTab] = useState("future")
  const query = useQueryGetActivityByPredicate(profileStore.profile?.username!,selectTab)

  const activityTab = [
    {id:1,name:"future", value:"Future Events"},
    {id:2, name:"past", value:"Past Events"},
    {id:2, name:"hosting", value:"Hosting"}
  ]
  if (query.isSuccess) {
    console.log(query.data);
    
  }

  return (
    <div>
      <div className="flex">
        <FaCalendar size={30} />
        <p className="font-bold text-xl ml-3">Events</p>
      </div>
      <div className="p-5">
        <ul className="flex justify-around">
          {activityTab.map((e) => (
            <li
              className={`hover:border-b-2 hover:border-blue-500 border-blue-500 ${
                e.name == selectTab ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setSelectTab(e.name)}
            >
              {e.value}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap max-h-96 overflow-y-auto">
        {query.isSuccess ? (query.data.length > 0 ? query.data.map((e) => (
            <Link to={`/activities/${e.id}`} className="w-60 border-2 ml-3 rounded p-3 mt-3">
              <img src={`/assets/categoryImages/${e.category}.jpg`} className='rounded' />
              <p className="text-xl text-center font-semibold">{e.title}</p>
              <p className="text-sm text-center text-gray-500">
                {format(new Date(e.date), "dd MMM yyyy h:mm aa")}
              </p>
            </Link>
          )) : <div className='w-full flex justify-center py-10'><p className='text-gray-400 text-2xl font-semibold'>No Any Activities</p></div>) : (
            <div className='flex justify-center w-full py-10'>
          <div
            className="ml-2 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-500 border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
            >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          </div>
            )}
            {/* {query.isLoading && (
        )} */}
      </div>
    </div>
  );
}
