// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeEntityId } from "@/Redux/action";
import { Commanservice } from "@/CommanService/commanService";

export async function getServerSideProps(context) {
  const userAgent = context.req.headers['user-agent'] || "";

  const isBot = /bot|crawl|spider|slurp|facebook|twitter|whatsapp|linkedin|embed|telegram/i.test(userAgent);

  const origin = context.req.headers.origin ||
    (context.req.headers.host
      ? `https://${context.req.headers.host}`
      : "https://zurah-next.vercel.app");

  const commanService = new Commanservice(origin);

  try {
    const res = await commanService.postApi("/EmbeddedPageMaster", {
      a: "GetStoreData",
      store_domain: commanService.domain,
      SITDeveloper: "1",
    });

    const data = res?.data?.data || {};

    // 💥 Return full meta data only for bots
    if (isBot) {
      return {
        props: {
          seoData: {
            title: data?.seo_titles || "Zurah Jewellery",
            description: data?.seo_description || "Default Description",
            keywords: data?.seo_keywords || "Zurah, Jewellery",
            image: data?.preview_image || "",
            url: commanService.domain,
          },
          entityData: data,
        },
      };
    }

    // For normal users, return minimal
    return {
      props: {
        seoData: {},
        entityData: data,
      },
    };
  } catch (err) {
    console.error("❌ Server-side fetch error:", err);
    return {
      props: {
        seoData: {},
        entityData: {},
      },
    };
  }
}