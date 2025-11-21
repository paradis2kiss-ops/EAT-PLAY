
import React, { useState, useMemo } from 'react';
import type { DailyLog, FoodLogEntry } from '../types';

interface FoodDiaryProps {
  logs: DailyLog[];
  setLogs: React.Dispatch<React.SetStateAction<DailyLog[]>>;
  onClose: () => void;
}

const MEAL_TIMES = ['아침', '점심', '저녁', '간식'] as const;
const DAILY_CALORIE_GOAL = 2000; // Default goal

export const FoodDiary: React.FC<FoodDiaryProps> = ({ logs, setLogs, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEntry, setNewEntry] = useState<{ time: string; menu: string; calories: string }>({
    time: '아침',
    menu: '',
    calories: ''
  });

  const currentLog = useMemo(() => 
    logs.find(log => log.date === currentDate) || { date: currentDate, entries: [] },
  [logs, currentDate]);

  const totalCalories = useMemo(() => 
    currentLog.entries.reduce((sum, entry) => sum + (entry.calories || 0), 0),
  [currentLog]);

  const progressPercentage = Math.min((totalCalories / DAILY_CALORIE_GOAL) * 100, 100);

  const handleDateChange = (offset: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + offset);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.menu) return;

    const entry: FoodLogEntry = {
      id: Date.now().toString(),
      time: newEntry.time as any,
      menu: newEntry.menu,
      calories: parseInt(newEntry.calories) || 0
    };

    setLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => log.date === currentDate);
      if (existingLogIndex >= 0) {
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = {
          ...updatedLogs[existingLogIndex],
          entries: [...updatedLogs[existingLogIndex].entries, entry]
        };
        return updatedLogs;
      } else {
        return [...prevLogs, { date: currentDate, entries: [entry] }];
      }
    });

    setNewEntry(prev => ({ ...prev, menu: '', calories: '' }));
  };

  const handleDeleteEntry = (id: string) => {
    setLogs(prevLogs => {
      return prevLogs.map(log => {
        if (log.date === currentDate) {
          return {
            ...log,
            entries: log.entries.filter(entry => entry.id !== id)
          };
        }
        return log;
      });
    });
  };

  const getProgressColor = () => {
    if (progressPercentage > 110) return 'bg-red-500';
    if (progressPercentage > 90) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getEatMateMessage = () => {
    if (totalCalories === 0) return "오늘의 식단을 기록하고 건강을 챙겨보세요! 🍎";
    if (totalCalories < DAILY_CALORIE_GOAL * 0.8) return "잘하고 있어요! 균형 잡힌 식사가 중요해요. 🥗";
    if (totalCalories <= DAILY_CALORIE_GOAL * 1.1) return "완벽해요! 오늘의 목표 달성입니다! 🎉";
    return "오늘은 조금 많이 드셨네요! 내일 더 건강하게 먹으면 돼요. 💪";
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold font-gaegu flex items-center gap-2">
              📝 잇 플레이 식단 일기
            </h2>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
          </div>
          
          {/* Date Navigator */}
          <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
            <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-white/20 rounded-full transition">◀</button>
            <span className="font-bold text-lg">{currentDate}</span>
            <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-white/20 rounded-full transition">▶</button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">오늘의 섭취 칼로리</p>
              <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
                {totalCalories.toLocaleString()} <span className="text-sm font-normal text-zinc-500">/ {DAILY_CALORIE_GOAL} kcal</span>
              </p>
            </div>
            <span className="text-2xl animate-bounce">{progressPercentage > 100 ? '⚠️' : '✨'}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getProgressColor()}`} 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-center font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 py-2 rounded-lg">
             🤖 잇 메이트: {getEatMateMessage()}
          </p>
        </div>

        {/* Diary Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {MEAL_TIMES.map(time => {
            const meals = currentLog.entries.filter(e => e.time === time);
            return (
              <div key={time} className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-zinc-700 dark:text-zinc-200 mb-3 flex items-center gap-2">
                  {time === '아침' && '🌅'}
                  {time === '점심' && '☀️'}
                  {time === '저녁' && '🌙'}
                  {time === '간식' && '🍪'}
                  {time}
                </h3>
                
                {meals.length > 0 ? (
                  <ul className="space-y-2">
                    {meals.map(meal => (
                      <li key={meal.id} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-700/50 p-3 rounded-lg group">
                        <div>
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">{meal.menu}</span>
                          <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">{meal.calories} kcal</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteEntry(meal.id)}
                          className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">기록된 식사가 없습니다.</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Entry Form */}
        <form onSubmit={handleAddEntry} className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={newEntry.time}
              onChange={e => setNewEntry({...newEntry, time: e.target.value})}
              className="p-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
            >
              {MEAL_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input 
              type="text" 
              placeholder="메뉴 이름 (예: 현미밥, 닭가슴살)" 
              value={newEntry.menu}
              onChange={e => setNewEntry({...newEntry, menu: e.target.value})}
              className="flex-grow p-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              required
            />
            <input 
              type="number" 
              placeholder="칼로리 (선택)" 
              value={newEntry.calories}
              onChange={e => setNewEntry({...newEntry, calories: e.target.value})}
              className="w-full sm:w-24 p-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
            />
            <button 
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
            >
              추가
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
            animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
