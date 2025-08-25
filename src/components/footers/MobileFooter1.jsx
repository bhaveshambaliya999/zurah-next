import Link from "next/link";
import { useEffect, useState } from "react";
import { diamondNumber, diamondPageChnages, filterData, filteredData, isFilter, storeActiveFilteredData, storeFilteredData, storeFilteredDiamondObj, storeItemObject } from "@/Redux/action";
import { useDispatch, useSelector } from "react-redux";

export default function MobileFooter1() {

  //states and variable declarations
  const [showFooter, setShowFooter] = useState(false);
  const favCounts = useSelector((state) => state.favCount);
  const dispatch = useDispatch();
  
  useEffect(() => {
    setShowFooter(true);
  }, []);

  const handleOnClick = () => {
    dispatch(isFilter(true));
    dispatch(filterData([]));
    dispatch(filteredData([]));
    dispatch(storeItemObject({}));
    dispatch(storeFilteredDiamondObj({}));
    dispatch(storeActiveFilteredData({}));
    dispatch(storeFilteredData({}));
    dispatch(diamondPageChnages(false));
    dispatch(diamondNumber(""));
  }

  return (
    <footer
      className={`footer-mobile container w-100 px-5 d-md-none bg-body ${showFooter ? "position-fixed footer-mobile_initialized" : ""
        }`}
    >
      <div className="row text-center">
        <div className="col-4">
          <Link
            href="/"
            className="footer-mobile__link d-flex flex-column align-items-center"
            onClick={() => handleOnClick()}
          >
            <i className="ic_icon_home">  </i>
            <span>Home</span>
          </Link>
        </div>
        {/* <!-- /.col-3 --> */}

        <div className="col-4">
          <Link
            href={`/products/JEWEL`}
            className="footer-mobile__link d-flex flex-column align-items-center"
            onClick={() => handleOnClick()}
          >
            <i className="ic_icon_hanger"></i>
            <span>Shop</span>
          </Link>
        </div>
        {/* <!-- /.col-3 --> */}

        <div className="col-4">
          <Link
            href="/account_wishlist"
            className="footer-mobile__link d-flex flex-column align-items-center"
            onClick={() => handleOnClick()}
          >
            <div className="position-relative">
              <i className="ic_icon_heart"> </i>
              <span className="wishlist-amount d-block position-absolute js-wishlist-count">
                {favCounts ?? 0}
              </span>
            </div>
            <span>Wishlist</span>
          </Link>
        </div>
        {/* <!-- /.col-3 --> */}
      </div>
      {/* <!-- /.row --> */}
    </footer>
  );
}
