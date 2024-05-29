import { Profile } from "../../app/models/profile";
import { useMutationUpdateFollow } from "../../app/common/service";
import { useStore } from "../../app/store/store";
import { observer } from "mobx-react-lite";

interface Props {
  profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {
  const { profileStore } = useStore();
  const { mutateAsync } = useMutationUpdateFollow();
  const handleUpdateFollow = (username: string, following: boolean) => {
    mutateAsync(username).then(() => {
      profileStore.handleUpdateFollow(profile, following);
      profile.following = !profile.following;
    });
    // console.log("succesa");
  };

  return (
    <>
      {profile.following ? (
        <button
          className="w-56 py-1 bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
          onClick={() => handleUpdateFollow(profile.username, true)}
        >
          Following
        </button>
      ) : (
        <button
          className="w-56 py-1 bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
          onClick={() => handleUpdateFollow(profile.username, false)}
        >
          Follow
        </button>
      )}
    </>
  );
});
