import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { openCart } from "../../utlis/openCart";
import CartLength from "./components/CartLength";
import User from "./components/User";
import commanService, { domain } from "../../CommanService/commanService";
import { useDispatch, useSelector } from "react-redux";
import {
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  caratVlaues,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondShape,
  DIYName,
  DiySteperData,
  engravingObj,
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
  previewImageDatas,
  saveEmbossings,
  showMoreValue,
  storeActiveFilteredData,
  storeCurrency,
  storeCurrencyData,
  storeDiamondNumber,
  storeEmbossingData,
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
  thresholdValue,
} from "../../Redux/action";
const FavCount = dynamic(() => import("./components/FavCount"), { ssr: false });
import { changeUrl, isEmpty, safeParse } from "../../CommanFunctions/commanFunctions";
const Nav = dynamic(() => import("./components/Nav"), { ssr: false });
import { useContextElement } from "../../context/Context";
import Image from "next/image";
import dynamic from "next/dynamic";

export default function Header1({storeData}) {
  //state declerations;
  const pathname = usePathname(); 
  const router = useRouter();    
  const dispatch = useDispatch();
  const menuContainerRef = useRef(null);
  const { getCartItems, getWishListFavourit } = useContextElement();
  const reduxLoginData = useSelector((state) => state.loginData);
  const logedData = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("loginData")) : null;
  const loginDatas = logedData || reduxLoginData;
  const storeEntityIds = useSelector((state) => state.storeEntityId) || storeData;
  const storeCurrencys = useSelector((state) => state.storeCurrency);
  const storeHeaderLog = useSelector((state) => state.storeHeaderLogo);
  const storeHeaderFavLogos = useSelector((state) => state.storeHeaderFavLogo);
  const naviGationMenuDatas = useSelector((state) => state.naviGationMenuData);
  const showMoreValues = useSelector((state) => state.showMoreValue)
  const isLogin = loginDatas && Object.keys(loginDatas)?.length > 0;
  const [scrollDirection, setScrollDirection] = useState("down");
  const [loader, setLoader] = useState(false);
  const [storeHeaderLogos, setStoreHeaderLogos] = useState(
    storeHeaderLog ?? []
  );
  const [navigationData, setNavigationData] = useState(
    naviGationMenuDatas ?? []
  );
  const [showMore, setShowMore] = useState(showMoreValues ?? false);
  const [currencyCode, setCurrencyCode] = useState([]);

  var megaMenu = sessionStorage.getItem("megaMenus");

  //Header logo settings
  const setHeaderLogo = useCallback((data) => {
    const filterLogo = data ? data.filter((h) => h.logo_type === "HEADER") : JSON.parse(megaMenu)?.logo_data.filter((h) => h.logo_type === "HEADER");
    setStoreHeaderLogos(filterLogo);
    dispatch(storeHeaderLogo(filterLogo));
    const filterFavLogo = data
      ? data.filter((h) => h.logo_type === "FAVICON")
      : JSON.parse(megaMenu)?.logo_data.filter((h) => h.logo_type === "FAVICON");
    if (isEmpty(filterFavLogo) !== "" && filterFavLogo.length > 0) {
      var link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      if (filterFavLogo.length > 0) {
        link.href = filterFavLogo[0].image;
      }
    }
    dispatch(storeHeaderFavLogo(filterFavLogo));
  }, []);

  //URL convert with dash
  function getAlias(e, link, type) {
    const alias = changeUrl(e.menu_name);
    const verticalCode = e.product_vertical_name.toLowerCase();
    if (link.toLowerCase().includes(`/${verticalCode}`) && !type) {
      return link.toLowerCase().replace(`/${verticalCode}`, `/${alias}`);
    } else if (link.toLowerCase().includes("/diy")) {
      return link.toLowerCase().replace(`/diy`, `/make-your-customization`)
    } else {
      return `/${alias}`;
    }
  }

  //Menu navigation store
  const handleNavigationMenu = (navigation_data) => {
    for (let c = 0; c < navigation_data.length; c++) {
      if (navigation_data[c].product_vertical_name === "LGDIA" || navigation_data[c].product_vertical_name === "DIAMO" || navigation_data[c].product_vertical_name === "GEDIA" || navigation_data[c].product_vertical_name === "LDIAM" || navigation_data[c].product_vertical_name === "GEMST") {
        let diy_detaills = [];
        let sub_menu = navigation_data[c]['sub_menu'];

        for (let d = 0; d < sub_menu.length; d++) {
          let detaills = sub_menu[d]['detaills'];

          if (detaills?.length !== 0) {
            for (let e = 0; e < detaills.length; e++) {
              let item = detaills[e];
              if (item.logic_code === "size_group") item.logic_code = "carat";
              item.titles = item.title.replaceAll(' ', '-');
              item.unique_id = isEmpty(navigation_data[c].unique_id);
              if (item.logic_code.includes('_')) {
                let output = item.logic_code.split('_').pop();
                item.router_link = `${getAlias(navigation_data[c], navigation_data[c].router_link)}/${output}/${item.titles.toLowerCase()}`;
              } else {
                item.router_link = `${getAlias(navigation_data[c], navigation_data[c].router_link)}/${item.logic_code}/${item.titles.toLowerCase()}`;
              }
              // }
            }
          } else {
            if (isEmpty(sub_menu[d]?.diy_json) !== "") {
              let diy_jsons = safeParse(sub_menu[d]?.diy_json);
              for (let m = 0; m < diy_jsons?.length; m++) {
                let datas = { unique_id: isEmpty(navigation_data[c].unique_id), type: isEmpty(diy_jsons[m]?.diy_type) !== "" ? isEmpty(diy_jsons[m]?.diy_type) : "0", title: diy_jsons[m]?.value, router_link: `/make-your-customization${diy_jsons[m]?.router_link}`, icon: isEmpty(diy_jsons[m]?.icon), vertical_code: diy_jsons[m]?.vertical, logic_code: diy_jsons[m]?.vertical };
                detaills.push(datas)
              }
              sub_menu[d].detaills = detaills
            }
          }
        }

        navigation_data[c].sub_menus = JSON.parse(JSON.stringify(navigation_data[c].sub_menu));
      } else {
        const originalSubMenus = navigation_data[c]['segmantion_data'];

        let combinedSubMenu = null;

        const groupedByTitleArray = [];
        const titleIndexMap = new Map();

        for (let d = 0; d < originalSubMenus?.length; d++) {
          const sub_menu = originalSubMenus[d];
          const { filter_json, unique_id, product_vertical, sub_category, display_name, sequence, ...rest } = sub_menu;

          if (!combinedSubMenu) {
            combinedSubMenu = { unique_id, product_vertical, sub_category, display_name, sequence, ...rest };
          }

          const detailsArray = safeParse(filter_json) !== null ? safeParse(isEmpty(filter_json)).sort((a, b) => a.sequence - b.sequence) : [];

          detailsArray.forEach(detail => {
            if (isEmpty(detail.status) === "1" || isEmpty(detail.status) === "") {

              const display_name = detail.display_title;
              const selectedValues = Array.isArray(detail.selected_value) ? detail.selected_value : [];

              if (!titleIndexMap.has(display_name)) {
                titleIndexMap.set(display_name, groupedByTitleArray.length);
                groupedByTitleArray.push({
                  display_name,
                  product_vertical: sub_menu.vertical_code,
                  item_group: sub_menu.item_group,
                  detaills: []
                });
              }

              const groupIndex = titleIndexMap.get(display_name);

              selectedValues.forEach(sel => {
                groupedByTitleArray[groupIndex].detaills.push({
                  unique_id: isEmpty(navigation_data[c].unique_id),
                  logic_code: detail.msf_key || detail.logic_code || "",
                  code: sel.key || "",
                  type: isEmpty(sel?.diy_type) !== "" ? isEmpty(sel?.diy_type) : "0",
                  vertical_code: detail.msf_key === "DIY" ? sel.vertical : navigation_data[c].product_vertical_name || "",
                  title: sel.value || "",
                  icon: sel.icon || "",
                  master_code: sel.master_code || "",
                  router_link: detail.msf_key === "DIY" ? getAlias(navigation_data[c], `/${detail.msf_key.toLowerCase()}${sel.router_link}`, "diy") : detail.msf_key.split('_').pop() ? getAlias(navigation_data[c], `${navigation_data[c].router_link}/${detail.msf_key.split('_').pop()}/${sel.value.replaceAll(' ', '-').toLowerCase()}`) : getAlias(navigation_data[c], `${navigation_data[c].router_link}/${detail.msf_key}/${sel.value.replaceAll(' ', '-').toLowerCase()}`)
                });
              });
              const details = groupedByTitleArray[groupIndex].detaills;

              groupedByTitleArray[groupIndex].detaills = details;
            }
          });
        }

        if (combinedSubMenu) {
          combinedSubMenu.detaills = groupedByTitleArray;
          navigation_data[c]['sub_menus'] = groupedByTitleArray;
        } else {
          navigation_data[c]['sub_menus'] = [];
        }

      }
    }
    const n = 2;
    const result = [];

    for (let i = 0; i < navigation_data.length; i++) {
      result.push(navigation_data[i]);
    }

    setNavigationData([...result]);
    dispatch(naviGationMenuData([...result]));
  }

  //get Home Navigation
  const headerSectionData = useCallback((data) => {
    setLoader(true);
    const obj = {
      a: "GetHomeNavigation",
      store_id: data.mini_program_id ?? storeEntityIds.mini_program_id,
      type: "B2C",
    };
    commanService
      .postLaravelApi("/NavigationMegamenu", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const data = res.data.data;
          sessionStorage.setItem("megaMenus", JSON.stringify(data));
          var logo_data = data.logo_data;
          var navigation_data = data.navigation_data;
          var currency_data = data.currency_data;
          setHeaderLogo(logo_data);
          setCurrencyCode(currency_data);
          if (navigation_data?.length > 0) {
            handleNavigationMenu(navigation_data);
          }
          // setNavigationData(navigation_data);

          // dispatch(naviGationMenuData(navigation_data));
          dispatch(thresholdValue(null));
          dispatch(showMoreValue(false))
          if (currency_data && currency_data.length > 0) {
            const arr1 = currency_data;
            if (arr1.length > 0) {
              if (arr1.length > 1) {
                dispatch(storeCurrencyData(arr1));
              } else {
                dispatch(storeCurrencyData(arr1));
              }
            }
          }
          router.push(`${pathname}${search ? `?${search}` : ""}`);
          setLoader(false);
        } else {
          setLoader(false);
        }
      })
      .catch(() => { });
  }, []);

  //Get store Data
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
  //         if (Object.keys(data)?.length > 0) {
  //           headerSectionData(data);
  //           // getCartItems();
  //           // getWishListFavourit();
  //           dispatch(storeEntityId(data));
  //           dispatch(storeCurrency(data?.store_currency));
  //         }
  //       } else {
  //         setLoader(false);
  //       }
  //     })
  //     .catch(() => { });
  // }, [domain, storeCurrencys]);

  //Home page Navigation
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
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(DiySteperData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(caratVlaues([]))
    dispatch(engravingObj({}))
    sessionStorage.removeItem("DIYVertical")
    dispatch(DIYName(""));
  };

  const lastScrollY = useRef(0);

  //API call and Scrolling function
  useEffect(() => {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    if (storeHeaderFavLogos?.length > 0) {
      link.href = storeHeaderFavLogos[0].image;
    }
    if (
      megaMenu !== null &&
      megaMenu !== undefined &&
      megaMenu !== false && (storeEntityIds.store_domain === domain)
    ) {
      setLoader(false);
      setHeaderLogo();
    } else {
      if (storeEntityIds.store_domain !== domain) {
        // sessionStorage.clear();
        // localStorage.clear();
        // dispatch(loginData({}));
        // dispatch(thresholdValue(null));
        // dispatch(showMoreValue(false))
      }
      // homePageNavigation();
      headerSectionData(storeEntityIds)
      if (isLogin) {
        getCartItems();
        getWishListFavourit();
      }
    }
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

  //Showmore menu navigation with state update for thresold value
  const handleSetShowMore = useCallback((value) => {
    setShowMore(value);
    dispatch(showMoreValue(value))
  }, []);

  return (
    <>
      <header
        id="header"
        className={`header header_sticky header-fullwidth header_sticky ${scrollDirection === "up" ? "header_sticky-active" : "position-absolute"
          }`}>
        <div className="container">
          <div className="header-desk header-desk_type_5 ">
            <div className="logo">
              {storeHeaderLogos && storeHeaderLogos?.length > 0
                ? storeHeaderLogos?.map((h, index) => (
                  <Link
                    href="/"
                    key={index}
                    onClick={() => homePageNavigation()}
                    className="logo__link"
                    aria-label={h?.logo_type || "HomePage Logo"}
                  >
                    <Image
                      src={h?.image}
                      width={128}
                      height={52}
                      alt={h?.logo_type || "HomePage Logo"}
                      className="logo__image d-block"
                      priority fetchPriority="high"
                    />
                  </Link>
                ))
                : ""}
            </div>
            {/* <!-- /.logo --> */}
            {/* <!-- /.header-search --> */}
            <div className="header-right">
              <nav className="navigation" ref={menuContainerRef}>
                <ul className="navigation__list list-unstyled d-flex" id="menuContainer">
                  <Nav getAlias={getAlias} navigationDatas={naviGationMenuDatas} setShowMore={handleSetShowMore} showMore={showMore} menuContainerRef={menuContainerRef} />
                </ul>
                {/* <!-- /.navigation__list --> */}
              </nav>
              {/* <!-- /.navigation --> */}

              <div className="header-tools d-flex align-items-center">
                {/* <SearchPopup /> */}
                {/* <!-- /.header-tools__item hover-container --> */}

                {!isLogin ? (
                  <div className="hover-container">
                    <div className="header-tools__item js-open-aside cursor-pointer">
                      <User />
                    </div>
                  </div>
                ) : (
                  <Link href="/account_dashboard" className="userLogin" aria-label="Account Dashboard">
                    <div className="hover-container">
                      <div className="header-tools__item js-open-aside">
                        <i
                          className={`ic_icon_user fs-20 ${pathname.includes("/account") &&
                            !pathname.includes("/account_wishlist")
                            ? "menu-active"
                            : ""
                            }`} >
                        </i>
                        <span className="cart-amount d-block position-absolute js-cart-items-count">
                          <i className="ic_check"></i>
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                <Link className="hover-container" href="/account_wishlist" aria-label="Account Wishlist"> 
                  <div className="header-tools__item header-tools__cart js-open-aside">
                    <i aria-hidden="true" className={`ic_icon_heart fs-20 ${pathname.includes("/account_wishlist")
                        ? "menu-active" : "" }`} >
                    </i>
                    <span className="cart-amount d-block position-absolute js-cart-items-count">
                      <FavCount />
                    </span>
                  </div>
                </Link>

                <div
                  onClick={() => openCart()}
                  className="header-tools__item header-tools__cart js-open-aside cursor-pointer"
                >
                  <i  className="ic_icon_cart fs-20" aria-hidden="true"></i>
                  <span className="cart-amount d-block position-absolute js-cart-items-count">
                    <CartLength />
                  </span>
                </div>
              </div>
            </div>
            {/* <!-- /.header__tools --> */}
          </div>
        </div>
      </header>
    </>
  );
}
