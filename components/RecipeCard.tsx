import React from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onViewDetails: (recipe: Recipe) => void;
  onToggleSave: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isSaved, onViewDetails, onToggleSave }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:border-green-400 dark:hover:border-zinc-700 hover:shadow-green-500/10 hover:-translate-y-1">
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-6xl border-b border-gray-200 dark:border-zinc-800">
        {recipe.icon}
      </div>
      <div className="p-5">
        <h3 
          className="text-xl font-semibold text-zinc-900 dark:text-white cursor-pointer hover:text-green-500 dark:hover:text-green-400 transition-colors"
          onClick={() => onViewDetails(recipe)}
        >
          {recipe.name}
        </h3>
        {recipe.aiReason && (
            <div className="mt-2 p-3 bg-green-100/50 dark:bg-green-900/50 border border-green-500/30 rounded-md text-green-800 dark:text-green-300 text-xs">
              <strong className="font-semibold">🤖 추천 이유:</strong> {recipe.aiReason}
            </div>
        )}
        <div className="flex flex-wrap gap-2 my-3">
          {recipe.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 h-10">{recipe.description}</p>
        
        <div className="grid grid-cols-4 gap-2 text-center text-xs mb-4">
            <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-md">
                <div className="text-sm font-bold text-green-500 dark:text-green-400">{recipe.calories}</div>
                <div className="text-gray-500 dark:text-zinc-500">KCAL</div>
            </div>
            <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-md">
                <div className="text-sm font-bold text-green-500 dark:text-green-400">{recipe.protein}g</div>
                <div className="text-gray-500 dark:text-zinc-500">단백질</div>
            </div>
            <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-md">
                <div className="text-sm font-bold text-green-500 dark:text-green-400">{recipe.carbs}g</div>
                <div className="text-gray-500 dark:text-zinc-500">탄수화물</div>
            </div>
            <div className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-md">
                <div className="text-sm font-bold text-green-500 dark:text-green-400">{recipe.fat}g</div>
                <div className="text-gray-500 dark:text-zinc-500">지방</div>
            </div>
        </div>

        <div className="flex">
          <button
            onClick={() => onToggleSave(recipe)}
            title="저장"
            className={`w-full flex items-center justify-center py-2 border rounded-lg transition-all duration-300 ${
              isSaved
                ? 'bg-green-500 border-green-500 text-white'
                : 'bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
            }`}
          >
            {isSaved ? '❤️ 저장됨' : '🤍 저장'}
          </button>
        </div>
      </div>
    </div>
  );
};