import { useState } from "react";
import { CheckSquare, Target, Calendar as CalendarIcon, Circle, CheckCircle2, Plus, X, ChevronRight, ChevronLeft, Flame, Menu } from "lucide-react";

type ScreenId = 'home' | 'todos' | 'goals-routines' | 'calendar';

interface MainDashboardProps {
  onNavigate: (screen: ScreenId, options?: { openAddModal?: boolean; date?: Date }) => void;
}

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  fromRoutine?: boolean; // 루틴에서 생성된 할일인지
  routineId?: string;
}

interface RoutineCount {
  id: string;
  title: string;
  current: number;
  target: number;
  color: string;
}

export function MainDashboard({ onNavigate }: MainDashboardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddText, setQuickAddText] = useState("");
  const today = new Date(2026, 2, 9); // March 9, 2026
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekOffset, setWeekOffset] = useState(0); // 주 단위 오프셋

  // 오늘 할일 (루틴 기반 + 일반)
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", title: "영어 단어 10개", completed: true, fromRoutine: true, routineId: "r1" },
    { id: "2", title: "운동 30분", completed: true, fromRoutine: true, routineId: "r2" },
    { id: "3", title: "보고서 작성", completed: false, fromRoutine: false },
    { id: "4", title: "아침 명상", completed: true, fromRoutine: true, routineId: "r3" },
    { id: "5", title: "회의 준비", completed: false, fromRoutine: false },
    { id: "6", title: "독서 30분", completed: false, fromRoutine: true, routineId: "r4" },
    { id: "7", title: "장보기", completed: false, fromRoutine: false },
  ]);

  // 루틴 카운팅 (주간 진행)
  const [routines, setRoutines] = useState<RoutineCount[]>([
    { id: "r1", title: "영어 공부", current: 5, target: 7, color: "bg-blue-500" },
    { id: "r2", title: "운동", current: 3, target: 5, color: "bg-orange-500" },
    { id: "r3", title: "명상", current: 6, target: 7, color: "bg-green-500" },
    { id: "r4", title: "독서", current: 2, target: 4, color: "bg-purple-500" },
  ]);

  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;
  const progressPercentage = Math.round((completedTodos / totalTodos) * 100);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => {
      if (t.id === id) {
        // 루틴 기반 할일이면 루틴 카운트도 업데이트
        if (t.fromRoutine && t.routineId) {
          const wasCompleted = t.completed;
          setRoutines(routines.map(r => {
            if (r.id === t.routineId) {
              return {
                ...r,
                current: wasCompleted ? Math.max(0, r.current - 1) : Math.min(r.target, r.current + 1)
              };
            }
            return r;
          }));
        }
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleQuickAdd = () => {
    if (!quickAddText.trim()) return;
    
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title: quickAddText,
      completed: false,
      fromRoutine: false,
    };
    setTodos([...todos, newTodo]);
    setQuickAddText("");
    setShowQuickAdd(false);
  };

  const incrementRoutine = (routineId: string) => {
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        return { ...r, current: Math.min(r.target, r.current + 1) };
      }
      return r;
    }));
  };

  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return "좋은 아침";
    if (hour < 18) return "좋은 오후";
    return "좋은 저녁";
  };

  // 주간 날짜 생성 (weekOffset 적용)
  const getWeekDates = () => {
    const dates = [];
    const current = new Date(today);
    
    // weekOffset만큼 주를 이동
    current.setDate(current.getDate() + (weekOffset * 7));
    
    const dayOfWeek = current.getDay();
    const diff = current.getDate() - dayOfWeek;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      date.setDate(diff + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // 이전 주로 이동
  const previousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  // 다음 주로 이동
  const nextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  // 오늘로 돌아가기
  const goToToday = () => {
    setWeekOffset(0);
    setSelectedDate(today);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header - 간결하게 */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900">{greeting()} 👋</h1>
            <p className="text-[12px] text-gray-500 mt-0.5">
              {today.getMonth() + 1}월 {today.getDate()}일 {['일', '월', '화', '수', '목', '금', '토'][today.getDay()]}요일
            </p>
          </div>
          <button
            onClick={() => setShowMenu(true)}
            className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm"
          >
            <Menu className="w-4.5 h-4.5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* 주간 캘린더 - 더 컴팩트하게 */}
      <div className="px-3 pb-3">
        <div className="flex gap-1 justify-between">
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
            const dayOfWeek = date.getDay();
            
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(date);
                  onNavigate('calendar', { date: date });
                }}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : isToday
                    ? 'bg-white/70 text-blue-600 border border-blue-200/50'
                    : 'bg-white/50 text-gray-700'
                }`}
              >
                <span className={`text-[9px] font-semibold ${ 
                  isSelected ? 'text-white/70' : dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : 'text-gray-400'
                }`}>
                  {dayNames[dayOfWeek]}
                </span>
                <span className={`text-[14px] font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <button
            onClick={previousWeek}
            className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center hover:bg-white/70 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button
            onClick={goToToday}
            className="text-[10px] text-gray-500 font-semibold hover:text-gray-700 transition-colors px-2"
          >
            오늘
          </button>
          <button
            onClick={nextWeek}
            className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center hover:bg-white/70 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 오늘 할일 - 메인 콘텐츠로 최우선 배치 */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[16px] font-bold text-gray-900">오늘 할일</h2>
          <button
            onClick={() => onNavigate("todos")}
            className="flex items-center gap-0.5 text-[12px] text-blue-600 font-semibold"
          >
            전체
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {todos.slice(0, 5).map((todo) => (
            <div
              key={todo.id}
              className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/80 shadow-sm"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="w-full flex items-center gap-2.5 p-2.5"
              >
                {todo.completed ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4.5 h-4.5 text-gray-300 flex-shrink-0" />
                )}
                
                <div className="flex-1 text-left min-w-0">
                  <p className={`text-[13.5px] leading-snug ${todo.completed ? "text-gray-400 line-through" : "text-gray-900 font-medium"}`}>
                    {todo.title}
                  </p>
                </div>

                {todo.fromRoutine && (
                  <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[9px] font-bold">
                    루틴
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
        
        {todos.length > 5 && (
          <button
            onClick={() => onNavigate("todos")}
            className="w-full mt-2 py-2 text-[12px] text-gray-500 font-medium hover:text-gray-700"
          >
            +{todos.length - 5}개 더보기
          </button>
        )}
      </div>

      {/* 오늘 진행률 - 간결하게 */}
      <div className="px-4 pb-3">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/80 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-[13px] font-bold text-gray-700">오늘 진행률</h3>
            <span className="text-[16px] font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">
            {completedTodos} / {totalTodos} 완료
          </p>
        </div>
      </div>

      {/* 주간 루틴 - 간결하게 */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[16px] font-bold text-gray-900">주간 루틴</h2>
          <button
            onClick={() => onNavigate("goals-routines")}
            className="flex items-center gap-0.5 text-[12px] text-orange-600 font-semibold"
          >
            전체
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-2.5 border border-white/80 shadow-sm"
            >
              <div className="flex items-start justify-between mb-1.5">
                <p className="text-[12.5px] font-bold text-gray-900 leading-tight">{routine.title}</p>
                <button
                  onClick={() => incrementRoutine(routine.id)}
                  className="flex-shrink-0 w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-3 h-3 text-blue-600" strokeWidth={2.5} />
                </button>
              </div>
              
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <div className="w-full bg-gray-200/50 rounded-full h-1.5">
                    <div
                      className={`${routine.color} rounded-full h-1.5 transition-all duration-300`}
                      style={{ width: `${(routine.current / routine.target) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-[11px] font-bold text-gray-600">
                  {routine.current}/{routine.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB - Floating Action Button */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-gray-900">할일 추가</h2>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <input
              type="text"
              value={quickAddText}
              onChange={(e) => setQuickAddText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
              placeholder="할일을 입력하세요..."
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-[15px] mb-4"
            />
            <button
              onClick={handleQuickAdd}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
            >
              추가하기
            </button>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-gray-900">메뉴</h2>
              <button
                onClick={() => setShowMenu(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setShowMenu(false);
                  onNavigate('goals-routines');
                }}
                className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-gray-50 transition-all text-left"
              >
                <Target className="w-5 h-5 text-gray-600" />
                <p className="text-[15px] font-medium text-gray-900">목표 설정</p>
              </button>
              <button 
                onClick={() => {
                  setShowMenu(false);
                  onNavigate('goals-routines');
                }}
                className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-gray-50 transition-all text-left"
              >
                <Flame className="w-5 h-5 text-gray-600" />
                <p className="text-[15px] font-medium text-gray-900">루틴 관리</p>
              </button>
              <button 
                onClick={() => {
                  setShowMenu(false);
                  onNavigate('calendar');
                }}
                className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-gray-50 transition-all text-left"
              >
                <CalendarIcon className="w-5 h-5 text-gray-600" />
                <p className="text-[15px] font-medium text-gray-900">캘린더</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}