import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa6";
import Swal from "sweetalert2";

interface Props {
  setFiles: (files: any) => void;
}

export default function PhotoWidgetDropzone({ setFiles }: Props) {
  const contentType = ["image/jpeg", "image/png", "image/jpg"];
  const dzStyles = {
    border: "dashed 3px #eee",
    borderColor: "#eee",
    borderRadius: "5px",
    paddingTop: "30px",
    textAlign: "center" as "center",
    height: 200,
    width: "100%",
  };

  const dzActive = {
    borderColor: "green",
  };
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.length > 1
        ? Swal.fire({
            text: "Maximal Photo One",
            title: "Failed",
            icon: "error",
          })
        : contentType.some((x) => x === acceptedFiles[0].type)
        ? 
          setFiles(
            acceptedFiles.map((file: any) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          )
        : Swal.fire({
            text: "Please Upload File Type jpeg, png, jpg",
            title: "Invalid",
            icon: "error",
          });
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}
    >
      <input {...getInputProps()} />
      <FaUpload className="mx-auto sm:text-4xl text-xl" color="grey" />
      <h1 className="sm:text-xl text-base text-gray-500">Upload Photo Here</h1>
    </div>
  );
}
