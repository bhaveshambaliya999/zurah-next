import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  filterData,
  filteredData,
  isFilter,
  storeItemObject,
} from "../../../Redux/action";
import React from "react";
import { changeUrl, isEmpty } from "../../../CommanFunctions/commanFunctions";
import Image from "next/image";

export default function OfferSection() {

  //State Declaration
  const dispatch = useDispatch();
  // get section wise data from Redux
  const sectionDetailsDatas = useSelector((state) => state.sectionDetailsData);

  return (
    <>
      {Object.keys(sectionDetailsDatas).length > 0 &&
        sectionDetailsDatas.section_data.length > 0 &&
        sectionDetailsDatas.section_data.map((c, index) => {
           var megaMenu = JSON.parse(sessionStorage.getItem("megaMenus"))?.navigation_data?.filter((item) => item.product_vertical_name === c?.vertical_code)[0];
          if (c.is_group === 1) {
            return;
          }
          return (
            <React.Fragment key={index}>
              {c.is_group !== 1 ? (
                <>
                  {/* Deal Timer Section */}
                  {c?.section_type === "OFFER" && (
                    <section className="lookbook-products position-relative mb-3 mb-xl-5 pb-1 pb-xl-3">
                      <Link href={isEmpty(c?.product_type) !== "" ? `/products/${changeUrl(megaMenu?.menu_name)}/offer/${changeUrl(c?.product_type)}` : `/products/${c.vertical_code}`}  aria-label={c?.display_name.toUpperCase() || `Lookbook Product ${index + 1}`}>
                        <Image
                          className="w-100 h-auto"
                          loading="lazy"
                          src={c.banner_image}
                          width={1903}
                          height={709}
                          alt={c?.display_name.toUpperCase()}
                        />
                      </Link>
                      <h2 className="section-title position-absolute position-top-center fw-normal text-center" style={{ top: "12%" }}>
                        {c.display_name.toUpperCase()}
                        <br />
                        {/* <span className="h2 fw-normal">Discount 50%</span><br /> */}
                        <Link
                          href={
                            c.section_type === "OFFER"
                              ? `/products/${changeUrl(megaMenu?.menu_name)
                              }/offer/${changeUrl(
                                isEmpty(c.offer_detail?.code)
                              )}`
                              : `/products/${changeUrl(megaMenu?.menu_name)
                              }/type/${c.product_title
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`
                          }
                          className="btn_shop_now btn-link default-underline text-uppercase fw-medium mt-3"
                          aria-label={"Shop Now"}
                          onClick={() => {
                            dispatch(isFilter(true));
                            dispatch(filterData([]));
                            dispatch(filteredData([]));
                            dispatch(storeItemObject({}));
                          }}
                        >
                          Shop Now
                        </Link>
                      </h2>
                    </section>)}
                </>) : ("")}
            </React.Fragment>)
        }
        )}
    </>
  )
}