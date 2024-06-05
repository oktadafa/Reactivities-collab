import React, { useEffect, useState } from "react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWIdgetCropper";
import { FaCheck, FaX } from "react-icons/fa6";
import { useMutationUploadPhoto } from "../service";
import LoadingAddAtendee from "../LoadingAddAtendee";
import { useStore } from "../../store/store";
import Swal from "sweetalert2";

interface Props {
  setPhotoMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PhotoUploadWidget({ setPhotoMode }: Props) {
  const [files, setFiles] = useState<any | undefined>(undefined);
  const [cropper, setCropper] = useState<Cropper>();
  const { mutateAsync } = useMutationUploadPhoto();
  const [loading, setLoading] = useState(false);
  const {
    profileStore: { profile },
  } = useStore();

  function blobToBase64(blob: any): Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result?.toString()!);
      reader.readAsDataURL(blob);
    });
  }

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(async (blob) => {
        try {
          setLoading(true);
          const result = await blobToBase64(blob);
          mutateAsync(result).then((data) => {
            setLoading(false);
            setPhotoMode(false);
            profile?.photos?.push(data.data);
            if (profile && !profile.image) {
              profile.image = result;
            }
          });
        } catch (error) {
          Swal.fire({
            title: "Failde!",
            text: "sorry there's a problem",
            icon: "error",
          });
        }
      });
    }
  }
  useEffect(() => {
    return () => {
      if (files) {
        files.forEach((file: any) => URL.revokeObjectURL(file.preview));
      }
    };
  }, [files]);

  return (
    <div className="flex w-full justify-center">
      <div hidden={files} className="w-full">
        <PhotoWidgetDropzone setFiles={setFiles} />
      </div>
      <div className="border" hidden={!files}>
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}

        <div className="flex mt-5 justify-end">
          <button
            onClick={onCrop}
            className="bg-green-500 sm:py-2 py-1 sm:px-6 px-3 flex rounded-s-xl hover:bg-green-600 active:shadow-xl sm:text-base text-xs"
          >
            <FaCheck color="white" />
            {loading && <LoadingAddAtendee />}
          </button>
          <button
            disabled={loading}
            onClick={() => setFiles([])}
            className="bg-red-500 sm:py-2 py-1 sm:px-6 px-3 rounded-e-xl  hover:bg-red-600 active:shadow-xl sm:text-base text-xs"
          >
            <FaX color="white" />
          </button>
        </div>
      </div>
      {/* <div className="hidden">
        <h1>Step 3 Preview & Upload</h1>
        {files && files.length > 0 && (
          <>
            <div
              className="img-preview"
              style={{ minHeight: 200, overflow: "hidden" }}
            />
            <div className="flex">
              <button
                onClick={onCrop}
                className="bg-green-500 py-2 px-6 flex rounded-s-xl hover:bg-green-600 active:shadow-xl"
              >
                <FaCheck color="white" size={20} />
                {loading && <LoadingAddAtendee />}
              </button>
              <button
                disabled={loading}
                onClick={() => setFiles([])}
                className="bg-red-500 py-2 px-6 rounded-e-xl hover:bg-red-600 active:shadow-xl"
              >
                <FaX color="white" size={20} />
              </button>
            </div>
          </>
        )}
      </div> */}
    </div>
  );
}
