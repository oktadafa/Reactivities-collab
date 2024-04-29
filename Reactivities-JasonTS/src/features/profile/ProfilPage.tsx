import { useEffect} from 'react'
import ProfileAbout from './ProfileAbout';
import {  Tab } from '../../app/models/profile';
import ProfileActivity from './ProfileActivity';
import ProfilePhoto from './ProfilePhoto';
import ProfileFollow from './ProfileFollow';
import { useStore } from '../../app/store/store';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useQueryProfile } from '../../app/common/service';
import ProfileHeader from './ProfileHeader';

export default observer(function ProfilPage() {
  const {username} = useParams()
  const { profileStore } = useStore();
  useEffect(() => {
    profileStore.setActiveTab(tabs[0]);
  }, [profileStore, username]);
  const query = useQueryProfile(username!)
  if (query.isSuccess) {
    if (profileStore.profile?.username !== query.data.username || !profileStore.profile) {
      profileStore.saveProfile(query.data)
    }
    
  }
  const tabs: Tab[] = [
    { id: 1, page: <ProfileAbout />, name: "About" },
    { id: 2, page: <ProfileActivity />, name: "Activity" },
    { id: 3, page: <ProfilePhoto />, name: "Photo" },
    { id: 4, page: <ProfileFollow />, name: "Followers" },
    { id: 5, page: <ProfileFollow />, name: "Followings" },
  ];
  return (
    <div className="px-60 py-20">
      <ProfileHeader/>
      <div className="flex justify-around">
        <div className="bg-white mt-5 w-[80%] p-4 rounded">
          {profileStore.activeTab?.page}
        </div>
        <div className="bg-white mt-5 w-[17%] max-h-52 rounded">
          {tabs.map((e) => (
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
    </div>
  );
});
