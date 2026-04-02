interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

interface BlogPostSchemaProps {
  post: BlogPost;
  content?: string;
}

export function BlogPostSchema({ post, content }: BlogPostSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baitabriq.com.br'}/logo.jpeg`,
    "author": {
      "@type": "Organization",
      "name": "BaitaBriq",
      "url": "https://baitabriq.com.br"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "BaitaBriq",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baitabriq.com.br'}/logo.jpeg`
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baitabriq.com.br'}/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": [
      post.category.toLowerCase(),
      "máquinas agrícolas",
      "tratores",
      "colheitadeiras", 
      "implementos agrícolas",
      "RS", "SC", "PR",
      "sul do brasil"
    ],
    "about": {
      "@type": "Thing",
      "name": "Máquinas Agrícolas"
    },
    "wordCount": content ? content.split(' ').length : undefined
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogListSchema({ posts }: { posts: BlogPost[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog BaitaBriq",
    "description": "Dicas e guias sobre máquinas agrícolas no Sul do Brasil",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baitabriq.com.br'}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "BaitaBriq"
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://baitabriq.com.br'}/blog/${post.slug}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}