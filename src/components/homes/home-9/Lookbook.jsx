import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../CommanUIComp/Loader/Loader";
import {
  filterData,
  filteredData,
  isFilter,
  storeItemObject,
} from "../../../Redux/action";
import React from "react";
import { changeUrl, isEmpty } from "../../../CommanFunctions/commanFunctions";
import Image from "next/image";

export default function Lookbook() {

  //state Declerations
  const sectionDetailsDatas = useSelector((state) => state.sectionDetailsData);
  const dispatch = useDispatch();
  const isLoading =
    Object.keys(sectionDetailsDatas).length > 0 ? false : true;

  return (
    <>
      {Object.keys(sectionDetailsDatas).length > 0 &&
        sectionDetailsDatas.section_data.length > 0 &&
        sectionDetailsDatas.section_data.map((c, index) => {
          var megaMenu = JSON.parse(sessionStorage.getItem("megaMenus"))?.navigation_data?.filter((item) => item.product_vertical_name === c?.vertical_code)[0];
          return (
            <React.Fragment key={index}>
              {c.is_group === 0 ? (
                <>
                  {/* Deal Timer Section */}
                  {c?.section_type === "COLLECTION" && (
                    <section className="lookbook-products position-relative">
                      <Link
                        href={isEmpty(c?.product_title) !== "" ? `/products/${changeUrl(megaMenu?.menu_name)
                          }/collection/${changeUrl(c?.product_title)}` : `/products/${changeUrl(megaMenu?.menu_name)}`}
                          aria-label={c?.display_name.toUpperCase() || `Lookbook Product ${index + 1}`}
                      >
                        <Image
                          className="lookbook-img"
                          loading="lazy"
                          src={c.banner_image}
                          width={1903}
                          height={709}
                          alt={c.display_name.toUpperCase() || `Lookbook Product ${index + 1}`}
                        />
                      </Link>
                      <div
                        className="section-title text-center"
                      >
                        <h2>{c.display_name.toUpperCase()}</h2>
                        <div className="description" dangerouslySetInnerHTML={{ __html: c.description }} />

                        {/* <span className="h2 fw-normal">Discount 50%</span><br /> */}
                        <Link
                          href={isEmpty(c?.product_title) !== "" ? `/products/${changeUrl(megaMenu?.menu_name)
                            }/collection/${changeUrl(c?.product_title)}` : `/products/${changeUrl(megaMenu?.menu_name)}`}
                          className="btn btn-outline-primary text-uppercase fw-medium mt-3" aria-label={"Shop Now"}
                          onClick={() => {
                            dispatch(isFilter(true));
                            dispatch(filterData([]));
                            dispatch(filteredData([]));
                            dispatch(storeItemObject({}));
                          }}> 
                          Shop Now
                        </Link>
                      </div>
                    </section>)}
                </>) : ("")}
            </React.Fragment>
          )
        })}
        <div className="section-gap"></div>
    </>
  )
}