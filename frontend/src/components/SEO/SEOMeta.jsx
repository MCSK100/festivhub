import { Helmet } from 'react-helmet-async';

/**
 * SEOMeta Component
 * Manages all SEO-related meta tags, Open Graph, Twitter Cards, and Schema Markup
 */
const SEOMeta = ({
  title = 'FestivLink - Premium Event Management & Service Provider Booking Platform',
  description = 'Connect with elite vendors and professionals. Book verified talent for photography, catering, decoration, and more. Your dream event deserves excellence.',
  canonical = 'https://festivlink.vercel.app',
  ogTitle,
  ogDescription,
  ogImage = 'https://festivlink.vercel.app/og-image.jpg',
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  schemaMarkup,
  children,
}) => {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalOgUrl = ogUrl || canonical;
  const finalTwitterTitle = twitterTitle || title;
  const finalTwitterDescription = twitterDescription || description;
  const finalTwitterImage = twitterImage || ogImage;

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FestivLink',
    url: 'https://festivlink.vercel.app',
    logo: 'https://festivlink.vercel.app/logo.png',
    description: 'Premium event management and vendor booking platform',
    sameAs: [
      'https://www.facebook.com/festivlink',
      'https://www.instagram.com/festivlink',
      'https://www.twitter.com/festivlink',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+1-800-FESTIVLINK',
      email: 'support@festivlink.com',
    },
  };

  // Local Business Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FestivLink',
    image: 'https://festivlink.vercel.app/logo.png',
    description: 'Premium event management and vendor booking platform',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Event Street',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US',
    },
    telephone: '+1-800-FESTIVLINK',
    url: 'https://festivlink.vercel.app',
    priceRange: '$$',
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I book a vendor on FestivLink?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Browse our verified vendors, compare portfolios and pricing, and book directly through our platform.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are all vendors verified?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all vendors on FestivLink are thoroughly vetted and verified for quality assurance.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is your satisfaction guarantee?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer a 99.9% satisfaction guarantee on all bookings made through our platform.',
        },
      },
    ],
  };

  const finalSchemaMarkup = schemaMarkup || organizationSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={finalOgUrl} />
      <meta property="og:site_name" content="FestivLink" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />
      <meta name="twitter:site" content="@festivlink" />

      {/* Additional Meta Tags */}
      <meta name="keywords" content="event management, vendor booking, photography, catering, decoration, wedding planning" />
      <meta name="author" content="FestivLink" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchemaMarkup)}
      </script>

      {/* Additional Schema Markups */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* Preconnect to external resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Additional children if provided */}
      {children}
    </Helmet>
  );
};

export default SEOMeta;
