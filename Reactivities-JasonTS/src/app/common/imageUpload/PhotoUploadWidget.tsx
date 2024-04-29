import React, { useEffect, useState } from 'react'
import PhotoWidgetDropzone from './PhotoWidgetDropzone'
import PhotoWidgetCropper from './PhotoWIdgetCropper'
import { FaCheck, FaX } from 'react-icons/fa6'
import { useMutationUpdateFollow, useMutationUploadPhoto } from '../service';
import LoadingAddAtendee from '../LoadingAddAtendee';
import { useStore } from '../../store/store';

interface Props{
  uploadPhoto:(file:Blob) => void
  setPhotoMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PhotoUploadWidget({ uploadPhoto, setPhotoMode}:Props) {
  const [files, setFiles] = useState<any>([])
  const[cropper, setCropper] = useState<Cropper>()
  const {mutateAsync} = useMutationUploadPhoto()
  const [loading, setLoading] = useState(false)
  const {profileStore:{profile}} = useStore()
    
    function blobToBase64(blob:any) : Promise<string>{
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result?.toString()!);
        reader.readAsDataURL(blob);
      });
    }

    function onCrop() {
      if (cropper) {
        cropper.getCroppedCanvas().toBlob( async(blob) =>{
                try {
                  setLoading(true)
                    const result =await blobToBase64(blob)
                     mutateAsync(result).then((data) => {
                      setLoading(false)
                      setPhotoMode(false)
                      profile?.photos?.push(data.data)
                      if (profile && !profile.image) {
                        profile.image = result
                      }
                    })                  
                } catch (error) {
                    console.log(error);
                    
                }
        });
      }
    }
    useEffect(() => {
      return () => {
        files.forEach((file: any) => URL.revokeObjectURL(file.preview));
      };
    }, [files]);
  return (
    <div className="flex justify-between w-full">
      <div>
        <h1>Step 1 Add Photo</h1>
        <PhotoWidgetDropzone setFiles={setFiles} />
      </div>
      <div className="border">
        <h1>Step 2 Resize Image</h1>
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}
      </div>
      <div>
        <h1>Step 3 Preview & Upload</h1>
        {files && files.length > 0 && (
          <>
            <div
              className="img-preview"
              style={{ minHeight: 200, overflow: "hidden" }}
            />
            <div className='flex'>
              <button onClick={onCrop} className="bg-green-500 py-2 px-6 flex rounded-s-xl hover:bg-green-600 active:shadow-xl">
                <FaCheck color="white" size={20} />
                {loading && 
                <LoadingAddAtendee/>
                 }
              </button>
              <button
                disabled={loading}
                onClick={() => setFiles([])}
                className="bg-red-500 py-2 px-6 rounded-e-xl hover:bg-red-600 active:shadow-xl" 
              >
                <FaX color="white" size={20}/>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
