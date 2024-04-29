import React, { useEffect } from 'react'
import { Tab } from '../../app/models/profile';
import ProfileAbout from './ProfileAbout';
import ProfileActivity from './ProfileActivity';
import ProfilePhoto from './ProfilePhoto';
import ProfileFollow from './ProfileFollow';
import { useStore } from '../../app/store/store';

export default function ProfileContent({tab}:any) {
       const {profileStore} = useStore()
  
  return (
    <div className="flex justify-around">
      <div className="bg-white mt-5 w-[80%] p-4">
        {profileStore.activeTab?.page}
      </div>
      <div className="bg-white mt-5 w-[17%] max-h-52">
        {tab.map((e:any) => (
          <div
            className={`px-2 py-2 border-b hover:bg-gray-100 ${
              e.id == profileStore.activeTab?.id && "bg-gray-100"
            }`}
            onClick={() => profileStore.setActiveTab(e)}
          >
            <p>{e.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
