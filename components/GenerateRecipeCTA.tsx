
import React from 'react';

interface GenerateRecipeCTAProps {
  dishName: string;
  onGenerate: () => void;
}

export const GenerateRecipeCTA: React.FC<GenerateRecipeCTAProps> = ({ dishName, onGenerate }) => {
  return (
    <div className="text-center py-20 px-6 bg-gray-100/50 dark:bg-zinc-900/50 border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl">
      <div className="text-6xl mb-4">🤔</div>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
        '<span className="font-semibold text-green-500 dark:text-green-400">{dishName}</span>'에 대한 검색 결과가 없습니다. <br />
        대신 잇 메이트에게 건강 맞춤 레시피를 만들어달라고 요청해볼까요? 🤝
      </p>
      <button
        onClick={onGenerate}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-8 py-4 rounded-lg flex items-center justify-center gap-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 mx-auto"
      >
        ✨ 잇 메이트와 레시피 생성하기
      </button>
    </div>
  );
};