import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-icon">
        {/* You can add an icon here */}
      </div>
      <h1 className="error-title">Content Not Found</h1>
      <p className="error-message">
        Sorry, we couldn't find what you're looking for. The content might have been moved or removed.
      </p>
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
      >
        <ArrowLeft size={20} />
        Back to Browse
      </button>
    </div>
  );
};

export default ErrorPage; 