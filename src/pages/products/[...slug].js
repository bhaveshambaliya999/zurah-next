import Shop1 from "@/components/shoplist/Shop1";
import SingleProduct12 from "@/components/singleProduct/SingleProduct12";

import Head from "next/head";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  let { slug = [] } = context.params;
  let variantId =
    slug[slug.length - 1]?.split("-").pop()?.toUpperCase() || null;
  let verticalCode = slug[0] || null;
  let origin = "https://uat-direct.rpdiamondsandjewellery.com";

  let storeEntityIds = {};
  let seoData = {};
  let seoDataforDetailsPage = {};

  try {
    // 1️⃣ Fetch store data
    const storeRes = await fetch(
      "http://192.168.84.28/sit-ci-api/call/EmbeddedPageMaster",
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
    const storeResult = await storeRes.json();
    storeEntityIds = storeResult?.success === 1 ? storeResult?.data : {};
    if (!storeEntityIds?.secret_key || !storeEntityIds?.tenant_id)
      return { notFound: true };

    // 2️⃣ Fetch PV variant SEO if slug.length > 1
    if (slug.length > 1 && variantId?.includes("PV")) {
      const productRes = await fetch(
        "http://192.168.84.28/sit-ci-api/call/EmbeddedPageMaster",
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
          cache: "no-store",
        }
      );
      const detailData = await productRes.json();
      const matchedSeo = detailData?.data || {};

      console.log(matchedSeo);
      seoDataforDetailsPage = {
        title:
          matchedSeo?.seo_titles ||
          slug[1]?.split("pv")[0]?.replaceAll("-", " ").toUpperCase() ||
          "",
        description: matchedSeo?.seo_description || "",
        keywords: matchedSeo?.seo_keyword || "",
        image: matchedSeo?.image || storeEntityIds?.preview_image,
        url: `${origin}/products/${slug[0]}/${slug[1]}`,
      };
      console.log(seoDataforDetailsPage);
    } else {
      // 3️⃣ Fetch vertical/category SEO if slug.length === 1
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
          cache: "no-store",
        }
      );

      const menuData = (await menuRes.json())?.data?.navigation_data || [];
      const flatMenu = [];
      const flattenMenu = (items) =>
        items.forEach((item) => {
          flatMenu.push(item);
          if (Array.isArray(item.child)) flattenMenu(item.child);
        });
      flattenMenu(menuData);

      const matchedSeo =
        flatMenu.find(
          (item) =>
            item.menu_name?.replaceAll(" ", "-").toLowerCase() ===
            verticalCode?.toLowerCase()
        ) || null;

      seoData = {
        title: matchedSeo?.seo_titles || "",
        description: matchedSeo?.seo_description || "",
        keywords: matchedSeo?.seo_keyword || "",
        image: storeEntityIds?.preview_image || "",
        url: `${origin}/products/${slug[0]}`,
      };
    }
  } catch (error) {
    console.error("SSR Error:", error.message);
  }

  return {
    props: {
      seoData,
      seoDataforDetailsPage,
      entityData: {
        storeEntityIds,
        seoData,
        seoDataforDetailsPage,
        verticalCode,
      },
      slug,
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
    return (
      <>
        <Head>
          <title>{seoData?.title}</title>
          <meta name="description" content={seoData?.description} />
          <meta name="keywords" content={seoData?.keywords} />

          <meta property="og:title" content={seoData?.title} />
          <meta
            property="og:description"
            content={seoData?.description}
          />
          <meta property="og:image" content={seoData?.image} />
          <meta property="og:url" content={seoData?.url} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoData?.title} />
          <meta
            name="twitter:description"
            content={seoData?.description}
          />
          <meta name="twitter:image" content={seoData?.image} />
        </Head>
        <Shop1
          verticalCode={currentSlug[0]}
          storeEntityIds={entityData.storeEntityIds}
        />
      </>
    );
  }

  if (currentSlug.length === 2) {
    return (
      <>
        <Head>
          <title>{seoDataforDetailsPage?.title}</title>
          <meta
            name="description"
            content={seoDataforDetailsPage?.description}
          />
          <meta
            name="keywords"
            content={seoDataforDetailsPage?.keywords}
          />

          <meta
            property="og:title"
            content={seoDataforDetailsPage?.title}
          />
          <meta
            property="og:description"
            content={seoDataforDetailsPage?.description}
          />
          <meta
            property="og:image"
            content={seoDataforDetailsPage?.image}
          />
          <meta
            property="og:url"
            content={seoDataforDetailsPage?.url}
          />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={seoDataforDetailsPage?.title}
          />
          <meta
            name="twitter:description"
            content={seoDataforDetailsPage?.description}
          />
          <meta
            name="twitter:image"
            content={seoDataforDetailsPage?.image}
          />
        </Head>
        <SingleProduct12
          verticalCode={currentSlug[0]}
          variantId={currentSlug[1]}
        />
      </>
    );
  }

  if (currentSlug.length === 3) {
    return (
      <>
        <Head>
          <title>{seoData?.title}</title>
          <meta name="description" content={seoData?.description} />
          <meta name="keywords" content={seoData?.keywords} />

          <meta property="og:title" content={seoData?.title} />
          <meta
            property="og:description"
            content={seoData?.description}
          />
          <meta property="og:image" content={seoData?.image} />
          <meta property="og:url" content={seoData?.url} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoData?.title} />
          <meta
            name="twitter:description"
            content={seoData?.description}
          />
          <meta name="twitter:image" content={seoData?.image} />
        </Head>
        <Shop1
          verticalCode={currentSlug[0]}
          storeEntityIds={entityData.storeEntityIds}
        />
      </>
    );
  }

  if (currentSlug.length === 4) {
    return (
      <>
        <Head>
          <title>{seoDataforDetailsPage?.title}</title>
          <meta
            name="description"
            content={seoDataforDetailsPage?.description}
          />
          <meta
            name="keywords"
            content={seoDataforDetailsPage?.keywords}
          />

          <meta
            property="og:title"
            content={seoDataforDetailsPage?.title}
          />
          <meta
            property="og:description"
            content={seoDataforDetailsPage?.description}
          />
          <meta
            property="og:image"
            content={seoDataforDetailsPage?.image}
          />
          <meta
            property="og:url"
            content={seoDataforDetailsPage?.url}
          />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={seoDataforDetailsPage?.title}
          />
          <meta
            name="twitter:description"
            content={seoDataforDetailsPage?.description}
          />
          <meta
            name="twitter:image"
            content={seoDataforDetailsPage?.image}
          />
        </Head>
        <SingleProduct12
          verticalCode={currentSlug[0]}
          variantId={currentSlug[1]}
        />
      </>
    );
  }

  return;
}
