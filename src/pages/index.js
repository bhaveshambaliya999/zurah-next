// pages/index.js
import Head from "next/head";
import Homes from "@/components/HomePage/Home/homes";
import { Commanservice } from "@/CommanService/commanService";

export async function getServerSideProps() {
  const origin = "https://zurah-next.vercel.app"; // Change this if needed
  const commanService = new Commanservice(origin);

  let seoData = {
    title: "Zurah Jewellery",
    description: "Elegant Gold and Diamond Collections",
    keywords: "Zurah, Gold, Diamond, Jewelry",
    image: `${origin}/default-preview.jpg`,
    url: origin,
  };

  try {
    const res = await commanService.postApi("/EmbeddedPageMaster", {
      a: "GetStoreData",
      store_domain: origin,
      SITDeveloper: "1",
    });

    const data = res?.data?.data;

    seoData = {
      title: data?.seo_titles || seoData.title,
      description: data?.seo_description || seoData.description,
      keywords: data?.seo_keywords || seoData.keywords,
      image: data?.preview_image?.startsWith("http")
        ? data?.preview_image
        : `${origin}${data?.preview_image}`,
      url: origin,
    };

    return {
      props: {
        seoData,
        entityData: data,
      },
    };
  } catch (error) {
    console.error("SEO Fetch Error:", error);
    return {
      props: {
        seoData,
        entityData: {},
      },
    };
  }
}
// pages/index.js
export default function Home({ seoData, entityData }) {
  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />

        {/* Open Graph tags for LinkedIn, Facebook */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:type" content="website" />

        {/* Optional: Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.image} />
      </Head>

      <Homes entityData={entityData} />
    </>
  );
}
