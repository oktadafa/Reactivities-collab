import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { FaFileImage } from "react-icons/fa6";
import { useStore } from "../../app/store/store";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo } from "../../app/models/profile";
import {
  useMutationDeletePhoto,
  useMutationSetMainPhoto,
} from "../../app/common/service";
import LoadingAddAtendee from "../../app/common/LoadingAddAtendee";

export default observer(function ProfilePhoto() {
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const {
    profileStore: { profile, isCurrentUser },
  } = useStore();
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = useMutationSetMainPhoto();
  const deletePhoto = useMutationDeletePhoto();

  const handleMain = (
    photo: Photo,
    click: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(click.currentTarget.name);
    setLoading(true);
    mutateAsync(photo.id)
      .then(() => {
        if (profile && profile.photos) {
          profile.photos.find((p) => p.isMain)!.isMain = false;
          profile.photos.find((p) => p.id === photo.id)!.isMain = true;
          profile.image = profile.photos.find(
            (x) => x.isMain == true
          )?.fileBase64;
        }
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (
    photo: Photo,
    click: SyntheticEvent<HTMLButtonElement>
  ) => {
    setTarget(click.currentTarget.name);
    setLoading(true);
    deletePhoto
      .mutateAsync(photo.id)
      .then(() => {
        if (profile && profile.photos) {
          profile.photos = profile.photos.filter((e) => e.id !== photo.id);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="flex justify-between sm:text-xl text-sm ">
        <div className="flex items-center">
          <FaFileImage />
          <p className="font-bold ml-3">Photos</p>
        </div>
        <div>
          {isCurrentUser &&
            (addPhotoMode ? (
              <button
                className="p-1 bg-gray-500 sm:p-2 sm:text-base text-sm rounded-md text-white hover:bg-gray-600 active:shadow"
                onClick={() => setAddPhotoMode(!addPhotoMode)}
              >
                Cancel Add
              </button>
            ) : (
              <button
                className="p-1 sm:p-2 bg-green-500 rounded-md text-white sm:text-base text-sm hover:bg-green-600 active:shadow "
                onClick={() => setAddPhotoMode(!addPhotoMode)}
              >
                Add Photo
              </button>
            ))}
        </div>
      </div>
      <div className="flex flex-wrap mt-4 w-full max-h-68 overflow-y-auto">
        {addPhotoMode ? (
          <PhotoUploadWidget setPhotoMode={setAddPhotoMode} />
        ) : profile?.photos?.length! > 0 ? (
          profile?.photos?.map((e) => (
            <div className="sm:border-2 sm:p-2 border p-1 rounded ml-2 hover:shadow-lg mt-3">
              <img
                src={e.fileBase64}
                className="sm:w-40 w-20 mx-auto rounded"
              />
              {isCurrentUser && (
                <div className="flex justify-between mt-2">
                  <button
                    className="sm:px-2 px-[1px] rounded-md text-[10px] sm:text-base sm:py-1 py-[0.5px] border-2 border-green-600 text-green-600 hover:shadow-green-600 hover:shadow active:shadow-none disabled:shadow-none disabled:border-green-200 disabled:text-green-200"
                    disabled={e.isMain}
                    name={`main${e.id}`}
                    onClick={(click) => handleMain(e, click)}
                  >
                    Set Main
                    {loading && `main${e.id}` == target && (
                      <LoadingAddAtendee />
                    )}
                  </button>
                  <button
                    className="px-[1px] sm:px-2 rounded-md text-[10px]  sm:py-1 py-[0.5px] border-2 border-red-600 text-red-600  sm:text-base hover:shadow-red-600 hover:shadow active:shadow-none disabled:border-red-200 disabled:text-red-200 disabled:shadow-none"
                    disabled={e.isMain}
                    name={e.id}
                    onClick={(es) => handleDelete(e, es)}
                  >
                    Delete
                    {loading && e.id == target && <LoadingAddAtendee />}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full py-10">
            <p className="sm:text-2xl text-sm text-gray-400 text-center font-semibold">
              No Any Photo
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
