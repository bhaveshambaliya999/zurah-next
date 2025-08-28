import { isEmpty } from "@/CommanFunctions/commanFunctions";
import { useContextElement } from "@/context/Context";
import { stepperCompletedPage } from "@/Redux/action";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function OrderCompleted() {
  const { cartProducts, totalPrice } = useContextElement();
  const [showDate, setShowDate] = useState(false);
  useEffect(() => {
    setShowDate(true);
  }, []);

  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(stepperCompletedPage(1));
    if (
      params.succesOrderId !== "CancelTransaction" &&
      params.succesOrderId !== "CancelOrder"
    ) {
      setTimeout(() => {
        var url = "/account_orders/" + params.succesOrderId;
        navigate(url);
      }, 4000);
    }
  }, []);

  return (
    <React.Fragment>
      {isEmpty(params.succesOrderId) === "CancelTransaction" || isEmpty(params.succesOrderId) === "CancelOrder" ? (
        <div className="order-complete gap-2">
          {params.succesOrderId === "CancelTransaction" &&
          params.succesOrderId === "CancelOrder" ? (
            <img
              src={
                "https://i0.wp.com/css-tricks.com/wp-content/uploads/2020/01/timer-progress-animated.gif?ssl=1"
              }
            />
          ) : (
            <div className="d-flex justify-content-center">
              <img
                src="/assets/images/img-payment-fail.png"
                alt=""
                className="img-fluid"
              />
            </div>
          )}
          <div className="row">
            <div className="col-12 faildTransaction">
              <p className="text-center text-muted">Payment Failed</p>

              <div className="text-center d-flex justify-content-center gap-5">
                <Link
                  href={
                    params.succesOrderId !== "CancelTransaction" &&
                    params.succesOrderId !== "CancelOrder"
                      ? ``
                      : `/`
                  }
                  className="d-block"
                >
                  <button className="btn btn-primary fs-15px">
                    Continue Shopping
                  </button>
                </Link>
                <Link
                  href={
                    params.succesOrderId !== "CancelTransaction" &&
                    params.succesOrderId !== "CancelOrder"
                      ? ``
                      : `/account_orders`
                  }
                  className="d-block"
                >
                  <button className="btn btn-primary fs-15px ">
                    Open Order
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="order-complete">
          <div className="order-complete__message">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="40" cy="40" r="40" fill="#B9A16B" />
              <path
                d="M52.9743 35.7612C52.9743 35.3426 52.8069 34.9241 52.5056 34.6228L50.2288 32.346C49.9275 32.0446 49.5089 31.8772 49.0904 31.8772C48.6719 31.8772 48.2533 32.0446 47.952 32.346L36.9699 43.3449L32.048 38.4062C31.7467 38.1049 31.3281 37.9375 30.9096 37.9375C30.4911 37.9375 30.0725 38.1049 29.7712 38.4062L27.4944 40.683C27.1931 40.9844 27.0257 41.4029 27.0257 41.8214C27.0257 42.24 27.1931 42.6585 27.4944 42.9598L33.5547 49.0201L35.8315 51.2969C36.1328 51.5982 36.5513 51.7656 36.9699 51.7656C37.3884 51.7656 37.8069 51.5982 38.1083 51.2969L40.385 49.0201L52.5056 36.8996C52.8069 36.5982 52.9743 36.1797 52.9743 35.7612Z"
                fill="white"
              />
            </svg>
            <h3>Your order is completed!</h3>
            <p>Thank you. Your order has been received.</p>
          </div>
        </div>
      )}{" "}
    </React.Fragment>
  );
}
