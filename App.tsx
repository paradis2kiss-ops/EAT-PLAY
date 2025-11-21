
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DiseaseSelector } from './components/DiseaseSelector';
import { SearchSection } from './components/SearchSection';
import { RecipeGrid } from './components/RecipeGrid';
import { RecipeModal } from './components/RecipeModal';
import { generateAiRecipes, generateAiMealPlan, getAiIngredientModification } from './services/geminiService';
import { RECIPE_DATABASE } from './data/constants';
import type { Recipe, DiseaseSelection, ModifiedRecipe, AiMealPlan, DailyLog } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { GenerateRecipeCTA } from './components/GenerateRecipeCTA';
import { GeneratedRecipeCard } from './components/GeneratedRecipeCard';
import { GeneratedMealPlan } from './components/GeneratedMealPlan';
import { FoodDiary } from './components/FoodDiary';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('eat-play-dark-mode', true);
  const [selectedDiseases, setSelectedDiseases] = useLocalStorage<DiseaseSelection[]>('eat-play-diseases', []);
  const [avoidance, setAvoidance] = useLocalStorage<string>('eat-play-avoidance', '');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedRecipes, setSavedRecipes] = useLocalStorage<Recipe[]>('eat-play-saved-recipes', []);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [modifiedRecipe, setModifiedRecipe] = useState<ModifiedRecipe | null>(null);
  const [isModifying, setIsModifying] = useState<boolean>(false);

  const [generatedRecipes, setGeneratedRecipes] = useState<ModifiedRecipe[] | null>(null);
  const [generatedMealPlan, setGeneratedMealPlan] = useState<AiMealPlan | null>(null);
  const [isHealthSectionVisible, setIsHealthSectionVisible] = useState(true);

  // Food Diary State
  const [foodLogs, setFoodLogs] = useLocalStorage<DailyLog[]>('eat-play-food-logs', []);
  const [isFoodDiaryOpen, setIsFoodDiaryOpen] = useState(false);


  const filterRecipes = useCallback(() => {
    setGeneratedRecipes(null);
    setGeneratedMealPlan(null);

    if (selectedDiseases.length === 0 && !searchQuery) {
        setRecipes([]);
        return;
    }

    let filtered: Recipe[] = [];
    const allRecipes = Object.values(RECIPE_DATABASE).flat();

    if(searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(lowercasedQuery) ||
            recipe.description.toLowerCase().includes(lowercasedQuery) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(lowercasedQuery))
        );
    } else if (selectedDiseases.length > 0) {
        const selectedRecipes = new Map<string, Recipe>();
        selectedDiseases.forEach(disease => {
            const recipesForDisease = RECIPE_DATABASE[disease.key] || [];
            recipesForDisease.forEach(recipe => {
                if (!selectedRecipes.has(recipe.name)) {
                    selectedRecipes.set(recipe.name, recipe);
                }
            });
        });
        filtered = Array.from(selectedRecipes.values());
    }

    setRecipes(filtered);
  }, [selectedDiseases, searchQuery]);


  useEffect(() => {
    filterRecipes();
  }, [selectedDiseases, searchQuery, filterRecipes]);
  
  const getSelectedDiseasesInfo = () => {
     return (selectedDiseases && selectedDiseases.length > 0)
        ? selectedDiseases.map(d => d.name).join('/')
        : '일반 건강식';
  };

  const handleAiRequest = async (
    query: string,
    type: 'recipe' | 'mealPlan',
    period?: 'week' | 'month'
  ) => {
    const diseaseName = getSelectedDiseasesInfo();

    setIsLoading(true);
    setIsHealthSectionVisible(false); // Collapse section
    setGeneratedRecipes(null);
    setGeneratedMealPlan(null);
    setRecipes([]);
    setSearchQuery(query);

    try {
        const context = {
            disease: diseaseName,
            avoidance: avoidance || '없음',
            query: query,
            period: period || '',
        };

        if (type === 'recipe') {
            if (!query) {
                alert('레시피를 생성하려면 검색어를 입력해주세요.');
                return;
            }
            if (diseaseName === '일반 건강식' && !avoidance) {
              alert(' 추천받으려면 건강 상태를 선택하거나, 알레르기/기피 식품을 입력해주세요 😊');
              return;
            }
            const aiResult = await generateAiRecipes(context);
            setGeneratedRecipes(aiResult);
        } else if (type === 'mealPlan') {
            const aiResult = await generateAiMealPlan(context);
            setGeneratedMealPlan(aiResult);
        }
    } catch (error) {
        console.error(' 요청 오류:', error);
        alert(' 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleRequestModification = async (recipeToModify: Recipe) => {
    if (selectedDiseases.length === 0) {
        alert('먼저 건강 상태를 선택해주세요 😊');
        return;
    }
    setIsModifying(true);
    setModifiedRecipe(null);
    try {
        const diseaseName = getSelectedDiseasesInfo();
        const modification = await getAiIngredientModification(diseaseName, recipeToModify);
        setModifiedRecipe(modification);
    } catch (error) {
        console.error(' 재료 수정 오류:', error);
        alert(' 재료 수정 제안을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
        setIsModifying(false);
    }
  };

  const handleViewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModifiedRecipe(null);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
    setModifiedRecipe(null);
  };
  
  const handleToggleSelect = (disease: DiseaseSelection) => {
    setSelectedDiseases(prev => {
        const isSelected = prev.some(d => d.key === disease.key);
        if (isSelected) {
            return prev.filter(d => d.key !== disease.key);
        } else {
            return [...prev, disease];
        }
    });
  };

  const handleResetSelection = () => {
      setSelectedDiseases([]);
      setAvoidance('');
      setSearchQuery('');
      alert('건강 상태 선택이 초기화되었습니다. 다시 선택해주세요.');
  };

  const handleGeneralSelection = () => {
      setSelectedDiseases([]);
      alert('특정 질환 없이 일반 건강식 검색 모드로 전환되었습니다.');
  };

  const handleToggleSave = (recipeToToggle: Recipe) => {
    setSavedRecipes(prev => {
      const isSaved = prev.some(r => r.name === recipeToToggle.name);
      if (isSaved) {
        return prev.filter(r => r.name !== recipeToToggle.name);
      } else {
        return [...prev, recipeToToggle];
      }
    });
  };

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center p-10"><LoadingSpinner text="맞춤 정보를 생성 중입니다..." /></div>;
    
    if (generatedMealPlan) {
      return (
        <GeneratedMealPlan 
          mealPlan={generatedMealPlan} 
          onClose={() => setGeneratedMealPlan(null)} 
        />
      );
    }

    if (generatedRecipes && generatedRecipes.length > 0) {
      return (
        <div>
          <div className="space-y-6">
            {generatedRecipes.map((recipe, index) => (
              <React.Fragment key={index}>
                <GeneratedRecipeCard recipe={recipe} />
                {index < generatedRecipes.length - 1 && <hr className="my-8 border-t-2 border-dashed border-gray-200 dark:border-zinc-700" />}
              </React.Fragment>
            ))}
          </div>
          <button
            onClick={() => setGeneratedRecipes(null)}
            className="w-full mt-6 bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors duration-300"
          >
            닫고 다른 레시피 검색하기
          </button>
        </div>
      );
    }

    if (recipes.length === 0 && searchQuery && (selectedDiseases.length > 0 || avoidance)) {
      return <GenerateRecipeCTA dishName={searchQuery} onGenerate={() => handleAiRequest(searchQuery, 'recipe')} />;
    }
    
    return <RecipeGrid 
      recipes={recipes} 
      isLoading={false} 
      savedRecipes={savedRecipes}
      onViewDetails={handleViewDetails} 
      onToggleSave={handleToggleSave}
      emptyStateIcon="🥗"
      emptyStateText="건강 상태를 선택하거나 검색해보세요"
    />;
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 min-h-screen text-zinc-800 dark:text-zinc-300 transition-colors duration-300">
        <div className="container max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="bg-white/70 dark:bg-zinc-950/70 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-gray-400/20 dark:shadow-black/50 overflow-hidden">
            <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <main className="p-4 sm:p-6 md:p-10">
              <DiseaseSelector
                selectedDiseases={selectedDiseases}
                onToggleSelect={handleToggleSelect} 
                onReset={handleResetSelection}
                onGeneralSelect={handleGeneralSelection}
                avoidance={avoidance}
                onAvoidanceChange={setAvoidance}
                isVisible={isHealthSectionVisible}
                onToggleVisibility={() => setIsHealthSectionVisible(p => !p)}
              />

              <SearchSection onFindRecipe={(query) => handleAiRequest(query, 'recipe')} onSearch={setSearchQuery} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 mb-6">
                <button
                    onClick={() => handleAiRequest('', 'mealPlan', 'week')}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    📅 1주일 식단 추천
                </button>
                <button
                    onClick={() => handleAiRequest('', 'mealPlan', 'month')}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    🗓️ 1달 식단 추천
                </button>
                <button
                    onClick={() => setIsFoodDiaryOpen(true)}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    📝 식단 일기 (Food Diary)
                </button>
              </div>

              <div className="mt-6 border-t border-gray-200 dark:border-zinc-800 pt-6">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
      {selectedRecipe && <RecipeModal 
          recipe={selectedRecipe} 
          onClose={handleCloseModal}
          onModify={handleRequestModification}
          modifiedRecipe={modifiedRecipe}
          isModifying={isModifying}
        />}
      {isFoodDiaryOpen && (
        <FoodDiary 
          logs={foodLogs}
          setLogs={setFoodLogs}
          onClose={() => setIsFoodDiaryOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
