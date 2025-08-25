/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ShareComponent({ title = "title" }) {
  const router = useRouter();
  const pathname = router.pathname;

  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = `${window.location.protocol}//${window.location.host}${pathname}`;
      setFullUrl(currentUrl);
      // console.log("currentUrl : ");
      // console.log(currentUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: fullUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      alert("Web Share API not supported in this browser.");
    }
  };
  return (
    <a href="#" onClick={shareContent} className="menu-link menu-link_us-s">
       <i className="ic_icon_sharing fs-16"></i>
      <span>Share</span>
    </a>
  );
}
