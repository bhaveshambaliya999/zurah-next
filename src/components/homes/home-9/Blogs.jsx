import { changeUrl } from "../../../CommanFunctions/commanFunctions";
import Loader from "../../../CommanUIComp/Loader/Loader";
import { useContextElement } from "../../../context/Context";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

export default function Blogs() {
  //State Declerations
  const dispatch = useDispatch();
  const sectionDetailsDatas = useSelector((state) => state.sectionDetailsData);

  //Dependencies for Swiper
  const swiperOptions = {
    autoplay: {
      delay: 50000000,
    },
    modules: [Autoplay],
    // slidesPerView: 3,
    // slidesPerGroup: 3,
    effect: "none",
    // loop: true,
    breakpoints: {
      320: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 14,
      },
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 30,
      },
    },
  };
  return (
    Object.keys(sectionDetailsDatas).length > 0 &&
      sectionDetailsDatas.blog_list.length > 0 ? (<section className="blog-carousel container">
        <h2 className="section-title text-uppercase fs-36 text-center mb-3 pb-2 pb-xl-3">
          Latest <span className="fw-semi-bold">Blogs</span>
        </h2>

        <div className="position-relative">
          <Swiper
            className="swiper-container js-swiper-slider"
            {...swiperOptions}
            lazy={"true"}
          >
            {Object.keys(sectionDetailsDatas).length > 0 &&
              sectionDetailsDatas.blog_list.length > 0 &&
              sectionDetailsDatas.blog_list.map((elm, i) => (
                <SwiperSlide key={i} className="swiper-slide blog-grid__item mb-0">
                  <Link
                    // href={`blog-details/${elm.unique_id}/${elm.category_id}`}
                    href={`/blog-details/${changeUrl(elm?.title)}`}
                    state={{
                      params: {
                        unique_id: elm.unique_id,
                        category_id: elm.category_id,
                      },
                    }}  aria-label={elm?.title || `Blog Link ${index + 1}`}
                  >
                    <div className="blog-grid__item-image">
                      <Image
                        src={elm.featured_image}
                        alt={elm?.title}
                        loading="lazy"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="blog-grid__item-image__img"
                      />
                    </div>
                    <div className="blog-grid__item-detail">
                      <div className="blog-grid__item-meta">
                        <span className="blog-grid__item-meta__author">
                          {elm.category_name}
                        </span>
                        <span className="blog-grid__item-meta__date">{elm.date}</span>
                      </div>
                      <div className="blog-grid__item-title mb-0 blog-title">
                        {elm.title}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}

            {/* <!-- /.swiper-wrapper --> */}
          </Swiper>
          {/* <!-- /.swiper-container js-swiper-slider --> */}
        </div>
        {/* <!-- /.position-relative --> */}
      </section>
    ) : null)
}
