// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import { NextSeo } from "next-seo";
import { Commanservice } from "@/CommanService/commanService";

export async function getServerSideProps() {
  const origin = "https://zurah-next.vercel.app";
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

    let imageUrl = "";
    if (data?.preview_image) {
      imageUrl = data.preview_image.startsWith("http")
        ? data.preview_image
        : `${origin}${data.preview_image.startsWith("/") ? "" : "/"}${data.preview_image}`;
    } else {
      imageUrl = `${origin}/default-preview.jpg`;
    }

    return {
      props: {
        seoData: {
          title: data?.seo_titles || "Zurah Jewellery",
          description: data?.seo_description || "Default Description",
          keywords: data?.seo_keywords || "Zurah, Jewellery",
          image: imageUrl,
          url: origin,
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
          image: `${origin}/default-preview.jpg`,
          url: origin,
        },
        entityData: {},
      },
    };
  }
}

// ✅ Make sure this is default export and a valid component
export default function Home({ seoData, entityData }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (entityData && Object.keys(entityData).length > 0) {
      sessionStorage.setItem("storeData", JSON.stringify(entityData));
    }
    console.log("✅ SEO DATA:", seoData);
  }, [dispatch, entityData, seoData]);

  return (
    <>
      <NextSeo
        title={seoData.title}
        description={seoData.description}
        openGraph={{
          title: seoData.title,
          description: seoData.description,
          images: [{ url: seoData.image }],
          url: seoData.url,
        }}
      />

      {/* Actual homepage */}
      <Homes entityData={entityData} />
    </>
  );
}
