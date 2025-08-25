import React from "react";
import { useCallback, useEffect, useState } from "react";
import CartLength from "./components/CartLength";
import { openCart } from "@/utlis/openCart";
import MobileNav from "./components/MobileNav";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "next/navigation";
import Link from "next/link";
import {
  addedDiamondData,
  addedRingData,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondShape,
  filterData,
  filteredData,
  finalCanBeSetData,
  isFilter,
  isLoginModal,
  isRegisterModal,
  isRingSelected,
  IsSelectedDiamond,
  jeweleryDIYimage,
  jeweleryDIYName,
  loginData,
  naviGationMenuData,
  storeActiveFilteredData,
  storeCurrency,
  storeCurrencyData,
  storeDiamondNumber,
  storeEntityId,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeHeaderFavLogo,
  storeHeaderLogo,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "@/Redux/action";
import commanService, { domain } from "@/CommanService/commanService";
import User from "./components/User";
import { openModalUserlogin } from "@/utlis/aside";
import Loader from "@/CommanUIComp/Loader/Loader";
import { useContextElement } from "@/context/Context";
import { isEmpty, RandomId } from "@/CommanFunctions/commanFunctions";
import Image from "next/image";

export default function MobileHeader() {
  const loginDatas = useSelector((state) => state.loginData);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const storeCurrencys = useSelector((state) => state.storeCurrency);
  const storeHeaderLog = useSelector((state) => state.storeHeaderLogo);
  const storeCurrencyDatas = useSelector((state) => state.storeCurrencyData);
  const naviGationMenuDatas = useSelector((state) => state.naviGationMenuData);
  const socialUrlDatas = useSelector((state) => state.socialUrlData);
  const isLogin = Object.keys(loginDatas).length > 0;

  const dispatch = useDispatch();
  const { getCartItems, getWishListFavourit } = useContextElement();

  const [scrollDirection, setScrollDirection] = useState("down");
  // const [storeHeaderLogos, setStoreHeaderLogos] = useState(
  //   storeHeaderLogo ?? []
  // );
  // const [navigationData, setNavigationData] = useState(
  //   naviGationMenuData ?? []
  // );
  // const [loader, setLoader] = useState(false);
  // const [currencyCode, setCurrencyCode] = useState([]);
  // var megaMenu = sessionStorage.getItem("megaMenus");

  // const setHeaderLogo = useCallback((data) => {
  //   const filterLogo = data ? data.filter((h) => h.logo_type === "HEADER") : [];
  //   setStoreHeaderLogos(filterLogo);
  //   dispatch(storeHeaderLogo(filterLogo));
  //   const filterFavLogo = data
  //     ? data.filter((h) => h.logo_type === "FAVICON")
  //     : [];
  //   if (isEmpty(filterFavLogo) !== "" && filterFavLogo.length > 0) {
  //     var link = document.querySelector("link[rel~='icon']");
  //     if (!link) {
  //       link = document.createElement("link");
  //       link.rel = "icon";
  //       document.head.appendChild(link);
  //     }
  //     if (filterFavLogo.length > 0) {
  //       link.href = filterFavLogo[0].image;
  //     }
  //   }
  //   dispatch(storeHeaderFavLogo(filterFavLogo));
  // }, []);

  // const headerSectionData = useCallback((data) => {
  //   setLoader(true);
  //   const obj = {
  //     a: "GetHomeNavigation",
  //     store_id: data.mini_program_id ?? storeEntityId.mini_program_id,
  //     type: "B2C",
  //   };
  //   commanService
  //     .postLaravelApi("/NavigationMegamenu", obj)
  //     .then((res) => {
  //       if (res.data.success === 1) {
  //         const data = res.data.data;
  //         sessionStorage.setItem("megaMenus", JSON.stringify(data));
  //         var logo_data = data.logo_data;
  //         var navigation_data = data.navigation_data;
  //         var currency_data = data.currency_data;
  //         setHeaderLogo(logo_data);
  //         setNavigationData(navigation_data);
  //         setCurrencyCode(currency_data);
  //         dispatch(naviGationMenuData(navigation_data));

  //         if (currency_data && currency_data.length > 0) {
  //           const arr1 = currency_data;
  //           if (arr1.length > 0) {
  //             if (arr1.length > 1) {
  //               dispatch(storeCurrencyData(arr1));
  //             } else {
  //               dispatch(storeCurrencyData(arr1));
  //             }
  //           }
  //         }
  //         navigate("/")
  //         setLoader(false);
  //       } else {
  //         setLoader(false);
  //       }
  //     })
  //     .catch(() => {});
  // }, []);

  // const handleGetStoreData = useCallback(() => {
  //   setLoader(true);
  //   const getEntityId = {
  //     a: "GetStoreData",
  //     store_domain: domain,
  //     SITDeveloper: "1",
  //   };
  //   commanService
  //     .postApi("/EmbeddedPageMaster", getEntityId)
  //     .then((res) => {
  //       if (res.data.success === 1) {
  //         const data = res.data.data;
  //         sessionStorage.setItem("storeNavData", JSON.stringify(data));
  //         if (Object.keys(data).length > 0) {
  //           headerSectionData(data);
  //           // getCartItems();
  //           // getWishListFavourit();
  //           dispatch(storeEntityId(data));
  //           dispatch(storeCurrency(data.store_currency));
  //         }
  //       } else {
  //         setLoader(false);
  //       }
  //     })
  //     .catch(() => {});
  // }, [domain, storeCurrency]);

  const homePageNavigation = () => {
    dispatch(isRegisterModal(false));
    dispatch(isLoginModal(false));
    dispatch(filteredData([]));
    dispatch(filterData([]));
    dispatch(isFilter(false));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(finalCanBeSetData([]));
    dispatch(diamondDIYimage(""));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
  };

  useEffect(() => {
    // var storeData = JSON.parse(sessionStorage.getItem("storeNavData"));
    // if (
    //   megaMenu !== null &&
    //   megaMenu !== undefined &&
    //   megaMenu !== false &&
    //   storeEntityId.store_domain === domain
    // ) {
    //   setLoader(false);
    // } else {
    //   // sessionStorage.clear();
    //   dispatch(loginData({}));
    //   // homePageNavigation();
    //   handleGetStoreData();
    //   if (isLogin) {
    //     getCartItems();
    //     getWishListFavourit();
    //   }
    // }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 250) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setScrollDirection("down");
        } else {
          // Scrolling up
          setScrollDirection("up");
        }
      } else {
        // Below 250px
        setScrollDirection("down");
      }

      lastScrollY.current = currentScrollY;
    };

    const lastScrollY = { current: window.scrollY };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        if (res.data.success !== 1) {
        }
      })
      .catch(() => {});
  };

  const changeCurrency = (e) => {
    const data = storeCurrencyDatas.filter(
      (s) => s.mp_store_price === e.target.value
    );

    if (data?.[0]?.mp_b2c_url && data?.[0].is_store !== 1) {
      window.open(data[0]?.mp_b2c_url, "_blank", "");
    } else {
      updateCartCurrency(data?.[0].mp_store_price);
      dispatch(storeCurrency(data?.[0]?.mp_store_price));
      window.scroll(0, 0);
    }
  };

  return (
    <div
      className={`header-mobile header_sticky ${
        scrollDirection == "up" ? "header_sticky-active" : "position-absolute"
      } `}
    >
      {/* {loader && <Loader />} */}
      <div className="container d-flex align-items-center h-100">
        <a className="mobile-nav-activator d-block position-relative" href="#">
          <i
            className="nav-icon ic_icon_nav" >
          </i>
          <span className="btn-close-lg position-absolute top-0 start-0 w-100"></span>
        </a>

        <div className="logo">
          {storeHeaderLog && storeHeaderLog.length > 0
            ? storeHeaderLog.map((h, index) => (
                <Link
                  href="/"
                  key={index}
                  onClick={() => homePageNavigation()}
                  refresh="true"
                  className="logo_mobile_link"
                  aria-label={`HomePage Logo`}
                >
                  <Image
                    src={h.image}
                    alt="B2C Logo"
                    width={118}
                    height={48}
                    className="img-fluid logo__image logo_mobile_image d-block"
                  />
                </Link>
              ))
            : ""}
        </div>
        {/* <!-- /.logo --> */}

        <div onClick={() => openCart()}
          className="header-tools__item header-tools__cart js-open-aside" >
          <i className="ic_icon_cart fs-20" aria-hidden="true"></i>
          <span className="cart-amount d-block position-absolute js-cart-items-count">
            <CartLength />
          </span>
        </div>
      </div>
      {/* <!-- /.container --> */}

      <nav className="header-mobile__navigation navigation d-flex flex-column w-100 position-absolute top-100 bg-body overflow-auto">
        <div className="container">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="search-field position-relative mt-4 mb-3"
          >
            {/* <div className="position-relative">
              <input
                className="search-field__input w-100 border rounded-1"
                type="text"
                name="search-keyword"
                placeholder="Search products"
              />
              <button
                className="btn-icon search-popup__submit pb-0 me-2"
                type="submit"
              >
                <svg
                  className="d-block"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="#icon_search" />
                </svg>
              </button>
              <button
                className="btn-icon btn-close-lg search-popup__reset pb-0 me-2"
                type="reset"
              ></button>
            </div>

            <div className="position-absolute start-0 top-100 m-0 w-100">
              <div className="search-result"></div>
            </div> */}
          </form>
          {/* <!-- /.header-search --> */}
        </div>
        {/* <!-- /.container --> */}

        <div className="container">
          <div className="overflow-hidden">
            <ul className="navigation__list list-unstyled position-relative">
              <MobileNav navigationData={naviGationMenuDatas} />
            </ul>
            {/* <!-- /.navigation__list --> */}
          </div>
          {/* <!-- /.overflow-hidden --> */}
        </div>
        {/* <!-- /.container --> */}

        <div className="border-top mt-auto pb-2">
          {!isLogin ? (
            <div
              className="customer-links container mt-4 mb-2 pb-1"
              onClick={openModalUserlogin}
            >
              <i className="ic_icon_user fs-18" aria-hidden="true"></i>
              <span className="d-inline-block ms-2 text-uppercase align-middle fw-medium">
                My Account
              </span>
            </div>
          ) : (
            <Link href="/account_dashboard"  aria-label={ `Account Dashboard`}>
              <div className="customer-links container mt-4 mb-2 pb-1">
                <i className="ic_icon_user fs-18" aria-hidden="true"></i>
                <span className="d-inline-block ms-2 text-uppercase align-middle fw-medium">
                  My Account
                </span>
              </div>
            </Link>
          )}
          {/* <div className="container d-flex align-items-center">
            <label className="me-2 text-secondary">Language</label>
            <select
              className="form-select form-select-sm bg-transparent border-0"
              aria-label="Default select example"
              name="store-language"
            >
              {languageOptions.map((option, index) => (
                <option
                  key={index}
                  className="footer-select__option"
                  value={option.value}
                >
                  {option.text}
                </option>
              ))}
            </select>
          </div> */}

          <div className="container d-flex align-items-center">
            <label className="me-2 text-secondary">Currency</label>
            {Object.keys(storeEntityIds).length > 0
              ? storeCurrencyDatas.length > 0 && (
                  <select
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
                  </select>
                )
              : ""}
          </div>
          <ul className="container social-links list-unstyled d-flex flex-wrap mb-0">
            {socialUrlDatas?.map((s, i) => (
              <li key={i}>
                <Link
                  className="footer__social-link d-block"
                  target={"_blank"}
                  href={s.url}
                  aria-label={ `Footer Social`}
                >
                  <Image
                    src={s.image}
                    alt="Footer Social"
                    className="img-fluid"
                    width={15}
                    height={15}
                  ></Image>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* <!-- /.navigation --> */}
    </div>
  );
}
