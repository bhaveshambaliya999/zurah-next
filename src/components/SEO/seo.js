// components/SEO/seo.js
import Head from "next/head";

const Seo = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  noIndex = false,
}) => {
  const fallbackImage = "https://zurah-next.vercel.app/default-preview.jpg";
  const canonicalUrl = url || "https://zurah-next.vercel.app/";

  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url: canonicalUrl,
    image: [image || fallbackImage],
  };

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} />

      {/* Basic SEO */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || fallbackImage} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || fallbackImage} />
      <meta name="twitter:url" content={canonicalUrl} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export default Seo;
