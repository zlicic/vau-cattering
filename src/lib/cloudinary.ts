const CLOUD_NAME = 'gvn6v5d8';

function buildTransforms(
  width?: number,
  { quality = 'q_auto', format = 'f_auto' }: { quality?: string; format?: string } = {}
): string {
  const parts: string[] = [];
  if (width) parts.push(`w_${width}`);
  parts.push(quality, format);
  return parts.join(',');
}

export function cloudinaryUrl(
  image: string,
  width?: number,
  options?: { quality?: string; format?: string }
): string {
  // External or already-transformed URLs — return as-is
  if (image.startsWith('http')) {
    const ourBase = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
    if (image.startsWith(ourBase) && !image.includes('/image/upload/w_')) {
      return image.replace('/image/upload/', `/image/upload/${buildTransforms(width, options)}/`);
    }
    return image;
  }

  // Public ID path — build full URL
  const transforms = buildTransforms(width, options);
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${image}`;
}
