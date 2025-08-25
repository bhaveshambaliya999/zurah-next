import { useContextElement } from "@/context/Context";
import { dashboardMenuItems } from "@/data/menu";
import { loginData } from "@/Redux/action";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DashboardSidebar() {
  const router = useRouter()
  const dispatch = useDispatch();
  const { setCartProducts, setWishlistProducts, cartProducts } = useContextElement();

  return (
    <div className="col-lg-3 pe-lg-0">
      <ul className="account-nav">
        {dashboardMenuItems.map((elm, i) => (
          <li key={i}>
            <Link
              href={elm.title === "Logout" ? '/' : elm.href}
              className={`menu-link menu-link_us-s ${
                router.pathname?.includes(elm.href) ? "menu-link_active" : ""
              } `}
              onClick={async() => {
                if (elm.title === "Logout") {
                  await setCartProducts([]);
                  await setWishlistProducts([]);
                  dispatch(loginData({}));
                  sessionStorage.removeItem("loginData")
                  sessionStorage.removeItem("storeData")
                  sessionStorage.removeItem("megaMenus")
                  // router.reload()
                }
                window.scroll(0,0)
              }}
            >
              {elm.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
