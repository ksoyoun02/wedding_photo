import { useState } from 'react';
import './css/App.css';
import SavePage from './savePage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function UploadPage() {
  const [mediaList, setMediaList] = useState([]);
  const [showSavePage, setShowSavePage] = useState(false);
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        setMediaList((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), url: reader.result, type: file.type, file:file},
        ]);
      };

      reader.readAsDataURL(file);
    });

    e.target.value = ''; // 같은 파일도 다시 업로드 가능하게 초기화
  };

  const handleDelete = (id) => {
    setMediaList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpload = async () => {
    if (mediaList.length === 0) return alert("업로드할 파일을 선택하세요.");
    setShowSavePage(true);
  };

  const handleConfirmSave = async({ name, phone }) => {

    const formData = new FormData();
    mediaList.forEach(media  => formData.append("files", media.file));

    formData.append("name", name);
    formData.append("phone", phone);

    const startTime = Date.now();

    try {

      setUploading(true);
      setUploadPercent(0);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload?name=${encodeURIComponent(name)}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadPercent(percent);
          },
        }
      );

      if (res.status !== 200) throw new Error("업로드 실패");
      setUploading(false);
      navigate("/successPage");
    } catch (err) {
      setUploading(false);
      console.error("Upload error:", err);
      alert("파일 업로드 중 문제가 발생했습니다.");
    }
  }

  return (
    <div className="container">
      {showSavePage && (
        <SavePage
          onClose={() => setShowSavePage(false)}
          onConfirm={handleConfirmSave}
        />
      )}

      {uploading && (
        <div className="upload-overlay">
          <div className="upload-progress-container">
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: `${uploadPercent}%` }} />
            </div>
            <div className="upload-progress-text">{uploadPercent}% 업로드 중...</div>
          </div>
        </div>
      )}

      <h1>미디어 업로드</h1>

      <div className="upload-section">
        <label className="upload-label">
          업로드
          <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} hidden />
        </label>
        <button className="submit-label" onClick={handleUpload}>저장</button>
      </div>

      <div className="thumbnail-grid">
        {mediaList.map((media) => (
          <div className="thumbnail" key={media.id}>
            {media.type.startsWith('image/') ? (
              <img src={media.url} alt="uploaded-img" />
            ) : (
              <video src={media.url} controls />
            )}
            <button className="delete-btn" onClick={() => handleDelete(media.id)}>✕</button>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default UploadPage;
