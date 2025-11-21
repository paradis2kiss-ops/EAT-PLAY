
import React from 'react';

interface LoadingSpinnerProps {
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
  return (
    <div className="text-center p-10 text-green-500 dark:text-green-400">
      <div className="w-12 h-12 border-4 border-gray-300 dark:border-zinc-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
      {text && <p>{text}</p>}
    </div>
  );
};
