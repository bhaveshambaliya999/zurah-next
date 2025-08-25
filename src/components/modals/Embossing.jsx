import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { extractNumber, numberWithCommas } from "@/CommanFunctions/commanFunctions";
import commanService from "@/CommanService/commanService";
import { Tooltip } from "react-tooltip";

const Embossing = ({
    embossingModelView, embossingModelViewJson,
    handleSetStateChangeModal,
    datas,
    itemIds,
    setLoading,
    setGetEmbossingData,
    setItemsId,
    setEmbJson, handleUpdateEmbossing, engIndex, itemAllData
}) => {
    const imgContainer = useRef();
    const imgContainers = useRef();
    const storeEntityIds = useSelector((state) => state.storeEntityId)

    const [embossingModalView, setEmbossingModalView] = useState(false)
    const [imageForPreview, setImageForPreview] = useState(false)
    const [previewImageData, setPreviewImageData] = useState([])

    const [embossingPreview, setEmbossingPreview] = useState(false)
    const [SaveEmbossing, setSaveEmbossing] = useState(false)

    const [callingFrom, setCallingFrom] = useState('');
    const [embPostionEle, setEmbPostionEle] = useState('');
    const [imageDataList, setImageDataList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [activeImg, setActiveImg] = useState([]);
    const [itemId, setItemId] = useState("")
    const [embImgPostion, setEmbImgPostion] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const [boxes, setBoxes] = useState({});

    const [startX, setStartX] = useState({ left: 0, top: 0 });
    const [startY, setStartY] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (imgContainer.current) {
            addBox(true);
        }
    }, [callingFrom, imageDataList, selectedIndex]);

    useEffect(() => {
        if (embossingModelView || embossingModelViewJson) {
            const dataEmboss = datas;
            setImageDataList(dataEmboss);
            setActiveImg(dataEmboss);
            setItemId(itemIds);
            setSelectedIndex(0)
            // Cleanup listeners on component unmount or when modalView is closed
            return () => {
                document.removeEventListener('mousemove', imgOnMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
        }
    }, [embossingModelView, embossingModelViewJson]);

    const addBox = (isTrue) => {
        const container = imgContainer.current;
        if (isTrue) {
            if (embPostionEle['image_area']) {
                const percentageValues = JSON.parse(embPostionEle['image_area']);
                setBoxes({
                    left: (percentageValues.left / 100) * container.width,
                    top: (percentageValues.top / 100) * container.height,
                    width: (percentageValues.width / 100) * container.width,
                    height: (percentageValues.height / 100) * container.height
                });
                setEmbImgPostion(percentageValues);
            }
        } else {
            setBoxes({
                left: container.width * 0.1,
                top: container.height * 0.1,
                width: container.width * 0.2,
                height: container.height * 0.2,
            });
            setEmbImgPostion({
                left: (0.1 * 100).toFixed(2),
                top: (0.1 * 100).toFixed(2),
                width: (0.2 * 100).toFixed(2),
                height: (0.2 * 100).toFixed(2)
            });
        }
    };


    const changeImage = (data, i) => {
        // setActiveImg(data);
        setSelectedIndex(i);
    };

    const changeEmboFile = (event) => {
        const extension = event.target.files[0]?.name.split(".").pop().toLowerCase();

        if (extension === 'jpg' || extension === 'png' || extension === 'jpeg' || extension === 'webp') {
            activeImg.binaryFile = event.target.files[0];
            event.target.value = ''; // Clear input value
            addEmbImage();
        } else {
            toast.error("Only JPG,JPEG,PNG AND WEBP Files Are Allowed.");
        }
    };

    const addEmbImage = async () => {
        const obj = {
            a: 'UploadEmbossingImages',
            SITDeveloper: 1,
            item_id: itemId,
            create_by: storeEntityIds.mini_program_id,
            entity_id: storeEntityIds.entity_id,
            tenant_id: storeEntityIds.tenant_id,
        }

        const imageFormData = new FormData();
        if (activeImg.binaryFile) {
            imageFormData.append('image', activeImg.binaryFile, activeImg.binaryFile.name);
        }
        imageFormData.append('json', JSON.stringify(obj));

        if (activeImg.binaryFile) {
            setLoading(true);
            commanService.postApi('/MasterTableSecond', imageFormData).then((response) => {
                if (response.data.success === 1) {
                    setActiveImg((prevState) => prevState.map((item, i) => {
                        if (i === selectedIndex) {
                            return {
                                ...item,
                                embImage: response.data.data,
                                binaryFile: null,
                                embImageArea: {
                                    left: 20,
                                    top: 20,
                                    width: 50,
                                    height: 50,
                                },
                            };
                        }
                        return item;
                    }));

                    setImageForPreview(true)
                    // updateInchDimensions();
                } else {
                    setActiveImg((prevState) => prevState.map((item, i) => {
                        if (i === selectedIndex) {
                            return {
                                ...item,
                                embImage: '',
                                binaryFile: null,
                                embImageArea: {
                                    left: 20,
                                    top: 20,
                                    width: 50,
                                    height: 50,
                                },
                            };
                        }
                        return item;
                    }));
                }
                setLoading(false);
            })

        }
    };

    const imgStartDrag = (event, data, index) => {
        event.preventDefault();

        if (!data?.embImageArea) return;

        const embossingArea = document.querySelector(`#embossing-img-${index}`).getBoundingClientRect();
        const resizableImg = event.target.closest(`#resizable-img-${index}`).getBoundingClientRect();

        let offsetX = event.clientX - resizableImg.left;
        let offsetY = event.clientY - resizableImg.top;

        const onMouseMove = (moveEvent) => {
            let newLeft = moveEvent.clientX - offsetX - embossingArea.left;
            let newTop = moveEvent.clientY - offsetY - embossingArea.top;

            newLeft = Math.max(0, Math.min(embossingArea.width - resizableImg.width, newLeft));
            newTop = Math.max(0, Math.min(embossingArea.height - resizableImg.height, newTop));

            setActiveImg((prevState) => prevState.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        embImageArea: {
                            ...item.embImageArea,
                            left: (newLeft / embossingArea.width) * 100,
                            top: (newTop / embossingArea.height) * 100,
                        },
                    };
                }
                return item;
            }));

        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    // Handle Resizing
    const imgResizeStart = (event, data, index) => {
        event.preventDefault();
        event.stopPropagation();

        const embossingArea = document.querySelector(`#embossing-img-${index}`).getBoundingClientRect();

        setIsResizing(true);
        setStartX({ left: event.clientX, top: event.clientY });
        setStartY({
            width: data.embImageArea.width,
            height: data.embImageArea.height,
        });

        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX.left;
            const deltaY = moveEvent.clientY - startX.top;

            let newWidth = startY.width + (deltaX / embossingArea.width) * 100;
            let newHeight = startY.height + (deltaY / embossingArea.height) * 100;

            newWidth = Math.max(5, Math.min(100 - data.embImageArea.left, newWidth));
            newHeight = Math.max(5, Math.min(100 - data.embImageArea.top, newHeight));

            setActiveImg((prevState) => prevState.map((item, i) => {
                if (i === index) {
                    return {
                        ...item,
                        embImageArea: {
                            ...item.embImageArea,
                            width: newWidth,
                            height: newHeight,
                        },
                    };
                }
                return item;
            }));

        };

        const onMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const imgOnMouseMove = (event) => {
        if (!isDragging && !isResizing) return;

        const parentRect = document.querySelector(`#embossing-img`).getBoundingClientRect();
        let updatedImageArea = { ...activeImg?.[selectedIndex]?.embImageArea };

        if (isResizing) {
            const deltaX = event.clientX - startX.left;
            const deltaY = event.clientY - startX.top;

            let newWidth = startY.width + (deltaX / parentRect.width) * 100;
            let newHeight = startY.height + (deltaY / parentRect.height) * 100;

            newWidth = Math.max(5, Math.min(100 - updatedImageArea.left, newWidth));
            newHeight = Math.max(5, Math.min(100 - updatedImageArea.top, newHeight));

            updatedImageArea.width = newWidth;
            updatedImageArea.height = newHeight;
        }

        setActiveImg((prevState) => prevState.map((item, i) => {
            if (i === selectedIndex) {
                return {
                    ...item,
                    embImageArea: updatedImageArea,
                };
            }
            return item;
        }));

    };

    const onMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        document.removeEventListener("mousemove", imgOnMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    // Centering Functions
    const centerImage = (type) => {
        setActiveImg((prevState) => prevState.map((item, i) => {
            if (i === selectedIndex) {
                const imgElement = item.embImageArea;
                const parentElement = document.querySelector(".embossing-img");

                if (!imgElement || !parentElement) return item;

                let updatedArea = { ...imgElement };

                // Horizontal update
                if (type === "horizontal") {
                    const parentWidth = parentElement.clientWidth;
                    const imgWidth = (parentWidth * imgElement.width) / 100;
                    updatedArea.left = ((parentWidth - imgWidth) / 2 / parentWidth) * 100;
                }

                // Vertical update
                if (type === "vertical") {
                    const parentHeight = parentElement.clientHeight;
                    const imgHeight = (parentHeight * imgElement.height) / 100;
                    updatedArea.top = ((parentHeight - imgHeight) / 2 / parentHeight) * 100;
                }

                // Return updated item
                return {
                    ...item,
                    embImageArea: updatedArea,
                };
            }

            // Return other items unchanged
            return item;
        }));

    };

    const centerBoth = () => {
        centerImage("horizontal");
        centerImage("vertical");
    };

    const setSaveEmbossDetail = () => {
        if (imageForPreview && activeImg?.some((item) => item.embImage !== "") == true) {
            const savedData = activeImg?.filter((item) => item.embImage !== '');
            setPreviewImageData(savedData);
            setEmbossingPreview(true)
        } else {
            setImageForPreview(false)
        }
        setGetEmbossingData(activeImg)
        handleUpdateEmbossing(itemAllData, activeImg, engIndex)
        setSaveEmbossing(true);
        setEmbossingModalView(false);
        handleSetStateChangeModal(false)
    }
    const setSaveEmbossDetailReset = () => {
        const activeImgObj = activeImg.map((item) => ({
            ...item,
            embImage: '',
            binaryFile: null,
            embImageArea: {
                left: 20,
                top: 20,
                width: 50,
                height: 50,
            },
        }));
        setGetEmbossingData(activeImgObj);
        handleUpdateEmbossing(itemAllData, activeImgObj, engIndex);
        setSaveEmbossing(true);
        setEmbossingModalView(false);
        handleSetStateChangeModal(false);
    };



    return (
        <div
            className="modal fade EmbossingModal"
            id="addEmbossing"
            tabIndex="-1"
            aria-hidden="true"
            data-bs-backdrop="static"
        >
            <div className="modal-dialog size-guide">

                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Set Embossing Position {`(${activeImg[selectedIndex]?.new_currency} ${numberWithCommas(extractNumber(activeImg[selectedIndex]?.new_price).toFixed(2))})`}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => { handleSetStateChangeModal(false) }}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid px-0">
                            <div className="row">
                                <div className="col-md-6 col-12">
                                    <div className="dragarea mt-1">
                                        <div className="text-center">
                                            <a onClick={() => imgContainer.current.click()}>
                                                {'Click To Browse'}
                                                <br />
                                                <span className="text-grey font-15px">({'Single Image'})</span>
                                                <input
                                                    type="file"
                                                    ref={imgContainer}
                                                    style={{ display: 'none' }}
                                                    onChange={(event) => changeEmboFile(event)}
                                                    accept=".png, .jpg, .jpeg, .webp, .PNG, .JPG, .JPEG, .WEBP"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    {activeImg?.[selectedIndex]?.embImage && activeImg?.[selectedIndex]?.area && (
                                        <div>
                                            <div className="text-main mt-3">
                                                <span>Alignment</span>
                                            </div>
                                            <div className="btn-margin d-flex flex-wrap">
                                                <div>
                                                    <button className="btn btn-dark" onClick={() => centerImage('horizontal')} data-tooltip-id="tooltip-top" data-tooltip-content="Horizontal Center">
                                                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                                                            <path d="M43.584 23.96H38.4V18.776C38.4 17.7448 37.9904 16.7559 37.2612 16.0268C36.5321 15.2976 35.5432 14.888 34.512 14.888H30.624C29.5928 14.888 28.6039 15.2976 27.8748 16.0268C27.1456 16.7559 26.736 17.7448 26.736 18.776V23.96H24.144V14.888C24.144 13.8568 23.7344 12.8679 23.0052 12.1388C22.2761 11.4096 21.2872 11 20.256 11H16.368C15.3368 11 14.3479 11.4096 13.6188 12.1388C12.8896 12.8679 12.48 13.8568 12.48 14.888V23.96H7.296C6.95228 23.96 6.62264 24.0965 6.37959 24.3396C6.13654 24.5826 6 24.9123 6 25.256C6 25.5997 6.13654 25.9294 6.37959 26.1724C6.62264 26.4155 6.95228 26.552 7.296 26.552H12.48V35.624C12.48 36.6552 12.8896 37.6441 13.6188 38.3732C14.3479 39.1024 15.3368 39.512 16.368 39.512H20.256C21.2872 39.512 22.2761 39.1024 23.0052 38.3732C23.7344 37.6441 24.144 36.6552 24.144 35.624V26.552H26.736V31.736C26.736 32.7672 27.1456 33.7561 27.8748 34.4852C28.6039 35.2144 29.5928 35.624 30.624 35.624H34.512C35.5432 35.624 36.5321 35.2144 37.2612 34.4852C37.9904 33.7561 38.4 32.7672 38.4 31.736V26.552H43.584C43.9277 26.552 44.2574 26.4155 44.5004 26.1724C44.7435 25.9294 44.88 25.5997 44.88 25.256C44.88 24.9123 44.7435 24.5826 44.5004 24.3396C44.2574 24.0965 43.9277 23.96 43.584 23.96ZM21.552 35.624C21.552 35.9677 21.4155 36.2974 21.1724 36.5404C20.9294 36.7835 20.5997 36.92 20.256 36.92H16.368C16.0243 36.92 15.6946 36.7835 15.4516 36.5404C15.2085 36.2974 15.072 35.9677 15.072 35.624V14.888C15.072 14.5443 15.2085 14.2146 15.4516 13.9716C15.6946 13.7285 16.0243 13.592 16.368 13.592H20.256C20.5997 13.592 20.9294 13.7285 21.1724 13.9716C21.4155 14.2146 21.552 14.5443 21.552 14.888V35.624ZM35.808 31.736C35.808 32.0797 35.6715 32.4094 35.4284 32.6524C35.1854 32.8955 34.8557 33.032 34.512 33.032H30.624C30.2803 33.032 29.9506 32.8955 29.7076 32.6524C29.4645 32.4094 29.328 32.0797 29.328 31.736V18.776C29.328 18.4323 29.4645 18.1026 29.7076 17.8596C29.9506 17.6165 30.2803 17.48 30.624 17.48H34.512C34.8557 17.48 35.1854 17.6165 35.4284 17.8596C35.6715 18.1026 35.808 18.4323 35.808 18.776V31.736Z" />
                                                        </svg>

                                                        {/* <span>Horizontal center</span> */}
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="btn btn-dark" onClick={() => centerImage('vertical')} data-tooltip-id="tooltip-top" data-tooltip-content="Vertical Center">
                                                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                                                            <path d="M31.736 24.144C32.7672 24.144 33.7561 23.7344 34.4852 23.0052C35.2144 22.2761 35.624 21.2872 35.624 20.256V16.368C35.624 15.3368 35.2144 14.3479 34.4852 13.6188C33.7561 12.8896 32.7672 12.48 31.736 12.48H26.552V7.296C26.552 6.95228 26.4155 6.62264 26.1724 6.37959C25.9294 6.13654 25.5997 6 25.256 6C24.9123 6 24.5826 6.13654 24.3396 6.37959C24.0965 6.62264 23.96 6.95228 23.96 7.296V12.48H18.776C17.7448 12.48 16.7559 12.8896 16.0268 13.6188C15.2976 14.3479 14.888 15.3368 14.888 16.368V20.256C14.888 21.2872 15.2976 22.2761 16.0268 23.0052C16.7559 23.7344 17.7448 24.144 18.776 24.144H23.96V26.736H14.888C13.8568 26.736 12.8679 27.1456 12.1388 27.8748C11.4096 28.6039 11 29.5928 11 30.624V34.512C11 35.5432 11.4096 36.5321 12.1388 37.2612C12.8679 37.9904 13.8568 38.4 14.888 38.4H23.96V43.584C23.96 43.9277 24.0965 44.2574 24.3396 44.5004C24.5826 44.7435 24.9123 44.88 25.256 44.88C25.5997 44.88 25.9294 44.7435 26.1724 44.5004C26.4155 44.2574 26.552 43.9277 26.552 43.584V38.4H35.624C36.6552 38.4 37.6441 37.9904 38.3732 37.2612C39.1024 36.5321 39.512 35.5432 39.512 34.512V30.624C39.512 29.5928 39.1024 28.6039 38.3732 27.8748C37.6441 27.1456 36.6552 26.736 35.624 26.736H26.552V24.144H31.736ZM36.92 30.624V34.512C36.92 34.8557 36.7835 35.1854 36.5404 35.4284C36.2974 35.6715 35.9677 35.808 35.624 35.808H14.888C14.5443 35.808 14.2146 35.6715 13.9716 35.4284C13.7285 35.1854 13.592 34.8557 13.592 34.512V30.624C13.592 30.2803 13.7285 29.9506 13.9716 29.7076C14.2146 29.4645 14.5443 29.328 14.888 29.328H35.624C35.9677 29.328 36.2974 29.4645 36.5404 29.7076C36.7835 29.9506 36.92 30.2803 36.92 30.624ZM17.48 20.256V16.368C17.48 16.0243 17.6165 15.6946 17.8596 15.4516C18.1026 15.2085 18.4323 15.072 18.776 15.072H31.736C32.0797 15.072 32.4094 15.2085 32.6524 15.4516C32.8955 15.6946 33.032 16.0243 33.032 16.368V20.256C33.032 20.5997 32.8955 20.9294 32.6524 21.1724C32.4094 21.4155 32.0797 21.552 31.736 21.552H18.776C18.4323 21.552 18.1026 21.4155 17.8596 21.1724C17.6165 20.9294 17.48 20.5997 17.48 20.256Z" />
                                                        </svg>
                                                        {/* <span>Vertical center</span> */}
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="btn btn-dark" onClick={centerBoth} data-tooltip-id="tooltip-top" data-tooltip-content="Both Center">
                                                        <svg width="50" height="50" viewBox="0 0 50 50" >
                                                            <path
                                                                d="M10.4167 10.9375C10.0023 10.9375 9.60492 11.1021 9.31189 11.3951C9.01887 11.6882 8.85425 12.0856 8.85425 12.5C8.85425 12.9144 9.01887 13.3118 9.31189 13.6049C9.60492 13.8979 10.0023 14.0625 10.4167 14.0625H39.5834C39.9978 14.0625 40.3952 13.8979 40.6883 13.6049C40.9813 13.3118 41.1459 12.9144 41.1459 12.5C41.1459 12.0856 40.9813 11.6882 40.6883 11.3951C40.3952 11.1021 39.9978 10.9375 39.5834 10.9375H10.4167ZM18.7501 19.2708C18.3357 19.2708 17.9383 19.4355 17.6452 19.7285C17.3522 20.0215 17.1876 20.4189 17.1876 20.8333C17.1876 21.2477 17.3522 21.6452 17.6452 21.9382C17.9383 22.2312 18.3357 22.3958 18.7501 22.3958H31.2501C31.6645 22.3958 32.0619 22.2312 32.3549 21.9382C32.648 21.6452 32.8126 21.2477 32.8126 20.8333C32.8126 20.4189 32.648 20.0215 32.3549 19.7285C32.0619 19.4355 31.6645 19.2708 31.2501 19.2708H18.7501ZM10.4167 27.6042C10.0023 27.6042 9.60492 27.7688 9.31189 28.0618C9.01887 28.3548 8.85425 28.7523 8.85425 29.1667C8.85425 29.5811 9.01887 29.9785 9.31189 30.2715C9.60492 30.5645 10.0023 30.7292 10.4167 30.7292H39.5834C39.9978 30.7292 40.3952 30.5645 40.6883 30.2715C40.9813 29.9785 41.1459 29.5811 41.1459 29.1667C41.1459 28.7523 40.9813 28.3548 40.6883 28.0618C40.3952 27.7688 39.9978 27.6042 39.5834 27.6042H10.4167ZM18.7501 35.9375C18.3357 35.9375 17.9383 36.1021 17.6452 36.3951C17.3522 36.6882 17.1876 37.0856 17.1876 37.5C17.1876 37.9144 17.3522 38.3118 17.6452 38.6049C17.9383 38.8979 18.3357 39.0625 18.7501 39.0625H31.2501C31.6645 39.0625 32.0619 38.8979 32.3549 38.6049C32.648 38.3118 32.8126 37.9144 32.8126 37.5C32.8126 37.0856 32.648 36.6882 32.3549 36.3951C32.0619 36.1021 31.6645 35.9375 31.2501 35.9375H18.7501Z" />
                                                        </svg>
                                                        {/* Both Center */}
                                                    </button>
                                                </div>
                                                <Tooltip id="tooltip-top" place="top" effect="solid" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6 col-12">
                                    {/* Tab Navigation */}
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        {activeImg?.map((data, i) => (
                                            <li className="nav-item" role="presentation" key={i}>
                                                <a
                                                    className={`nav-link nav-link_underscore ${i === selectedIndex ? 'active' : ''}`}
                                                    id={`tab-${i}`}
                                                    data-bs-toggle="tab"
                                                    href={`#tab-content-${i}`}
                                                    role="tab"
                                                    aria-controls={`tab-content-${i}`}
                                                    aria-selected={i === selectedIndex}
                                                    onClick={() => changeImage(data, i)} // Change active tab
                                                >
                                                    {data.type}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Tab Content */}
                                    <div className="tab-content" id="myTabContent">
                                        {activeImg.map((data, i) => {
                                            // Check if data.area is a stringified JSON and parse it if necessary
                                            let areas = data?.area;
                                            if (typeof areas === 'string') {
                                                try {
                                                    areas = JSON.parse(areas); // Try to parse it if it's a string
                                                } catch (e) {
                                                    // console.error("Error parsing area:", e);
                                                }
                                            }

                                            return (
                                                <div
                                                    key={i}
                                                    className={`tab-pane fade ${i === selectedIndex ? 'show active' : ''}`}
                                                    id={`tab-content-${i}`}
                                                    role="tabpanel"
                                                    aria-labelledby={`tab-${i}`}
                                                >
                                                    <div className="main-img">
                                                        <div className="singleProduct-view">
                                                            {/* Image for the selected tab */}
                                                            <img
                                                                src={data?.url}
                                                                className="img-fluid img-width d-block m-auto"
                                                                alt={`Image ${i}`}
                                                            />

                                                            {/* Display embossing image if activeImg has area */}
                                                            {areas?.width && areas?.height && (
                                                                <div
                                                                    className="embossing-img"
                                                                    id={`embossing-img-${i}`}
                                                                    style={{
                                                                        left: `${areas.left}%`,
                                                                        top: `${areas.top}%`,
                                                                        width: `${areas.width}%`,
                                                                        height: `${areas.height}%`,
                                                                    }}
                                                                >
                                                                    {data?.embImage && (
                                                                        <div
                                                                            className="resizable-img"
                                                                            id={`resizable-img-${i}`}
                                                                            style={{
                                                                                left: `${data.embImageArea.left}%`,
                                                                                top: `${data.embImageArea.top}%`,
                                                                                width: `${data.embImageArea.width}%`,
                                                                                height: `${data.embImageArea.height}%`,
                                                                            }}
                                                                            onMouseDown={(event) => imgStartDrag(event, data, i)} // Implement your drag logic here
                                                                        >
                                                                            <img
                                                                                src={data.embImage}
                                                                                className="img-fluid img-width d-block m-auto"
                                                                                alt={`Embossed Image ${i}`}
                                                                                ref={imgContainers}
                                                                            />
                                                                            <div className="resize-btn" onMouseDown={(event) => imgResizeStart(event, data, i)}>
                                                                                ↘
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-dark"
                            data-bs-dismiss={`${activeImg?.filter((item) => item.embImage !== '')[0]?.embImage !== "" ? "modal" : ""}`}
                            aria-label="Close" onClick={() => setSaveEmbossDetail()}>Save
                        </button>
                        <button type="button" className="btn btn-light"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => setSaveEmbossDetailReset()}
                        >Reset</button>

                        <button
                            type="button"
                            className="btn btn-light"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => { handleSetStateChangeModal(false); setSelectedIndex(0) }}
                        >Close</button>

                    </div>
                </div>

            </div>
            {/* <!-- /.modal-dialog --> */}
        </div>
    );
};

export default Embossing