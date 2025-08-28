

import { useState } from "react";
import Loader from "../../../CommanUIComp/Loader/Loader";
import { servicePromotions } from "../../../data/features";

export default function Features() {
  const [loader, setLoader] = useState(false);
  const isLoading = servicePromotions?.length > 0 ? false : true;
  return isLoading ? (
    <Loader />
  ) : (
    <section className="service-promotion horizontal pb-0">
      <div className="row">
        {servicePromotions.map((elm, i) => (
          <div key={i} className="col-md-4 mb-5 d-flex align-items-center justify-content-center gap-3">
            <div className="service-promotion__icon">
              <i className={elm.icon} aria-hidden="true"></i>
            </div>
            <div className="service-promotion__content-wrap">
              <h3 className="service-promotion__title h6 text-uppercase mb-1">
                {elm.title}
              </h3>
              <p className="service-promotion__content text-light1 mb-0">
                {elm.content}
              </p>
              </div>
          </div>
        ))}
      </div>
    </section>
  );
}
