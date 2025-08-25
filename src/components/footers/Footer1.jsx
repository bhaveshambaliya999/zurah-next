import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import commanService from "../../CommanService/commanService";
import {
  footerAllContentData,
  isLoginModal,
  isRegisterModal,
  socialUrlData,
  storeCurrency,
} from "../../Redux/action";
import Loader from "../../CommanUIComp/Loader/Loader";
import { toast } from "react-toastify";
import { isEmpty, RandomId } from "../../CommanFunctions/commanFunctions";
import Features from "../common/features/Features";
import Image from "next/image";
// import paymentGateways from "../../assets/images/payment-options.png";
import { FormSelect } from "react-bootstrap"

export default function Footer1() {
 //State Declerations
  const loginDatas = useSelector((state) => state.loginData);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const storeCurrencys = useSelector((state) => state.storeCurrency);
  const storeCurrencyDatas = useSelector((state) => state.storeCurrencyData);

  const isLogin = Object.keys(loginDatas).length > 0;

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [loader, setLoader] = useState(false);

  // Tost Msg
  const [toastShow, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Footer Active
  const [FooterActive, setFooterActive] = useState("");

  // Footer Data
  const [footerLogo, setFooterLogo] = useState([]);
  const [footerContent, setFooterContent] = useState([]);
  const [footerSocialLink, setfooterSocialLink] = useState([]);
  const [footerContact, setFooterContact] = useState([]);

  // Form email
  const [email, setEmail] = useState("");

  //Get Home Footer Details Data
  const footerData = useCallback(
    (data) => {
      setLoader(true);
      const obj = {
        a: "getHomeFooterDetail",
        store_id: data.mini_program_id,
        user_id:
          Object.keys(loginDatas).length > 0
            ? loginDatas.member_id
            : RandomId,
        type: "B2C",
      };
      commanService
        .postLaravelApi("/SectionDetail", obj)
        .then((res) => {
          if (res["data"]["success"] === 1) {
            setFooterContent([]);
             dispatch(footerAllContentData([]))
            const footerData = res["data"]["data"];
            if (Object.keys(footerData).length > 0) {
              const footerLogo = footerData?.logo_data;
              const footerContentData = footerData?.content_data;
              const footerSocialData = footerData?.socialmedia_link;
              const footerContact = footerData?.contact_data;
              if (footerLogo.length > 0) {
                setFooterLogo(footerLogo);
              }

              setFooterContent(footerContentData);
               dispatch(footerAllContentData(footerContentData))
              if (footerSocialData.length > 0) {
                setfooterSocialLink(footerSocialData);
                dispatch(socialUrlData(footerSocialData));
              }
              if (footerContact.length > 0) {
                footerContact[0]["address"] = footerContact[0]["building"];
                if (footerContact[0]["building_name"] != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    ", " +
                    footerContact[0]["building_name"];
                }
                footerContact[0]["address"] =
                  footerContact[0]["address"] +
                  ", " +
                  footerContact[0]["street"];
                // if (footerContact[0]["description"] != "") {
                //   footerContact[0]["address"] =
                //     footerContact[0]["address"] +
                //     ", " +
                //     footerContact[0]["description"];
                // }
                if (footerContact[0]["city_name"] != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    ", " +
                    footerContact[0]["city_name"];
                }
                if (footerContact[0]["pincode"] != "") {
                  footerContact[0]["address"] =
                    footerContact[0]["address"] +
                    "-" +
                    footerContact[0]["pincode"];
                }
                footerContact[0]["address"] =
                  footerContact[0]["address"] +
                  ", " +
                  footerContact[0]["state_name"] +
                  ", " +
                  footerContact[0]["country_name"] +
                  ".";
                setFooterContact(footerContact);

              }
            } else {
              let arr = [];
              arr.push(
                { code: "blog", name: "Blog" },
                { code: "about-us", name: "About Us" },
                { code: "contact-us", name: "Contact Us" }
              );
              setFooterContent(arr);
            }
            setLoader(false);
          } else {
            let arr = [];
            arr.push(
              { code: "blog", name: "Blog" },
              { code: "about-us", name: "About Us" },
              { code: "contact-us", name: "Contact Us" }
            );
            setFooterContent(arr);
            setLoader(false);
          }
        })
        .catch(() => {
          let arr = [];
          arr.push(
            { code: "blog", name: "Blog" },
            { code: "about-us", name: "About Us" },
            { code: "contact-us", name: "Contact Us" }
          );
          setFooterContent(arr);
          setLoader(false);
        });
    },
    [loginDatas, dispatch]
  );

  //call of function of footerData
  useEffect(() => {
    const data = storeEntityIds;
    if (Object.keys(data).length > 0) {
      footerData(data);
      setFooterContent([]);
    }
  }, [storeEntityIds, loginDatas, storeCurrencyDatas]);

  //Update currency
  const updateCartCurrency = (e) => {
    const obj = {
      a: "updateCartCurrency",
      store_id: storeEntityIds.mini_program_id,
      member_id:
        Object.keys(loginDatas).length > 0
          ? loginDatas.member_id
          : RandomId,
      new_currency: e,
    };
    commanService
      .postLaravelApi("/CartMaster ", obj)
      .then((res) => {
        if (res.data.success === 1) {
          if (pathname.includes("/start-with-a-item")) {
            dispatch(storeEmbossingData([]));
            dispatch(saveEmbossings(false));
            dispatch(previewImageDatas([]));
            dispatch(activeImageData([]));
            dispatch(engravingObj({}))
            dispatch(DiySteperData([]))
            dispatch(ActiveStepsDiy(0));
            sessionStorage.removeItem("DIYVertical");
            navigate("/make-your-customization")
          }
        }
      })
      .catch(() => { });
  };

  //Onchange Currency update
  const changeCurrency = (e) => {
    const data = storeCurrencyDatas.filter(
      (s) => s.mp_store_price === e.target.value
    );

    if (data?.[0]?.mp_b2c_url && data?.[0].is_store !== 1) {
      window.open(data[0]?.mp_b2c_url, "_blank", "");
    } else {
      updateCartCurrency(data?.[0].mp_store_price);
      dispatch(storeCurrency(data?.[0]?.mp_store_price));
      navigate(pathname.includes("_checkout") ? "/shop_cart" : pathname)
      window.scroll(0, 0);
    }
  };

  //Click function for To Subscribe Email
  const subscribeEmail = () => {
    const obj = {
      a: "AddUpdateSubscribers",
      unique_id: "",
      store_id: storeEntityIds.mini_program_id,
      email: email,
    };

    setLoader(true);
    if (email != "") {
      commanService
        .postLaravelApi("/Subscribers", obj)
        .then((res) => {
          if (res.data.success === 1) {
            setEmail("");
            toast.success(res.data.message);
            if (!isLogin) {
              navigate("/login_register");
              dispatch(isRegisterModal(false));
              dispatch(isLoginModal(true));
            }
            setLoader(false);
          } else {
            setLoader(false);
            toast.error(res.data.message);
          }
          window.scroll(0, 0)
          setEmail("");
        })
        .catch(() => { });
    } else {
      setLoader(false);
    }
  };

  //Active-Deactive Menu
  const isMenuActive = (menu, item) => {
    return pathname
      .toLowerCase()
      .toString()
      .includes(`/${menu.split(" ").join("-").toLowerCase()}`);
  };

  return loader ? (
    <Loader />
  ) : (
    <footer className="footer footer_type_1 pb-5 pb-sm-0">
      <div className="footer-top container py-0">
          <Features/>
      </div>
      <div className="footer-middle container">
        <div className="row row-cols-lg-5 row-cols-2">
          <div className="footer-column footer-store-info col-12 mb-4 mb-lg-0">
            {footerLogo.length > 0 &&
              footerLogo.map((L, i) => {
                return (
                  <React.Fragment key={i}>
                    {L.image !== "" ? (
                      <React.Fragment>
                        {L.logo_type === "FOOTER" && (
                          <div className="footer-logo ">
                            {" "}
                            <div className="logo">
                              <Link href="/" aria-label="Footer Logo">
                                <Image
                                  src={L.image}
                                  width={123}
                                  height={50}
                                  alt="B2C Footer Logo"
                                  className="logo__image d-block"
                                />
                              </Link>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                  </React.Fragment>
                );
              })}

            {/* <!-- /.logo --> */}
            {footerContact.length > 0 &&
              footerContact.map((e, i) => (
                <React.Fragment key={i}>
                  <div className="footer-address">{e.address}</div>

                  <div className="mb-2 d-flex align-items-center">
                    <i aria-hidden="true" className="ic_envelope me-1"></i><strong className="fw-medium"><Link href={`mailto:${e?.email}`} aria-label={e?.email}>{e.email}</Link></strong>
                  </div>
                  <div className="mb-4 d-flex align-items-center">
                    <i aria-hidden="true" className="ic_telephone me-1"></i><strong className="fw-medium"><Link href={`tel:${e?.mobile}`} aria-label={e?.mobile}>{e.mobile}</Link></strong>
                  </div>
                </React.Fragment>
              ))}
            <h3 className="sub-menu__title text-uppercase h5 mb-3">
              Stay Connected
            </h3>
            <ul className="social-links list-unstyled d-flex flex-wrap mb-0">
              {footerSocialLink.length > 0 &&
                footerSocialLink.map((s, i) => (
                  <li key={i}>
                    <Link
                      className="footer__social-link d-block"
                      target={"_blank"}
                      href={s.url}
                      aria-label="Footer Social Media"
                    >
                      <Image
                        src={s.image}
                        alt="Social Images"
                        className="img-fluid"
                        width={20} 
                        height={20}
                        />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          {/* <!-- /.footer-column --> */}

          <div className="footer-column footer-menu mb-4 mb-lg-0">
            {footerContent.length > 0 &&
              (footerContent || []).map((e, i) => {
                if (e.category_name === "Customer Service") {
                  return (
                    <React.Fragment key={i}>
                      <h3 className="sub-menu__title text-uppercase h5">
                        {e.category_name}
                      </h3>
                      <ul className="sub-menu__list list-unstyled">
                        {(e.data || []).map((d, index) => {
                          return (
                            <li key={index} className="sub-menu__item">
                              <Link
                                href={`/${d?.ecm_code.toLowerCase()}`}
                                aria-label={d?.ecm_name}
                                className={`${isMenuActive(d?.ecm_code.toLowerCase()) ? "menu-active" : ""} menu-link menu-link_us-s`}
                              >
                                {d?.ecm_name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </React.Fragment>
                  );
                }
              })}
          </div>
          {/* <!-- /.footer-column --> */}
          <div className="footer-column footer-menu mb-4 mb-lg-0">
            {footerContent.length > 0 &&
              (footerContent || []).map((e, i) => {
                if (e.category_name === "About Us") {
                  return (
                    <React.Fragment key={i}>
                      <h3 className="sub-menu__title text-uppercase h5">
                        {e.category_name}
                      </h3>
                      <ul className="sub-menu__list list-unstyled">
                        {/* <li className="sub-menu__item">
                          <Link className={`${pathname.includes("/about-us") ? "menu-active" : ""} menu-link menu-link_us-s`} href={"/about-us"}>
                            About Us
                          </Link>
                        </li> */}
                        {(e.data || []).map((d, index) => {
                          return (
                            <li key={index} className="sub-menu__item">
                              <Link
                                href={d.ecm_code === 'ABOUTUS' ? '/about-us' : `/${(d.ecm_code).toLowerCase()}`}
                                className={`${d.ecm_code === 'ABOUTUS' && pathname.includes("/about-us") ? "menu-active" : isMenuActive(d?.ecm_code.toLowerCase()) ? "menu-active" : ""} menu-link menu-link_us-s`}
                                aria-label={d?.ecm_name}
                              >
                                {d?.ecm_name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </React.Fragment>
                  );
                }
              })}
          </div>
          {/* <!-- /.footer-column --> */}
          <div className="footer-column footer-menu mb-4 mb-lg-0">
            {footerContent.length > 0 &&
              (footerContent || []).map((e, i) => {
                if (e.category_name === "Why") {
                  return (
                    <React.Fragment key={i}>
                      <h3 className="sub-menu__title text-uppercase h5">
                        {e.category_name}
                      </h3>
                      <ul className="sub-menu__list list-unstyled">
                        {/* <li className="sub-menu__item">
                          <Link className={`${pathname.includes("/contact") ? "menu-active" : ""} menu-link menu-link_us-s`} href={"/contact-us"}>
                            24/7 Customer Support
                          </Link>
                        </li> */}
                        {(e.data || []).map((d, index) => { 
                          return (
                            <li key={index} className="sub-menu__item">
                              <Link
                                href={d.ecm_code === 'CUSTOMERSUPPORT' ? '/contact-us' : `/${(d.ecm_code).toLowerCase()}`}
                                aria-label={d?.ecm_name}
                                className={`${d.ecm_code === 'CUSTOMERSUPPORT' && pathname.includes("/contact") ? "menu-active" : isMenuActive(d?.ecm_code.toLowerCase()) ? "menu-active" : ""} menu-link menu-link_us-s`}
                              >
                                {d?.ecm_name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </React.Fragment>
                  );
                }
              })}
          </div>
          {/* <!-- /.footer-column --> */}
          <div className="footer-column footer-newsletter col-12 mb-4 mb-lg-0">
            <h3 className="sub-menu__title text-uppercase h5">Subscribe</h3>
            <p>
              Be the first to get the latest news about trends, promotions, and
              much more!
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="footer-newsletter__form position-relative bg-body"
            >
              <input
                className="form-control border-white"
                type="email"
                name="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                required
              />
              <input
                className="btn-link fw-medium bg-white position-absolute top-0 end-0 h-100"
                type="submit"
                defaultValue="Submit"
                onClick={() => {
                  subscribeEmail();
                }}
              />
            </form>

            <div className="mt-4">
              <strong className="fw-medium sub-menu__title text-uppercase mb-3">Secure payments</strong>
              <p className="my-2 payment-options">
                {/* <Image
                  loading="lazy"
                  width={324}
                  height={38}
                  src={paymentGateways}
                  alt="Acceptable payment gateways"
                  className="mw-100"
                /> */}
              </p>
            </div>
          </div>
          {/* <!-- /.footer-column --> */}
        </div>
        {/* <!-- /.row-cols-5 --> */}
      </div>
      {/* <!-- /.footer-middle container --> */}

      <div className="footer-bottom container">
        <div className="d-block d-md-flex align-items-center">
          {/* <span className="footer-copyright me-auto">
            ©{new Date().getFullYear()} UPQOR
          </span> */}
          <span className="footer-copyright me-auto">
            Copyright © {new Date().getFullYear()}{" "}
            {storeEntityIds.store_name}
          </span>
          <div className="footer-settings d-block d-md-flex align-items-center">
            

            <div className="d-flex align-items-center">
              <label
                htmlFor="footerSettingsCurrency"
                className="ms-md-3 me-2 text-light1"
              >
                Currency
              </label>
              {Object.keys(storeEntityIds).length > 0
                ? storeCurrencyDatas.length > 0 && (
                  <FormSelect
                    id="footerSettingsCurrency"
                    className="form-select form-select-sm bg-transparent border-0"
                    aria-label="Default select example"
                    name="store-language"
                    value={storeCurrencys}
                    onChange={(e) => changeCurrency(e)}
                  >
                    {storeCurrencyDatas &&
                      storeCurrencyDatas.map((e, i) => {
                        return (
                          <option
                            className="footer-select__option"
                            key={i}
                            value={e.mp_store_price}
                          >
                            {e.mp_store_price}
                          </option>
                        );
                      })}
                  </FormSelect>
                )
                : ""}
            </div>
          </div>
          {/* <!-- /.footer-settings --> */}
        </div>
        {/* <!-- /.d-flex --> */}
      </div>
      {/* <!-- /.footer-bottom container --> */}
    </footer>
  );
}
