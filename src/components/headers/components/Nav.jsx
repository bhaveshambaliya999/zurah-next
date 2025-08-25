import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  activeDIYtabs,
  activeIdMenu,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  allFilteredData,
  caratVlaues,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  diamondShape,
  dimaondColorType,
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
  overflowItemsData,
  previewImageDatas,
  saveEmbossings,
  showMoreValue,
  storeActiveFilteredData,
  storeDiamondArrayImage,
  storeDiamondNumber,
  storeEmbossingData,
  storeFilteredData,
  storeFilteredDiamondObj,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
  thresholdValue,
} from "../../../Redux/action";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../../../CommanFunctions/commanFunctions";
import commanService, { domain } from "../../../CommanService/commanService";
import Image from "next/image";

export default function Nav(props) {
  const { navigationDatas, showMore, setShowMore, menuContainerRef,getAlias } = props;
  
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const initialThreshold = useSelector((state) => state.thresholdValue)
  const storeEntityIds = useSelector((state) => state.storeEntityId)
  const showMoreValues = useSelector((state) => state.showMoreValue)
  const activeIdMenus = useSelector((state) => state.activeIdMenu)
  const activeVerticalCode = sessionStorage.getItem("DIYVertical")
  const [threshold, setThreshold] = useState(initialThreshold ?? null);
  const [hasMeasuredInitial, setHasMeasuredInitial] = useState(false);
  const [activeId, setActiveId] = useState(activeIdMenus ?? "")

  const itemRefs = useRef([]);

  //Object for api call require
  const obj = {
    SITDeveloper: "1",
    a: "SetupDiyVertical",
    store_id: storeEntityIds.mini_program_id,
    tenant_id: storeEntityIds.tenant_id,
    entity_id: storeEntityIds.entity_id,
    origin: domain,
    unique_id: "",
  }

  //calculate thresold for Navigation menu
  const measureItemsPerLine = useCallback(() => {
    if (!menuContainerRef.current || navigationDatas?.length === 0) {
      return;
    }

    const menuContainer = menuContainerRef.current;
    const containerWidth = menuContainer.offsetWidth;
    let currentLineWidth = 0;
    let itemsOnCurrentLine = 0;
    // const navDataLength = navMenuFirst?.length + navigationDatas?.length
    navigationDatas?.length > 0 && navigationDatas.forEach((_, index) => {
      const itemRef = itemRefs.current[index];
      if (itemRef && itemRef.offsetWidth) {
        const itemWidth = itemRef.offsetWidth;
        const itemMarginRight = parseFloat(window.getComputedStyle(itemRef).marginRight) || 0;
        const totalItemWidth = itemWidth + itemMarginRight * 2;
        currentLineWidth += totalItemWidth;
        itemsOnCurrentLine++;
        // console.log(itemsOnCurrentLine, currentLineWidth, containerWidth);
        if (index > 0) {
          if (currentLineWidth + 140 > 1140) {
            setThreshold(index);
            dispatch(thresholdValue(index))
            return;
          }
        } else {
          if (currentLineWidth + 140 > containerWidth) {
            setThreshold(itemsOnCurrentLine);
            dispatch(thresholdValue(itemsOnCurrentLine))
            return;
          }
        }
      }
    });
  }, [menuContainerRef, navigationDatas, threshold, setShowMore, dispatch]);

  useEffect(() => {
    let timeoutId;

    const measure = () => {
      const menuContainer = menuContainerRef.current;
      if (navigationDatas?.length > 0 && menuContainer) {
        measureItemsPerLine();
        if (threshold !== null && navigationDatas?.slice(threshold)?.length > 0) {
          setShowMore(true);
          dispatch(showMoreValue(true))
          dispatch(thresholdValue(threshold));
        }
      }
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measure, 100);
    };

    // Initial measure

    measure();


    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [measureItemsPerLine, navigationDatas, threshold, dispatch, setShowMore, menuContainerRef]);

  //Active Sub menu
  const isMenuActive = (menu, item = {}, sub = {}, parent = {}) => {
    const lowerPath = pathname?.toLowerCase() || "";

    const linksToCheck = [
      item?.router_link,
      sub?.display_name,
      parent?.unique_id,
    ].filter(Boolean);

    for (const link of linksToCheck) {
      if (lowerPath.includes(item?.router_link?.toLowerCase()) && activeIdMenus === item?.unique_id && activeVerticalCode === (item?.vertical_code ?? item?.product_vertical_name)) {
        return true;
      }
    }
    // const slug = menu?.split(" ")?.join("-")?.toLowerCase();
    // if (slug && lowerPath.includes(`/${slug}`)) {
    //   return true;
    // }

    return false;
  };

  //Active Parent Menu
  const isActiveParentMenu = (menus, item = {}) => {
    const lowerPath = pathname?.toLowerCase() || "";

    if (menus && (menus === pathname) || pathname.includes(menus) && activeIdMenus === item.unique_id) {
      return true;
    }
    if (
      item?.product_vertical_name === "DIY" &&
      lowerPath.includes("start-with-a") && activeIdMenus === item.unique_id
    ) { return true }
    if (Array.isArray(item?.sub_menus) && activeIdMenus === item.unique_id) {
      for (const subMenu of item.sub_menus) {
        if (Array.isArray(subMenu?.detaills)) {
          for (const petaMenu of subMenu.detaills) {
            if (
              petaMenu?.router_link &&
              lowerPath.toLowerCase()?.includes(petaMenu.router_link) && activeIdMenus === petaMenu?.unique_id
            ) {
              return true;
            }
          }
        }
        if (
          subMenu?.router_link &&
          lowerPath.toLowerCase()?.includes(subMenu.router_link) && activeIdMenus === item?.unique_id
        ) {
          return true;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    function setBoxMenuPosition(menu) {
      const scrollBarWidth = 17;
      const limitR = window.innerWidth - menu.offsetWidth - scrollBarWidth;
      const limitL = 0;
      const menuPaddingLeft = parseInt(
        window.getComputedStyle(menu, null).getPropertyValue("padding-left")
      );
      const parentPaddingLeft = parseInt(
        window
          .getComputedStyle(menu.previousElementSibling, null)
          .getPropertyValue("padding-left")
      );
      const centerPos =
        menu.previousElementSibling.offsetLeft -
        menuPaddingLeft +
        parentPaddingLeft;

      let menuPos = centerPos;
      if (centerPos < limitL) {
        menuPos = limitL;
      } else if (centerPos > limitR) {
        menuPos = limitR;
      }

      menu.style.left = `${menuPos}px`;
    }
    document.querySelectorAll(".box-menu").forEach((el) => {
      setBoxMenuPosition(el);
    });

  }, []);

  //menu click event
  const homePageNavigation = () => {
    dispatch(isRegisterModal(false));
    dispatch(filteredData([]));
    dispatch(filterData([]));
    dispatch(isLoginModal(false));
    dispatch(isFilter(false));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(finalCanBeSetData([]));
    dispatch(caratVlaues([]))
    // dispatch(activeDIYtabs("Jewellery"));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(jeweleryDIYimage(""));
    dispatch(diamondDIYimage(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(storeDiamondArrayImage({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
    dispatch(diamondSelectShape({}));
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(DiySteperData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(engravingObj({}))
    sessionStorage.removeItem("DIYVertical");
    dispatch(DIYName(""));
    dispatch(dimaondColorType("White"));
  };

  //Submenu click event
  const handleRouteData = (e) => {
    dispatch(DiySteperData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(isFilter(true));
    dispatch(filterData([]));
    dispatch(allFilteredData([]));
    dispatch(filteredData([]));
    dispatch(storeItemObject({}));
    dispatch(caratVlaues([]))
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
    dispatch(diamondSelectShape({}));
    dispatch(storeDiamondArrayImage({}));
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(engravingObj({}))
    dispatch(DIYName(""));
    dispatch(dimaondColorType("White"));
    sessionStorage.removeItem("DIYVertical")
    if (location.pathname.includes("/diy/start-with-a-setting")) {
      dispatch(activeDIYtabs("Jewellery"));
      dispatch(storeItemObject({}));
    }
    if (location.pathname.includes("/diy/start-with-a-item")) {
      dispatch(DiySteperData([]));
      dispatch(ActiveStepsDiy(0));
    }
    if (location.pathname.includes("/diy/start-with-a-diamond")) {
      dispatch(activeDIYtabs("Diamond"));
      dispatch(storeItemObject({}));
      dispatch(diamondPageChnages(false));
    }
    // e.preventDefault();
  };

  // useEffect(()=>{
  //   handleRouteData();
  // },[location.pathname])

  //API call for DIY type is 1
  const allProductData = useCallback((obj, data) => {
    commanService.postApi('/Diy', obj).then((res) => {
      if (res.data.success === 1) {
        const stepps = res.data.data.filter((item) => data.router_link.includes(item.router_link))[0];
        if (stepps?.details && Array.isArray(stepps?.details) && data.router_link.includes("/start-with-a-item")) {
          const updatedSteps = [
            { position: 0, display_name: stepps?.from_display_name, vertical: stepps?.vertical_code },
            ...stepps.details.map((step, index) => ({
              ...step,
              position: index + 1,
            })),
            { position: stepps?.details.length + 1, display_name: "Complete" },
          ];
          dispatch(DiySteperData(updatedSteps));
          // dispatch(DIYName(stepps?.name))
        } else {
          dispatch(DiySteperData([]))
        }
        sessionStorage.setItem("DIYVertical", stepps.vertical_code)
      }
    }).catch((error) => { });
  }, [])

  return (
    <>
      {navigationDatas?.length > 0 &&
        navigationDatas?.map((item, i) => {
          const capitalizeEachWord = (str) =>
            str
              ?.split(" ")
              ?.map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");
          if (threshold !== null && i >= threshold) {
            return
          }          
          return (
            <li className="navigation__item" key={i} ref={(el) => (itemRefs.current[i] = el)}>
              <Link href={getAlias(item, item.router_link)} aria-label={item?.menu_name || 'Menu Link'}
                onClick={(e) => { setActiveId(item?.unique_id); dispatch(activeIdMenu(item?.unique_id)); homePageNavigation(e) }}
              // refresh="true"
              >
                <span
                  className={`navigation__link ${isActiveParentMenu(getAlias(item, item.router_link), item)
                    ? "menu-active"
                    : ""
                    }`}

                //  href={window.location.pathname + `/${item.router_link}`}
                >
                  {item.menu_name}
                </span>
              </Link>
              {isEmpty(item?.submenu) === 1 &&
                item.product_vertical_name !== "DIY" &&
                <div className="navigation__item">
                  <div
                    className={`${item.sub_menus?.length !== 0 &&
                      item.product_vertical_name !== "DIY"
                      ? "mega-menu"
                      : ""
                      }`}
                  >
                    <div
                      className={`${item.product_vertical_name !== "DIY"
                        ? "container"
                        : "default-menu list-unstyled"
                        }`}
                    >
                    <div className="row">
                      <div className="col pe-md-0">
                        <div className="row mx-8">
                          {item &&
                            item.sub_menus?.length > 0 &&
                            item.sub_menus.map((subMenu, k) => {
                              if (
                                subMenu.detaills?.length > 0 &&
                                subMenu.display_name !== ""
                              ) {
                                let n = subMenu?.detaills?.filter((it) => it?.title !== "")?.length;
                                if (subMenu?.detaills?.filter((it) => it?.title !== "")?.length >= 6) {

                                  // n = Math.ceil(subMenu?.detaills?.length / 3)
                                  n = Math.ceil(subMenu?.detaills?.filter((it) => it?.title !== "")?.length / 2)
                                }
                                return (
                                  <div className="col-md-3 px-2 mb-3" key={k}>
                                    <Link href="#" className="sub-menu__title" aria-label={subMenu?.display_name || 'Submenu Link'}>
                                      {subMenu.display_name}
                                    </Link>
                                    <ul className="sub-menu__list list-unstyled">
                                      {subMenu.detaills?.length > 0 ? (
                                        subMenu.detaills?.length >= n ? (
                                          <li className="d-flex gap-3">
                                            <ul className="list-unstyled">
                                              {subMenu.detaills
                                                .slice(0, n)
                                                .map((petaMenu, j) => {
                                                  if (petaMenu.title === "") {
                                                    return;
                                                  }
                                                  return (
                                                    <li
                                                      key={j}
                                                      className="sub-menu__item "
                                                    >
                                                      <Link
                                                        href={{
                                                          pathname: petaMenu.router_link,
                                                          query: { verticalCode: petaMenu?.vertical_code }
                                                        }}
                                                        aria-label={capitalizeEachWord(petaMenu?.title)}
                                                        // href={`${petaMenu.router_link}`}
                                                        className={`menu-link menu-link_us-s ${isMenuActive(
                                                          petaMenu.title,
                                                          petaMenu, subMenu, item
                                                        )
                                                          ? "menu-active"
                                                          : ""
                                                          }`}
                                                        // refresh="true"
                                                        onClick={(e) => {
                                                          setActiveId(petaMenu.unique_id)
                                                          dispatch(activeIdMenu(petaMenu?.unique_id))
                                                          handleRouteData(e);
                                                          dispatch(DIYName(petaMenu?.title))
                                                          sessionStorage.setItem("DIYVertical", petaMenu.vertical_code)
                                                          if (petaMenu?.type === "1") {
                                                            allProductData(obj, petaMenu)
                                                          }
                                                        }}
                                                      >{petaMenu?.icon !== "" && <span className={`${petaMenu?.icon} me-2`}></span>}
                                                        {capitalizeEachWord(
                                                          petaMenu.title
                                                        )}
                                                      </Link>
                                                    </li>
                                                  );
                                                })}
                                            </ul>
                                            <ul className="list-unstyled">
                                              {subMenu.detaills
                                                .slice(n)
                                                .map((petaMenu, j) => {
                                                  if (petaMenu.title === "") {
                                                    return;
                                                  }
                                                  return (
                                                    <li
                                                      key={j}
                                                      className="sub-menu__item"
                                                    >
                                                      <Link
                                                        href={{
                                                          pathname: petaMenu.router_link,
                                                          query: { verticalCode: petaMenu?.vertical_code }
                                                        }}
                                                        aria-label={capitalizeEachWord(petaMenu?.title)}
                                                        // href={`${petaMenu.router_link}`}
                                                        className={`menu-link menu-link_us-s ${isMenuActive(
                                                          petaMenu.title,
                                                          petaMenu, subMenu, item
                                                        )
                                                          ? "menu-active"
                                                          : ""
                                                          }`}
                                                        // refresh="true"
                                                        onClick={(e) => {
                                                          setActiveId(petaMenu.unique_id);
                                                          dispatch(activeIdMenu(petaMenu?.unique_id))
                                                          handleRouteData(e);
                                                          dispatch(DIYName(petaMenu?.title))
                                                          sessionStorage.setItem("DIYVertical", petaMenu.vertical_code)
                                                          if (petaMenu?.type === "1") {
                                                            allProductData(obj, petaMenu)
                                                          }
                                                        }}
                                                        style={{
                                                          textTransform: "capitalize",
                                                        }}
                                                      >{petaMenu?.icon !== "" && <span className={`${petaMenu?.icon} me-2`}></span>}
                                                        {capitalizeEachWord(
                                                          petaMenu.title
                                                        )}
                                                      </Link>
                                                    </li>
                                                  );
                                                })}
                                            </ul>
                                          </li>
                                        ) : (
                                          subMenu.detaills.map((petaMenu, j) => {
                                            if (petaMenu.title === "") {
                                              return;
                                            }

                                            return (
                                              <li key={j} className="sub-menu__item">
                                                <Link
                                                  href={{
                                                    pathname: petaMenu.router_link,
                                                    query: { verticalCode: petaMenu?.vertical_code }
                                                  }}
                                                  aria-label={capitalizeEachWord(petaMenu?.title)}
                                                  // href={`${petaMenu.router_link}`}
                                                  onClick={(e) => {
                                                    setActiveId(petaMenu.unique_id)
                                                    dispatch(activeIdMenu(petaMenu?.unique_id))
                                                    handleRouteData(e);
                                                    dispatch(DIYName(petaMenu?.title))
                                                    sessionStorage.setItem("DIYVertical", petaMenu.vertical_code)
                                                    if (petaMenu?.type === "1") {
                                                      allProductData(obj, petaMenu)
                                                    }
                                                  }}
                                                  className={`menu-link menu-link_us-s ${isMenuActive(petaMenu.title, petaMenu, subMenu, item)
                                                    ? "menu-active"
                                                    : ""
                                                    }`}
                                                  // refresh="true"
                                                  style={{
                                                    textTransform: "capitalize",
                                                  }}
                                                >{petaMenu?.icon !== "" && <span className={`${petaMenu?.icon} me-2`}></span>}
                                                  {capitalizeEachWord(petaMenu.title)}
                                                </Link>
                                              </li>
                                            );
                                          })
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </ul>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="col-md-3 px-3 mb-3" key={k}>
                                    <Link
                                      href={
                                        subMenu?.sub_category === "STRWD"
                                          ? "/make-your-customization/start-with-a-diamond"
                                          : subMenu?.sub_category === "STRWS"
                                            ? "/make-your-customization/start-with-a-setting"
                                            : subMenu?.sub_category === "STWIT"
                                              ? "/make-your-customization/start-with-a-item"
                                              : item.router_link
                                      }
                                      aria-label={subMenu?.display_name}
                                      // refresh="true"
                                      onClick={(e) => {
                                        setActiveId(item.unique_id)
                                        dispatch(activeIdMenu(item?.unique_id))
                                        dispatch(DiySteperData([]));
                                        dispatch(ActiveStepsDiy(0));
                                        handleRouteData(e);
                                      }}
                                    >
                                      <div
                                        className={`menu-link menu-link_us-s ${isMenuActive(subMenu.display_name, subMenu, {}, item)
                                          ? "menu-active"
                                          : ""
                                          }`}
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {subMenu.display_name}
                                      </div>
                                    </Link>
                                  </div>
                                );
                              }
                            })}
                        </div>
                      </div>
                      {item && item.sub_menus?.length > 0 && item.image !== "" && (
                        <div className="mega-menu__media col" key={i}>
                          <div className="position-relative">
                            <Image
                              loading="lazy"
                              className="mega-menu__img"
                              src={item.image}
                              width={322}
                              height={322}
                              alt="New Horizons"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>}
              {/* <!-- /.box-menu --> */}
            </li>
          );
        })}
      {
        showMore &&
        <li className="navigation__item">
          {navigationDatas?.slice(threshold) &&
            navigationDatas?.slice(threshold)?.length > 0 &&
            (<>
              <span
                className={`navigation__link`}>
                Show More
              </span>
              <div className="navigation__item">
                <div className={""}>
                  <div className={"default-menu list-unstyled"}>
                    {navigationDatas?.slice(threshold)?.map((menu, q) => {

                      return (
                        <div className="col ShowMoreItem" key={q}>
                          <div className="sub-menu__item">
                            <Link
                              href={getAlias(menu, menu.router_link)}
                              aria-label= {menu?.menu_name}
                              onClick={(e) => {
                                setActiveId(menu.unique_id)
                                dispatch(activeIdMenu(menu?.unique_id));
                                homePageNavigation(e)
                                sessionStorage.setItem("DIYVertical", menu.product_vertical_name)
                              }}
                              // refresh="true"
                              className="menu-link menu-link_us-s"
                            >
                              <span
                                className={`menu__title ${isActiveParentMenu(getAlias(menu, menu.router_link), menu)
                                  ? "menu-active"
                                  : ""
                                  }`}
                              >
                                {menu.menu_name}
                              </span>
                            </Link>
                          </div>
                        </div>
                      )

                    })}
                  </div>
                </div>
              </div></>)}
        </li>
      }
    </>
  );
}
