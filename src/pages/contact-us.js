// pages/index.js
import Head from "next/head";
import { storeEntityId } from "@/Redux/action";
import ContactUs from "@/components/otherPages/Contact/Contact";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { isEmpty } from "@/CommanFunctions/commanFunctions";
import defaultService, { Commanservice } from "@/CommanService/commanService";

export async function getServerSideProps() {
  const origin = "https://uat-direct.rpdiamondsandjewellery.com";

  const response = await fetch("http://192.168.84.45/sit-ci-api/call/EmbeddedPageMaster", {
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
        title: storeEntityIds?.seo_titles || "",
        description: storeEntityIds?.seo_description || "",
        keywords: storeEntityIds?.seo_keyword || "",
        image: storeEntityIds?.preview_image,
        url: origin,
      },
    },
  };
}

export default function ContactPage({ storeEntityIds, seoData }) {
  const footerAllContentDatas = useSelector((state) => state.footerAllContentData);
  const [loading, setLoading] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [mapUrl, setMapUrl] = useState("");
  const [onceUpdate, setOnceUpdated] = useState(false);

 
  const contactUsData = () => {
    const obj = {
      a: "GetContactUs",
      store_id: storeEntityIds.mini_program_id,
      per_page: "0",
      number: "0",
      status: "1",
      primary: "1",
    };
    setLoading(true);
    defaultService
      .postLaravelApi("/ContactUs", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (res?.data?.data?.length > 0) {
            for (var i = 0; i < res?.data?.data.length; i++) {
              var data = res?.data?.data;
              data[i].address = data[i].building + ", " + data[i].building_name;
              if (isEmpty(data[i].building_name) !== "") {
                data[i].address = data[i].address + ", " + data[i].street;
              }
              if (isEmpty(data[i].city) != "") {
                data[i].address = data[i].address + ", " + data[i].city;
              }
              if (isEmpty(data[i].pincode) != "") {
                data[i].address = data[i].address + ", " + data[i].pincode;
              }
              data[i].address =
                data[i].address +
                ", " +
                data[i].state +
                ", " +
                data[i].country +
                ".";
            }
            setContactData(data);
            setMapUrl(data?.embed_url);
            setLoading(false);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setOnceUpdated(false);
    window.scrollTo(0, 0);
    if (onceUpdate == false) {
      contactUsData();
      // countryDrp(countryDataDrp);
    }
  }, [onceUpdate]);
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
      <ContactUs contactData={contactData} loading={loading} entityData={storeEntityIds} seoData={seoData}> </ContactUs>
    </>
  )
}
