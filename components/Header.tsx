
import React from 'react';
import { PotionIcon } from './PotionIcon';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <header className="bg-gradient-to-br from-green-600 via-green-500 to-green-600 dark:from-green-700 dark:via-green-600 dark:to-green-700 p-6 md:p-8 text-white relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-gaegu text-3xl md:text-4xl font-bold flex items-center gap-2">
            <PotionIcon className="w-10 h-10 md:w-12 md:h-12" />
            <span>잇 플레이 (Eat Play)</span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-90 font-light">
            안녕하세요, 저는 당신의 건강 식단 메이트, 잇 메이트입니다. 🎮
          </p>
        </div>
      </div>
    </header>
  );
};
