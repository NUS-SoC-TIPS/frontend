import imageCompression from 'browser-image-compression';

import { CLOUDINARY_UPLOAD_URL } from 'constants/urls';

export const uploadImageToCloudinary = async (image: File): Promise<string> => {
  const compressedFile = await imageCompression(image, {
    maxSizeMB: 1,
  });
  const formData = new FormData();
  formData.append('file', compressedFile);

  formData.append(
    'upload_preset',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET!,
  );
  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });
  const { secure_url: secureUrl } = await response.json();
  return secureUrl;
};
