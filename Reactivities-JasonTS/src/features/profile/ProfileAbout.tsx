import { FaUser } from "react-icons/fa6";
import { useStore } from "../../app/store/store";
import { useState } from "react";
import { Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { useMutationUpdateProfile } from "../../app/common/service";
import LoadingAddAtendee from "../../app/common/LoadingAddAtendee";
import { observer } from "mobx-react-lite";

export default observer(function ProfileAbout() {
  const { profileStore, userStore } = useStore();
  const [editAboutMode, setEditAboutMode] = useState(false);
  const { mutateAsync } = useMutationUpdateProfile();
  return (
    <div>
      <div className="flex justify-between sm:text-xl text-sm">
        <div className="flex items-center">
          <FaUser />
          <p className="font-bold sm:ml-3 ml-1">
            About {profileStore.profile?.displayName}
          </p>
        </div>
        <div>
          {profileStore.isCurrentUser &&
            (editAboutMode ? (
              <button
                className="p-1 sm:p-2 bg-gray-500 hover:bg-gray-600 rounded text-white text-sm sm:text-base"
                onClick={() => setEditAboutMode(!editAboutMode)}
              >
                Cancel Edit
              </button>
            ) : (
              <button
                className="p-1 sm:p-2 bg-green-500 hover:bg-green-600 rounded text-white text-sm sm:text-base"
                onClick={() => setEditAboutMode(!editAboutMode)}
              >
                Edit About
              </button>
            ))}
          {}
        </div>
      </div>
      {editAboutMode ? (
        <div className="text-right py-10 px-10">
          <Formik
            initialValues={{
              displayName: profileStore.profile?.displayName,
              bio: profileStore.profile?.bio,
            }}
            onSubmit={(value) => {
              mutateAsync(value);
              setEditAboutMode(false);
              if (
                profileStore.profile &&
                profileStore.isCurrentUser &&
                userStore.user
              ) {
                profileStore.profile.displayName = value.displayName!;
                profileStore.profile.bio = value.bio;
                userStore.user.displayName = value.displayName!;
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <MyTextInput
                  name="displayName"
                  type="text"
                  className="border-2 w-full rounded p-1 text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Display Name"
                  errorClass=""
                />
                <MyTextArea
                  rows={5}
                  name="bio"
                  className="w-full border-2 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded mt-3 p-1"
                  placeholder="Add Your Bio"
                  errorClass=""
                />
                <button
                  type="submit"
                  className="mt-3 bg-green-500 p-2 text-white rounded hover:bg-green-600 disabled:bg-green-300"
                  disabled={isSubmitting}
                >
                  Submit
                  {isSubmitting && <LoadingAddAtendee />}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <p>{profileStore.profile?.bio}</p>
      )}
    </div>
  );
});
