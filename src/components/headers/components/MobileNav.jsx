import { useCallback, useEffect } from "react";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  activeDIYtabs,
  activeIdMenu,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
  allFilteredData,
  diamondDIYimage,
  diamondImage,
  diamondNumber,
  diamondPageChnages,
  diamondSelectShape,
  diamondShape,
  DIYName,
  DiySteperData,
  engravingObj,
  filterData,
  filteredData,
  finalCanBeSetData,
  isFilter,
  isRingSelected,
  IsSelectedDiamond,
  jeweleryDIYimage,
  jeweleryDIYName,
  previewImageDatas,
  saveEmbossings,
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
} from "@/Redux/action";
import { changeUrl, isEmpty } from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";

export default function MobileNav(props) {
  const { navigationData } = props;
  const dispatch = useDispatch();
  const pathname = usePathname();
  const naviGationMenuDatas = useSelector((state) => state.naviGationMenuData);
  const activeIdMenus = useSelector((state) => state.activeIdMenu);
  const activeVerticalCode = sessionStorage.getItem("DIYVertical");

  //Active Sub menu
  const isMenuActive = (menu, item = {}, sub = {}, parent = {}) => {
    const lowerPath = pathname?.toLowerCase() || "";

    const linksToCheck = [
      item?.router_link,
      sub?.display_name,
      parent?.unique_id,
    ].filter(Boolean);

    for (const link of linksToCheck) {
      if (
        lowerPath.includes(item?.router_link?.toLowerCase()) &&
        activeIdMenus === item?.unique_id &&
        activeVerticalCode ===
          (item?.vertical_code ?? item?.product_vertical_name)
      ) {
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

    if (
      (menus && menus === pathname) ||
      (pathname.includes(menus) && activeIdMenus === item.unique_id)
    ) {
      return true;
    }
    if (
      item?.product_vertical_name === "DIY" &&
      lowerPath.includes("start-with-a") &&
      activeIdMenus === item.unique_id
    ) {
      return true;
    }
    if (Array.isArray(item?.sub_menus) && activeIdMenus === item.unique_id) {
      for (const subMenu of item.sub_menus) {
        if (Array.isArray(subMenu?.detaills)) {
          for (const petaMenu of subMenu.detaills) {
            if (
              petaMenu?.router_link &&
              lowerPath.toLowerCase()?.includes(petaMenu.router_link) &&
              activeIdMenus === petaMenu?.unique_id
            ) {
              return true;
            }
          }
        }
        if (
          subMenu?.router_link &&
          lowerPath.toLowerCase()?.includes(subMenu.router_link) &&
          activeIdMenus === item?.unique_id
        ) {
          return true;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    const selectors = {
      mobileMenuActivator: ".mobile-nav-activator",
      mobileMenu: ".navigation",
      mobileMenuActiveClass: "mobile-menu-opened",
      mobileSubNavOpen: ".js-nav-right",
      mobileSubNavClose: ".js-nav-left",
      mobileSubNavHiddenClass: "d-none",
    };

    const mobileMenuActivator = document.querySelector(
      selectors.mobileMenuActivator
    );
    const mobileDropdown = document.querySelector(selectors.mobileMenu);
    let transformLeft = 0;

    const toggleMobileMenu = (event) => {
      if (event) {
        event.preventDefault();
      }

      if (document.body.classList.contains(selectors.mobileMenuActiveClass)) {
        document.body.classList.remove(selectors.mobileMenuActiveClass);
        document.body.style.paddingRight = "";
        mobileDropdown.style.paddingRight = "";
      } else {
        document.body.classList.add(selectors.mobileMenuActiveClass);
        document.body.style.paddingRight = "scrollWidth"; // Replace with appropriate value
        mobileDropdown.style.paddingRight = "scrollWidth"; // Replace with appropriate value
      }
    };

    if (mobileDropdown) {
      mobileMenuActivator &&
        mobileMenuActivator.addEventListener("click", toggleMobileMenu);

      const mobileMenu = mobileDropdown.querySelector(".navigation__list");
      let menuMaxHeight = mobileMenu.offsetHeight;

      const openSubNav = (event, btn) => {
        event.preventDefault();
        btn.nextElementSibling.classList.remove(
          selectors.mobileSubNavHiddenClass
        );

        transformLeft -= 100;
        if (menuMaxHeight < btn.nextElementSibling.offsetHeight) {
          mobileMenu.style.transform = `translateX(${transformLeft}%)`;
          mobileMenu.style.minHeight = `${btn.nextElementSibling.offsetHeight}px`;
        } else {
          mobileMenu.style.transform = `translateX(${transformLeft}%)`;
          mobileMenu.style.minHeight = `${menuMaxHeight}px`;
        }
      };

      const closeSubNav = (event, btn) => {
        event.preventDefault();
        transformLeft += 100;
        mobileMenu.style.transform = `translateX(${transformLeft}%)`;
        btn.parentElement.classList.add(selectors.mobileSubNavHiddenClass);
        const wrapper = btn.closest(".sub-menu");
        if (wrapper) {
          const minHeight =
            menuMaxHeight < wrapper.offsetHeight
              ? wrapper.offsetHeight
              : menuMaxHeight;
          mobileMenu.style.minHeight = `${minHeight}px`;
        }
      };

      mobileMenu &&
        Array.from(
          mobileMenu.querySelectorAll(selectors.mobileSubNavOpen)
        ).forEach((btn) => {
          btn.addEventListener("click", (event) => openSubNav(event, btn));
        });

      mobileMenu &&
        Array.from(
          mobileMenu.querySelectorAll(selectors.mobileSubNavClose)
        ).forEach((btn) => {
          btn.addEventListener("click", (event) => closeSubNav(event, btn));
        });

      return () => {
        mobileMenuActivator &&
          mobileMenuActivator.removeEventListener("click", toggleMobileMenu);
        mobileMenu &&
          Array.from(
            mobileMenu.querySelectorAll(selectors.mobileSubNavOpen)
          ).forEach((btn) => {
            btn.removeEventListener("click", (event) => openSubNav(event, btn));
          });
        mobileMenu &&
          Array.from(
            mobileMenu.querySelectorAll(selectors.mobileSubNavClose)
          ).forEach((btn) => {
            btn.removeEventListener("click", (event) =>
              closeSubNav(event, btn)
            );
          });
      };
    }
  }, []);
  useEffect(() => {
    const selectors = {
      mobileMenuActivator: ".mobile-nav-activator",
      mobileMenu: ".navigation",
      mobileMenuActiveClass: "mobile-menu-opened",
      mobileSubNavOpen: ".js-nav-right",
      mobileSubNavClose: ".js-nav-left",
      mobileSubNavHiddenClass: "d-none",
    };

    const mobileDropdown = document.querySelector(selectors.mobileMenu);

    const removeMenu = (event) => {
      if (event) {
        event.preventDefault();
      }

      if (document.body.classList.contains(selectors.mobileMenuActiveClass)) {
        document.body.classList.remove(selectors.mobileMenuActiveClass);
        document.body.style.paddingRight = "";
        mobileDropdown.style.paddingRight = "";
      }
    };
    removeMenu();
  }, [pathname]);

  const handleOnClick = () => {
    dispatch(DiySteperData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(isFilter(true));
    dispatch(filterData([]));
    dispatch(allFilteredData([]));
    dispatch(filteredData([]));
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
    dispatch(diamondSelectShape({}));
    dispatch(storeDiamondArrayImage({}));
    dispatch(storeEmbossingData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(engravingObj({}));
    if (
      location.pathname.includes(
        "/make-your-customization/start-with-a-setting"
      )
    ) {
      dispatch(activeDIYtabs("Jewellery"));
      dispatch(storeItemObject({}));
    }
    if (
      location.pathname.includes("/make-your-customization/start-with-a-item")
    ) {
      dispatch(DiySteperData([]));
      dispatch(ActiveStepsDiy(0));
    }
    if (
      location.pathname.includes(
        "/make-your-customization/start-with-a-diamond"
      )
    ) {
      dispatch(activeDIYtabs("Diamond"));
      dispatch(storeItemObject({}));
      dispatch(diamondPageChnages(false));
    }
  };

  //URL convert with dash
  function getAlias(e, link, type) {
    const alias = changeUrl(e.menu_name);
    const verticalCode = e.product_vertical_name.toLowerCase();
    if (link.toLowerCase().includes(`/${verticalCode}`) && !type) {
      return link.toLowerCase().replace(`/${verticalCode}`, `/${alias}`);
    } else if (link.toLowerCase().includes("/diy")) {
      return link.toLowerCase().replace(`/diy`, `/make-your-customization`);
    } else {
      return `/${alias}`;
    }
  }

  //API call for DIY type is 1
  const allProductData = useCallback((obj, data) => {
    commanService
      .postApi("/Diy", obj)
      .then((res) => {
        if (res.data.success === 1) {
          const stepps = res.data.data.filter((item) =>
            data.router_link.includes(item.router_link)
          )[0];
          if (
            stepps?.details &&
            Array.isArray(stepps?.details) &&
            data.router_link.includes("/start-with-a-item")
          ) {
            const updatedSteps = [
              {
                position: 0,
                display_name: stepps?.from_display_name,
                vertical: stepps?.vertical_code,
              },
              ...stepps.details.map((step, index) => ({
                ...step,
                position: index + 1,
              })),
              {
                position: stepps?.details.length + 1,
                display_name: "Complete",
              },
            ];
            dispatch(DiySteperData(updatedSteps));
            // dispatch(DIYName(stepps?.name))
          } else {
            dispatch(DiySteperData([]));
          }
          sessionStorage.setItem("DIYVertical", stepps.vertical_code);
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <>
      {naviGationMenuDatas?.length > 0 &&
        naviGationMenuDatas?.map((item, i) => {
          return (
            <li className="navigation__item js-nav-right d-flex align-items-center" key={i}>
              <Link
                href={getAlias(item, item.router_link)}
                className={`${
                  item?.sub_menus?.length === 0 ||
                  item?.product_vertical_name === "DIY"
                    ? "navigation__link"
                    : "navigation__link"
                } ${
                  isActiveParentMenu(getAlias(item, item.router_link), item)
                    ? "menu-active"
                    : ""
                }`}
                onClick={async () => {
                  await handleOnClick();
                  dispatch(activeIdMenu(item?.unique_id));
                }}
              > {item?.menu_name}  
              </Link>
              {item?.sub_menus?.length > 0 &&
                item?.product_vertical_name !== "DIY" && (
                  <i className="ic_chavron_right ms-auto">
                  </i>
                )}

              {/* Sub-menu logic */}
              {item?.sub_menus?.length > 0 &&
                item?.product_vertical_name !== "DIY" && (
                  <div className="sub-menu position-absolute top-0 start-100 w-100 d-none">
                    <Link
                      href="#"
                      className="navigation__link js-nav-left d-flex align-items-center border-bottom mb-3"
                    >
                      <svg
                        className="me-2"
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href="#icon_prev_sm" />
                      </svg>
                      {item?.menu_name}
                    </Link>
                    {isEmpty(item?.submenu) === 1 &&
                      item.product_vertical_name !== "DIY" && (
                        <ul className="sub-menu__wrapper">
                          {item.sub_menus.map((subMenu, k) => {
                            if (
                              subMenu.detaills.length > 0 &&
                              subMenu.display_name !== ""
                            ) {
                              return (
                                <li key={k}>
                                  <Link
                                    href="#"
                                    className="navigation__link js-nav-right d-flex align-items-center"
                                  >
                                    {subMenu?.display_name}
                                    <i className="ic_chavron_left ms-auto"></i>
                                  </Link>
                                  <div className="sub-menu__wrapper position-absolute top-0 start-100 w-100 d-none">
                                    <Link
                                      href="#"
                                      className="navigation__link js-nav-left d-flex align-items-center border-bottom mb-2"
                                    >
                                      <svg
                                        className="me-2"
                                        width="7"
                                        height="11"
                                        viewBox="0 0 7 11"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <use href="#icon_prev_sm" />
                                      </svg>
                                      {subMenu.display_name}
                                    </Link>
                                    <ul className="sub-menu__list list-unstyled">
                                      {subMenu.detaills.map((petaMenu, j) => (
                                        <li key={j} className="sub-menu__item">
                                          <Link
                                            href={{
                                              pathname: petaMenu.router_link,
                                              query: {
                                                verticalCode:
                                                  petaMenu?.vertical_code,
                                              },
                                            }}
                                            refresh="true"
                                            onClick={(e) => {
                                              dispatch(
                                                activeIdMenu(
                                                  petaMenu?.unique_id
                                                )
                                              );
                                              handleOnClick();
                                              dispatch(
                                                DIYName(petaMenu?.title)
                                              );
                                              sessionStorage.setItem(
                                                "DIYVertical",
                                                petaMenu.vertical_code
                                              );
                                              if (petaMenu?.type === "1") {
                                                allProductData(obj, petaMenu);
                                              }
                                            }}
                                            className={`menu-link menu-link_us-s ${
                                              isMenuActive(
                                                petaMenu.title,
                                                petaMenu,
                                                subMenu,
                                                item
                                              )
                                                ? "menu-active"
                                                : ""
                                            }`}
                                          >
                                            {petaMenu.title}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </li>
                              );
                            } else {
                              return (
                                <li className="navigation__item" key={k}>
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
                                    className={`navigation__link ${
                                      isMenuActive(
                                        subMenu.display_name,
                                        subMenu,
                                        {},
                                        item
                                      )
                                        ? "menu-active"
                                        : ""
                                    }`}
                                    onClick={(e) => {
                                      dispatch(activeIdMenu(item?.unique_id));
                                      dispatch(DiySteperData([]));
                                      dispatch(ActiveStepsDiy(0));
                                      handleOnClick(e);
                                    }}
                                    style={{ textTransform: "capitalize" }}
                                  >
                                    {subMenu.display_name}
                                  </Link>
                                </li>
                              );
                            }
                          })}
                        </ul>
                      )}
                  </div>
                )}
            </li>
          );
        })}

      {/* Static About and Contact Links */}
      <li className="navigation__item">
        <Link
          href="/about-us"
          className={`navigation__link ${
            pathname == "/about" ? "menu-active" : ""
          }`}
          onClick={() => handleOnClick()}
        >
          About
        </Link>
      </li>
      <li className="navigation__item">
        <Link
          href="/contact-us"
          className={`navigation__link ${
            pathname == "/contact" ? "menu-active" : ""
          }`}
          onClick={() => handleOnClick()}
        >
          Contact
        </Link>
      </li>
    </>
  );
}
