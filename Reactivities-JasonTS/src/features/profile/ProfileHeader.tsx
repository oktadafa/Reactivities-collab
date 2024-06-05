import { useState } from "react";
import { useStore } from "../../app/store/store";
import LoadingAddAtendee from "../../app/common/LoadingAddAtendee";
import { useMutationUpdateFollow } from "../../app/common/service";
import { observer } from "mobx-react-lite";
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
  };

  return (
    <div className="header bg-white sm:p-5 p-3 flex justify-between rounded">
      <div className="flex sm:text-2xl text-sm font-semibold items-center">
        <img
          src={profileStore.profile?.image || "/assets/user.png"}
          className="sm:w-36 w-16 rounded-full"
        />
        <p className="ml-4">{profileStore.profile?.displayName}</p>
      </div>
      <div>
        <div className="flex">
          <div className="sm:px-5 sm:py-2 px-1">
            <p className="sm:text-5xl text-lg text-center">
              {profileStore.profile?.followersCount}
            </p>
            <p className="sm:text-xl text-sm font-semibold">Followers</p>
          </div>
          <div className="sm:px-5 sm:py-2 px-1">
            <p className="sm:text-5xl text-lg text-center">
              {profileStore.profile?.followingCount}
            </p>
            <p className="sm:text-xl text-sm font-semibold">Followings</p>
          </div>
        </div>
        <hr className="font-bold" />
        <div className="flex justify-center pt-4">
          <div>
            {userStore.user?.userName !== profileStore.profile?.username ? (
              <>
                {profileStore.profile?.following ? (
                  <button
                    className="sm:w-56 w-36 py-[0.25rem] bg-green-500 text-white hover:bg-green-600 active:bg-green-700 sm:text-base text-xs"
                    onClick={() =>
                      handleUpdateFollow(profileStore.profile?.username!)
                    }
                  >
                    Following
                    {loading && <LoadingAddAtendee />}
                  </button>
                ) : (
                  <button
                    className="sm:w-56 w-36 py-[0.25rem] bg-green-500 text-white hover:bg-green-600 active:bg-green-700 sm:text-base text-xs"
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
                  className="px-5 mt-2 bg-blue-500 text-white py-1 flex justify-center items-center hover:bg-blue-600 active:bg-blue-700 sm:text-base text-xs"
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
