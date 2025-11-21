import React from 'react';
import type { ModifiedRecipe } from '../types';

interface GeneratedRecipeCardProps {
  recipe: ModifiedRecipe;
}

export const GeneratedRecipeCard: React.FC<GeneratedRecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800/50 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 animate-fadeIn">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-green-500 dark:text-green-400">{recipe.name}</h2>
          {recipe.modifiedDescription && (
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">{recipe.modifiedDescription}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">🥘 맞춤 재료</h3>
          <ul className="bg-white/50 dark:bg-zinc-950/50 p-4 rounded-lg border-l-4 border-green-500 space-y-2">
            {recipe.modifiedIngredients.map((ing, index) => (
              <li key={index} className="text-zinc-700 dark:text-zinc-300">{ing}</li>
            ))}
          </ul>
        </section>

        {recipe.instructions && recipe.instructions.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">👨‍🍳 조리 방법</h3>
            <ol className="bg-white/50 dark:bg-zinc-950/50 p-4 rounded-lg border-l-4 border-green-500 space-y-3">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                  <p className="text-zinc-700 dark:text-zinc-300 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section>
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">💡 추천 이유</h3>
          <div className="bg-white/50 dark:bg-zinc-950/50 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">{recipe.reason}</p>
          </div>
        </section>
      </div>

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