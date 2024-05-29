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
    <div className="w-auto p-2 border-2 rounded hover:shadow-xl">
      <img
        src={profile.image || "/assets/user.png"}
        className="rounded max-w-60"
      />
      <Link
        to={`/profile/${profile.username}`}
        className="font-semibold my-1 text-center hover:text-blue-900 active:text-blue-500"
      >
        {profile.username}
      </Link>
      <p className="text-center text-sm italic my-1 text-gray-500">
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
