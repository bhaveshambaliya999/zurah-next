import { openModalUserlogin } from "../../../utlis/aside";

export default function User() {
  return (
    <i
      onClick={openModalUserlogin}
      className="ic_icon_user fs-20" aria-hidden="true"
    >
    </i>
  );
}
