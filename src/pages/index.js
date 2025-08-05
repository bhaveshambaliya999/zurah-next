// pages/index.js
import Homes from "@/components/HomePage/Home/homes";
import Seo from "@/components/SEO/seo";
import { useEffect } from "react";
import Head from "next/head";

export async function getServerSideProps() {
  // simulates SEO data from server
  return {
    props: {
      seo: {
        title: "Zurah Jewellery",
        description: "The best jewellery in town, shop exclusive collections.",
        keywords: "Zurah, Jewellery, Diamonds",
        image: "https://zurah-next.vercel.app/default-preview.jpg",
        url: "https://zurah-next.vercel.app",
      }
    }
  }
}

export default function Home({ seo }) {
  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.image} />
        <meta property="og:url" content={seo.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.image} />
      </Head>
      <main>
        <h1>Hello Zurah World!</h1>
      </main>
    </>
  )
}
