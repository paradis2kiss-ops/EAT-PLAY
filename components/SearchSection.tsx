
import React, { useState } from 'react';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onFindRecipe: (query: string) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, onFindRecipe }) => {
    const [query, setQuery] = useState('');

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            onFindRecipe(query);
        } else {
            alert('레시피를 생성하려면 검색어를 입력해주세요.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        // This allows live searching on the local database as the user types
        onSearch(e.target.value);
    };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-zinc-900 dark:to-black/50 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 mb-2">
      <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="만들어달라고 요청할 요리 이름 (예: 닭가슴살 샐러드)"
          className="flex-grow bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
        >
          👩🏻‍🍳 레시피 생성
        </button>
      </form>
       <p className="text-xs text-center mt-3 text-zinc-500 dark:text-zinc-400">
        입력창에 검색어를 입력하면 기존 레시피가 필터링됩니다. 잇 메이트에게 새로운 레시피를 요청하려면 '레시피 생성' 버튼을 누르세요. 😊
      </p>
    </div>
  );
};