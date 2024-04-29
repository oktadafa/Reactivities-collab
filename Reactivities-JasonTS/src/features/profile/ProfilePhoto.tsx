import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react'
import { FaFileImage } from 'react-icons/fa6';
import { useStore } from '../../app/store/store';
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget';
import ProfileStore from '../../app/store/profileStore';
import { Photo } from '../../app/models/profile';
import { useMutationDeletePhoto, useMutationSetMainPhoto } from '../../app/common/service';
import LoadingAddAtendee from '../../app/common/LoadingAddAtendee';

export default observer(function ProfilePhoto() {
  const [addPhotoMode, setAddPhotoMode] = useState(false)
  const {profileStore : {profile, isCurrentUser, handleSetMain}} = useStore()
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const {mutateAsync} = useMutationSetMainPhoto()
  const deletePhoto = useMutationDeletePhoto()
  const uploadPhoto = (file:Blob) => {
    console.log(file);
  }
  const handleMain = (photo:Photo, click:SyntheticEvent<HTMLButtonElement>) => {
    setTarget(click.currentTarget.name)
    setLoading(true)
      mutateAsync(photo.id).then(() => {
          if (profile && profile.photos) {
            profile.photos.find((p) => p.isMain)!.isMain = false;
            profile.photos.find((p) => p.id === photo.id)!.isMain = true;
            profile.image = profile.photos.find(
              (x) => x.isMain == true
            )?.fileBase64;
          }
      }).finally(() => setLoading(false))
    
  }

  const handleDelete = (photo:Photo, click:SyntheticEvent<HTMLButtonElement>) => {
    setTarget(click.currentTarget.name)
    setLoading(true)
    deletePhoto.mutateAsync(photo.id).then(() => {
        if (profile && profile.photos) {
          profile.photos = profile.photos.filter((e) => e.id !== photo.id);
    }
    }).finally(() => setLoading(false))
    
  } 


  return (
    <div>
      <div className="flex justify-between">
        <div className="flex">
          <FaFileImage size={30} />
          <p className="font-bold text-xl ml-3">Photos</p>
        </div>
        <div>
          {isCurrentUser &&
            (addPhotoMode ? (
              <button
                className="p-2 bg-gray-500 rounded-md text-white hover:bg-gray-600 active:shadow"
                onClick={() => setAddPhotoMode(!addPhotoMode)}
              >
                Cancel Add
              </button>
            ) : (
              <button
                className="p-2 bg-green-500 rounded-md text-white hover:bg-green-600 active:shadow"
                onClick={() => setAddPhotoMode(!addPhotoMode)}
              >
                Add Photo
              </button>
            ))}
        </div>
      </div>
      <div className="flex flex-wrap mt-4 w-full max-h-96 overflow-y-auto">
        {addPhotoMode ? (
          <PhotoUploadWidget
            uploadPhoto={uploadPhoto}
            setPhotoMode={setAddPhotoMode}
          />
        ) : profile?.photos?.length! > 0 ? (
          profile?.photos?.map((e) => (
            <div className="border-2 p-2 rounded ml-2 hover:shadow-lg mt-3">
              <img src={e.fileBase64} className="w-40 mx-auto rounded" />
              {isCurrentUser && (
                <div className="flex justify-between mt-2">
                  <button
                    className="px-2 rounded-md py-1 border-2 border-green-600 text-green-600 hover:shadow-green-600 hover:shadow active:shadow-none disabled:shadow-none disabled:border-green-200 disabled:text-green-200"
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
                    className="px-2 rounded-md py-1 border-2 border-red-600 text-red-600  hover:shadow-red-600 hover:shadow active:shadow-none disabled:border-red-200 disabled:text-red-200 disabled:shadow-none"
                    disabled={e.isMain}
                    name={e.id}
                    onClick={(es) => handleDelete(e,es)}
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
            <p className="text-2xl text-gray-400 text-center font-semibold">
              No Any Photo
            </p>
          </div>
        )}
        {/* {profile?.photos?.length! > 0 ? (
          profile?.photos?.map((e) => (
            <div className="border-2 p-2">
              <img src={e.fileBase64} className="w-60" />
              <div className="flex justify-between mt-2">
                <button
                  className="px-4 rounded-md py-2 border-2 border-green-600 text-green-600 hover:shadow-green-600 hover:shadow active:shadow-none disabled:shadow-none disabled:border-green-200 disabled:text-green-200"
                  disabled={e.isMain}
                >
                  Set Main
                </button>
                <button
                  className="px-4 rounded-md py-2 border-2 border-red-600 text-red-600  hover:shadow-red-600 hover:shadow active:shadow-none disabled:border-red-200 disabled:text-red-200"
                  disabled={!e.isMain}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-10">
            <p className="text-2xl text-gray-400 text-center">No Any Photo</p>
          </div>
        )} */}
      </div>
    </div>
  );
}); 