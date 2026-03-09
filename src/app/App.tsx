import { useState } from "react";
import { Home, CheckSquare, Target, Calendar } from "lucide-react";
import { MainDashboard } from "./components/MainDashboard";
import { TodoScreen } from "./components/TodoScreen";
import { GoalRoutineScreen } from "./components/GoalRoutineScreen";
import { CalendarScreen } from "./components/CalendarScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'todos' | 'goals-routines' | 'calendar'>('home');
  const [shouldOpenAddModal, setShouldOpenAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 2, 9)); // March 9, 2026

  const handleNavigate = (screen: 'home' | 'todos' | 'goals-routines' | 'calendar', options?: { openAddModal?: boolean; date?: Date }) => {
    setCurrentScreen(screen);
    setShouldOpenAddModal(options?.openAddModal || false);
    
    if (options?.date) {
      setSelectedDate(options.date);
    }
    
    // 모달을 열고 나면 즉시 리셋 (다음 렌더링 사이클에서)
    if (options?.openAddModal) {
      setTimeout(() => setShouldOpenAddModal(false), 100);
    }
  };

  const tabs = [
    { id: "home" as const, label: "홈", icon: Home },
    { id: "todos" as const, label: "할일", icon: CheckSquare },
    { id: "goals-routines" as const, label: "목표·루틴", icon: Target },
    { id: "calendar" as const, label: "달력", icon: Calendar },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <MainDashboard onNavigate={handleNavigate} />;
      case 'todos':
        return <TodoScreen onNavigate={handleNavigate} shouldOpenAddModal={shouldOpenAddModal} />;
      case 'goals-routines':
        return <GoalRoutineScreen onNavigate={handleNavigate} shouldOpenAddModal={shouldOpenAddModal} />;
      case 'calendar':
        return <CalendarScreen onNavigate={handleNavigate} selectedDate={selectedDate} />;
      default:
        return <MainDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="h-screen max-w-md mx-auto bg-gray-50 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-gray-200">
        <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentScreen === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  active
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon
                  className="w-6 h-6"
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}