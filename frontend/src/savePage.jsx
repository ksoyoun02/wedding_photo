// src/savePage.jsx
import React, { useState } from 'react';
import './savePage.css';

function SavePage({ onClose, onConfirm }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!name || !phone) return alert("이름과 전화번호를 입력해주세요.");
    onConfirm({ name, phone });
    onClose(); // 팝업 닫기
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>정보 입력</h3>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="전화번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="button-row">
          <button onClick={handleSubmit}>확인</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default SavePage;
