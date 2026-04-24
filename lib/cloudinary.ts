export function optimizeCloudinaryUrl(url: string, options?: { width?: number; height?: number }): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const transforms = ['f_auto', 'q_auto'];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  return url.replace('/image/upload/', `/image/upload/${transforms.join(',')}/`);
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default_mercado_maquina');
  formData.append('folder', 'mercado-maquina');

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao fazer upload da imagem');
  }

  const data = await response.json();
  return data.secure_url;
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  // Extrair public_id da URL
  const parts = imageUrl.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  
  // Deletar via backend (precisa de API Secret)
  // Por enquanto, deixar manual no Cloudinary Dashboard
  console.log('Delete public_id:', publicId);
};
