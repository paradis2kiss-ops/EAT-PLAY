
import React, { useState } from 'react';
import { DISEASE_CATEGORIES } from '../data/constants';
import type { Disease, DiseaseSelection } from '../types';

interface DiseaseSelectorProps {
  selectedDiseases: DiseaseSelection[];
  onToggleSelect: (selection: DiseaseSelection) => void;
  onReset: () => void;
  onGeneralSelect: () => void;
  avoidance: string;
  onAvoidanceChange: (value: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

export const DiseaseSelector: React.FC<DiseaseSelectorProps> = ({ 
    selectedDiseases, 
    onToggleSelect, 
    onReset, 
    onGeneralSelect,
    avoidance,
    onAvoidanceChange,
    isVisible,
    onToggleVisibility
}) => {
  const [expandedDiseaseId, setExpandedDiseaseId] = useState<string | null>(null);
  
  const isSelected = (key: string) => selectedDiseases.some(d => d.key === key);

  const handleDiseaseClick = (disease: Disease) => {
    if (disease.subOptions) {
      setExpandedDiseaseId(prev => (prev === disease.id ? null : disease.id));
    } else {
      onToggleSelect({ key: disease.id, name: disease.name });
    }
  };

  const handleSubOptionClick = (disease: Disease, subOption: {id: string, name: string}) => {
    onToggleSelect({
        key: `${disease.id}-${subOption.id}`,
        name: `${disease.name} (${subOption.name})`
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-zinc-900 dark:to-black/50 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 mb-6">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggleVisibility}
        role="button"
        aria-expanded={isVisible}
        aria-controls="health-condition-content"
      >
        <h2 className="text-xl font-semibold flex items-center gap-3">
          <span className="text-green-400">👩🏻‍⚕️</span>
          나의 건강 상태 (선택)
        </h2>
        <ChevronIcon className={`text-zinc-500 dark:text-zinc-400 transform transition-transform duration-300 ${isVisible ? '' : 'rotate-180'}`} />
      </div>

      {isVisible && (
        <div id="health-condition-content" className="mt-5 animate-fadeIn">
            <div className="flex justify-end space-x-2 mb-4">
                <button
                    onClick={onReset}
                    className="px-3 py-2 text-xs font-medium rounded-lg bg-gray-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors flex items-center gap-1"
                    title="선택 초기화"
                >
                    ↻ 
                </button>
                <button
                    onClick={onGeneralSelect}
                    className="px-3 py-2 text-xs font-medium rounded-lg bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                    title="특정 질환 없음"
                >
                    질환없음
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DISEASE_CATEGORIES.map(category => (
              <div key={category.name} className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 transition-colors duration-300 hover:border-gray-300 dark:hover:border-zinc-700">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 dark:border-zinc-800">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-semibold text-green-500 dark:text-green-400">{category.name}</h3>
                </div>
                <div className="space-y-2">
                  {category.diseases.map(disease => (
                    <div key={disease.id}>
                      <div
                        onClick={() => handleDiseaseClick(disease)}
                        className={`flex items-center justify-between gap-3 p-3 rounded-md cursor-pointer transition-all duration-300 text-sm border ${
                          !disease.subOptions && isSelected(disease.id)
                            ? 'bg-green-100 dark:bg-green-800/50 border-green-500 text-green-700 dark:text-green-200 font-bold shadow-md'
                            : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{disease.icon}</span>
                          <span>{disease.name}</span>
                        </div>
                        {!disease.subOptions && isSelected(disease.id) && <span className="text-base">✔️</span>}
                      </div>
                      {disease.subOptions && expandedDiseaseId === disease.id && (
                        <div className="pl-6 mt-2 space-y-2">
                          {disease.subOptions.map(sub => {
                            const subKey = `${disease.id}-${sub.id}`;
                            const subIsSelected = isSelected(subKey);
                            return (
                              <div
                                key={sub.id}
                                onClick={() => handleSubOptionClick(disease, sub)}
                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-xs transition-all duration-300 border ${
                                  subIsSelected
                                    ? 'bg-green-100 dark:bg-green-800/50 border-green-500 text-green-700 dark:text-green-200 font-bold'
                                    : 'bg-gray-200/50 dark:bg-zinc-700/50 hover:bg-gray-300/50 dark:hover:bg-zinc-600/50 text-gray-600 dark:text-zinc-400 border-transparent'
                                }`}
                              >
                                <span>{sub.name}</span>
                                {subIsSelected && <span className="text-base">✔️</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
           <div className="mt-6 p-4 rounded-xl bg-yellow-50 dark:bg-zinc-800/60 border border-yellow-300 dark:border-zinc-700">
                <label htmlFor="avoidance-foods" className="block text-base font-semibold mb-2 text-yellow-800 dark:text-yellow-300">
                    🚫 알레르기 / 기피 식품 입력 (선택 사항)
                </label>
                <input
                    id="avoidance-foods"
                    type="text"
                    value={avoidance}
                    onChange={(e) => onAvoidanceChange(e.target.value)}
                    placeholder="예: 새우, 땅콩, 고수, 매운 음식..."
                    className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700/80 focus:border-green-500 focus:ring-green-500 transition-colors"
                />
            </div>
        </div>
      )}
       <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
                animation: fadeIn 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};
