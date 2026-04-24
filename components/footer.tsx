'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMounted } from '@/hooks/use-mounted';
import { Instagram, Facebook, Linkedin, Youtube, Mail, Phone } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

async function fetchPublicSettings() {
  const { data } = await api.get('/settings/public');
  return data;
}

export function Footer() {
  const mounted = useMounted();

  const { data: settings } = useQuery({
    queryKey: ['public-settings'],
    queryFn: fetchPublicSettings,
    staleTime: 1000 * 60 * 10,
    retry: 1,
    enabled: mounted,
  });

  const social = mounted ? (settings?.socialLinks || {}) : {};
  const hasSocial = social.instagram || social.facebook || social.linkedin || social.youtube;

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">{(mounted && settings?.siteName) || 'BaitaBriq'}</h3>
            <p className="text-sm text-muted-foreground">
              {(mounted && settings?.homeDescription) || 'Marketplace de máquinas agrícolas e de construção no Sul do Brasil.'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos-de-uso" className="text-muted-foreground hover:text-primary">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidade" className="text-muted-foreground hover:text-primary">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-muted-foreground hover:text-primary">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${(mounted && settings?.emailSupport) || 'contato@baitabriq.com.br'}`} className="flex items-center gap-2 hover:text-primary">
                  <Mail className="h-4 w-4" />
                  {(mounted && settings?.emailSupport) || 'contato@baitabriq.com.br'}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${(mounted && settings?.whatsappSupport) || '5553984590461'}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4" />
                  {(mounted && settings?.phoneSupport) || '(53) 98459-0461'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            {mounted && hasSocial ? (
              <ul className="space-y-2 text-sm">
                {social.instagram && (
                  <li>
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Instagram className="h-4 w-4" /> Instagram
                    </a>
                  </li>
                )}
                {social.facebook && (
                  <li>
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Facebook className="h-4 w-4" /> Facebook
                    </a>
                  </li>
                )}
                {social.youtube && (
                  <li>
                    <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Youtube className="h-4 w-4" /> YouTube
                    </a>
                  </li>
                )}
                {social.linkedin && (
                  <li>
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Em breve</p>
            )}
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BaitaBriq. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
