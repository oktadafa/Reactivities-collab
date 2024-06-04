import { Profile } from "../../app/models/profile";
import { useMutationUpdateFollow } from "../../app/common/service";
import { useStore } from "../../app/store/store";
import { observer } from "mobx-react-lite";
import { useState } from "react";

interface Props {
  profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {
  const { profileStore } = useStore();
  const [isLoad, setLoad] = useState(false);
  const { mutateAsync } = useMutationUpdateFollow();
  const handleUpdateFollow = (username: string, following: boolean) => {
    setLoad(true);
    mutateAsync(username).then(() => {
      profileStore.handleUpdateFollow(profile, following);
      profile.following = !profile.following;
      setLoad(false);
    });
  };

  return (
    <>
      {profile.following ? (
        <button
          disabled={isLoad}
          className="w-full sm:py-1 py-[0.05] bg-green-500 text-white hover:bg-green-600 active:bg-green-700 text-[10px] sm:text-base"
          onClick={() => handleUpdateFollow(profile.username, true)}
        >
          Following
        </button>
      ) : (
        <button
          disabled={isLoad}
          className="w-full sm:py-1 py-[0.05] bg-green-500 text-white hover:bg-green-600 active:bg-green-700 text-[10px] sm:text-base"
          onClick={() => handleUpdateFollow(profile.username, false)}
        >
          Follow
        </button>
      )}
    </>
  );
});
