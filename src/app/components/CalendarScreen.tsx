import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Circle, CheckCircle2, Calendar as CalendarIcon, MoreHorizontal, X } from "lucide-react";

type ScreenId = 'home' | 'todos' | 'goals-routines' | 'calendar';

interface CalendarEvent {
  id: string;
  title: string;
  type: "todo" | "routine" | "goal" | "event";
  color: string;
  completed?: boolean;
}

interface CalendarScreenProps {
  onNavigate: (screen: ScreenId, options?: { date?: Date; openAddModal?: boolean }) => void;
  selectedDate?: Date;
}

export function CalendarScreen({ onNavigate, selectedDate: propSelectedDate }: CalendarScreenProps) {
  const [currentDate, setCurrentDate] = useState(propSelectedDate || new Date(2026, 2, 9));
  const [selectedDate, setSelectedDate] = useState<number | null>(propSelectedDate?.getDate() || null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState<CalendarEvent["type"]>("todo");

  useEffect(() => {
    if (propSelectedDate) {
      setCurrentDate(propSelectedDate);
      setSelectedDate(propSelectedDate.getDate());
    }
  }, [propSelectedDate]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  // 오늘 날짜
  const today = new Date(2026, 2, 9);
  const todayDate = today.getDate();

  // 각 날짜별 이벤트 (예시 데이터)
  const [eventsData, setEventsData] = useState<{ [key: number]: CalendarEvent[] }>({
    1: [
      { id: "1", title: "운라인 수업", type: "event", color: "bg-red-400" },
      { id: "2", title: "수영 수업", type: "routine", color: "bg-yellow-400" },
    ],
    2: [
      { id: "3", title: "할일 마감", type: "todo", color: "bg-blue-400" },
      { id: "4", title: "명상", type: "routine", color: "bg-green-400" },
    ],
    3: [
      { id: "5", title: "회의 개최", type: "event", color: "bg-purple-400" },
    ],
    4: [
      { id: "6", title: "쇼핑하기", type: "todo", color: "bg-pink-400" },
      { id: "7", title: "피트니스", type: "routine", color: "bg-orange-400" },
    ],
    5: [
      { id: "8", title: "영화 시청", type: "event", color: "bg-teal-400" },
      { id: "9", title: "독서", type: "routine", color: "bg-indigo-400" },
    ],
    6: [
      { id: "10", title: "온라인 과제", type: "todo", color: "bg-blue-400" },
    ],
    7: [
      { id: "11", title: "명상", type: "routine", color: "bg-green-400" },
      { id: "12", title: "경기", type: "event", color: "bg-red-400" },
    ],
    8: [
      { id: "13", title: "스터디 모임", type: "event", color: "bg-purple-400" },
      { id: "14", title: "수영", type: "routine", color: "bg-blue-400" },
    ],
    9: [
      { id: "15", title: "프로젝트 기획서", type: "todo", color: "bg-blue-500" },
      { id: "16", title: "디자인 리뷰", type: "todo", color: "bg-purple-500" },
      { id: "17", title: "운동하기", type: "routine", color: "bg-orange-500" },
      { id: "18", title: "독서", type: "routine", color: "bg-green-500" },
    ],
    10: [
      { id: "19", title: "바이올린 연습", type: "routine", color: "bg-pink-400" },
      { id: "20", title: "마라톤 대회", type: "event", color: "bg-red-400" },
    ],
    11: [
      { id: "21", title: "수업", type: "event", color: "bg-yellow-400" },
    ],
    15: [
      { id: "22", title: "목표 점검", type: "goal", color: "bg-green-500" },
      { id: "23", title: "월간 보고서", type: "todo", color: "bg-blue-500" },
    ],
    17: [
      { id: "24", title: "클로경", type: "event", color: "bg-purple-400" },
    ],
    24: [
      { id: "25", title: "골프 레슨", type: "routine", color: "bg-green-400" },
    ],
    31: [
      { id: "26", title: "학기 내일", type: "event", color: "bg-red-400" },
    ],
  });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const getEventChips = (day: number) => {
    const events = eventsData[day] || [];
    return events;
  };

  // 선택된 날짜의 이벤트
  const selectedDayEvents = selectedDate ? eventsData[selectedDate] || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[24px] font-bold text-gray-900">직관적인 일정관리</h1>
          <button onClick={() => onNavigate('home')} className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/50">
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <p className="text-[14px] text-gray-600">모든 일정을 한눈에 확히 알다</p>
      </div>

      {/* Calendar Container */}
      <div className="px-5">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 p-4 mb-4 shadow-sm">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
              <CalendarIcon className="w-4 h-4 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={previousMonth}
                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <h2 className="text-[16px] font-bold text-gray-900 min-w-[60px] text-center">
                {monthNames[currentDate.getMonth()]}
              </h2>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <button className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, index) => (
              <div key={index} className="text-center">
                <span className={`text-[11px] font-semibold ${
                  index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-500"
                }`}>
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isToday = day === todayDate && currentDate.getMonth() === today.getMonth();
              const isSelected = day === selectedDate;
              const events = getEventChips(day);
              const hasMoreEvents = events.length > 2;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  className={`aspect-square rounded-lg p-1 flex flex-col items-start justify-start relative transition-all ${
                    isSelected
                      ? "bg-blue-100 ring-2 ring-blue-500"
                      : isToday
                      ? "bg-blue-200/50"
                      : "hover:bg-white/50"
                  }`}
                >
                  {/* 날짜 숫자 */}
                  <span className={`text-[13px] font-semibold mb-0.5 ${
                    isToday ? "text-blue-700" : "text-gray-800"
                  }`}>
                    {day}
                  </span>

                  {/* 이벤트 칩 (최대 2개) */}
                  <div className="w-full space-y-0.5">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`${event.color} rounded px-1 py-0.5 text-white text-[7px] font-medium truncate leading-tight`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {hasMoreEvents && (
                      <div className="text-[7px] text-gray-500 font-medium px-1">
                        +{events.length - 2}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 하단 이벤트 목록 (날짜 선택 시) */}
        {selectedDate && selectedDayEvents.length > 0 && (
          <div className="mb-4">
            <h3 className="text-[16px] font-bold text-gray-900 mb-3 px-1">
              {currentDate.getMonth() + 1}월 {selectedDate}일
            </h3>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => onNavigate('todos', { date: new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate) })}
                className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-[12px] font-semibold"
              >
                이 날짜 할일 보기
              </button>
              <button
                onClick={() => onNavigate('goals-routines')}
                className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 text-[12px] font-semibold"
              >
                이 날짜 루틴 보기
              </button>
            </div>
            <div className="space-y-2">
              {selectedDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/60 flex items-center gap-3"
                >
                  <div className={`w-1 h-10 rounded-full ${event.color}`} />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-gray-900">{event.title}</p>
                    <p className="text-[12px] text-gray-500 capitalize">{event.type}</p>
                  </div>
                  {event.completed !== undefined && (
                    event.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 오늘 리스트 섹션 제목만 (내용은 제거) */}
        <div className="mt-6">
          <p className="text-[13px] text-gray-500 px-1">오늘</p>
        </div>
      </div>

      {/* Floating Add Button */}
      <button onClick={() => setShowAddModal(true)} className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 sm:right-6 w-14 h-14 rounded-full bg-blue-600 shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-105">
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </button>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center p-3">
          <div className="bg-white rounded-2xl sm:rounded-t-3xl w-full max-w-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-gray-900">일정 추가</h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[14px]"
              />
              <div className="grid grid-cols-2 gap-2">
                {(["todo", "routine", "goal", "event"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewEventType(type)}
                    className={`px-3 py-2 rounded-lg text-[12px] font-semibold ${newEventType === type ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (!newEventTitle.trim()) return;
                  const day = selectedDate || todayDate;
                  const colorMap = { todo: "bg-blue-500", routine: "bg-orange-500", goal: "bg-green-500", event: "bg-purple-500" };
                  const event: CalendarEvent = { id: Date.now().toString(), title: newEventTitle, type: newEventType, color: colorMap[newEventType] };
                  setEventsData((prev) => ({ ...prev, [day]: [...(prev[day] || []), event] }));
                  setSelectedDate(day);
                  setNewEventTitle("");
                  setShowAddModal(false);
                }}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
