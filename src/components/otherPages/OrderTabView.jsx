"use client";
import Link from "next/link";

export default function OrderTabView({
  allTabs,
  selectedTab,
  setSelectedTab,
  setOrderDataList,
  setTotalTabOrder,
  setCount,
  setOrderLength,
  setTotalpages,
  setSearchDetails,
  filterToggles,
  filterToggle,
  handleSelectTab,
  orderCount,
  cancelCount
}) {
  return (
    <div className="col-12 border p-3 mb-3" style={{ backgroundColor: "#e4e4e4" }}>
      <ul className="account-nav d-flex justify-content-between flex-row gap-5 flex-wrap align-items-center py-0">
        {/* {allTabs.map((elm, i) => (
          <li key={i}>
            <Link
              className={`menu-link menu-link_us-s ${
                elm == selectedTab ? "menu-link_active" : ""
              } `}
              onClick={() => {
                setOrderDataList([]);
                setSelectedTab(elm);
                setTotalTabOrder(0);
                setCount(1);
                setOrderLength(0);
                setTotalpages(1);
              }}
            >
              {elm}
            </Link>
          </li>
        ))} */}
        <div className="d-flex justify-content-start gap-4">
          <li>
            <Link
              className={`menu-link menu-link_us-s ${selectedTab === "Ordered" ? "menu-link_active" : "" } `}
              onClick={() => {
                setOrderDataList([]);
                setSelectedTab("Ordered");
                handleSelectTab()
                setTotalTabOrder(0);
                setCount(1);
                setOrderLength(0);
                setTotalpages(1);
                setSearchDetails({
                  orderId: "",
                  consumerName: "",
                  mobileNo: "",
                  status: "",
                });
                filterToggles(false);
              }}
             href="javascript:void(0)" >
              Order ({orderCount})
            </Link>
          </li>
          <li>
            <Link className={`menu-link menu-link_us-s ${selectedTab === "Cancelled" ? "menu-link_active" : "" } `}
              onClick={() => {
                setOrderDataList([]);
                setSelectedTab("Cancelled");
                setTotalTabOrder(0);
                handleSelectTab()
                setCount(1);
                setOrderLength(0);
                setTotalpages(1);
                setSearchDetails({
                  orderId: "",
                  consumerName: "",
                  mobileNo: "",
                  status: "",
                });
                filterToggles(false);
                
              }}
              href="javascript:void(0)"
            >
              Cancelled ({cancelCount})
            </Link>
          </li>
        </div>

        <div
          onClick={() => {
            filterToggles(!filterToggle);
          }}
        >
          <i className="ic_filter fs-4 fw-bold" />
        </div>

      </ul>
    </div>
  );
}
