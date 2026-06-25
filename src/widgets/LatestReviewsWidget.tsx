import React from 'react';
import { MOCK_REVIEWS } from '../mocks/doctorFlowMocks';
import { Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LatestReviewsWidget = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Latest Reviews</h3>
        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-amber-700">4.8 Avg</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {MOCK_REVIEWS.map(review => (
          <div key={review.id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{review.patientName}</h4>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{review.date}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-200'}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">"{review.comment}"</p>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50 mt-auto">
        <button 
          onClick={() => navigate('/reviews')}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors py-2"
        >
          View All Reviews
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LatestReviewsWidget;
