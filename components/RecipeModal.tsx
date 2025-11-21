
import React, { useEffect } from 'react';
import type { Recipe, ModifiedRecipe } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onModify: (recipe: Recipe) => void;
  modifiedRecipe: ModifiedRecipe | null;
  isModifying: boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onModify, modifiedRecipe, isModifying }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const hasMicros = recipe.fiber !== undefined || recipe.sodium !== undefined || recipe.potassium !== undefined || recipe.calcium !== undefined || recipe.iron !== undefined || recipe.magnesium !== undefined || recipe.phosphorus !== undefined;

  const MicroItem = ({ label, value, unit }: { label: string, value?: number, unit: string }) => {
    if (value === undefined) return null;
    return (
      <div className="flex flex-col items-center justify-center p-2 bg-white dark:bg-zinc-700/50 rounded-lg shadow-sm">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{label}</span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{value}<span className="text-xs font-normal ml-0.5">{unit}</span></span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50 animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{recipe.name}</h2>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 w-9 h-9 rounded-full flex items-center justify-center text-xl transition-transform duration-300 hover:rotate-90"
            >
              ×
            </button>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-green-500 dark:text-green-400 mb-3 flex items-center gap-2">🥘 재료</h3>
            <ul className="bg-gray-100/50 dark:bg-zinc-800/50 p-4 rounded-lg border-l-4 border-green-500 space-y-2">
              {recipe.ingredients.map((ing, index) => (
                <li key={index} className="text-zinc-700 dark:text-zinc-300">{ing}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-blue-500 dark:text-blue-400 mb-3 flex items-center gap-2">🤖 AI 맞춤 재료 제안</h3>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
              {isModifying ? (
                <LoadingSpinner text="AI가 레시피를 분석하고 있어요..." />
              ) : modifiedRecipe ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">✅ 수정된 재료</h4>
                    <ul className="space-y-1 list-disc list-inside">
                      {modifiedRecipe.modifiedIngredients.map((ing, index) => (
                        <li key={index} className="text-zinc-700 dark:text-zinc-300">{ing}</li>
                      ))}
                    </ul>
                  </div>
                  {modifiedRecipe.modifiedDescription && (
                    <div>
                      <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">📝 수정된 설명</h4>
                      <p className="text-zinc-700 dark:text-zinc-300 text-sm">{modifiedRecipe.modifiedDescription}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">💡 수정 이유</h4>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm">{modifiedRecipe.reason}</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    선택하신 건강 상태에 맞춰 재료를 변경하거나 대체하는 똑똑한 제안을 해드려요.
                  </p>
                  <button 
                    onClick={() => onModify(recipe)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    ✨ 제안 받기
                  </button>
                </>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-green-500 dark:text-green-400 mb-3 flex items-center gap-2">📊 영양 정보</h3>
            <div className="bg-gray-100/50 dark:bg-zinc-800/50 p-5 rounded-xl">
              {/* Macro Nutrients */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                <div className="bg-white dark:bg-zinc-700 p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-500 dark:text-green-400">{recipe.calories}</div>
                  <div className="text-sm text-gray-500 dark:text-zinc-400">KCAL</div>
                </div>
                <div className="bg-white dark:bg-zinc-700 p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-500 dark:text-green-400">{recipe.protein}<span className="text-base">g</span></div>
                  <div className="text-sm text-gray-500 dark:text-zinc-400">단백질</div>
                </div>
                <div className="bg-white dark:bg-zinc-700 p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-500 dark:text-green-400">{recipe.carbs}<span className="text-base">g</span></div>
                  <div className="text-sm text-gray-500 dark:text-zinc-400">탄수화물</div>
                </div>
                <div className="bg-white dark:bg-zinc-700 p-3 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-500 dark:text-green-400">{recipe.fat}<span className="text-base">g</span></div>
                  <div className="text-sm text-gray-500 dark:text-zinc-400">지방</div>
                </div>
              </div>

              {/* Micro Nutrients */}
              {hasMicros ? (
                <div>
                   <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-700 pb-2">상세 영양소</h4>
                   <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      <MicroItem label="식이섬유" value={recipe.fiber} unit="g" />
                      <MicroItem label="당류" value={recipe.sugar} unit="g" />
                      <MicroItem label="나트륨" value={recipe.sodium} unit="mg" />
                      <MicroItem label="칼륨" value={recipe.potassium} unit="mg" />
                      <MicroItem label="콜레스테롤" value={recipe.cholesterol} unit="mg" />
                      <MicroItem label="칼슘" value={recipe.calcium} unit="mg" />
                      <MicroItem label="철분" value={recipe.iron} unit="mg" />
                      <MicroItem label="마그네슘" value={recipe.magnesium} unit="mg" />
                      <MicroItem label="인" value={recipe.phosphorus} unit="mg" />
                   </div>
                </div>
              ) : (
                 <p className="text-center text-xs text-zinc-400">상세 영양 정보가 제공되지 않는 레시피입니다.</p>
              )}
            </div>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-green-500 dark:text-green-400 mb-3 flex items-center gap-2">👨‍🍳 조리 방법</h3>
            <ol className="space-y-3">
              {(recipe.steps || ["레시피에 따라 맛있게 조리하세요."]).map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                  <p className="text-zinc-700 dark:text-zinc-300 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
       <style>{`
        @keyframes slideUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        .animate-slideUp {
            animation: slideUp 0.3s ease-out forwards;
        }
        `}</style>
    </div>
  );
};
