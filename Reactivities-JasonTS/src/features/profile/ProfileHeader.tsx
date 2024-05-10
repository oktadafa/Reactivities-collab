import { useState } from "react";
import { useStore } from "../../app/store/store";
import LoadingAddAtendee from "../../app/common/LoadingAddAtendee";
import { useMutationUpdateFollow } from "../../app/common/service";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { BsFillChatFill } from "react-icons/bs";
import { router } from "../../app/router/router";

export default observer(function ProfileHeader() {
  const { userStore, profileStore, conversationStore } = useStore();
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = useMutationUpdateFollow();
  const handleUpdateFollow = (username: string) => {
    setLoading(true);
    mutateAsync(username)
      .then(() => {
        profileStore.handleUpdateFollow(
          profileStore.profile!,
          profileStore.profile?.following!
        );
      })
      .finally(() => setLoading(false));
    // console.log("succesa");
  };

  return (
    <div className="header bg-white p-5 flex justify-between rounded">
      <div className="flex text-2xl font-semibold items-center">
        <img
          src={profileStore.profile?.image || "/assets/user.png"}
          className="w-36 rounded-full"
        />
        <p className="ml-4">{profileStore.profile?.displayName}</p>
      </div>
      <div>
        <div className="flex">
          <div className="px-5 py-2">
            <p className="text-5xl text-center">
              {profileStore.profile?.followersCount}
            </p>
            <p className="text-xl font-semibold">Followers</p>
          </div>
          <div className="px-5 py-2">
            <p className="text-5xl text-center">
              {profileStore.profile?.followingCount}
            </p>
            <p className="text-xl font-semibold">Followings</p>
          </div>
        </div>
        <hr className="font-bold" />
        <div className="flex justify-center pt-4">
          <div>
            {userStore.user?.userName !== profileStore.profile?.username ? (
              <>
                {profileStore.profile?.following ? (
                  <button
                    className="w-56 py-1 bg-green-600 text-white hover:bg-green-500 active:bg-green-400"
                    onClick={() =>
                      handleUpdateFollow(profileStore.profile?.username!)
                    }
                  >
                    Following
                    {loading && <LoadingAddAtendee />}
                  </button>
                ) : (
                  <button
                    className="w-56 py-1 bg-green-600 text-white hover:bg-green-500 active:bg-green-400"
                    onClick={() =>
                      handleUpdateFollow(profileStore.profile?.username!)
                    }
                  >
                    Follow {loading && <LoadingAddAtendee />}
                  </button>
                )}
                <button
                  onClick={() => {
                    conversationStore.setSelectedUser(
                      profileStore.profile?.username!
                    );
                    router.navigate("/chat");
                  }}
                  className="px-10 mt-2 bg-blue-500 text-white py-1 flex justify-center items-center"
                >
                  <BsFillChatFill className="mr-2" /> Chat
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
