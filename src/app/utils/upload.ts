export const uploadToS3 = async (file: File) => {
  const fileType = encodeURIComponent(file.type);

  //get signed url from the server
  const res = await fetch(`/api/uploads3?fileType=${fileType}`);

  //data contains the signed url and the file key
  const { uploadUrl, key } = await res.json();

  //upload the file to s3
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });
  if (!uploadRes.ok) throw new Error("Error uploading file");
  return key;
};
