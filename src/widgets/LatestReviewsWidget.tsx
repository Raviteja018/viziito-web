import React from 'react';
import { MOCK_REVIEWS } from '../mocks/doctorFlowMocks';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LatestReviewsWidget = () => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = rating >= i;
          const half = !filled && rating >= i - 0.5;
          return (
            <Star
              key={i}
              className={`w-3 h-3 ${filled || half ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
            />
          );
        })}
        <span className="text-[11px] font-bold text-slate-700 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">Latest Reviews & Ratings</h3>
        <button
          onClick={() => navigate('/reviews')}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          View all
        </button>
      </div>

      {/* Reviews List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {MOCK_REVIEWS.map(review => (
          <div key={review.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${review.color}`}>
                {review.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{review.patientName}</span>
                    <div className="mt-0.5">{renderStars(review.rating)}</div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0 mt-0.5">{review.date}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestReviewsWidget;
