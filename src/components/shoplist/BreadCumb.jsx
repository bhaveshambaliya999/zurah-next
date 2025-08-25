import { changeUrl, isEmpty } from "@/CommanFunctions/commanFunctions";
import {
  activeDIYtabs,
  activeImageData,
  ActiveStepsDiy,
  addedDiamondData,
  addedRingData,
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
  isLoginModal,
  isRegisterModal,
  isRingSelected,
  IsSelectedDiamond,
  jeweleryDIYimage,
  jeweleryDIYName,
  naviGationMenuData,
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  usePathname,
  useRouter,
  useParams,
  useSearchParams,
} from "next/navigation";

export default function BreadCumb({
  showDiamondDetails,
  diamondDataList,
  handleReset,
  uniqueId,
  type,
}) {

  //State declerations
const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const diamondSelectShapes = useSelector((state) => state.diamondSelectShape);
  const activeDIYtabss = useSelector((state) => state.activeDIYtabs);
  const loginDatas = useSelector((state) => state.loginData);
  const navigationMenuData = useSelector((state) => state.naviGationMenuData);
  const DIYNames = useSelector((state) => state.DIYName);

  const dispatch = useDispatch();
  const [selectedProductName, setSelectedProductName] = useState("");
  const [showMenuName, setShowMenuName] = useState("Products");
  const isDiy = location.pathname.includes("/make-your-customization")

  //Update menu name from Params
  useEffect(() => {
    if (params.variantId?.includes("pv") || params.variantId) {
      var splitvalue = params.variantId.split("-");
      var productName = splitvalue.slice(0, splitvalue.length - 1).join(" ");
      setSelectedProductName(productName);
    }

    if (!location.pathname.includes("diamond") && !location.pathname.includes("gemstone")) {
      navigationMenuData.forEach(element => {
        if (element.product_vertical_name === params.verticalCode) {
          setShowMenuName(element.menu_name);
        }
      });
    }
  }, [params.variantId, location]);

  //Onclick function for Make Your Customization
  const handleSetDiy = () => {
    dispatch(DiySteperData([]));
    dispatch(ActiveStepsDiy(0));
    router.push("/make-your-customization", { replace: true });
    sessionStorage.removeItem("DIYVertical")
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
    dispatch(activeDIYtabs("Jewellery"));
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
    dispatch(engravingObj({}))
    // dispatch(DIYName(""));
  }
  //Onclick function for DIY start with setting
  const handleStartWithSetting = () => {
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(diamondDIYimage(""));
    dispatch(finalCanBeSetData([]));
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYimage(""));
    router.push("/make-your-customization/start-with-a-setting", { replace: true });
  };
  //Onclick function for DIY start with diamond
  const handleStartWithDiamond = () => {
    router.push("/make-your-customization/start-with-a-diamond", { replace: true });
    dispatch({
      type: "CLEAR_ALL_STATE",
    });
    dispatch(diamondPageChnages(false));
    dispatch(storeFilteredData({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(diamondNumber(""));
    dispatch(storeDiamondNumber(""));
    dispatch(addedRingData({}));
    dispatch(activeDIYtabs("Diamond"));
    dispatch(IsSelectedDiamond(false));
    dispatch(isRingSelected(false));
    dispatch(addedDiamondData({}));
    dispatch(finalCanBeSetData([]));
    dispatch(storeSpecData({}));
    dispatch(diamondImage(""));
    dispatch(diamondShape(""));
  };
  //Onclick function for DIY Item to Item
  const handleStartWithItems = () => {
    router.push("/make-your-customization/start-with-a-item", { replace: true });
    sessionStorage.removeItem("DIYVertical")
    dispatch(storeEmbossingData([]));
    dispatch(ActiveStepsDiy(0));
    dispatch(DiySteperData([]));
    dispatch(saveEmbossings(false));
    dispatch(previewImageDatas([]));
    dispatch(activeImageData([]));
    dispatch(engravingObj({}))
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
    dispatch(storeSelectedDiamondPrice(""));
    dispatch(diamondDIYimage(""));
    dispatch(finalCanBeSetData([]));
    dispatch(activeDIYtabs("Jewellery"));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYName(""));
    dispatch(storeSpecData({}));
    dispatch(storeProdData({}));
    dispatch(storeSelectedDiamondData([]));
    dispatch(jeweleryDIYimage(""));
  };

  //Onclick function for Home page navigation
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
    dispatch(engravingObj({}));
    sessionStorage.removeItem('DIYVertical');
    dispatch(DIYName(""));
  };

  return (
    <>
      <Link
        href="/"
        className="menu-link menu-link_us-s text-capitalize fw-medium"
        onClick={() => homePageNavigation()}
      >
        Home
      </Link>
      <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
        /
      </span>
      {(location.pathname.includes(`${params.title}`) ||
        location.pathname.includes(`${params.variantId}`)) &&
        !location.pathname.includes("/start-with-a-setting") &&
        !location.pathname.includes("/start-with-a-diamond") && !location.pathname.includes("/start-with-a-item") && !isDiy ? (
        <Link
          href={`/products/${params.verticalCode}`}
          onClick={() => {
            dispatch(isFilter(true));
            dispatch(filterData([]));
            dispatch(filteredData([]));
            dispatch(storeItemObject({}));
          }}
          className="menu-link menu-link_us-s text-capitalize fw-medium"
        >
          {showMenuName}
        </Link>
      ) : !location.pathname.includes("/start-with-a-setting") && !location.pathname.includes("/start-with-a-item") && !isDiy &&
        (location.pathname.includes("diamond") ||
          (location.pathname.includes("gemstone") &&
            location.pathname.split("/").length === 2)) &&
        !location.pathname.includes("/start-with-a-diamond") ? (
        showDiamondDetails === false ? (
          <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
            {location.pathname?.replace("/", "")}
          </div>
        ) : (
          <div
            className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
            onClick={handleReset}
          >
            {location.pathname?.replace("/", "")}
          </div>
        )
      ) : location.pathname.includes("dashboard") ? (
        <Link
          href={`${Object.keys(loginDatas).length > 0 ? "/account_dashboard" : "/"
            }`}
        >
          <span className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer">
            Dashboard
          </span>
        </Link>
      ) : isDiy ? (!location.pathname.includes("start-with-a-setting") && !location.pathname.includes("start-with-a-item") && !location.pathname.includes("start-with-a-diamond")) ?
        (
          <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
            DIY Product
          </div>
        ) : isDiy && (location.pathname.includes("start-with-a-item") || location.pathname.includes("start-with-a-setting") || location.pathname.includes("start-with-a-diamond")) ? (
          <div
            className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
            onClick={handleSetDiy}
          >
            DIY Product
          </div>) : (<div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
            DIY Product
          </div>
        ) :
        location.pathname.includes("gemstone") &&
          location.pathname.split("/").length > 2 ? (
          <div className="menu-link menu-link_us-s text-capitalize fw-medium">
            {location.pathname.split("/")[1]}
          </div>
        ) : location.pathname.includes("offer") ? (
          <Link
            href={`/products/${params.verticalCode}`}
            onClick={() => {
              dispatch(isFilter(true));
              dispatch(filterData([]));
              dispatch(filteredData([]));
              dispatch(storeItemObject({}));
            }}
            className="menu-link menu-link_us-s text-capitalize fw-medium"
          >
            {showMenuName}
          </Link>
        ) : (
          <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
            {showMenuName}
          </div>
        )}
      {
        location.pathname.includes("start-with-a-setting") ? (
          activeDIYtabss === "Jewellery" && !params.variantId ? (
            <>
              <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
                /
              </span>
              <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
                {DIYNames}
              </div>
            </>
          ) : (
            <>
              <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
                /
              </span>
              <div
                className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
                onClick={handleStartWithSetting}
              >
                {DIYNames}
              </div>
            </>
          )
        ) : location.pathname.includes("start-with-a-diamond") ? (
          activeDIYtabss === "Diamond" && !params.variantId ? (
            <>
              <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
                /
              </span>
              <div
                className={`${params.variantId !== "" ? "text-muted" : ""
                  } menu-link menu-link_us-s text-capitalize fw-medium`}
              >
                {DIYNames}
              </div>
            </>
          ) : (
            <>
              <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
                /
              </span>
              <div
                className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
                onClick={handleStartWithDiamond}
              >
                {DIYNames}
              </div>
            </>
          )
        ) : location.pathname.includes("start-with-a-item") ? !params.variantId ? (
          <>
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <div
              className={`${params.variantId !== "" ? "text-muted" : ""
                } menu-link menu-link_us-s text-capitalize fw-medium`}
            >
              {DIYNames}
            </div>
          </>
        ) : (<>
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          <div
            className="menu-link menu-link_us-s text-capitalize fw-medium cursor-pointer"
            onClick={handleStartWithItems}
          >
            {DIYNames}
          </div>
        </>
        ) : ""
      }
      {location.pathname.includes("diamond") && showDiamondDetails === true ? (
        <>
          {" "}
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          {/* <Link to={`/products/${params.verticalCode}/type/${params.title}`}> */}
          <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
            {diamondDataList?.product_name}
          </div>
          {/* </Link> */}
        </>
      ) : location.pathname.includes(`${params.title}`) ? (
        location.pathname.includes(`${params.variantId}`) ? (
          <>
            {" "}
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <Link
              href={
                window.location.pathname.includes("offer")
                  ? `/products/${params.verticalCode}/offer/${params.title}` : window.location.pathname.includes("collection")
                    ? `/products/${params.verticalCode}/collection/${params.title}`
                    : `/products/${params.verticalCode}/type/${params.title}`
              }
              onClick={() => {
                dispatch(isFilter(true));
                dispatch(filterData([]));
                dispatch(filteredData([]));
                dispatch(storeItemObject({}));
              }}
            >
              <span className="menu-link menu-link_us-s text-capitalize fw-medium">
                {params.title}
              </span>
            </Link>
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
              {selectedProductName}
            </div>
          </>
        ) : (
          <>
            {" "}
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            {/* <Link to={`/products/${params.verticalCode}/type/${params.title}`}> */}
            <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
              {params.title}
            </div>
            {/* </Link> */}
          </>
        )
      ) : location.pathname.includes(`${params.variantId}`) ? (
        location.pathname.includes("/start-with-a-diamond") && location.pathname.includes("/start-with-a-item") ? (
          <>
            {" "}
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            {/* <Link to={`/products/${params.verticalCode}/type/${params.title}`}> */}
            <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
              {selectedProductName}
            </div>
            {/* </Link> */}
          </>
        ) : (
          <>
            {" "}
            <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
              /
            </span>
            {/* <Link to={`/products/${params.verticalCode}/type/${params.title}`}> */}
            <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
              {selectedProductName}
            </div>
            {/* </Link> */}
          </>
        )
      ) : isEmpty(uniqueId) !== "" ? (
        <>
          {" "}
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          {/* <Link to={`/products/${params.verticalCode}/type/${params.title}`}> */}
          <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
            {uniqueId}
          </div>
          {/* </Link> */}
        </>
      ) : location.pathname.includes("gemstone") &&
        location.pathname.split("/").length > 2 ? (
        <>
          {" "}
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          {/* <Link to={`/products/${params.verticalCode}/type/${params.title}`}> */}
          <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
            {!diamondSelectShapes.shapeName
              ? location.pathname.split("/")[
              location.pathname.split("/").length - 1
              ]
              : diamondSelectShapes.shapeName}
          </div>
          {/* </Link> */}
        </>
      ) : location.pathname.includes("offer") && params.type !== undefined ? (
        <>
          {" "}
          <span className="breadcrumb-separator menu-link fw-medium ps-1 pe-1">
            /
          </span>
          {/* <Link to={`/products/${params.verticalCode}/type/${params.title}`}> */}
          <div className="text-muted menu-link menu-link_us-s text-capitalize fw-medium">
            {params.type}
          </div>
          {/* </Link> */}
        </>
      ) : (
        ""
      )}
    </>
  );
}
