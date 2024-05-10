import React from "react";
import { FaFile, FaFileAudio, FaFileLines, FaFilePdf } from "react-icons/fa6";

interface Props {
  File: FileBase64;
  className: string;
}
export default function UploadFile({ File, className }: Props) {
  if (
    File.contentType == "image/jpeg" ||
    File.contentType == "image/png" ||
    File.contentType == "image/jpg"
  ) {
    return <img src={File.base64} className={className} />;
  } else if (
    File.contentType == "video/mp4" ||
    File.contentType == "video/mkv"
  ) {
    return (
      <video className={className} controls>
        <source src={File.base64} type={File.contentType} />
      </video>
    );
  } else if (File.contentType == "application/pdf") {
    return <FaFilePdf className={className} color="gray" />;
  } else if (File.contentType == "audio/mpeg") {
    return (
      <>
        <audio className={className} controls>
          <source src={File.base64} type={File.contentType} />
        </audio>
      </>
    );
  } else {
    return (
      <>
        <FaFileLines className={className} color="gray" />
      </>
    );
  }
}
