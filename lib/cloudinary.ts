import { httpClient, validateEndpoint } from './http-client';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ddgoyuy57';
const UPLOAD_PRESET = 'baitabriq';

export function optimizeCloudinaryUrl(url: string, options?: { width?: number; height?: number }): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const transforms = ['f_auto', 'q_auto'];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  return url.replace('/image/upload/', `/image/upload/${transforms.join(',')}/`);
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  if (!CLOUD_NAME || !/^[a-zA-Z0-9_-]+$/.test(CLOUD_NAME)) {
    throw new Error('Cloudinary cloud name inválido');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) throw new Error('Erro ao fazer upload da imagem');

  const data = await response.json();
  return data.secure_url;
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) return;

  const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
  if (!match) return;
  const publicId = match[1];

  await httpClient.post(validateEndpoint('/images/delete'), { publicId });
};
