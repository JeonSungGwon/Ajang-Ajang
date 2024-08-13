import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import cameraImage from '../../assets/camera.png';
import videoImage from '../../assets/video.png';
import deleteIcon from '../../assets/delete.png'; // 삭제 아이콘 추가
import apiClient from '../../api/apiClient';
import './BoardWriter.css'; // CSS 파일 import
import usePageStore from '../../store/currentPageStore';
import axios from 'axios';

const BoardWrite = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ETC');
  const [region, setRegion] = useState('');
  const [status, setStatus] = useState('FOR_SALE'); // status 상태 추가
  const [addressId, setAddressId] = useState(); // deliveryType 상태 추가
  const [images, setImages] = useState([]); // 이미지 상태를 배열로 변경
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // 리다이렉션을 위해 useNavigate 사용
  const setCurrentPage = usePageStore((state) => state.setCurrentPage);
  const location = useLocation(); // 상태를 받기 위해 useLocation 사용
  const [selectedImages, setSelectedImages] = useState([]); // 선택된 이미지를 저장할 상태
  const [uploadedFiles, setUploadedUrls] = useState([]); // 누끼딴 이미지 url들


  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await apiClient.get('/api/address/my');
        if (response.data && response.data.data && response.data.data.length > 0) {
          const addressId = response.data.data[0].addressId; // 첫 번째 주소의 ID를 사용
          setAddressId(addressId);
        }
      } catch (error) {
        console.error('Failed to fetch address data', error);
      }
    };
  
    fetchAddress();
  
    if (location.state?.templateData) {
      const { title, content, price } = location.state.templateData;
      setTitle(title || '');
      setContent(content || '');
      setPrice(price || '');
    }
  }, [location.state]);
  
  const handleCheckboxChange = (image) => { // 누끼딸 이미지 선택
    console.log(selectedImages)
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(image)) {
        // 이미 선택된 이미지라면 배열에서 제거
        return prevSelectedImages.filter((img) => img !== image);
      } else {
        // 선택되지 않은 이미지라면 배열에 추가
        return [...prevSelectedImages, image];
      }
    });
  };

  const handleRemoveBg = async () => { // 누끼따는 함수
    if (selectedImages.length === 0) {
      alert('이미지를 선택해주세요.');
      return;
    }
    // 선택된 이미지들을 formData에 추가
    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append('files', image);
    });
    
    try {
      const response = await axios.post("http://localhost:8000/api/remove-background", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
      setUploadedUrls(response.data.data)

    } catch (error) {
      console.error('Error submitting the form', error);
    }

  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleTemplate = () => {
    setCurrentPage('post/template');
    navigate('/post/template'); // 템플릿 이동
  };

  const isFormValid = () => {
    return title.trim() !== '' && price.trim() !== '' && content.trim() !== '';
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDeleteS3Image = (index) => {
    setUploadedUrls(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isFormValid()) {
      alert('제목, 가격, 내용은 반드시 입력해야 합니다.');
      return;
    }
  
    const createBoardDto = {
      title,
      price: parseInt(price),
      content,
      category,
      status,
      addressId,
    };
  
    const formData = new FormData();
    formData.append('board', new Blob([JSON.stringify(createBoardDto)], { type: 'application/json' }));
    images.forEach((image) => {
      formData.append('media', image); // 서버에서 배열로 받도록 설정
    });
  
    console.log("createBoardDto:", createBoardDto);
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
    }
  
    const url = '/api/board';
  
    try {
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
      navigate('/direct'); // 전송이 완료되면 리다이렉션
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="board-write-container">
      <div className="header">
        <button type="button" className="template-button" onClick={handleTemplate}>템플릿</button>
        <div>
          <button type="submit" className="submit-button" disabled={!isFormValid()}>완료</button>
        </div>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={handleTitleChange}
          className="input-field"
        />
        <select value={category} onChange={handleCategoryChange} className="category-select">
          <option value="ETC">기타</option>
          <option value="DAILY_SUPPLIES">일상용품</option>
          <option value="BABY_CARRIAGE">유모차</option>
          <option value="FURNITURE">아기가구</option>
          <option value="BABY_CLOTHES">아기옷</option>
          <option value="TOY">장난감</option>
          <option value="CAR_SEAT">카시트</option>
        </select>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="가격"
          value={price}
          onChange={handlePriceChange}
          className="input-field"
        />
        <span className="region-label">지역 선택</span>
        <select value={region} onChange={handleRegionChange} className="region-select">
          <option value="선택">선택</option>
          {/* 지역 옵션 추가 가능 */}
        </select>
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="지역"
          value={region}
          onChange={handleRegionChange}
          className="input-field"
        />
      </div>
      <textarea
        placeholder="내용을 입력하세요."
        value={content}
        onChange={handleContentChange}
        className="textarea-field"
      />
      <div className='btn-section'>
      {images.length > 0 && (
          <button type="button" className="removebg-btn" onClick={handleRemoveBg}>
            누끼
          </button>
        )}
      </div>
      <div className="camera-section">
        <div className="video-icon" onClick={handleIconClick}>
          <img src={videoImage} alt="Video Icon" className="camera-image" />
        </div>
        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className='checkbox-container'>
              <label className='recommand'>
                <input 
                  type="checkbox" 
                  className="image-checkbox" 
                  onChange={() => handleCheckboxChange(image)} 
                />
              </label>
              <div key={index} className="image-container">
                <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="image-thumbnail" />
                <img
                  src={deleteIcon}
                  alt="Delete Icon"
                  className="delete-icon"
                  onClick={() => handleDeleteImage(index)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="camera-icon" onClick={handleIconClick}>
          <img src={cameraImage} alt="Camera Icon" className="camera-image" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple // 여러 장 선택 가능하도록 설정
      /> 
      {/* 누끼 결과 */}
      <div className='camera-section'> 
      <div className="image-preview">
          {uploadedFiles.map((data, index) => (
            <div key={index} className="image-container">
              <img src={data.url} alt={`Preview ${index}`} className="image-thumbnail" />
              <img
                src={deleteIcon}
                alt="Delete Icon"
                className="delete-icon"
                onClick={() => handleDeleteS3Image(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};

export default BoardWrite;
