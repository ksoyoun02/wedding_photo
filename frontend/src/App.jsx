import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './uploadPage';
import SuccessPage from './successPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/successPage" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
