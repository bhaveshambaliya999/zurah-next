import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Pagination1 from "../common/Pagination1";
import { useCallback, useEffect, useRef, useState } from "react";
import BreadCumb from "./BreadCumb";
import Link from "next/link";
import { useRouter, useParams, usePathname, useSearchParams } from "next/navigation";
import { useContextElement } from "@/context/Context";
const itemPerRow = [2, 3, 4];

import { openModalShopFilter } from "@/utlis/aside";
import { sortingOptions } from "@/data/products/productCategories";
import { useDispatch, useSelector } from "react-redux";
import commanService, { domain } from "@/CommanService/commanService";
import Loader from "@/CommanUIComp/Loader/Loader";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  allFilteredData,
  diamondDIYimage,
  diamondNumber,
  diamondPageChnages,
  DiySteperData,
  engravingObj,
  filterData,
  filteredData,
  finalCanBeSetData,
  isFilter,
  jeweleryDIYimage,
  jeweleryDIYName,
  naviGationMenuData,
  previewImageDatas,
  saveEmbossings,
  storeEmbossingData,
  storeFilteredDiamondObj,
  storeItemObject,
  storeProdData,
  storeSelectedDiamondData,
  storeSelectedDiamondPrice,
  storeSpecData,
} from "@/Redux/action";
import SkeletonModal from "@/CommanUIComp/Skeleton/SkeletonModal";
import { toast } from "react-toastify";
import {
  changeUrl,
  extractNumber,
  isEmpty,
  jewelVertical,
  numberWithCommas,
  perfumeVertical,
  RandomId,
} from "@/CommanFunctions/commanFunctions";
import DIYSteps from "./DIYSteps";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import DIYSetupAP from "./DIYSetupAP";
import Image from "next/image";
import NotFoundImg from "../../assets/images/RecordNotfound.png";

export default function Shop1() {
  //State Declerations
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastAbortController = useRef();
  const DIYvertical =
    router.state?.verticalCode ?? sessionStorage.getItem("DIYVertical");
  const nextStepPosition = router.state?.nextStepPosition;
  const combination_id = router.state?.combination_id;
  const diy_bom_id = router.state?.diy_bom_id;

  //Home filter data
  const getAllFilteredHome = router.state?.getAllFilteredHome;
  const dimension = router.state?.dimension;
  const item_group = router.state?.dimension;
  const segment = router.state?.segments;

  const naviGationMenuDatas = useSelector((state) => state.naviGationMenuData);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const loginDatas = useSelector((state) => state.loginData);
  const storeCurrencys = useSelector((state) => state.storeCurrency);
  const filterDat = useSelector((state) => state.filterData);
  const filteredDatas = useSelector((state) => state.filteredData);
  const storeItemObjects = useSelector((state) => state.storeItemObject);
  const isFilters = useSelector((state) => state.isFilter);
  const addedDiamondDatas = useSelector((state) => state.addedDiamondData);
  const storeProdDatas = useSelector((state) => state.storeSpecData);
  const DiySteperDatas = useSelector((state) => state.DiySteperData);
  const engravingAllData = useSelector((state) => state.engravingObj);
  const ActiveStepsDiys = useSelector((state) => state.ActiveStepsDiy);

  const isLogin = Object.keys(loginDatas).length > 0;
  const dispatch = useDispatch();

  const [filterDatas, setFilterDatas] = useState(filterDat ?? []);
  const [loader, setLoader] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [storeSkeletonArr, setStoreSkeletonArr] = useState([]);
  const [storeFilterArr, setStoreFilterArr] = useState(filteredDatas ?? []);
  const [productDataList, setProductDataList] = useState([]);
  const [productAll, setProductAll] = useState({});
  const [totalPages, setTotalPages] = useState();
  const [orignalData, setOrignalData] = useState([]);
  const [storeItemObj, setStoreItemObj] = useState(storeItemObjects ?? {});
  const [itemsLength, setItemLength] = useState(Array.from({ length: 1 }));
  const [clickPageScroll, setClickPageScroll] = useState(false);
  const [selectedSortingValue, setSelectedSortingValue] = useState(
    storeItemObjects?.sort_by ?? ""
  );
  const [sortBy, setSortBy] = useState("");
  const [onceUpdated, setOnceUpdated] = useState(false);
  const [verticalCode, setVerticalCode] = useState(params.verticalCode || "");

  const isJewelDiy = pathname.includes("start-with-a-setting");
  const isDiamoDiy = pathname.includes("start-with-a-diamond");
  const isItemDIY = pathname.includes("start-with-a-item");
  const diySetupFor = isJewelDiy || isDiamoDiy || isItemDIY;
  const paramsItem = isDiamoDiy || isJewelDiy || isItemDIY ? "DIY" : "PRODUCT";

  const { toggleWishlist, isAddedtoWishlist } = useContextElement();
  const [selectedColView, setSelectedColView] = useState(4);

  //DIY stepper
  const [steps, setSteps] = useState(DiySteperDatas ?? []);
  const [activeIndex, setActiveIndex] = useState();
  const { addProductToCart, isAddedToCartProducts } = useContextElement();

  // eslint-disable-next-line no-unused-vars
  let megaMenu = {};
  let getProduct = "";
  let product_key = "offer";
  if (typeof window !== "undefined") {
  const storedMenus = sessionStorage.getItem("megaMenus");
    if (storedMenus) {
      try {
        const parsedMenus = JSON.parse(storedMenus);
        megaMenu = parsedMenus?.navigation_data?.filter(
          (item) =>
            item.menu_name?.replaceAll(" ", "-")?.toLowerCase() ===
            (params.verticalCode?.toLowerCase() ?? "make your customization")
        )[0];
      } catch (e) {
        console.error("Invalid JSON in sessionStorage.megaMenus", e);
      }
    }
  }
  if (pathname.includes("offer")) {
    getProduct = params.type;
  }
  let vertical_code = megaMenu?.product_vertical_name ?? params.verticalCode;

  let title = params.title ? params.title : "";

  // //Meta
  // const metaConfig = {
  //   title: `${isEmpty(megaMenu?.seo_titles) !== "" ? megaMenu?.seo_titles : megaMenu?.menu_name}`,
  //   description: megaMenu?.seo_description,
  //   keywords: megaMenu?.seo_keyword,
  //   url: window.location.href,
  // }

  const [currency, setCurrency] = useState(storeCurrencys);

  // useEffect(() => {
  //   if (currentCategory == "All") {
  //     setFiltered(products51);
  //   } else {
  //     setFiltered(
  //       products51.filter((elm) => elm.filterCategory2 == currentCategory)
  //     );
  //   }
  // }, [currentCategory]);

  //Currency Update
  useEffect(() => {
    if (storeCurrencys) {
      setCurrency(storeCurrencys);
      setOnceUpdated(false);
      setHasMore(true);
      setClickPageScroll(false);
      setItemLength(Array.from({ length: 1 }));
      window.scrollTo(0, 0);
    }
  }, [storeCurrencys]);

  //get All Product data
  var jewellerydata = [];
  const productData = useCallback(
    (obj, key, signal) => {
      // setLoader(true);
      commanService
        .postApi("/EmbeddedPageMaster", obj, signal)
        .then((res) => {
          if (res.data.success === 1) {
            const jewelData = res.data.data.resData;
            setProductDataList(res?.data?.data?.resData);
            setProductAll(res?.data?.data);
            setTotalPages(res?.data?.data?.total_pages);
            if (jewelData.length === 0) {
              setOrignalData([]);
              setHasMore(false);
              // setLoader(false);
            }
            if (key === "1" && jewelData) {
              if (jewelData.length > 0) {
                var data = [];
                jewellerydata = [];
                for (let c = 0; c < jewelData.length; c++) {
                  data.push(jewelData[c]);
                  jewellerydata.push(jewelData[c]);
                }
                setOrignalData(data);
                // setLoader(false);
              }
            } else if (key === "0" && jewelData) {
              if (jewelData.length > 0) {
                var data = [...jewellerydata];
                for (let c = 0; c < jewelData.length; c++) {
                  data.push(jewelData[c]);
                }
                jewellerydata = data;
                setOrignalData(data);
                // setLoader(false);
              }
            }
            dispatch(allFilteredData(data));
            let arr1 = [];
            for (let i = 0; i < Number(9); i++) {
              arr1.push(i);
            }
            setStoreSkeletonArr(arr1);
            setLoader(false);
            setClickPageScroll(false);
            dispatch(isFilter(false));
            setOnceUpdated(false);
          }
        })
        .catch((error) => {
          setLoader(false);
          // toast.error(error.message);
        });
    },
    [currency]
  );

  //Get Filters Data
  const getFilterItems = useCallback(() => {
    const obj = {
      SITDeveloper: "1",
      a: "GetItemSearchFiltersForJewellery",
      entity_id: storeEntityIds.entity_id,
      miniprogram_id: storeEntityIds.mini_program_id,
      secret_key: storeEntityIds.secret_key,
      tenant_id: storeEntityIds.tenant_id,
      vertical_code: diySetupFor
        ? DiySteperDatas?.filter(
            (item) => item.position === nextStepPosition
          )[0]?.vertical ?? isEmpty(DIYvertical)
        : vertical_code?.toUpperCase(),
    };
    setLoader(true);
    commanService
      .postApi("/EmbeddedPageMaster", obj)
      .then((res) => {
        if (res?.data?.success === 1) {
          const storeArr = [];
          setFilterDatas(res?.data?.data);
          setOnceUpdated(true);
          dispatch(filterData(res?.data?.data));
          const filteredArray = [...res?.data?.data];
          const selectedValues = [];

          if (filteredArray.length > 0) {
            for (let i = 0; i < filteredArray.length; i++) {
              filteredArray[i]["selected_values"] = [];

              for (let j = 0; j < filteredArray[i]?.value?.length; j++) {
                const dataValueSlug = filteredArray[i]?.value[j]?.data_value
                  ?.split(" ")
                  ?.join("-")
                  ?.toLowerCase();

                if (params.verticalCode && !params.title) {
                  if (params.verticalCode.toLowerCase() === dataValueSlug) {
                    filteredArray[i]["selected_values"].push(
                      filteredArray[i]?.value[j]?.data_key
                    );
                  }
                }

                if (params.verticalCode && params.title) {
                  if (params.title.toLowerCase() === dataValueSlug) {
                    filteredArray[i]["selected_values"].push(
                      filteredArray[i]?.value[j]?.data_key
                    );
                  }
                }
              }
            }

            // Get navigation menu that matches verticalCode
            const navFilter = naviGationMenuDatas?.find(
              (item) =>
                item?.menu_name?.toLowerCase() ===
                params.verticalCode?.toLowerCase()
            );

            const matchedDetails = [];

            navFilter?.sub_menus?.forEach((sub) => {
              sub?.detaills?.forEach((detail) => {
                if (
                  changeUrl(detail?.title)?.toLowerCase() ===
                  changeUrl(params.title)?.toLowerCase()
                ) {
                  matchedDetails.push(detail);
                }
              });
            });

            const existingKeys = filteredArray.map((f) => f.fielter_key);

            matchedDetails.forEach((detail) => {
              const obj = {
                fielter_key: detail.logic_code,
                selected_values: [detail.code],
                value: [
                  {
                    data_value: detail.logic_code,
                    data_key: detail.code,
                  },
                ],
              };

              if (!existingKeys.includes(detail.logic_code)) {
                filteredArray.push(obj);
              }
            });

            // Build store array
            filteredArray.forEach((item) => {
              storeArr.push({
                key: item.fielter_key,
                value: item.selected_values || [],
              });
            });

            setStoreFilterArr(storeArr);
            setOnceUpdated(true);
            dispatch(filteredData(storeArr));
          }

          setClickPageScroll(false);
          let arr1 = [];
          for (let i = 0; i < Number(8); i++) {
            arr1.push(i);
          }
          setStoreSkeletonArr(arr1);

          const obj = {
            a: "getStoreItems",
            user_id: isLogin ? loginDatas.member_id : RandomId,
            SITDeveloper: "1",
            miniprogram_id: storeEntityIds.mini_program_id,
            tenant_id: storeEntityIds.tenant_id,
            entity_id: storeEntityIds.entity_id,
            per_page: "16",
            number: "1",
            filters: JSON.stringify(storeArr),
            diamond_params: pathname.includes("start-with-a-diamond")
              ? JSON.stringify({
                  shape: addedDiamondDatas?.st_shape,
                  from_length: addedDiamondDatas?.st_length,
                  from_width: addedDiamondDatas?.st_width,
                  from_depth: addedDiamondDatas?.st_depth,
                })
              : "[]",
            from_price: "",
            to_price: "",
            sort_by: selectedSortingValue,
            extra_currency: storeCurrencys,
            secret_key: storeEntityIds.secret_key,
            product_diy: nextStepPosition ? "PRODUCT" : paramsItem,
            store_type: "B2C",
            vertical_code: diySetupFor
              ? DiySteperDatas?.filter(
                  (item) => item.position === nextStepPosition
                )[0]?.vertical ?? isEmpty(DIYvertical)
              : vertical_code?.toUpperCase() ?? isEmpty(DIYvertical),
            // vertical_code: "OIL",
            offer_code:
              isEmpty(product_key) == "offer" ? isEmpty(getProduct) : "",
          };
          if (isItemDIY) {
            obj.diy_bom_id = diy_bom_id;
            obj.combination_id = combination_id;
            obj.diy_step =
              nextStepPosition !== 0 ? isEmpty(nextStepPosition) ?? "1" : "";
            obj.diy_type = "1";
          }
          if (getAllFilteredHome) {
            obj.dimension = dimension;
            obj.item_group = item_group;
            obj.segments = segment;
          }
          setStoreItemObj(obj);
          dispatch(storeItemObject(obj));
          productData(obj, "1");
          // setLoader(false);
          // dispatch(isFilter(false));
        } else {
          // setLoader(false);
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        // toast.error(error.message);
      });
  }, [hasMore, params, isFilters, currency, nextStepPosition, DIYvertical]);

  // const getDiyItemSteps = useCallback(() => {
  //   const obj = {
  //     SITDeveloper: "1",
  //     a: "SetupDiyVertical",
  //     store_id: storeEntityIds.mini_program_id,
  //     tenant_id: storeEntityIds.tenant_id,
  //     entity_id: storeEntityIds.entity_id,
  //     origin: domain,
  //     vertical: DIYvertical,
  //     unique_id: "",
  //   }
  //   setLoader(true);

  //   commanService
  //     .postApi("/Diy", obj)
  //     .then((res) => {
  //       if (res?.data?.success === 1) {
  //         const stepps = res?.data?.data?.filter((elm) => elm.vertical_code === DIYvertical)[0];

  //         if (stepps?.details && Array.isArray(stepps.details)) {
  //           const updatedSteps = [
  //             { position: 0, display_name: stepps?.from_display_name, vertical: stepps?.vertical_code },
  //             ...stepps.details.map((step, index) => ({
  //               ...step,
  //               position: index + 1,
  //             })),
  //             { position: stepps.details.length + 1, display_name: "Complete" },
  //           ];

  //           // const validPrevSteps = Array.isArray(steps) ? steps : [];

  //           // const mergedSteps = updatedSteps.map((newStep) => {
  //           //   const existingStep = validPrevSteps.find(
  //           //     (step) => step.position === newStep.position
  //           //   );

  //           // return newStep;
  //           // });
  //           setSteps(updatedSteps);
  //           dispatch(DiySteperData(updatedSteps));

  //         } else { }
  //       }
  //     })
  //     .catch((error) => {
  //     })
  //     .finally(() => {
  //     });
  // }, [storeEntityIds.tenant_id, dispatch, DIYvertical, currency]);

  //Api call for Next Data with hase more
  useEffect(() => {
    if (
      filteredDatas.length > 0 &&
      !isFilters &&
      filterDat?.length > 0 &&
      onceUpdated === false &&
      storeItemObj !== ""
    ) {
      setLoader(true);
      setClickPageScroll(true);
      setItemLength(Array.from({ length: 1 }));
      const obj = {
        ...storeItemObj,
        page: "1",
        number: "1",
        product_diy: nextStepPosition ? "PRODUCT" : paramsItem,
        sort_by: selectedSortingValue,
        filters: JSON.stringify(filteredDatas),
        vertical_code: diySetupFor
          ? DiySteperDatas?.filter(
              (item) => item.position === nextStepPosition
            )[0]?.vertical ?? isEmpty(DIYvertical)
          : vertical_code?.toUpperCase() ?? isEmpty(DIYvertical),
      };
      if (isItemDIY) {
        obj.diy_bom_id = diy_bom_id;
        obj.combination_id = combination_id;
        obj.diy_step =
          nextStepPosition !== 0 ? isEmpty(nextStepPosition) ?? "1" : "";
        obj.diy_type = "1";
      } else {
        delete obj.diy_bom_id;
        delete obj.combination_id;
        delete obj.diy_step;
        delete obj.diy_type;
      }
      dispatch(storeItemObject(obj));
      productData(obj, "1");
      setHasMore(true);
    }
  }, [filteredDatas]);

  //Initial Api call with back and forward conditional functionality
  useEffect(() => {
    if (Object.keys(storeEntityIds).length === 0) return;

    const shouldGetFilters =
      !onceUpdated ||
      Object.keys(storeItemObjects).length === 0 ||
      (vertical_code && Object.keys(storeProdDatas).length === 0) ||
      (paramsItem === "DIY") ||
      (!onceUpdated &&
        vertical_code &&
        !isFilters &&
        filteredDatas.some((item) => item?.value?.length > 0) &&
        Object.keys(storeProdDatas).length === 0) ||
      currency;

    if (shouldGetFilters) {
      getFilterItems();
    }
  }, [params, currency, vertical_code, nextStepPosition, DIYvertical]);


  //Update pages with has more data
  const handleChangeRow = (e) => {
    if (lastAbortController.current) {
      lastAbortController.current.abort();
    }
    const currentAbortController = new AbortController();
    lastAbortController.current = currentAbortController;
    const obj = {
      ...storeItemObj,
      filters: JSON.stringify(filteredDatas),
      number: e.toString(),
    };
    if (isItemDIY) {
      obj.diy_bom_id = diy_bom_id;
      obj.combination_id = combination_id;
      obj.diy_step =
        nextStepPosition !== 0 ? isEmpty(nextStepPosition) ?? "1" : "";
      obj.diy_type = "1";
    }
    setStoreItemObj(obj);
    dispatch(storeItemObject(obj));
    if (clickPageScroll === false) {
      setLoader(true);
      let arr1 = [];
      for (let i = 0; i < Number(8); i++) {
        arr1.push(i);
      }
      setStoreSkeletonArr(arr1);
      productData(obj, "0", currentAbortController.signal);
    }
    window.scrollTo({ top: window.scrollY, behavior: "smooth" });
  };

  //Show more Product data
  const handleShowMore = () => {
    if (totalPages) {
      const totalRows = totalPages ? totalPages : 1;
      if (itemsLength.length >= totalRows) {
        setHasMore(false);
        return;
      } else {
        setHasMore(true);
      }
      if (clickPageScroll === false) {
        setTimeout(() => {
          setItemLength(itemsLength.concat(Array.from({ length: 1 })));
          handleChangeRow(itemsLength.concat(Array.from({ length: 1 })).length);
        }, 500);
      }
      window.scrollTo({ top: window.scrollY, behavior: "smooth" });
    }
  };

  //APi call for Show more data
  const fetchPosts = useCallback(
    async (obj) => {
      if (lastAbortController.current) {
        lastAbortController.current.abort();
      }
      const currentAbortController = new AbortController();
      lastAbortController.current = currentAbortController;
      await productData(obj, "1", currentAbortController.signal);
    },
    [productData]
  );

  const onCheckSortBy = (val, e) => {
    // dispatch(filteredData([]));
    setLoader(true);
    setSelectedSortingValue(e.target.value);
    window.scrollTo(0, 0);
    let arr1 = [];
    for (let i = 0; i < Number(8); i++) {
      arr1.push(i);
    }
    setStoreSkeletonArr(arr1);
    setOrignalData([]);
    setClickPageScroll(true);
    if (e.target.value) {
      setSortBy(e.target.value);
    } else {
      setSortBy("");
    }
    setItemLength(Array.from({ length: 1 }));
    const obj = {
      ...storeItemObj,
      filters: JSON.stringify(filteredDatas),
      sort_by: e.target.value,
      number: "1",
    };
    setStoreItemObj(obj);
    dispatch(storeItemObject(obj));
    fetchPosts(obj);
    setHasMore(true);
  };

  // Handle vertical code update on URL change
  useEffect(() => {
    const newVerticalCode = params.verticalCode || "";
    if (newVerticalCode !== verticalCode) {
      setVerticalCode(newVerticalCode);
    }
  }, [params.verticalCode]);

  //Initial Reset for all declared states
  useEffect(() => {
    setItemLength(Array.from({ length: 1 }));
    dispatch(storeProdData({}));
    if (params.title !== undefined) {
      setClickPageScroll(true);
      dispatch(isFilter(true));
      setOnceUpdated(false);
    } else {
      dispatch(isFilter(false));
      setOnceUpdated(true);
    }
    const newVerticalCode = params.verticalCode || "";
    if (vertical_code === "" || newVerticalCode !== verticalCode) {
      let arr1 = [];
      for (let i = 0; i < Number(8); i++) {
        arr1.push(i);
      }
      setStoreSkeletonArr(arr1);
      dispatch(filterData([]));
      dispatch(filteredData([]));
      setStoreFilterArr([]);
      setOrignalData([]);
      setProductDataList([]);
      setProductAll({});
      setTotalPages("");
      dispatch(isFilter(false));
      setStoreItemObj({});
      dispatch(storeItemObject({}));
    }
    dispatch(activeDIYtabs("Jewellery"));
    setHasMore(true);
  }, [params]);

  // offer and engraving price plus
  const calculatePrice = (
    specificationData,
    selectedOffer,
    saveEngraving,
    SaveEmbossing,
    embossingData,
    serviceData
  ) => {
    let storeBasePrice = parseFloat(specificationData?.final_total) || 0;
    let offerPrice = 0;
    let customDuty = 0;
    let tax = 0;
    let price = 0;

    if (Array.isArray(selectedOffer) && selectedOffer.length > 0) {
      let discountValue = extractNumber(selectedOffer[0]?.discount) || 0;
      if (selectedOffer[0]?.offer_type === "FLAT") {
        offerPrice = discountValue;
      } else {
        offerPrice =
          parseFloat(((storeBasePrice * discountValue) / 100).toFixed(2)) || 0;
      }
    }

    let engravingPrice =
      saveEngraving && engravingData?.service_rate
        ? extractNumber(engravingData?.service_rate.toString()) || 0
        : 0;

    let embossingPrice =
      SaveEmbossing === true
        ? extractNumber(embossingData?.[0]?.service_rate.toString())
        : 0;

    let otherService = serviceData?.some(
      (item) => item.is_selected === true || item.is_selected === "1"
    )
      ? serviceData
          ?.filter(
            (item) => item.is_selected === true || item.is_selected === "1"
          )
          .reduce((total, item) => {
            const price = parseFloat(extractNumber(item.service_rate));
            return isNaN(price) ? total : total + price;
          }, 0)
      : 0;

    let customPer = extractNumber(specificationData?.custom_per) || 0;
    let taxPer = extractNumber(specificationData?.tax1) || 0;

    customDuty =
      parseFloat(
        (
          ((storeBasePrice -
            offerPrice +
            engravingPrice +
            embossingPrice +
            otherService) *
            customPer) /
          100
        ).toFixed(2)
      ) || 0;
    tax =
      parseFloat(
        (
          ((storeBasePrice -
            offerPrice +
            customDuty +
            engravingPrice +
            embossingPrice +
            otherService) *
            taxPer) /
          100
        ).toFixed(2)
      ) || 0;

    price =
      storeBasePrice -
      offerPrice +
      engravingPrice +
      embossingPrice +
      otherService +
      customDuty +
      tax;
    return numberWithCommas(price.toFixed(2));
  };

  //DIY Initial reset for data with required dependencies
  useEffect(() => {
    if (diySetupFor === true) {
      if (ActiveStepsDiys < DiySteperDatas?.length - 1) {
        dispatch(storeSpecData({}));
        dispatch(storeProdData({}));
      }
      dispatch(storeEmbossingData([]));
      dispatch(saveEmbossings(false));
      dispatch(previewImageDatas([]));
      dispatch(activeImageData([]));
      dispatch(engravingObj({}));

      if (
        (isEmpty(typeof window !== "undefined" && sessionStorage.getItem("DIYVertical")) === "" &&
          DIYvertical === null &&
          paramsItem === "DIY" &&
          isDiamoDiy == false) ||
        (isEmpty(typeof window !== "undefined" && sessionStorage.getItem("DIYVertical")) === "" &&
          DIYvertical !== null &&
          paramsItem === "DIY" &&
          isDiamoDiy === false)
      ) {
        dispatch(DiySteperData([]));
        dispatch(ActiveStepsDiy(0));
        router.push("/make-your-customization");
      }

      if (
        (isItemDIY === true &&
          perfumeVertical(DIYvertical) !== true &&
          DiySteperDatas?.length === 0) ||
        ((isJewelDiy === true || isDiamoDiy === true) &&
          DiySteperDatas?.length > 0) ||
        (isJewelDiy === true && jewelVertical(DIYvertical) !== true) ||
        (isDiamoDiy === true && jewelVertical(DIYvertical) === true)
      ) {
        dispatch(DiySteperData([]));
        dispatch(ActiveStepsDiy(0));
        router.push("/make-your-customization");
      }
    }
  }, [diySetupFor, params, isDiamoDiy, isJewelDiy, isItemDIY]);

  //Add to cart
  const handleAddProductToCart = (data) => {
    let updatedImageDataList = [];

    data?.image_types.forEach((type, index) => {
      if (type !== "Video" && type !== "360 View") {
        let parsedEmbossingArea = data.image_area?.[index];
        if (typeof parsedEmbossingArea === "string") {
          try {
            parsedEmbossingArea = JSON.parse(parsedEmbossingArea);
          } catch (e) {
            // console.error("Error parsing embossingArea:", e);
          }
        }
        updatedImageDataList.push({
          type: type,
          url: data?.image_urls[index] || "",
          area: parsedEmbossingArea,
          price: data?.service_data?.filter(
            (item) =>
              item.service_code === "EMBOSSING" &&
              item.service_type === "Special"
          )?.[0]?.service_rate,
          currency: data?.service_data?.filter(
            (item) =>
              item.service_code === "EMBOSSING" &&
              item.service_type === "Special"
          )?.[0]?.msrv_currency,
          embImage: "",
          embImageArea: {
            left: 20,
            top: 20,
            width: 50,
            height: 50,
          },
          widthInInches: null,
          heightInInches: null,
          binaryFile: null,
        });
      }
    });

    // setActiveImg(updatedImageDataList.filter(item => item.area !== ""));
    const initServiceData = data.service_data.map((item) => ({
      ...item,
      is_selected: false,
    }));
    const services = [];
    initServiceData.forEach((element) => {
      const serviceItem = {
        text: "",
        type: "",
        image: "",
        is_selected: element.is_selected,
        currency: element?.msrv_currency,
        price: element?.service_rate,
        font_size: element?.font_size,
        min_character: element?.min_character,
        max_character: element?.max_character,
        unique_id: element?.service_unique_id,
        service_code: element?.service_code,
        service_name: element?.service_name,
        service_type: element?.service_type,
      };

      if (
        element?.service_code == "ENGRAVING" &&
        element.service_type === "Special"
      ) {
        serviceItem.type = "";
        serviceItem.text = "";
        serviceItem.is_selected = "0";
      }

      if (
        element?.service_code == "EMBOSSING" &&
        element.service_type === "Special"
      ) {
        serviceItem.image = updatedImageDataList.filter(
          (item) => item.area !== ""
        );
        serviceItem.is_selected =
          updatedImageDataList
            .filter((item) => item.area !== "")
            .some((img) => img?.embImage !== "") == true
            ? "1"
            : "0";
      }

      data.service_data
        .filter((item) => item.service_type === "Normal")
        .forEach((ele) => {
          if (ele.service_unique_id == element?.service_unique_id) {
            serviceItem.is_selected = "0";
          }
        });
      services.push(serviceItem);
    });
    data.service_json = services;
    addProductToCart(data);
  };

  return (
    <main className="page-wrapper">
      {loader && <Loader />}
      <div className="mb-4 pb-lg-3"></div>
      <section className="shop-main container">
        {paramsItem === "DIY" && !isItemDIY ? (
          <DIYSteps product_type="Product" calculatePrice={calculatePrice} />
        ) : null}
        {paramsItem === "DIY" && isItemDIY ? (
          <DIYSetupAP
            product_type="Product"
            calculatePrice={calculatePrice}
            steps={steps}
            setActiveIndex={setActiveIndex}
          />
        ) : null}
        <div className="d-flex justify-content-between mb-4 pb-md-2">
          <div className="breadcrumb mb-0 d-none d-md-block flex-grow-1">
            <BreadCumb /> ({productAll?.total_rows})
          </div>

          <div className="shop-acs d-flex align-items-center justify-content-between justify-content-md-end flex-grow-1">
            <select
              className="shop-acs__select form-select w-auto border-0 py-0 order-1 order-md-0"
              aria-label="Sort Items"
              name="total-number"
              value={selectedSortingValue}
              onChange={(e) => {
                onCheckSortBy("", e);
              }}
            >
              {sortingOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="shop-asc__seprator mx-3 bg-light d-none d-md-block order-md-0"></div>

            <div className="col-size align-items-center order-1 d-none d-lg-flex">
              <span className="text-uppercase fw-medium me-2">View</span>
              {itemPerRow.map((elm, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColView(elm)}
                  className={`btn-link fw-medium me-2 js-cols-size ${
                    selectedColView == elm ? "btn-link_active" : ""
                  } `}
                >
                  {elm}
                </button>
              ))}
            </div>
            {/* <!-- /.col-size --> */}
            {filteredDatas?.length > 0 && (
              <>
                <div className="shop-asc__seprator mx-3 bg-light d-none d-lg-block order-md-1"></div>

                <div className="shop-filter d-flex align-items-center order-0 order-md-3">
                  <button
                    className="btn-link btn-link_f d-flex align-items-center ps-0 js-open-aside"
                    onClick={openModalShopFilter}
                  >
                    <i className="me-2 ic_filter"></i>
                    <span className="text-uppercase fw-medium d-inline-block align-middle">
                      Filter
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {/* <!-- /.d-flex justify-content-between --> */}
        <InfiniteScroll
          className={`products-grid row row-cols-1 row-cols-md-3 row-cols-lg-${selectedColView}`}
          id="products-grid"
          dataLength={orignalData?.length}
          next={handleShowMore}
          hasMore={hasMore}
          scrollThreshold={0.7}
          loader={
            loader === true && (
              <SkeletonModal
                page="product"
                storeSkeletonArr={storeSkeletonArr}
              />
            )
          }
        >
          {orignalData?.length > 0
            ? orignalData?.map((elm, i) => {
                var megaMenu = JSON.parse(
                  typeof window !== "undefined" && sessionStorage.getItem("megaMenus")
                ).navigation_data?.filter(
                  (item) => item.product_vertical_name === elm.vertical_code
                )[0];
                return (
                  <div key={i} className="product-card-wrapper">
                    <div className="product-card mb-3 mb-md-4">
                      <div className="pc__img-wrapper">
                        <Swiper
                          className="shop-list-swiper   swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden background-img js-swiper-slider"
                          slidesPerView={1}
                          modules={[Navigation]}
                          lazy={"true"}
                          navigation={{
                            prevEl: ".prev" + i,
                            nextEl: ".next" + i,
                          }}
                        >
                          {elm?.image_urls?.map((elm2, i) => (
                            <SwiperSlide key={i} className="swiper-slide">
                              <Link
                                onClick={() => {
                                  if (
                                    pathname.includes(
                                      "start-with-a-diamond"
                                    )
                                  ) {
                                    dispatch(filteredData(filteredDatas));
                                    dispatch(activeDIYtabs("Jewellery"));
                                  } else {
                                    dispatch(filteredData(filteredDatas));
                                    dispatch(activeDIYtabs("Jewellery"));
                                  }
                                }}
                                href={
                                  pathname.includes(
                                    "start-with-a-diamond"
                                  )
                                    ? `/make-your-customization/start-with-a-diamond/jewellery/${changeUrl(
                                        `${
                                          elm.product_name +
                                          "-" +
                                          elm.variant_unique_id
                                        }`
                                      )}`
                                    : pathname.includes(
                                        "start-with-a-item"
                                      )
                                    ? `/make-your-customization/start-with-a-item/${changeUrl(
                                        `${
                                          elm.product_name +
                                          "-" +
                                          elm.variant_unique_id
                                        }`
                                      )}`
                                    : pathname.includes(
                                        "start-with-a-setting"
                                      ) ||
                                      pathname.includes("offer") ||
                                      filteredDatas.some(
                                        (item) => item.value.length > 0
                                      ) === false
                                    ? `${pathname}/${changeUrl(
                                        `${
                                          elm.product_name +
                                          "-" +
                                          elm.variant_unique_id
                                        }`
                                      )}`
                                    : pathname.includes("type") &&
                                      elm?.jewellery_product_type_name !== ""
                                    ? `/products/${changeUrl(
                                        megaMenu?.menu_name
                                      )}/type/${changeUrl(
                                        elm?.jewellery_product_type_name
                                      )}/${changeUrl(
                                        `${
                                          elm.product_name +
                                          "-" +
                                          elm.variant_unique_id
                                        }`
                                      )}`
                                    : `${pathname}/${changeUrl(
                                        `${
                                          elm.product_name +
                                          "-" +
                                          elm.variant_unique_id
                                        }`
                                      )}`
                                }
                                refresh="true"
                              >
                                <LazyLoadImage
                                  effect="blur"
                                  loading="lazy"
                                  src={elm2}
                                  width="330"
                                  height="400"
                                  alt={elm.product_name}
                                  className="pc__img"
                                />
                              </Link>
                            </SwiperSlide>
                          ))}

                          <span
                            className={`cursor-pointer pc__img-prev ${
                              "prev" + i
                            } `}
                          >
                            <svg
                              width="7"
                              height="11"
                              viewBox="0 0 7 11"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_prev_sm" />
                            </svg>
                          </span>
                          <span
                            className={`cursor-pointer pc__img-next ${
                              "next" + i
                            } `}
                          >
                            <svg
                              width="7"
                              height="11"
                              viewBox="0 0 7 11"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="#icon_next_sm" />
                            </svg>
                          </span>
                        </Swiper>
                        {paramsItem !== "DIY" && (
                          <button
                            className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside"
                            onClick={() => handleAddProductToCart(elm)}
                            title={
                              isAddedToCartProducts(elm.item_id)
                                ? "Already Added"
                                : "Add to Cart"
                            }
                          >
                            {isAddedToCartProducts(elm.item_id)
                              ? "Already Added"
                              : "Add To Cart"}
                          </button>
                        )}
                      </div>

                      <div className="pc__info position-relative">
                        <p className="pc__category">
                          {elm.jewellery_product_type_name}
                        </p>
                        <h2 className="pc__title">
                          <Link
                            href={`${pathname}/${changeUrl(
                              `${
                                elm.product_name + "-" + elm.variant_unique_id
                              }`
                            )}`}
                          >
                            {elm.product_name}
                          </Link>
                        </h2>
                        <div className="product-card__price d-flex">
                          {elm.coupon_code ? (
                            <>
                              {" "}
                              <span className="money price price-old">
                                {elm.currency_symbol} {elm.origional_price}
                              </span>
                              <span className="money price price-sale">
                                {elm.currency_symbol} {elm.final_total_display}
                              </span>
                            </>
                          ) : (
                            <span className="money price">
                              {elm.currency_symbol} {elm.final_total_display}
                            </span>
                          )}
                        </div>

                        <button
                          className={`pc__btn-wl position-absolute top-0 end-0 bg-transparent border-0 js-add-wishlist ${
                            isAddedtoWishlist(elm?.item_id) ? "active" : ""
                          }`}
                          onClick={() => toggleWishlist(elm)}
                          title="Add To Wishlist"
                          aria-label="Add To Wishlist"
                        >
                          <i
                            className={`${
                              isAddedtoWishlist(elm?.item_id)
                                ? "ic_heart_fill"
                                : "ic_heart"
                            }`} aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            : loader === false &&
              orignalData?.length === 0 && (
                <div className="d-flex justify-content-center w-100">
                  <Image
                    src={NotFoundImg}
                    loading="lazy"
                    width={500}
                    height={500}
                    alt="Record Not found"
                  />
                </div>
              )}
        </InfiniteScroll>
      </section>
    </main>
  );
}
