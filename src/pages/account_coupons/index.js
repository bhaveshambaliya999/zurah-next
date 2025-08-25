// pages/index.js
import Head from "next/head";
import { storeEntityId } from "@/Redux/action";
import DashboardSidebar from "@/components/otherPages/DashboardSidebar";
import AccountCoupons from "@/components/otherPages/AccountCoupons";


export async function getServerSideProps() {
  const origin = "https://uat-direct.rpdiamondsandjewellery.com";

  const response = await fetch("http://192.168.84.21/sit-ci-api/call/EmbeddedPageMaster", {
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
  });

  const result = await response.json();
  const storeEntityIds = result?.success === 1 ? result?.data : {};

  return {
    props: {
      storeEntityIds,
      seoData: {
        title: storeEntityIds?.seo_titles || "Zurah Jewellery",
        description: storeEntityIds?.seo_description || "Elegant jewellery for all occasions",
        keywords: storeEntityIds?.seo_keyword || "Zurah, Jewellery",
        image: storeEntityIds?.preview_image,
        url: origin,
      },
    },
  };
}

export default function DashboardProfile({ storeEntityIds, seoData }) {
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
        <main className="page-wrapper">
          <div className="mb-4 pb-0 pb-md-4"></div>
          <section className="my-account container">
            <h2 className="page-title">Available Coupons</h2>
            <div className="row">
              <DashboardSidebar entityData={storeEntityIds} seoData={seoData}/>
              <AccountCoupons entityData={storeEntityIds} seoData={seoData}/>
            </div>
          </section>
        </main>
        <div className="section-gap"></div>
    </>
  )
}
