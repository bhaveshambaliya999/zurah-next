import { domain } from "@/CommanService/commanService";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";

const SeoMeta = ({ title, description, keywords, image, url }) => {

    //variable declerations
    const params = useParams();
    const canonicalUrl = url ?? (typeof window !== "undefined" ? window.location.href : domain);
    var megaMenu = JSON.parse(sessionStorage.getItem("megaMenus"))?.navigation_data?.filter((item) => item.menu_name?.replaceAll(" ", "-")?.toLowerCase() === (params.verticalCode?.toLowerCase() ?? "make your customization"))[0] ?? JSON.parse(sessionStorage.getItem("storeNavData"));

    //Schema for application/ld+json
    const schema = {
        "@context": "https://schema.org",
        "@type": "Website",
        name: title || megaMenu?.menu_name || megaMenu?.seo_titles,
        description: description || megaMenu?.seo_description,
        url: url,
        image: [image],
    }

    return (
        <HelmetProvider>
            <Helmet>
                <title>{title || megaMenu?.menu_name || megaMenu?.seo_titles}</title>
                <meta name="description" content={description || megaMenu?.seo_description} />
                <meta name="keywords" content={keywords || megaMenu?.seo_keyword} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title || megaMenu?.menu_name || megaMenu?.seo_titles} />
                <meta property="og:description" content={description || megaMenu?.seo_description} />
                {image && <meta property="og:image" content={image} />}
                {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content={domain} />
                <meta property="twitter:url" content={url} />
                <meta name="twitter:title" content={title || megaMenu?.menu_name || megaMenu?.seo_titles} />
                <meta name="twitter:description" content={description || megaMenu?.seo_description} />
                {image && <meta name="twitter:image" content={image} />}

                <link rel="canonical" href={domain} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}></script>
            </Helmet>
        </HelmetProvider>
    );
};

export default SeoMeta;
