const cloudinary = require('cloudinary').v2;
const { logger } = require('./logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'adult-content/images',
      resource_type: 'image',
      quality: 'auto:good',
      format: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' }
      ]
    };

    const uploadOptions = { ...defaultOptions, ...options };

    const result = await cloudinary.uploader.upload(file, uploadOptions);
    
    logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);
    
    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    logger.error('Cloudinary image upload error:', error);
    throw new Error('Failed to upload image');
  }
};

// Upload video to Cloudinary
const uploadVideo = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'adult-content/videos',
      resource_type: 'video',
      quality: 'auto:good',
      video_codec: 'h264',
      audio_codec: 'aac',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }
      ]
    };

    const uploadOptions = { ...defaultOptions, ...options };

    const result = await cloudinary.uploader.upload(file, uploadOptions);
    
    logger.info(`Video uploaded to Cloudinary: ${result.public_id}`);
    
    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      duration: result.duration,
      bytes: result.bytes
    };
  } catch (error) {
    logger.error('Cloudinary video upload error:', error);
    throw new Error('Failed to upload video');
  }
};

// Generate thumbnail from video
const generateThumbnail = async (videoPublicId, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'adult-content/thumbnails',
      resource_type: 'video',
      format: 'jpg',
      transformation: [
        { width: 640, height: 360, crop: 'fill' },
        { start_offset: '10%' }
      ]
    };

    const thumbnailOptions = { ...defaultOptions, ...options };

    const result = await cloudinary.uploader.upload(
      `video:${videoPublicId}`,
      thumbnailOptions
    );

    logger.info(`Thumbnail generated: ${result.public_id}`);

    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    logger.error('Thumbnail generation error:', error);
    throw new Error('Failed to generate thumbnail');
  }
};

// Delete file from Cloudinary
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    logger.info(`File deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file');
  }
};

// Get file info
const getFileInfo = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });

    return result;
  } catch (error) {
    logger.error('Get file info error:', error);
    throw new Error('Failed to get file info');
  }
};

// Generate signed upload URL (for direct uploads from frontend)
const generateSignedUploadUrl = (options = {}) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    const params = {
      timestamp,
      folder: options.folder || 'adult-content/uploads',
      ...options
    };

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUD_API_SECRET);

    return {
      url: `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/upload`,
      params: {
        ...params,
        signature,
        api_key: process.env.CLOUD_API_KEY
      }
    };
  } catch (error) {
    logger.error('Generate signed URL error:', error);
    throw new Error('Failed to generate signed upload URL');
  }
};

// Transform image URL
const transformImageUrl = (publicId, transformations = []) => {
  try {
    return cloudinary.url(publicId, {
      transformation: transformations,
      secure: true
    });
  } catch (error) {
    logger.error('Transform image URL error:', error);
    throw new Error('Failed to transform image URL');
  }
};

// Transform video URL
const transformVideoUrl = (publicId, transformations = []) => {
  try {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      transformation: transformations,
      secure: true
    });
  } catch (error) {
    logger.error('Transform video URL error:', error);
    throw new Error('Failed to transform video URL');
  }
};

module.exports = {
  uploadImage,
  uploadVideo,
  generateThumbnail,
  deleteFile,
  getFileInfo,
  generateSignedUploadUrl,
  transformImageUrl,
  transformVideoUrl,
  cloudinary
};