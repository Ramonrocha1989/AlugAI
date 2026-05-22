'use client';

import { useState } from 'react';
import Image from 'next/image';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { getApiErrorMessage } from '@/lib/error-handler';
import { Button } from '@/components/ui/button';
import { X, Upload, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    if (images.length + files.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} é muito grande. Máximo 5MB.`);
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} não é uma imagem válida.`);
        }

        const url = await uploadToCloudinary(file);
        setUploadProgress(((index + 1) / files.length) * 100);
        return url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Erro ao fazer upload das imagens'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = async (index: number) => {
    const urlToDelete = images[index];
    onChange(images.filter((_, i) => i !== index));
    try {
      await deleteFromCloudinary(urlToDelete);
    } catch {
      // falha silenciosa — imagem já removida da lista
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <div className="relative h-40 w-full bg-muted rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Imagem ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Principal
              </div>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <label className="relative h-40 w-full bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer flex flex-col items-center justify-center transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Adicionar imagens</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {images.length}/{maxImages}
                </p>
              </>
            )}
          </label>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        • Máximo {maxImages} imagens (5MB cada)
        <br />
        • A primeira imagem será a principal
        <br />
        • Formatos: JPG, PNG, WebP
      </p>
    </div>
  );
}
