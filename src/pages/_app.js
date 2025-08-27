import Script from "next/script";
const Header1 = dynamic(() => import("@/components/headers/Header9"), { ssr: false });
const Footer1 = dynamic(() => import("@/components/footers/Footer1"), { ssr: false });
import { Provider, useDispatch, useSelector } from "react-redux";
import Store from "../Redux/store";
import { useRouter } from "next/router";

import React, {
  useEffect,
  useCallback,
  useState,
  useMemo
} from "react";
import Loader from "../CommanUIComp/Loader/Loader";
import Head from "next/head";
import { storeCurrency, storeEntityId } from "../Redux/action";
import Context from "@/context/Context";
import dynamic from "next/dynamic";


const MobileHeader = dynamic(() => import("@/components/headers/MobileHeader"), { ssr: false });
import { ToastContainer } from "react-toastify";
const MobileFooter1 = dynamic(() => import("@/components/footers/MobileFooter1"), { ssr: false });
const LoginFormPopup = dynamic(() => import("@/components/common/LoginFormPopup"), { ssr: false });

const CartDrawer = dynamic(() => import("@/components/shopCartandCheckout/CartDrawer"), { ssr: false });
const CustomerLogin = dynamic(() => import("@/components/asides/CustomerLogin"), { ssr: false });
const ShopFilter = dynamic(() => import("@/components/asides/ShopFilter"), { ssr: false });
const ProductAdditionalInformation = dynamic(() => import("@/components/asides/ProductAdditionalInformation"), { ssr: false });

// CSS Imports
import "@/assets/sass/style.scss";
import "../styles/globals.scss";


// Constants
const STORE_DOMAIN = "https://uat-direct.rpdiamondsandjewellery.com";
const MAX_RETRY_ATTEMPTS = 3;

// Dynamic imports
// const Header = dynamic(
//   () => import("@/components/HeaderFooter/Header/header"),
//   { ssr: false }
// );

function InnerApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const storeEntityIds = useSelector((state) => state?.storeEntityId);
  const [loaded, setLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);

  const isStoreDataValid = useMemo(
    () => storeEntityIds?.tenant_id,
    [storeEntityIds]
  );

  const getStoreData = useCallback(
    async (attempt = 1) => {
      try {
        const response = await fetch(
          "http://192.168.84.45/sit-ci-api/call/EmbeddedPageMaster",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              STORE_DOMAIN,
              prefer: STORE_DOMAIN,
            },
            body: JSON.stringify({
              a: "GetStoreData",
              store_domain: STORE_DOMAIN,
              SITDeveloper: "1",
            }),
            cache: "no-store",
          }
        );

        const result = await response.json();
        if (result?.success === 1) {
          const data = result?.data;
          dispatch(storeEntityId(data));
          dispatch(storeCurrency(data?.store_currency || "USD"));
          sessionStorage.setItem("storeData", JSON.stringify(data));
          setLoaded(true);
          setRetryCount(0);
        } else {
          throw new Error("Invalid store data received");
        }
      } catch (err) {
        console.error("Store data load failed:", err);
        setError(err.message);
        sessionStorage.setItem("storeData", "false");
        setLoaded(true);
      }
    },
    [dispatch]
  );
  useEffect(() => {
     let isMounted = true;
    const initializeStoreData = async () => {
      if (typeof window === "undefined") return;

      const cached = sessionStorage.getItem("storeData");
       

      if (cached && cached !== "false") {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.tenant_id) {
            dispatch(storeEntityId(parsed));
            dispatch(storeCurrency(parsed?.store_currency || "USD"));
            if (isMounted) setLoaded(true);
            return;
          }
        } catch {
          sessionStorage.removeItem("storeData");
        }
      }

      if (pageProps?.storeEntityIds?.tenant_id) {
        dispatch(storeEntityId(pageProps.storeEntityIds));
        dispatch(
          storeCurrency(pageProps.storeEntityIds?.store_currency || "USD")
        );
        sessionStorage.setItem(
          "storeData",
          JSON.stringify(pageProps.storeEntityIds)
        );
        if (isMounted) setLoaded(true);
        return;
      }

      if (isMounted) await getStoreData();
    };

    initializeStoreData();

    return () => {
      isMounted = false;
    };
  }, [pageProps?.storeEntityIds, getStoreData, dispatch]);
  if (!loaded) return <Loader />;

  if (!isStoreDataValid) {
    console.warn("⚠️ Store data is invalid or incomplete.");
  }

  return (
    <>
      {/* Scripts */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-R6XBQY8QGN"
      />
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R6XBQY8QGN');
          `,
        }}
      />
      <Script id="jquery" src="https://code.jquery.com/jquery-3.7.1.min.js" strategy="beforeInteractive" />
      <Script
        id="tangiblee"
        async
        src="https://cdn.tangiblee.com/integration/3.1/managed/www.tangiblee-integration.com/revision_1/variation_original/tangiblee-bundle.min.js"
      />
      {/* <MobileHeader /> */}
      <ToastContainer />
      <Header1 storeData={storeEntityIds} />
      <Component {...pageProps} />
      <Footer1 storeData={storeEntityIds} />
      <MobileFooter1 />
      <LoginFormPopup />
      <CartDrawer />
      <CustomerLogin />
      <ShopFilter />
      <ProductAdditionalInformation />
      <div className="page-overlay" id="pageOverlay"></div>
    </>
  );
}

function App({ Component, pageProps }) {
  // const { store } = wrapper.useWrappedStore({ pageProps });

  

  
  return (
    <Provider store={Store}>
      <Context>
        <Head>
          <title>{pageProps?.seoData?.title}</title>
          <meta name="description" content={pageProps?.seoData?.description} />
          <meta name="keywords" content={pageProps?.seoData?.keywords} />

          <meta property="og:title" content={pageProps?.seoData?.title} />
          <meta
            property="og:description"
            content={pageProps?.seoData?.description}
          />
          <meta property="og:image" content={pageProps?.seoData?.image} />
          <meta property="og:url" content={pageProps?.seoData?.url} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageProps?.seoData?.title} />
          <meta
            name="twitter:description"
            content={pageProps?.seoData?.description}
          />
          <meta name="twitter:image" content={pageProps?.seoData?.image} />
        </Head>
        <InnerApp Component={Component} pageProps={pageProps} />
      </Context>
    </Provider>
  );
}

export default App;
