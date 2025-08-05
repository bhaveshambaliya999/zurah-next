// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import { Commanservice } from "@/CommanService/commanService";

export async function getServerSideProps(context) {
  const origin = "https://zurah-next.vercel.app"; // Your frontend domain
  const commanService = new Commanservice(origin);

  try {
    const res = await commanService.postApi(
      "/EmbeddedPageMaster",
      {
        a: "GetStoreData",
        store_domain: commanService.domain,
        SITDeveloper: "1",
      },
      { next: { revalidate: 3600 } }
    );

    const data = res?.data?.data || {};

    // ✅ Ensure image is a full valid URL
    let imageUrl = "";
    if (data?.preview_image) {
      imageUrl = data.preview_image.startsWith("http")
        ? data.preview_image
        : `${origin}${data.preview_image.startsWith("/") ? "" : "/"}${data.preview_image}`;
    } else {
      imageUrl = `${origin}/default-preview.jpg`; // ✅ fallback image
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

export default function Home({ seoData, entityData }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (entityData && Object.keys(entityData).length > 0) {
      // dispatch(storeEntityId(entityData));
      sessionStorage.setItem("storeData", JSON.stringify(entityData));
    }

    // ✅ Debug log
    console.log("✅ SEO DATA:", seoData);
  }, [dispatch, entityData, seoData]);

  return (
    <>
      <Seo
        title={seoData?.title}
        description={seoData?.description}
        keywords={seoData?.keywords}
        image={seoData?.image}
        url={seoData?.url}
      />
      <Homes entityData={entityData} />
    </>
  );
}
