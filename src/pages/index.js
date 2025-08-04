import { useEffect } from "react";
import { NextSeo } from "next-seo";
import { useDispatch } from "react-redux";
import Homes from "../components/HomePage/Home/homes";

// ✅ Server-side fetch
export async function getServerSideProps(context) {
  const origin =
    context.req.headers.origin ||
    (context.req.headers.host
      ? `https://${context.req.headers.host}`
      : "https://zurah-next.vercel.app");

  const commanService = new Commanservice(origin);

  try {
    const res = await commanService.postApi(
      "/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: commanService.domain,
        SITDeveloper: "1",
      },
      {
        headers: {
          origin: commanService.domain,
        },
      }
    );

    const data = res?.data?.data || {};

    return {
      props: {
        seoData: {
          title: data?.seo_titles || "Zurah Jewellery",
          description: data?.seo_description || "Default Description",
          keywords: data?.seo_keywords || "Zurah, Jewellery",
          image: data?.preview_image,
          url: commanService.domain,
        },
        entityData: data,
      },
    };
  } catch (err) {
    console.error("❌ Server-side fetch error:", err);
    return {
      props: {
        seoData: {
          title: "Zurah Jewellery",
          description: "Default Description",
          keywords: "Zurah, Jewellery",
          image: "https://yourdomain.com/default.jpg",
          url: commanService.domain,
        },
        entityData: {},
      },
    };
  }
}

// ✅ React Component
export default function Home({ seoData, entityData }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (entityData && Object.keys(entityData).length > 0) {
      sessionStorage.setItem("storeData", JSON.stringify(entityData));
    }
  }, [dispatch, entityData]);

  return (
    <>
      {/* ✅ Dynamic SEO */}
      <NextSeo
        title={seoData?.title}
        description={seoData?.description}
        canonical={seoData?.url}
        openGraph={{
          title: seoData?.title,
          description: seoData?.description,
          url: seoData?.url,
          images: [
            {
              url: seoData?.image,
              width: 1200,
              height: 630,
              alt: seoData?.title || "Zurah Jewellery",
              type: "image/jpeg",
            },
          ],
          site_name: "Zurah Jewellery",
        }}
      />

      {/* ✅ Page Content */}
      <Homes entityData={entityData} />
    </>
  );
}
