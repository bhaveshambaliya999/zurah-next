import { Link } from "react-router-dom";
import CountDownComponent from "@/components/common/CountDownComponent";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/CommanUIComp/Loader/Loader";
import {
  filterData,
  filteredData,
  isFilter,
  storeItemObject,
} from "@/Redux/action";
import React from "react";

export default function Products3() {
  const sectionDetailsDatas = useSelector((state) => state.sectionDetailsData);
  const dispatch = useDispatch();
  const isLoading =
    Object.keys(sectionDetailsDatas).length > 0 ? false : true;
  return (
    Object.keys(sectionDetailsDatas).length > 0 &&
    sectionDetailsDatas.section_data.length > 0 &&
    sectionDetailsDatas.section_data.map((c, index) => (
      <React.Fragment key={index}>
        {c.position > 2 ? (
          <>
            {/* Deal Timer Section */}
            {c.is_group !== 1 && c?.section_type === "COLLECTION" && (
              <div className="d-flex flex-column" >
                <section
                  className="deal-timer position-relative d-flex align-items-end overflow-hidden"
                  style={{
                    backgroundColor: "#ebebeb",
                    backgroundSize: "1399.200px",
                    backgroundRepeat: "no-repeat",
                    // height: "600px",
                  }}
                >
                  <div
                    className="background-img"
                    style={{
                      backgroundImage: `url(${c.banner_image})`,
                    }}
                  ></div>

                  <div className="deal-timer-wrapper container position-relative">
                    <div className="deal-timer__content pb-2 mb-3 pb-xl-5 mb-xl-3 mb-xxl-5">
                      {/* <p className="text_dash text-uppercase text-red fw-medium">
                        Deal of the week
                      </p> */}
                      <h3 className="h1 text-uppercase">
                        <strong>
                          {c.display_name?.replace("Collection", "")}
                        </strong>{" "}
                        Collection
                      </h3>
                      <Link
                        href={`/products/${c.vertical_code}/type/${c.product_title
                          ?.split(" ")
                          .join("-")
                          .toLowerCase()}`}
                        className="btn-link default-underline text-uppercase fw-medium mt-3"
                        onClick={() => {
                          dispatch(isFilter(true));
                          dispatch(filterData([]));
                          dispatch(filteredData([]));
                          dispatch(storeItemObject({}));
                        }}
                      >
                        Shop Now
                      </Link>
                    </div>

                    <div className="position-relative d-flex align-items-center text-center pt-xxl-4 js-countdown">
                      <CountDownComponent />
                    </div>
                  </div>
                </section>
                <div className="mb-3 mb-xl-5 pb-1 pb-xl-5 0000"></div>
              </div>
            )}
            {/* Collections Grid Section */}
            {c.is_group === 1 && (
              <>
                {/* <div className="mb-3 mb-xl-5 pb-1 pb-xl-5"></div> */}
                <section className="grid-banner container">
                  <div className="row">
                    {c?.sub_data?.length > 0 &&
                      c.sub_data.map((item, i) => {
                        if (item?.section_type === "COLLECTION") {
                          return (
                            <div
                              className={`mb-3 mb-xl-5 pb-1 pb-xl-5 ${c?.sub_data?.length > 3
                                ? "col-md-3"
                                : c?.sub_data?.length > 2
                                  ? "col-md-4"
                                  : c?.sub_data?.length > 1
                                    ? "col-md-6"
                                    : c?.sub_data?.length > 0
                                      ? "col-md-12"
                                      : ""
                                }`}
                              key={i}
                            >
                              <div className="grid-banner__item grid-banner__item_rect position-relative ">
                                <div
                                  className="background-img"
                                  style={{
                                    backgroundImage: `url(${item.banner_image})`,
                                  }}
                                ></div>
                                <div className="content_abs content_bottom content_left content_bottom-lg content_left-lg">
                                  <p
                                    className="text-uppercase fw-medium mb-3"
                                    dangerouslySetInnerHTML={{
                                      __html: item.description,
                                    }}
                                  ></p>
                                  <h3 className="mb-3">{item.display_name}</h3>
                                  <Link
                                    href={`/products/${item.vertical_code
                                      }/type/${item?.collection_name
                                        ?.split(" ")
                                        ?.join("-")
                                        ?.toLowerCase()}`}
                                    onClick={() => {
                                      dispatch(isFilter(true));
                                      dispatch(filterData([]));
                                      dispatch(filteredData([]));
                                      dispatch(storeItemObject({}));
                                    }}
                                    className="btn-link default-underline text-uppercase fw-medium"
                                  >
                                    Shop Now
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null; // Return null to avoid rendering unnecessary elements
                      })}
                  </div>
                  {/* <div className="mb-3 mb-xl-5 pb-1 pb-xl-5"></div> */}
                </section>
              </>
            )}
          </>
        ) : (
          ""
        )}
      </React.Fragment>
    ))
  );
}
