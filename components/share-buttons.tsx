'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Link2 } from 'lucide-react';
import { MessageCircle } from 'lucide-react';

const FacebookIcon = () => <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const TwitterIcon = () => <svg className="h-4 w-4 text-sky-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;

interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
  price: string;
}

export function ShareButtons({ title, description, url, price }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareText = `${title}\n${price}\n\nVeja no BaitaBriq:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('Erro ao copiar link');
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareText}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="w-full"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Compartilhar
      </Button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg p-2 z-50 w-48">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              WhatsApp
            </button>

            <button
              onClick={handleFacebookShare}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              <FacebookIcon />
              Facebook
            </button>

            <button
              onClick={handleTwitterShare}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              <TwitterIcon />
              Twitter
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Copiado!</span>
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  Copiar link
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
