export const uploadToCloudinary = async (file) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || "Image upload failed");
  }

  const data = await res.json();
  return data.secure_url;
};

export const uploadToImgbb = async (file) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "dummy_key_please_replace";
  
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || "Image upload failed");
  }

  const data = await res.json();
  return data.data.url;
};
