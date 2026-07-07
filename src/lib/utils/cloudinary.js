/**
 * Cloudinary Configuration
 * For image uploads and management
 */

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
};

/**
 * Upload image to Cloudinary from browser
 * @param {File} file - Image file from input
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImageToCloudinary = async (file, folder = 'products') => {
  try {
    if (!CLOUDINARY_CONFIG.cloudName) {
      throw new Error('Cloudinary cloud name not configured. Please check .env.local file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 400 && errorData.error?.message?.includes('Upload preset')) {
        throw new Error(`Upload preset "${CLOUDINARY_CONFIG.uploadPreset}" not found. Please create it in your Cloudinary dashboard as an unsigned preset.`);
      }

      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.error('[ERROR] Cloudinary upload error:', error.message);
    throw error;
  }
};


