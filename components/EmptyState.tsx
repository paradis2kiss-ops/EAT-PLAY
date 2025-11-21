
import React from 'react';

interface EmptyStateProps {
  icon: string;
  text: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, text }) => {
  return (
    <div className="text-center py-20 px-6 text-zinc-400 dark:text-zinc-500">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-lg">{text}</p>
    </div>
  );
};
