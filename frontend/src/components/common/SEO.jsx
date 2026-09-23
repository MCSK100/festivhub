import { Helmet } from 'react-helmet-async'

const SITE = 'FestivLink'

export default function SEO({ title, description, path = '', image, type = 'website' }) {
  const fullTitle = title ? `${title} | ${SITE}` : 'FestivLink — Find the right vendors for your event'
  const desc =
    description ||
    'Discover photographers, caterers, decorators, makeup artists, venues and more. Browse local professionals and send a booking request directly.'
  const url = `https://festivlink.vercel.app${path}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
