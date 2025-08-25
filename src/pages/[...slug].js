import Head from "next/head";
import Terms from "@/components/otherPages/Terms";
import CertificateDiamond from "@/components/shoplist/CertificateDiamond";
import HomePageDefault from "@/components/homes/home-9/homePageDefault";

export async function getServerSideProps(context) {
  const origin = "https://uat-direct.rpdiamondsandjewellery.com";
  const slug = context.params?.slug || [];

  const getStoreData = async () => {
    const res = await fetch(
      "http://192.168.84.21/sit-ci-api/call/EmbeddedPageMaster",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", origin, prefer: origin },
        body: JSON.stringify({
          a: "GetStoreData",
          store_domain: origin,
          SITDeveloper: "1",
        }),
        cache: "no-store",
      }
    );
    const result = await res.json();
    return result?.success === 1 ? result?.data : {};
  };

  let storeEntityIds = {};
  let menuData = {};
  let matchedSeoData = null;

  // ✅ Homepage
  if (slug.length === 0 || slug[0] === "index.php") {
    storeEntityIds = await getStoreData();
    const seoData = {
      title: storeEntityIds?.seo_titles || "",
      description: storeEntityIds?.seo_description || "",
      keywords: storeEntityIds?.seo_keyword || "",
      image: storeEntityIds?.preview_image || "",
      url: origin,
    };
    return { props: { type: "home", storeEntityIds, seoData } };
  }

  // ✅ Content page
  if (!slug[0].includes("diamond") || !slug[0].includes("gemstone")) {
    storeEntityIds = await getStoreData();

    const menuRes = await fetch(
      "http://192.168.84.21:8080/api/call/ContentType",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", origin, prefer: origin },
        body: JSON.stringify({
          a: "GetContentType",
          code: slug[0].split("-"),
          store_id: storeEntityIds.mini_program_id,
          status: "1",
          per_page: "0",
          number: "0",
          type: "B2C",
        }),
      }
    );
    const menuJson = await menuRes.json();
    menuData = menuJson?.data?.[0] || {};
  }

  // ✅ Diamond certificate page
  if (slug[0].includes("diamond") || slug[0].includes("gemstone")) {
    storeEntityIds = await getStoreData();

    if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id) {
      return { notFound: true };
    }

    const menuRes = await fetch(
      "http://192.168.84.21:8080/api/call/NavigationMegamenu",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", origin, prefer: origin },
        body: JSON.stringify({
          SITDeveloper: "1",
          a: "GetHomeNavigation",
          store_id: storeEntityIds.mini_program_id,
          type: "B2C",
        }),
        cache: "no-store",
      }
    );

    const navMenuData =
      (await menuRes.json())?.data?.navigation_data || [];

    // Flatten menu
    const flatMenu = [];
    (function flatten(items) {
      items.forEach((item) => {
        flatMenu.push(item);
        if (Array.isArray(item.child)) flatten(item.child);
      });
    })(navMenuData);

    matchedSeoData =
      flatMenu.find(
        (item) =>
          item.menu_name?.replaceAll(" ", "-").toLowerCase() ===
          slug[0].toLowerCase()
      ) || {};

    menuData = {
      seo_titles: matchedSeoData.seo_titles || "",
      seo_description: matchedSeoData.seo_description || "",
      seo_keyword: matchedSeoData.seo_keyword || "",
    };
  }

  return {
    props: {
      type: slug[0].includes("diamond") || slug[0].includes("gemstone") ? "diamond" : "content",
      storeEntityIds,
      seoData: {
        title: menuData?.seo_titles ?? null,
        description: menuData?.seo_description ?? null,
        keywords: menuData?.seo_keyword ?? null,
        image: storeEntityIds?.preview_image ?? null,
        url: `${origin}/${slug[0]}`,
      },
      policyName: slug[0],
    },
  };
}

export default function DynamicPage({
  type,
  storeEntityIds,
  seoData,
  policyName,
}) {
  const SeoHead = () => (
    <Head>
      <title>{seoData?.title}</title>
      <meta name="description" content={seoData?.description} />
      <meta name="keywords" content={seoData?.keywords} />
      {type === "home" && (
        <>
          <meta property="og:title" content={seoData?.title} />
          <meta property="og:description" content={seoData?.description} />
          <meta property="og:image" content={seoData?.image} />
          <meta property="og:url" content={seoData?.url} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoData?.title} />
          <meta name="twitter:description" content={seoData?.description} />
          <meta name="twitter:image" content={seoData?.image} />
        </>
      )}
    </Head>
  );

  if (type === "home") {
    return (
      <>
        <SeoHead />
        <HomePageDefault storeEntityIds={storeEntityIds}/>
      </>
    );
  }

  if (type === "diamond") {
    return (
      <>
        <SeoHead />
        <CertificateDiamond storeEntityIds={storeEntityIds} />
      </>
    );
  }

  return (
    <>
      <SeoHead />
      <Terms
        entityData={storeEntityIds}
        seoData={seoData}
        policyName={policyName}
      />
    </>
  );
}