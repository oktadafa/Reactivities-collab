import { useStore } from '../../app/store/store'
import { FaUser } from 'react-icons/fa6';
import {  useQueryGetFollow } from '../../app/common/service';
import ProfilCard from './ProfilCard';
import { observer } from 'mobx-react-lite';

export default observer(function ProfileFollow() {
  const { profileStore } = useStore();
  const follow =
    profileStore.activeTab?.name == "Followings" ? "following" : "followers";
console.log(profileStore.profile?.username);

  const query = useQueryGetFollow(profileStore.profile?.username!, follow);
 if (query.isSuccess) {
      profileStore.saveFollowing(query.data);
      
  return (
    <div>
      <div className="flex">
        <FaUser size={30} />
        <p className="text-xl font-bold ml-3">
          {profileStore.activeTab?.name} {profileStore.profile?.displayName}
        </p>
      </div>
      <div className="py-4 flex gap-2">
        {query.isSuccess && query.data.length > 0 ? query.data.map((e) => <ProfilCard profile={e} />) : (
        <div className='flex justify-center py-10 w-full'>
          <p className='text-xl text-gray-400 font-semibold'>No Any {profileStore.activeTab?.name}</p>
        </div>) }
      </div>
    </div>
  );
}
}); 