import { useState } from 'react';
import './App.css';
import SavePage from './savePage';

function App() {
  const [mediaList, setMediaList] = useState([]);
  const [showSavePage, setShowSavePage] = useState(false);
  
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

    try {
      const res = await fetch(`http://localhost:8080/upload?name=${encodeURIComponent(name)}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("업로드 실패");
    } catch (err) {
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
      
      <h1>미디어 업로드</h1>

      <div className="upload-section">
        <label className="upload-label">
          파일 업로드
          <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} hidden />
        </label>
        <button onClick={handleUpload}>저장</button>
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

export default App;
