import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // axios를 사용하여 API 요청을 처리합니다.

import { deleteMyBoard } from "../../api/boardService";
import { fetchBoardDetail } from "../../api/boardDetailService";
import useUserStore from "../../store/useUserStore";
import usePageStore from "../../store/currentPageStore";

import LikeIcon from "../../assets/icons/like-inactive.png";
import LikeActiveIcon from "../../assets/icons/like-active.png";
import VideoIcon from "../../assets/icons/video.png";
import CloseIcon from "../../assets/icons/close.png";
import ImageNotFound from "../../assets/icons/image-not-found.png";

import "./BoardDetetail.css";
import apiClient from "../../api/apiClient";

function BoardDetail() {
  const { id } = useParams(); // URL 경로에서 boardId를 가져옴
  const [boardDetail, setBoardDetail] = useState(null); // Board 상세 정보를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isLiked, setIsLiked] = useState(false); // 찜 상태를 관리하는 상태
  const [formattedPrice, setFormattedPrice] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스를 추적

  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleEditButtonClick = () => {
    usePageStore.getState().setCurrentPage(`/board/${id}`); // 현재 페이지 정보 저장
    navigate(`/edit/${id}`, { state: { boardDetail: boardDetail } }); // 수정 페이지로 이동
  };

  const handleDeleteButtonClick = () => {
    deleteMyBoard(id);
    navigate(`/direct`);
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "DAILY_SUPPLIES":
        return "일상 용품";
      case "BABY_CARRIAGE":
        return "유모차";
      case "FURNITURE":
        return "아기가구";
      case "BABY_CLOTHES":
        return "아기옷";
      case "TOY":
        return "장난감";
      case "CAR_SEAT":
        return "카시트";
      default:
        return "기타";
    }
  };

  const getBoardDetail = async () => {
    try {
      const data = await fetchBoardDetail(id); // id를 사용해 fetchBoardDetail 호출
      setBoardDetail(data);
      setFormattedPrice(new Intl.NumberFormat("en-US").format(data.price));
      setIsLiked(data.liked); // 초기 찜 상태를 설정
      const formattedDate = String(
        new Date(data.createdAt).toISOString().split("T")[0]
      );
      setFormattedDate(formattedDate);
    } catch (error) {
      console.error("Failed to fetch board details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBoardDetail();
  }, [id]); // boardId가 변경될 때마다 useEffect 재실행

  const toggleLikeStatus = async () => {
    try {
      if (isLiked) {
        // 찜하기 취소 요청
        await apiClient.delete(`api/board/${id}/likes`);
        setIsLiked(false); // 찜 상태 업데이트
        alert("좋아요를 취소했습니다.");
      } else {
        // 찜하기 요청
        await apiClient.post(`api/board/${id}/likes`);
        setIsLiked(true); // 찜 상태 업데이트
        alert("좋아요를 눌렀습니다.");
      }
    } catch (error) {
      console.error("Failed to toggle like status:", error);
      alert("자신의 글은 찜을 할 수 없습니다.");
    }
  };

  const handleChatButtonClick = async () => {
    if (user?.id === boardDetail.writer.userId) {
      alert("자신의 글에는 채팅을 걸 수 없습니다.");
      return;
    }

    try {
      // 방을 생성하는 API 요청
      const response = await apiClient.post(`/api/rooms`, {
        name: boardDetail.title,
        boardId: id,
      });

      const roomId = response.data.id;
      // 채팅방으로 네비게이트
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방을 생성할 수 없습니다. 다시 시도해 주세요.");
    }
  }
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? filteredImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === filteredImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  if (!boardDetail) {
    return (
      <div className="board-detail-page">
        <div className="not-found-content">게시글이 존재하지 않습니다.</div>
      </div> // boardDetail이 null일 경우
    );
  }

  //이미지 슬라이더에 사용할 이미지 필터링 (VIDEO는 제외)
  const filteredImages = boardDetail.mediaList.filter(
    (media) => media.mediaType === "IMAGE"
  );

  const videoBtnClickHandler = () => {
    //VIDEO 타입의 미디어를 찾는다
    const videoMedia = boardDetail.mediaList.find(
      (media) => media.mediaType === "VIDEO"
    );

    const url = videoMedia ? videoMedia.mediaUrl : "";

    if (!url) {
      alert("영상이 존재하지 않습니다.");
      return;
    }

    setVideoUrl(url);
    setIsVideoPlaying(true);
  };

  return (
    <div className="board-detail-page">
      <div className="image-slider">
        {filteredImages.length > 0 ? (
          <div className="slider">
            <img
              alt="board-img"
              src={filteredImages[currentImageIndex].mediaUrl || ImageNotFound}
            />
            <button className="prev-btn" onClick={handlePreviousImage}>
              &#8249; {/* 이전 화살표 */}
            </button>
            <button className="next-btn" onClick={handleNextImage}>
              &#8250; {/* 다음 화살표 */}
            </button>
          </div>
        ) : (
          <img alt="board-img" src={ImageNotFound} />
        )}
      </div>
      <div className="img-btns">
        <img
          className="like-btn"
          alt="like"
          src={isLiked ? LikeActiveIcon : LikeIcon}
          onClick={toggleLikeStatus} // 클릭 시 찜 상태를 토글
        />
        <img
          className="video-btn"
          alt="video"
          src={VideoIcon}
          onClick={videoBtnClickHandler}
        />
      </div>
      <div className="profile-bar">
        <div className="writer-profile">
          <img
            alt="작성자 프로필"
            src={boardDetail.writer.profileImage || ImageNotFound}
          />
          <div className="writer-info">
            <div className="writer-name">{boardDetail.writer.nickname}</div>
            <div className="other-info">
              <span className="level">{boardDetail.writer.level}</span>
              <span>{boardDetail.address}</span>
            </div>
          </div>
        </div>
        {user?.id === boardDetail.writer.userId ? (
          <div className="btns">
            <button className="edit-btn" onClick={handleEditButtonClick}>
              수정
            </button>
            <button className="delete-btn" onClick={handleDeleteButtonClick}>
              삭제
            </button>
          </div>
        ) : (
          <button className="chat-btn" onClick={handleChatButtonClick}>
            채팅
          </button>
        )}
      </div>
      <div className="post-content">
        <div className="post-content-info">
          <div className="info-left">
            <div className="post-title">{boardDetail.title}</div>
            <div className="post-other-info">
              <span className="post-category">
                {getCategoryLabel(boardDetail.category)}
              </span>
              <span>{formattedDate}</span>
            </div>
          </div>
          <div className="post-price">{formattedPrice}원</div>
        </div>
        <div className="post-main-content">{boardDetail.content}</div>
        <div className="post-last-info">
          <span>관심 {boardDetail.likeCount}</span>
          <span>조회 {boardDetail.viewCount}</span>
        </div>
      </div>

      {/* 비디오 재생 모달 */}
      {isVideoPlaying && (
        <div className="video-modal">
          <button
            className="close-btn"
            onClick={() => setIsVideoPlaying(false)}
          >
            <img alt="close icon" src={CloseIcon} />
          </button>
          <div className="video-container">
            <video controls autoPlay width="100%">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;
