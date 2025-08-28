import React, { useCallback, useEffect, useState, useMemo, useRef  } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import commanService from "@/CommanService/commanService";
import { changeUrl } from "@/CommanFunctions/commanFunctions";
import Image from "next/image";
import { useRouter } from "next/router";

export default function BlogDetails() {
  const isRefCall = useRef(false)
  const router = useRouter();
  const pathname = usePathname();
  const storeEntityIds = useSelector((state) => state.storeEntityId);
  const sectionDetailsDatas = useSelector((state) => state.sectionDetailsData);
 const getAllData = useMemo(() => {
    return sectionDetailsDatas.blog_list?.find((item) =>
      pathname.includes(changeUrl(item?.title))
    );
  }, [sectionDetailsDatas, pathname]);
  const { unique_id, category_id } = getAllData || {};

  const [loading, setLoading] = useState(false);
  const [uniqueId, setUniqueId] = useState(getAllData?.unique_id ?? unique_id);
  const [categoryId, setCategoryId] = useState(getAllData?.category_id ?? category_id);
  const [recentBlogDataList, setRecentBlogDataList] = useState([]);
  const [catagoryDataList, setCatagoryDataList] = useState([]);
  const [relatedCatagoryDataList, setRelatedCatagoryDataList] = useState([]);
  const [relatedBlogDataList, setRelatedBlogDataList] = useState([]);
  const [catagorieDataList, setCatagoriesDataList] = useState([]);
  const [catagoriecount, setcatagoriesCount] = useState([]);
  const [selectedBlogData, setSelectedBlogData] = useState([]);

  const [cout, setCout] = useState("");
  const [prev, setPrev] = useState("");
  const [next, setNext] = useState("");

  const blogDetailData = useCallback(
    (data) => {
      const get_blog_detail = {
        a: "getsideBlog",
        store_id: storeEntityIds.mini_program_id,
        blog_id: data === undefined ? uniqueId : data.unique_id.toLowerCase(),
        category_id:
          data === undefined ? categoryId : data.category_id.toLowerCase(),
        type: "B2C",
      };
      setLoading(true);
      commanService
        .postLaravelApi("/BlogMaster", get_blog_detail)
        .then((res) => {
          if (res.data.success == 1) {
            const resData = res.data.data.recent_blog;
            for (let index = 0; index < resData.length; index++) {
              resData[index]["count"] = index + 1;
            }
            setCatagoryDataList(resData);
            setRecentBlogDataList(resData);
            setRelatedCatagoryDataList(res.data.data.related_blog);
            setRelatedBlogDataList(res.data.data.related_blog);
            catagoryData(resData);
            if (!data) {
              resData.map((item) => {
                return item.unique_id.toLowerCase() === unique_id.toLowerCase()
                  ? setSelectedBlogData([item])
                  : "";
              });
            }
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [storeEntityIds,unique_id, category_id]
  );

  const catagoryData = (data) => {
    let catagoriearr = []; //push catagoryData name in aaray
    for (let c = 0; c < data.length; c++) {
      catagoriearr.push(data[c].category_name);
    }
    const catacount = catagoriearr.reduce((acc, ele) => {
      acc[ele] = (acc[ele] || 0) + 1;
      return acc;
    }, {}); // get count of catagoryData
    const finalcount = Object.entries(catacount);
    setcatagoriesCount(finalcount);
    const removeDuplicates = catagoriearr.filter(
      (item, index) => catagoriearr.indexOf(item) === index
    );
    setCatagoriesDataList(removeDuplicates);
  };

  const showSelectedData = (value) => {
    let datas = [value];
    setSelectedBlogData(datas);
  };

  const selectByCatagory = (catago_name, i) => {
    if (catago_name !== "All") {
      let catago_array = [];
      let related_catago_arra = [];
      for (let c = 0; c < catagoryDataList.length; c++) {
        if (catagoryDataList[c].category_name === catago_name) {
          catago_array.push(catagoryDataList[c]);
        }
      }
      for (let d = 0; d < relatedCatagoryDataList.length; d++) {
        if (relatedCatagoryDataList[d].category_name === catago_name) {
          related_catago_arra.push(relatedCatagoryDataList[d]);
        }
      }
      setRecentBlogDataList(catago_array);
      setRelatedBlogDataList(related_catago_arra);
    } else {
      setRecentBlogDataList(catagoryDataList);
      setRelatedBlogDataList(relatedCatagoryDataList);
    }
  };

  useEffect(() => {
    if(Object.keys(storeEntityIds).length>0 && !isRefCall.current){
      blogDetailData();
      isRefCall.current = true;
    }
  }, [uniqueId, blogDetailData]);

  useEffect(() => {
    selectedBlogData.map((item) => {
      setCout(item.count);
      let Pre = item.count === 1 ? 1 : item.count - 1;
      let Nexty =
        item.count === recentBlogDataList.length ? item.count : item.count + 1;
      for (let index = 0; index < recentBlogDataList.length; index++) {
        if (Pre === recentBlogDataList[index].count) {
          setPrev(recentBlogDataList[index]);
        }
        if (Nexty === recentBlogDataList[index].count) {
          setNext(recentBlogDataList[index]);
        }
        
      }
    });
  }, [selectedBlogData]);

  return (
    <main className="page-wrapper">
      <div className="mb-4 pb-4"></div>
      <section className="blog-page blog-single container">
        {selectedBlogData?.map((blog, i) => {
          let dates = new Date(blog.created_at);
          let newDate = new Date(dates).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          return (
            <React.Fragment key={i}>
              <div className="mw-930">
                <h2 className="page-title">{blog.title}</h2>
                <div className="blog-single__item-meta">
                  {/* <span className="blog-single__item-meta__author">By Admin</span> */}
                  <span className="blog-single__item-meta__date">{newDate}</span>
                  <span className="blog-single__item-meta__category">
                    {blog.category_name}
                  </span>
                </div>
              </div>
              <div className="blog-single__item-content">
                <p>
                  <Image
                    loading="lazy"
                    className="w-100 h-auto d-block"
                    src={blog?.featured_image || ""}
                    width="1410"
                    height="550"
                    alt="image"
                  />
                </p>
                <div className="mw-930">
                  <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div className="blog-single__item-pagination mw-930">
          <div className="row">
            {cout !== prev.count ? (
              <div
                className="col-lg-6"
                onClick={() => {
                  // blogDetailData(prev);
                  showSelectedData(prev);
                  router.push(`/blog-details/${changeUrl(prev?.title)}`, {
                    state: {
                      params: { unique_id: prev.unique_id, category_id: prev.category_id },
                    },
                  });
                }}
              >
                <div className="btn-link d-inline-flex align-items-center cursor-pointer">
                 <i className="ic_chavron_left fs-18"></i>
                  <span className="fw-medium">PREVIOUS POST</span>
                </div>
                <p>{prev.title}</p>
              </div>
            ) : (
              <div
                className="col-lg-6"
                style={{ opacity: "0.5", pointerEvents: "none" }}
              >
                <div className="btn-link d-inline-flex align-items-center cursor-pointer">
                 <i className="ic_chavron_left fs-18"></i>
                  <span className="fw-medium">PREVIOUS POST</span>
                </div>
                <p>{prev.title}</p>
              </div>
            )}
            {cout !== next.count ? (
              <div
                className="col-lg-6 text-lg-right"
                onClick={() => {
                  // blogDetailData(next);
                  showSelectedData(next);
                  router.push(`/blog-details/${changeUrl(next?.title)}`, {
                    state: {
                      params: { unique_id: next.unique_id, category_id: next.category_id },
                    },
                  });
                }}
              >
                <div className="btn-link d-inline-flex align-items-center cursor-pointer">
                  <span className="fw-medium me-1">NEXT POST</span>
                  <i className="ic_chavron_right fs-18"></i>
                </div>
                <p>{next.title}</p>
              </div>
            ) : (
              <div
                className="col-lg-6 text-lg-right"
                style={{ opacity: "0.5", pointerEvents: "none" }}
              >
                <div className="btn-link d-inline-flex align-items-center cursor-pointer">
                  <span className="fw-medium me-1">NEXT POST</span>
                  <i className="ic_chavron_right fs-18"></i>
                </div>
                <p>{next.title}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="section-gap"></div>
    </main>
  );
}
