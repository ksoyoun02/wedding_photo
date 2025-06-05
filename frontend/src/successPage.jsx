import { useNavigate } from 'react-router-dom';
function SuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1>감사합니다</h1>
      <button onClick={() => navigate("/")}>메인으로 돌아가기</button>
    </div>
  );
}

export default SuccessPage;
