import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { isEmpty } from "../../../CommanFunctions/commanFunctions";
import commanService from "../../../CommanService/commanService";
import Loader from "../../../CommanUIComp/Loader/Loader";
import { sectionDetailsData } from "../../../Redux/action";
import Image from "next/image";

export default function Hero({storeData}) {

  //variable declarations
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const storeEntityIds = useSelector((state) => state.storeEntityId) || storeData;
  const sectionDetailsDatas = useSelector((state) => state.sectionDetailsData);
  const [sliderData, setSliderData] = useState([]);
  const [loader, setLoader] = useState(false);

  //Get home section details daat
  const handleGetSectionData = useCallback(() => {
    setLoader(true);
    const obj = {
      a: "getHomeSectionDetail",
      store_id: storeEntityIds.mini_program_id,
      type: "B2C",
    };
    commanService.postLaravelApi("/SectionDetail", obj).then((res) => {
      if (res.data.success === 1) {
        const data = res.data.data;
        setSliderData(data.slider_data);
        dispatch(sectionDetailsData(res?.data?.data));
        setLoader(false);
      }
    });
  }, [storeEntityIds]);

  //Call API for Get Home Section details
  useEffect(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      window.scrollTo(0, 0);
      handleGetSectionData();
    }
  }, [storeEntityIds]);

  //Dependency for Swiper
  const swiperOptions = {
    autoplay: {
      delay: 5000,
    },
    modules: [Autoplay, EffectFade, Pagination],
    slidesPerView: 1,
    effect: "fade",
    // loop: sliderData.length > 1,
    pagination: {
      el: ".slideshow-pagination",
      type: "bullets",
      clickable: true,
    },
  };

  return (
    <>
    {loader && <Loader/>}
      {sectionDetailsDatas?.slider_data?.length > 0 &&
      <Swiper
        {...swiperOptions}
        lazy={"true"}
        className="swiper-container js-swiper-slider slideshow slideshow-md swiper-container-fade swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events"
      >
        {sectionDetailsDatas?.slider_data.map((elm, i) => (
          <SwiperSlide key={i} className="swiper-slide">
            <div className="overflow-hidden position-relative h-100">
              <Link className="slideshow-bg" href={isEmpty(elm.button_link_1) ? elm.button_link_1 : isEmpty(elm.button_link_2) ? elm.button_link_2 : ""} aria-label={elm?.text || `Banner slide ${i + 1}`}>
                <Image

                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  src={elm?.slider}
                  // width={1863}
                  // height={700}
                  alt={elm?.text}
                  decoding="async"
                  placeholder="blur"
                  blurDataURL="/placeholder.jpg"
                  layout="fill"
                  objectFit="cover"
                  className="slideshow-bg__img object-fit-cover object-position-right"
                />
              </Link>
              <div className="slideshow-text container position-absolute start-50 top-50 translate-middle">
                <h3 className="text_dash text-uppercase fs-base fw-medium animate animate_fade animate_btt animate_delay-3">
                  {elm.text}
                </h3>
                <h2 className="text-uppercase h1 fw-normal mb-0 animate animate_fade animate_btt animate_delay-5">
                  {elm.text}
                </h2>
                {elm.description ? (
                  <p className="animate animate_fade animate_btt animate_delay-6">
                    {elm.description.split(" ").slice(0, 7).join(" ")}
                    <br />
                    {elm.description.split(" ").slice(7).join(" ")}
                  </p>) : ""}
                <div className="d-flex flex-wrap">
                  {isEmpty(elm.button_link_1) != "" &&
                    isEmpty(elm.button_title_1) != "" ? (
                    <Link
                      className="btn-link btn-link_sm default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                      href={elm.button_link_1} aria-label={elm?.text || `Button Link ${index + 1}`}
                    >
                      {elm.button_title_1}
                      
                    </Link>
                  ) : (
                    ""
                  )}
                  {isEmpty(elm.button_link_1) != "" &&
                    isEmpty(elm.button_link_2) != "" ? (
                    <span className="px-sm-4 text-secondary">OR</span>
                  ) : (
                    ""
                  )}
                  {isEmpty(elm.button_link_2) != "" &&
                    isEmpty(elm.button_title_2) != "" ? (
                    <Link
                      className="btn-link btn-link_sm default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7"
                      href={elm.button_link_2} aria-label={elm?.text || `Button Link 2 ${index + 1}`}
                    >
                      {elm.button_title_2}
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* <!-- /.slideshow-wrapper js-swiper-slider --> */}

        <div className="slideshow-pagination position-left-center"></div>
        {/* <!-- /.products-pagination --> */}
      </Swiper>}
    </>
  );
}
