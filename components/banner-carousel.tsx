'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

interface Banner {
  id: string;
  imageUrl: string;
  link?: string;
}

async function fetchBanners(): Promise<Banner[]> {
  const { data } = await api.get('/settings/public');
  return data?.banners || [];
}

export function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const next = useCallback(() => {
    if (!banners?.length) return;
    setCurrent(prev => (prev + 1) % banners.length);
  }, [banners]);

  const prev = useCallback(() => {
    if (!banners?.length) return;
    setCurrent(prev => (prev - 1 + banners.length) % banners.length);
  }, [banners]);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners, next]);

  if (!banners || banners.length === 0) return null;

  const banner = banners[current];

  const content = (
    <div className="relative w-full h-[180px] sm:h-[250px] md:h-[320px] rounded-lg overflow-hidden group">
      <Image
        src={banner.imageUrl}
        alt="Banner promocional"
        fill
        className="object-cover"
        priority
      />

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (banner.link) {
    return (
      <Link href={banner.link} className="block mb-6">
        {content}
      </Link>
    );
  }

  return <div className="mb-6">{content}</div>;
}
