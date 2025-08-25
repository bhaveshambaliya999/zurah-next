import dynamic from "next/dynamic";
import Head from "next/head";
const HomePageDefault = dynamic(() => import("@/components/homes/home-9/homePageDefault"), {ssr: true,});


export async function getServerSideProps() {
  const origin = "https://uat-direct.rpdiamondsandjewellery.com";

  const response = await fetch(
    "http://192.168.84.45/sit-ci-api/call/EmbeddedPageMaster",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin,
        prefer: origin,
      },
      body: JSON.stringify({
        a: "GetStoreData",
        store_domain: origin,
        SITDeveloper: "1",
      }),
      cache: 'no-store'
    }
  );

  const result = await response.json();
  // console.log(result)
  const storeEntityIds = result?.success === 1 ? result?.data : {};
  const seoData = {
    title: storeEntityIds?.seo_titles || "",
    description: storeEntityIds?.seo_description || "",
    keywords: storeEntityIds?.seo_keyword || "",
    image: storeEntityIds?.preview_image || "",
    url: origin,
  };

  console.log(seoData,'homepage seo')
  return {
    props: {
      storeEntityIds,
      seoData,
    },
  };
}

export default function HomePage({ storeEntityIds, seoData }) {
  return (
    <>
      <Head>
        <title>{seoData?.title}</title>
        <meta name="description" content={seoData?.description} />
        <meta name="keywords" content={seoData?.keywords} />

        <meta property="og:title" content={seoData?.title} />
        <meta property="og:description" content={seoData?.description} />
        <meta property="og:image" content={seoData?.image} />
        <meta property="og:url" content={seoData?.url} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData?.title} />
        <meta name="twitter:description" content={seoData?.description} />
        <meta name="twitter:image" content={seoData?.image} />
      </Head>

      <HomePageDefault entityData={storeEntityIds} seoData={seoData} />
    </>
  );
}
