// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";

export async function getServerSideProps(context) {
  const origin = "https://zurah-next.vercel.app";
  const { Commanservice } = await import("@/CommanService/commanService");
  const commanService = new Commanservice(origin);

  let seoData = {
    title: "Zurah Jewellery",
    description: "Default Description",
    keywords: "Zurah, Jewellery",
    image: `${origin}/default-preview.jpg`,
    url: origin
  };
  let entityData = {};

  try {
    const res = await commanService.postApi(
      "/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: commanService.domain,
        SITDeveloper: "1",
      },
      {
        headers: { origin: commanService.domain }
      }
    );
    entityData = res?.data?.data || {};

    // build full image url if needed
    let imageUrl = "";
    if (entityData?.preview_image) {
      imageUrl = entityData.preview_image.startsWith("http")
        ? entityData.preview_image
        : `${origin}${entityData.preview_image.startsWith("/") ? "" : "/"}${entityData.preview_image}`;
    } else {
      imageUrl = `${origin}/default-preview.jpg`;
    }

    seoData = {
      title: entityData.seo_titles || "Zurah Jewellery",
      description: entityData.seo_description || "Default Description",
      keywords: entityData.seo_keywords || "Zurah, Jewellery",
      image: imageUrl,
      url: origin,
    };
  } catch (err) {
    console.error("Server-side fetch error:", err);
  }

  return {
    props: { seoData, entityData }
  };
}

export default function Home({ seoData, entityData }) {
  // for debugging
  // useEffect(() => {console.log({seoData}); }, [seoData]);

  return (
    <>
      <Seo
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        url={seoData.url}
      />
      <Homes entityData={entityData} />
    </>
  );
}
