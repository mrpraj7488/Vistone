// SEO Utilities and Structured Data Helpers

/**
 * Generate SEO metadata object
 */
export function generateSEO({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  publishedTime,
  author,
}) {
  const siteName = 'Vistone';
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    author: author || siteName,
    
    // Open Graph
    'og:title': fullTitle,
    'og:description': description,
    'og:url': url,
    'og:site_name': siteName,
    'og:image': image,
    'og:type': type,
    'og:published_time': publishedTime,
    
    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:title': fullTitle,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:creator': '@vistone',
    
    // Additional meta
    'robots': 'index, follow',
    'canonical': url,
  };
}

/**
 * Generate Product structured data (JSON-LD)
 */
export function generateProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.shortDescription,
    image: Array.isArray(product.images) ? product.images : [product.image],
    brand: {
      '@type': 'Brand',
      name: 'Vistone',
    },
    offers: {
      '@type': 'Offer',
      url: `${window.location.origin}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price || product.regularPrice,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Vistone',
      },
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount || 0,
    } : undefined,
  };
}

/**
 * Generate Breadcrumb structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate Organization structured data (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vistone',
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    description: 'Premium digital marketplace for SaaS products and templates',
    sameAs: [
      'https://twitter.com/vistone',
      'https://facebook.com/vistone',
      'https://linkedin.com/company/vistone',
    ],
  };
}

/**
 * Generate Article structured data (JSON-LD)
 */
export function generateArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || article.excerpt,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author || 'Vistone Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vistone',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png`,
      },
    },
  };
}

/**
 * Update document meta tags
 */
export function updateMetaTags(metadata) {
  // Update or create meta tags
  Object.entries(metadata).forEach(([key, value]) => {
    if (!value) return;
    
    let element = document.querySelector(`meta[property="${key}"], meta[name="${key}"], meta[itemprop="${key}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      if (key.startsWith('og:') || key.startsWith('twitter:')) {
        element.setAttribute('property', key);
      } else {
        element.setAttribute('name', key);
      }
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', value);
  });
  
  // Update title
  if (metadata.title) {
    document.title = metadata.title;
  }
  
  // Update canonical link
  if (metadata.canonical) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', metadata.canonical);
  }
}

/**
 * Inject JSON-LD structured data
 */
export function injectStructuredData(data, id = 'structured-data') {
  // Remove existing script if present
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data, null, 2);
  document.head.appendChild(script);
}

/**
 * Generate and inject all SEO elements for a product page
 */
export function setupProductSEO(product) {
  const metadata = generateSEO({
    title: product.name,
    description: product.shortDescription || product.description,
    keywords: [product.category, ...(product.techStack || [])],
    image: Array.isArray(product.images) ? product.images[0] : product.image,
    url: `${window.location.origin}/products/${product.slug}`,
    type: 'product',
  });
  
  updateMetaTags(metadata);
  injectStructuredData(generateProductSchema(product));
}

/**
 * Generate and inject all SEO elements for an article page
 */
export function setupArticleSEO(article) {
  const metadata = generateSEO({
    title: article.title,
    description: article.excerpt || article.description,
    keywords: article.tags || [],
    image: article.image,
    url: `${window.location.origin}/blog/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt,
    author: article.author,
  });
  
  updateMetaTags(metadata);
  injectStructuredData(generateArticleSchema(article));
}

/**
 * Generate sitemap data structure
 */
export function generateSitemapData(routes) {
  const baseUrl = window.location.origin;
  
  return routes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastmod: route.lastModified || new Date().toISOString(),
    changefreq: route.changeFrequency || 'weekly',
    priority: route.priority || 0.5,
  }));
}

