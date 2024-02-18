"use client";

import React from "react";
import { uploadToS3, uploadToAzure } from "@/app/utils/upload";

type Props = {
  maxFileCount?: number;
  provider: "aws" | "azure";
};

const Upload = (props: Props) => {
  const { maxFileCount = 1, provider } = props;

  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const files = (event.target as HTMLFormElement).file.files as FileList;
    if (!files || files.length === 0) return;

    if (files.length > maxFileCount) {
      setError(`Please select up to ${maxFileCount} files`);
      return;
    }

    try {
      let uploadPromises: Array<Promise<string>>;
      if (provider === "aws") {
         uploadPromises = Array.from(files).map((file) =>
          uploadToS3(file)
        );
      } else {
         uploadPromises = Array.from(files).map((file) =>
          uploadToAzure(file)
        );
      }
      const keys = await Promise.all(uploadPromises);
      keys.forEach((key) =>
        console.log(`File uploaded successfully with key: ${key}`)
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const allowMultiple = maxFileCount > 1;
  const maxFileCountMessage = allowMultiple
    ? `up to ${maxFileCount} files`
    : "a file";

  return (
    <>
      <p>Please select {maxFileCountMessage}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          id="file"
          name="file"
          accept="image/*, video/*, audio/*"
          multiple={allowMultiple}
        />
        <button type="submit">Upload</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default Upload;
