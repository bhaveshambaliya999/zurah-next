/* eslint-disable react/no-unescaped-entities */
import { changeUrl, isEmpty } from "../../../CommanFunctions/commanFunctions";
import Loader from "../../../CommanUIComp/Loader/Loader";
import {
  filterData,
  filteredData,
  isFilter,
  storeItemObject,
} from "../../../Redux/action";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Products4() {

  //State Declerations
  const sectionDetailsData = useSelector((state) => state.sectionDetailsData);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading =
    Object.keys(sectionDetailsData).length > 0 ? false : true;

  //On click event for navigation
  const handleNavigate = (c) => {
    if (c.section_type === "OFFER") {
      router.push(
        `/products/${c.vertical_code}/offer/${changeUrl(
          isEmpty(c.offer_detail?.code)
        )}`
      );
    } else {
      router.push(
        `/products/${c.vertical_code}/type/${c.product_title
          .split(" ")
          .join("-")
          .toLowerCase()}`
      );
    }
  };

  //filter OFFER section type data
  const isOffer = Array.isArray(sectionDetailsData?.section_data)
    ? sectionDetailsData.section_data.flatMap((item) =>
      Array.isArray(item.sub_data)
        ? item.sub_data.filter((subItem) => subItem.section_type === "OFFER")
        : []
    )
    : [];

  return (
    isOffer.length > 0 && (
      <>
        <section className="grid-banner container">
          <div className="row">
            {Object.keys(sectionDetailsData).length > 0 &&
              sectionDetailsData.section_data.length > 0 &&
              sectionDetailsData.section_data?.map((d, index) => {
                if (d.is_group !== 1) {
                  return
                }
                return d?.sub_data?.map((c, i) => {
                   var megaMenu = JSON.parse(sessionStorage.getItem("megaMenus"))?.navigation_data?.filter((item) => item.product_vertical_name === c?.vertical_code)[0];
                  if (c?.section_type === "OFFER") {
                    return (
                      <div
                        className={`${d.sub_data.length > 3
                          ? "col-md-3"
                          : d.sub_data.length > 2
                            ? "col-md-4"
                            : d.sub_data.length > 1
                              ? "col-md-6"
                              : d.sub_data.length > 0
                                ? "col-md-12"
                                : ""
                          }`}
                        key={i}
                      >
                        {/* <div className="col-md-4" key={i}> */}
                        <div className="grid-banner__item grid-banner__item_rect position-relative mb-3 mb-md-0">
                          <div className="background-img" style={{ backgroundImage: `url(${c.banner_image})` }}
                          ></div>
                          <div className="content_abs content_bottom content_left content_bottom-lg content_left-lg">
                            <p className="text-uppercase fw-medium mb-3">
                              {c.offer_detail.name}
                            </p>
                            <h3 className="mb-3">{c.display_name}</h3>
                            <Link href={c.section_type === "OFFER"
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
                              aria-label={"Shop Now"}
                              onClick={() => {
                                dispatch(isFilter(true));
                                dispatch(filterData([]));
                                dispatch(filteredData([]));
                                dispatch(storeItemObject({}));
                              }}
                              className="btn-link default-underline text-uppercase fw-medium"
                            >Shop Now
                            </Link>
                          </div>
                          {/* <!-- /.content_abs content_bottom content_left content_bottom-md content_left-md --> */}
                        </div>
                      </div>
                    );
                  }
                });
              })}
          </div>
          {/* <!-- /.row --> */}
        </section>
      </>
    )
  );
}
