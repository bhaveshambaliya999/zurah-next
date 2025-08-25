
import SingleProduct12 from "@/components/singleProduct/SingleProduct12";
import Head from "next/head";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { slug = [] } = context.params;
  const verticalCode = slug[0] || null;
  const variantId = slug[slug.length - 1]?.split("-").pop()?.toUpperCase() || null;
  const origin = "https://uat-direct.rpdiamondsandjewellery.com";

  let storeEntityIds = {};
  let menuData = [];
  let detailPageData = [];
  let matchedSeoData = null;

  try {
    // Get Store Data
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
    storeEntityIds = result?.success === 1 ? result?.data : {};
    if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id) {
      return { notFound: true };
    }

    // Get Menu Navigation Data
    const menuRes = await fetch(
      "http://192.168.84.21:8080/api/call/NavigationMegamenu",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin,
          prefer: origin,
        },
        body: JSON.stringify({
          SITDeveloper: "1",
          a: "GetHomeNavigation",
          store_id: storeEntityIds.mini_program_id,
          type: "B2C",
        }),
        cache: 'no-store'
      }
    );
    const menuDatas = await menuRes.json();
    menuData = menuDatas?.data?.navigation_data || [];

    // Flatten & Match SEO item
    const flatMenu = [];
    function flattenMenu(items) {
      items.forEach((item) => {
        flatMenu.push(item);
        if (Array.isArray(item.child)) flattenMenu(item.child);
      });
    }
    flattenMenu(menuData);

    matchedSeoData = flatMenu.find(
      (item) =>
        item.menu_name?.replaceAll(" ", "-").toLowerCase() ===
        verticalCode?.toLowerCase()
    ) || null;

    // Get product detail page data if PV variant
    if (slug?.length > 0 && variantId?.includes("PV")) {
      const singleProductDetailData = await fetch(
        "http://192.168.84.45/sit-ci-api/call/EmbeddedPageMaster",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            origin,
            prefer: origin,
          },
          body: JSON.stringify({
            SITDeveloper: "1",
            a: "GetItemWiseSEO",
            tenant_id: storeEntityIds.tenant_id,
            entity_id: storeEntityIds.entity_id,
            miniprogram_id: storeEntityIds.mini_program_id,
            pv_unique_id: variantId,
            type: "B2C",
          }),
          cache: 'no-store'
        }
      );
      const detailData = await singleProductDetailData.json();
      detailPageData = detailData?.data || {};
    }
  } catch (error) {
    console.error("SSR Error:", error.message);
  }

  const seoData = {
    title: matchedSeoData?.seo_titles || "",
    description: matchedSeoData?.seo_description || "",
    keywords: matchedSeoData?.seo_keyword || "",
    image: storeEntityIds?.preview_image || "",
    url: `${origin}/products/${slug[0] || ""}`,
  };

  const seoDataforDetailsPage = {
    title:
      detailPageData?.seo_titles ||
      slug[1]?.split("pv")[0]?.replaceAll("-", " ").toUpperCase() ||
      "",
    description: detailPageData?.seo_description || "",
    keywords: detailPageData?.seo_keyword || "",
    image: detailPageData?.preview_image || storeEntityIds?.preview_image,
    url: `${origin}/products/${slug[0] || ""}/${slug[1] || ""}`,
  };

  return {
    props: {
      seoData,
      seoDataforDetailsPage,
      entityData: {
        storeEntityIds: storeEntityIds || {},
        seoData,
        seoDataforDetailsPage,
        verticalCode: verticalCode || null, // ✅ no undefined
      },
      slug: slug || [],
    },
  };
}


export default function ProductsPage({
  entityData,
  slug = [],
  seoDataforDetailsPage,
  seoData,
}) {
  const router = useRouter();
  const currentSlug = slug.length > 0 ? slug : router.query.slug || [];
  if (currentSlug.length === 1) {
    // /products/:verticalCode
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
        <SingleProduct12
          variantId={currentSlug[0]}
          storeEntityIds={entityData.storeEntityIds}
        />
      </>
    );
  }

  return;
}
