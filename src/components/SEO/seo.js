// components/Seo.js
import Head from "next/head";

const Seo = ({
  title = "Zurah Jewellery",
  description = "Discover exquisite handmade gold, diamond, and silver jewellery online at Zurah.",
  keywords = "Zurah jewellery, handmade jewellery, gold, diamond, silver",
  image,
  url,
  type = "website",
  noIndex = false,
}) => {
  const fallbackImage = "https://rpdiamondsandjewellery-uat.s3.ap-southeast-1.amazonaws.com/writable/uploads/1003/510/BRD5100001/mini_program/1003_510_BRD5100001_mini_program_566913517528287565785.png";

  const canonicalUrl = url || "https://zurah-next.vercel.app";
  const imageUrl = image || fallbackImage;

  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url: canonicalUrl,
    image: [imageUrl],
  };

  return (
    <Head>
      {/* Title and Canonical */}
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} />

      {/* SEO Meta */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph (Facebook/WhatsApp/LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export default Seo;
