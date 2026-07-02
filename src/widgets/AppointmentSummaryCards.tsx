import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Star, ArrowRight } from 'lucide-react';

const AppointmentSummaryCards = () => {
  const navigate = useNavigate();

  const cards = [
    {
      label: "Today's Appointments",
      value: '12',
      icon: Calendar,
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      link: 'View all →',
      linkColor: 'text-teal-600',
      onClick: () => navigate('/appointments?filter=today'),
    },
    {
      label: 'Upcoming Appointments',
      value: '28',
      icon: Clock,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      link: 'View all →',
      linkColor: 'text-blue-600',
      onClick: () => navigate('/appointments?filter=upcoming'),
    },
    {
      label: 'Total Revenue (This Month)',
      value: '₹1,24,850',
      icon: DollarSign,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      link: 'View details →',
      linkColor: 'text-amber-600',
      onClick: () => navigate('/revenue'),
    },
    {
      label: 'Average Rating',
      value: '4.8/5',
      icon: Star,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      link: 'View all reviews →',
      linkColor: 'text-purple-600',
      onClick: () => navigate('/reviews'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            onClick={card.onClick}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 leading-tight">{card.label}</p>
                <h4 className="text-2xl font-extrabold text-slate-800 mt-1 leading-none">{card.value}</h4>
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-xs font-semibold ${card.linkColor} group-hover:underline`}>
                {card.link}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentSummaryCards;
