import { Link } from 'react-router-dom';
import ReviewsSection from '../components/ReviewsSection';

function ReviewsPage() {
  return (
    <div className="page-wrapper reviews-page">
      {/* Page Header Banner */}
      <div className="page-hero-banner">
        <div className="page-hero-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep">&bull;</span>
            <span className="current">Guest Experiences</span>
          </div>
          <h1>Stories, Photos &amp; Reviews</h1>
          <p>
            Read authentic reviews from fellow food lovers and share your own dining moments &amp; dish photos with our community.
          </p>
        </div>
      </div>

      {/* Full Reviews Section with Photos */}
      <ReviewsSection />
    </div>
  );
}

export default ReviewsPage;
