import FollowButton from "./FollowButton";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/store/store";
import { Link } from "react-router-dom";

interface Props {
  profile: Profile;
}

export default observer(function ProfilCard({ profile }: Props) {
  const { userStore } = useStore();
  function truncate(str: string | undefined) {
    if (str) {
      return str.length > 40 ? str.substring(0, 37) + "..." : str;
    }
  }
  return (
    <div className="sm:max-w-60 max-w-28 p-2 border-2 rounded hover:shadow-xl">
      <img
        src={profile.image || "/assets/user.png"}
        className="rounded sm:max-w-56 max-w-24 mb-1"
      />
      <Link
        to={`/profile/${profile.username}`}
        className="font-semibold text-cente text-[10px] sm:text-base hover:text-blue-900 active:text-blue-500 "
      >
        <p className="break-words leading-none">{profile.username}</p>
      </Link>
      <p className="text-center sm:text-sm text-[10px] italic sm:my-1 my-[0.05] text-gray-500">
        {truncate(profile.bio)}
      </p>
      <div className="flex justify-center">
        {userStore.user?.userName !== profile.username && (
          <FollowButton profile={profile} />
        )}
      </div>
    </div>
  );
});
