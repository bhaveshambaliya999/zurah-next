import commanService from "../../../CommanService/commanService";
import { getAllJourneyData } from "../../../Redux/action";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Instagram() {
   //State Declerations
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const [journeyList, setJourneyList] = useState([]);
  const [loader, setLoader] = useState(false);

  //Get Journey details API call
  useEffect(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      getJourneyDetails();
    } else {
      setLoader(false);
    }
  }, [storeEntityIds]);

  //Get Journey Details data
  const getJourneyDetails = useCallback(() => {
    if (Object.keys(storeEntityIds).length > 0) {
      setLoader(true);
      const obj = {
        a: "GetJourney",
        store_id: storeEntityIds.mini_program_id,
        tenant_id: storeEntityIds.tenant_id,
        entity_id: storeEntityIds.entity_id,
        store_type: "B2C",
        unique_id: "",
      };
      commanService.postLaravelApi("/WarrantyCard", obj).then((res) => {
        setJourneyList(res.data.data);
        // dispatch(getAllJourneyData(res.data.data))
        setLoader(false);
      });
    }
  }, [storeEntityIds]);
  
  return (
    <section className="instagram px-1 position-relative full-width_padding-20">
      {journeyList && journeyList.length > 0 ? (
        <>
      <h2 className="section-title text-uppercase fs-36 text-center mb-3 pb-2 pb-xl-3">Pics or It Didn’t <span className="fw-semi-bold">Happen!</span></h2>
      <div className="row row-cols-2 row-cols-md-4 row-cols-xl-8">
      {journeyList
              ? journeyList.map((elm, i) => (
                <Link to={`/dashboard/viewjourney?unique_id=${elm.unique_id}&type=${elm.type ?? 'S'}`} key={i} className="instagram__tile"  aria-label={"view journey"}>
            <div href="https://instagram.com"  target="_blank" className="position-relative overflow-hidden d-block effect overlay-plus" >
              <Image
                loading="lazy"
                className="instagram__img"
                src={elm.image}
                width={232}
                height={232}
                alt="Insta image 27"
              />
            </div>
          </Link>
        ))
        : ""}
      </div>
     
      </>) : (
        ""
      )}
    </section>
  );
}
