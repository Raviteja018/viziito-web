import React from 'react';
import { Star, MessageCircle, ThumbsUp, ChevronDown, Filter } from 'lucide-react';

const MOCK_REVIEWS = [
  { id: 1, patient: 'Rahul Sharma', rating: 5, date: '21 Jun 2026', text: 'Very patient and explained everything clearly. Highly recommend Dr. Jenkins.', likes: 12 },
  { id: 2, patient: 'Anita Desai', rating: 4, date: '18 Jun 2026', text: 'Good consultation, but had to wait 15 minutes past my appointment time.', likes: 3 },
  { id: 3, patient: 'Vikram Singh', rating: 5, date: '15 Jun 2026', text: 'Excellent diagnosis. The prescribed medication worked perfectly.', likes: 8 },
  { id: 4, patient: 'Priya Patel', rating: 5, date: '10 Jun 2026', text: 'Very professional clinic environment and great online consultation experience as well.', likes: 5 },
];

export default function ReviewsScreen() {
  return (
    <div className="w-full animate-fade space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            Reviews & Ratings
          </h1>
          <p className="text-slate-500 font-medium mt-1">Monitor patient feedback and your clinic's reputation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rating Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col items-center justify-center text-center py-10">
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter">4.8</h2>
            <div className="flex items-center gap-1 my-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-6 h-6 ${s <= 4 ? 'text-amber-500 fill-amber-500' : 'text-amber-500/30 fill-amber-500/30'}`} />
              ))}
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Based on 124 Reviews</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const percentage = stars === 5 ? 75 : stars === 4 ? 15 : stars === 3 ? 5 : stars === 2 ? 3 : 2;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 w-12 shrink-0 flex items-center gap-1">{stars} <Star className="w-3 h-3 text-amber-500 fill-amber-500" /></span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 w-8 text-right">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="font-bold text-slate-800">Recent Patient Feedback</h3>
            <div className="flex items-center justify-end w-full sm:w-auto gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
                Newest First <ChevronDown className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 p-2">
            {MOCK_REVIEWS.map(review => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold shadow-sm border border-teal-100">
                      {review.patient.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{review.patient}</h4>
                      <p className="text-xs font-semibold text-slate-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mt-2 font-medium">"{review.text}"</p>
                
                <div className="mt-4 flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-teal-50">
                    <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.likes})
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-teal-50">
                    <MessageCircle className="w-3.5 h-3.5" /> Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
