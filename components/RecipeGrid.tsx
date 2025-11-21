import React from 'react';
import { RecipeCard } from './RecipeCard';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import type { Recipe } from '../types';

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  savedRecipes: Recipe[];
  onViewDetails: (recipe: Recipe) => void;
  onToggleSave: (recipe: Recipe) => void;
  emptyStateIcon: string;
  emptyStateText: string;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({ 
  recipes, isLoading, savedRecipes, onViewDetails, onToggleSave, emptyStateIcon, emptyStateText
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <LoadingSpinner text="맛있는 레시피를 찾고 있어요..." />
      </div>
    );
  }

  if (recipes.length === 0) {
    return <EmptyState icon={emptyStateIcon} text={emptyStateText} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.name}
          recipe={recipe}
          isSaved={savedRecipes.some(r => r.name === recipe.name)}
          onViewDetails={onViewDetails}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
};