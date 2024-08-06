import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { fetchBoardDetail } from "../../api/boardDetailService";
import useStore from "../../store/store";

import LikeIcon from "../../assets/icons/like-inactive.png";
import LikeActiveIcon from "../../assets/icons/like-active.png";
import VideoIcon from "../../assets/icons/video.png";

import "./BoardDetetail.css";

function BoardDetail() {
  const { id } = useParams(); // URL 경로에서 boardId를 가져옴
  const [boardDetail, setBoardDetail] = useState(null); // Board 상세 정보를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const likedBoards = useStore((state) => state.likedBoards);
  const toggleLike = useStore((state) => state.toggleLike);
  const [formattedPrice, setFormattedPrice] = useState(0);

  useEffect(() => {
    // 데이터를 가져오는 비동기 함수
    const getBoardDetail = async () => {
      try {
        const data = await fetchBoardDetail(id); // id를 사용해 fetchBoardList 호출
        console.dir(data);
        setBoardDetail(data);
        setFormattedPrice(new Intl.NumberFormat("en-US").format(data.price));
      } catch (error) {
        console.error("Failed to fetch board details:", error);
      } finally {
        setLoading(false);
      }
    };

    getBoardDetail();
  }, [id]); // boardId가 변경될 때마다 useEffect 재실행

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

  const isLiked = likedBoards[id] || false;

  const videoBtnClickHandler = () => {
    alert("영상 재생");
    //재생할 영상 없으면 modal 창 : 영상이 존재하지 않습니다.
    //혹은 버튼 disabled -> 회색
    //영상 재생 창
    //width 100vh
    //heigh 100vh
    //close btn 상단 위
    //하단 재생바
  };

  return (
    <div className="board-detail-page">
      <img alt="board-img" src="https://picsum.photos/200" />
      <div className="img-btns">
        <img
          className="like-btn"
          alt="like"
          src={isLiked ? LikeActiveIcon : LikeIcon}
          onClick={() => toggleLike(id)}
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
          <img alt="작성자 프로필" src="https://picsum.photos/200" />
          <div className="writer-info">
            <div className="writer-name">{boardDetail.writer.nickname}</div>
            <div className="other-info">
              <span className="level">레벨 정보</span>
              <span>지역</span>
            </div>
          </div>
        </div>
        <button className="chat-btn">채팅</button>
      </div>
      <div className="post-content">
        <div className="post-content-info">
          <div className="info-left">
            <div className="post-title">{boardDetail.title}</div>
            <div className="post-other-info">
              <span className="post-category">{boardDetail.category}</span>
              <span>작성 시각</span>
            </div>
          </div>
          <div className="post-price">{formattedPrice}원</div>
        </div>
        <div className="post-main-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </div>
        <div className="post-last-info">
          <span>관심 {boardDetail.likeCount}</span>
          <span>채팅 수</span>
          <span>조회 수</span>
        </div>
      </div>
    </div>
  );
}

export default BoardDetail;
