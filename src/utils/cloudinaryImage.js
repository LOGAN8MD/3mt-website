const CLOUDINARY_UPLOAD_SEGMENT = '/upload/';
const DEFAULT_TRANSFORMS = ['f_auto', 'q_auto'];

const buildTransform = (options = {}) => {
  const transforms = [...DEFAULT_TRANSFORMS];

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  return transforms.join(',');
};

export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) return url;

  const [prefix, suffix] = url.split(CLOUDINARY_UPLOAD_SEGMENT);
  if (!prefix || !suffix) return url;

  const transform = buildTransform(options);
  if (suffix.startsWith(`${transform}/`)) return url;

  return `${prefix}${CLOUDINARY_UPLOAD_SEGMENT}${transform}/${suffix}`;
};
