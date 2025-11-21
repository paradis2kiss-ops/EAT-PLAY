
import React, { useState } from 'react';
import type { AiMealPlan } from '../types';

interface GeneratedMealPlanProps {
  mealPlan: AiMealPlan;
  onClose: () => void;
}

export const GeneratedMealPlan: React.FC<GeneratedMealPlanProps> = ({ mealPlan, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const DAYS_PER_PAGE = 7;
  
  const totalPages = Math.ceil(mealPlan.plan.length / DAYS_PER_PAGE);
  const currentPlan = mealPlan.plan.slice(currentPage * DAYS_PER_PAGE, (currentPage + 1) * DAYS_PER_PAGE);

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatMealPlanAsText = (plan: AiMealPlan): string => {
    const title = plan.title;
    let content = `--- ${title} ---\n\n`;
    content += `구성 원칙: ${plan.reason}\n\n`;

    plan.plan.forEach(dayPlan => {
        content += `[ ${dayPlan.day} ]\n`;
        dayPlan.meals.forEach(meal => {
            content += `  - ${meal.time}: ${meal.menu} (참고: ${meal.note})\n`;
        });
        content += "\n";
    });
    return content;
  };

  const handleDownloadMealPlan = (plan: AiMealPlan) => {
    const content = formatMealPlanAsText(plan);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `잇플레이_식단표_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800/50 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-zinc-800 animate-fadeIn">
      <header className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-500 dark:text-green-400">{mealPlan.title}</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl mx-auto text-sm sm:text-base">{mealPlan.reason}</p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-3 mb-6 border-b border-gray-200 dark:border-zinc-700 pb-6">
        <button
          onClick={() => handleDownloadMealPlan(mealPlan)}
          className="flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors flex-grow"
        >
          <span role="img" aria-label="download" className="mr-2">📥</span> 전체 식단 다운로드
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-400 dark:bg-zinc-600 text-white font-semibold hover:bg-gray-500 dark:hover:bg-zinc-500 transition-colors"
        >
          <span role="img" aria-label="close" className="mr-2">❌</span> 닫기
        </button>
      </div>

      <div className="space-y-6">
        {currentPlan.map((dailyPlan, index) => (
          <div key={index} className="bg-white/50 dark:bg-zinc-950/50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3">{dailyPlan.day}</h3>
            <div className="divide-y divide-gray-200 dark:divide-zinc-700/50">
              {dailyPlan.meals.map((meal, mealIndex) => (
                <div key={mealIndex} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start">
                  <div className="font-bold text-green-600 dark:text-green-400 sm:text-right">{meal.time}</div>
                  <div className="sm:col-span-2">
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300">{meal.menu}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{meal.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200 dark:border-zinc-700">
           <button
             onClick={handlePrev}
             disabled={currentPage === 0}
             className={`px-4 py-2 rounded-lg font-bold transition-colors ${currentPage === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
           >
             ◀ 이전 주
           </button>
           <span className="text-zinc-600 dark:text-zinc-400 font-medium">
             {currentPage + 1} / {totalPages} 페이지
           </span>
           <button
             onClick={handleNext}
             disabled={currentPage === totalPages - 1}
             className={`px-4 py-2 rounded-lg font-bold transition-colors ${currentPage === totalPages - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
           >
             다음 주 ▶
           </button>
        </div>
      )}

       <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
