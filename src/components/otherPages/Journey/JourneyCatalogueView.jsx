import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "./JourneyCatalogueView.scss";
import Loader from "@/CommanUIComp/Loader/Loader";
import { changeUrl, isEmpty } from "@/CommanFunctions/commanFunctions";
import { toast } from "react-toastify";
import commanService from "@/CommanService/commanService";

const JourneyCatalogueView = (props) => {
  const { uniqueId, type } = props;
  const loginDatas = useSelector((state) => state.loginData);
//   const getAllJourneyDatas = useSelector((state) => state.getAllJourneyData);
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  //   const params = useParams();
  const navigate = useNavigate();
  // const [searchParams, setSearchParams]=useSearchParams();
  //   const queryParams = new URLSearchParams(location.search);
  // const getAllData = getAllJourneyDatas?.filter((item)=>item.unique_id === queryParams?.getAll('unique_id'))?.[0]
  // const uniqueId = useSearchParams({unique_id: getAllData.unique_id})
  //   console.log(uniqueId);

  // //   let uniqueId = getAllData?.unique_id;
  //   let type = queryParams?.getAll('type');

  const [loading, setLoading] = useState(false);
  const [onceUpdated, setOnceUpdated] = useState(false);
  const [catalogDataList, setCatalogDataList] = useState([]);
  const [dd, setDate] = useState("");
  const [Active, setActive] = useState(false);

  const journeyReviewData = useCallback(() => {
    const catalog = {
      a: "GetJourneyReview",
      store_type: "B2C",
      counsumer_id: isEmpty(loginDatas.member_id),
      store_id: isEmpty(storeEntityIds.mini_program_id),
      unique_id: isEmpty(uniqueId),
    };
    setLoading(true);
    commanService
      .postLaravelApi("/WarrantyCard", catalog)
      .then((res) => {
        if (res.data.success == 1) {
          let data = res?.data?.data;
          const formattedDate = new Date(
            data?.[0]?.create_at
          ).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          setDate(formattedDate);
          data[0].data_url =
            window.location.origin +
            "/assets/Js/landing.php?og_title=" +
            encodeURIComponent(data?.[0]?.title) +
            "&og_image=" +
            encodeURIComponent(data?.[0]?.image) +
            "&og_description=" +
            encodeURIComponent(data?.[0]?.review) +
            "&ext_url=" +
            encodeURIComponent(`/dashboard/viewjourney?unique_id=${isEmpty(uniqueId)}`);
          setCatalogDataList(data);
          setLoading(false);
        } else {
          toast.error(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }, []);

  const journeyData = useCallback(() => {
    var obj = {
      a: "GetJourney",
      store_id: storeEntityIds.mini_program_id,
      tenant_id: storeEntityIds.tenant_id,
      entity_id: storeEntityIds.entity_id,
      store_type: "B2C",
      unique_id: isEmpty(uniqueId),
    };
    setLoading(true)
    commanService.postLaravelApi("/WarrantyCard", obj).then((res) => {
      if (res?.data?.success === 1) {
        var data = res.data.data;
        data[0].data_url =
          window.location.origin +
          "/assets/Js/landing.php?og_title=" +
          encodeURIComponent(data?.[0]?.title) +
          "&og_image=" +
          encodeURIComponent(data?.[0]?.image) +
          "&og_description=" +
          encodeURIComponent(data?.[0]?.review) +
          "&ext_url=" +
          encodeURIComponent(`/dashboard/viewjourney?unique_id=${isEmpty(uniqueId)}`);
        setCatalogDataList(data);
        setLoading(false);
      }
    });
  }, [storeEntityIds, uniqueId]);

  useEffect(() => {
    if (Object.keys(storeEntityIds)?.length > 0) {
      if (isEmpty(uniqueId) !== "" && type != "S") {
        if (!onceUpdated) {
          setOnceUpdated(true);
          if(Object.keys(loginDatas)?.length > 0){
              journeyReviewData();
          }
        }
      } else {
        journeyData();
      }
    }
  }, [storeEntityIds, uniqueId, onceUpdated]);

  return (
    <div id="viewJourney">
      {loading && <Loader />}
      {catalogDataList.length > 0 ? (
        <div className={`container my-2`}>
          <div className="cunsumer_detail">
            <div className="apply_detail">
              <div className="d-flex flex-wrap">
                {type != "S" && (
                  <>
                    <span>
                      {catalogDataList[0]?.order_id}&nbsp;&nbsp;|&nbsp;&nbsp;
                    </span>
                    <span>
                      Created At {isEmpty(dd)}&nbsp;&nbsp;|&nbsp;&nbsp;
                    </span>
                  </>
                )}
                <span className="share" onClick={() => setActive(!Active)}>
                  <a className="share_icon">
                    <i className="ic_share fw-bold" />
                  </a>
                </span>
                <div className={`${Active ? "active" : "icons"}`}>
                  <a
                    href={`https://twitter.com/intent/tweet?original_referer=${encodeURIComponent(
                      isEmpty(catalogDataList[0]?.publish_url)
                    )}&source=${encodeURIComponent(
                      "tweetbutton"
                    )}&text=${encodeURIComponent(
                      isEmpty(catalogDataList[0]?.title) +
                        " #proposal #engagement"
                    )}&url=${encodeURIComponent(
                      isEmpty(catalogDataList[0]?.publish_url)
                    )}`}
                    target="_blank"
                  >
                    <i className="ic_twitter fw-bold" />
                  </a>
                  <a
                    href={`http://www.facebook.com/sharer.php?u=${encodeURIComponent(
                      catalogDataList[0]?.data_url
                    )}`}
                    target="_blank"
                  >
                    <i className="ic_facebook fw-bold" />
                  </a>
                  {/* <a href={`https://www.instagram.com/sharer.php?u=${(encodeURIComponent(isEmpty(catalogDataList[0]?.publish_url)))}`} target="_blank"><i className="ic_instagram fw-bold" /></a> */}
                </div>
              </div>
            </div>
            {type != "S" && (
              <div className="share_back">
                {/* <button type="button" className='back_btn' onClick={() => navigate(`/profile/journey-catalog/${true}`)}><i className='ic_left' />Back To Journey</button> */}
                <button
                  type="button"
                  className="back_btn"
                  onClick={() => navigate(`/account_journey`)}
                >
                  <i className="ic_left" />
                  Back To Journey
                </button>
              </div>
            )}
          </div>
          <iframe
            src={catalogDataList[0]?.publish_url}
            width={"100%"}
            height={"100vh"}
            title="External Content"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default JourneyCatalogueView;
