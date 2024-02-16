"use client";

import React from "react";
import { uploadToS3 } from "@/app/utils/upload";

const Upload = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = (event.target as HTMLFormElement).file.files[0];
    if (!file) return null;
    try {
      const key = await uploadToS3(file);
      console.log(`File uploaded successfully with key: ${key}`);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <>
      <p>Please select file to upload</p>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          id="file"
          name="file"
          accept="image/*, video/*, audio/*"
        />
        <button type="submit">Upload</button>
      </form>
    </>
  );
};

export default Upload;
