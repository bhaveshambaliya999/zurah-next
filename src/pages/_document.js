import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Font Preloads */}
        <link
          rel="preload"
          href="/assets/fonts/jost/Jost-Medium.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/jost/Jost-Bold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/jost/Jost-Regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/jost/Jost-SemiBold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/zurah-icon.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* SEO */}
        <meta name="robots" content="index,follow" />
        <Script id="jquery" src="https://code.jquery.com/jquery-3.7.1.min.js" strategy="beforeInteractive" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
