import Products1 from "../home-1/Products1";
import Products2 from "../home-1/Products2";
import Products4 from "../home-1/Products4";
import Blogs from "./Blogs";
import Hero from "./Hero";
import Instagram from "./Instagram";
import Lookbook from "./Lookbook";
import OfferSection from "./OfferSection";

export default function HomePageDefault ({storeEntityIds}) {
    return(
     <main className="page-wrapper">
        {/* Slider section */}
        <Hero storeData={storeEntityIds}/>
        {/* Spacing between Slider section and collection section */}
        <div className="section-gap-20"></div>
        {/* Collection section */}
        <Products1 />
        {/* View Best selling Products section */}
        <Products2 />
        <div className="section-gap"></div>
        {/* New arrival section */}
        <Lookbook />
        {/* Offer section with Group*/}
        <Products4 />
        {/* Offer section without group */}
        <OfferSection />
        <div className="section-gap"></div>
        {/* Blog section */}
        <Blogs />
        <div className="section-gap"></div>
        {/* Journey section */}
        <Instagram />
        <div className="section-gap"></div>
        {/* Service promotion section */}
        {/* <Features /> */}
      </main>
    )
}