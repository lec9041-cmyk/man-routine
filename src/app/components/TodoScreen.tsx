import { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  Circle,
  CheckCircle2,
  Clock,
  Flag,
  MoreVertical,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Trash2,
  Edit2,
} from "lucide-react";

type ScreenId = 'home' | 'todos' | 'goals-routines' | 'calendar' | 'ai';

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Todo {
  id: string;
  title: string;
  category: string;
  time?: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  subTasks?: SubTask[];
  expanded?: boolean;
}

interface TodoScreenProps {
  onNavigate: (screen: ScreenId, options?: { openAddModal?: boolean }) => void;
  shouldOpenAddModal?: boolean;
}

export function TodoScreen({ onNavigate, shouldOpenAddModal }: TodoScreenProps) {
  const [filter, setFilter] = useState<"all" | "today" | "upcoming">("today");
  const [newSubTaskId, setNewSubTaskId] = useState<string | null>(null);
  const [newSubTaskText, setNewSubTaskText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [categories, setCategories] = useState(["업무", "개인", "학습", "건강", "취미"]);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState({
    title: "",
    category: "업무",
    time: "",
    priority: "medium" as const,
    dueDate: "오늘",
  });
  
  // shouldOpenAddModal이 true면 모달 열기
  useEffect(() => {
    if (shouldOpenAddModal) {
      setShowAddModal(true);
    }
  }, [shouldOpenAddModal]);

  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "프로젝트 기획서 작성",
      category: "업무",
      time: "10:00",
      completed: false,
      priority: "high",
      dueDate: "오늘",
      subTasks: [
        { id: "1-1", title: "시장 조사 및 분석", completed: true },
        { id: "1-2", title: "기능 요구사항 정리", completed: false },
        { id: "1-3", title: "일정 계획 수립", completed: false },
      ],
      expanded: false,
    },
    {
      id: "2",
      title: "디자인 리뷰 미팅",
      category: "업무",
      time: "14:00",
      completed: false,
      priority: "high",
      dueDate: "오늘",
      subTasks: [
        { id: "2-1", title: "피드백 자료 준비", completed: false },
        { id: "2-2", title: "프로토타입 최종 점검", completed: false },
      ],
      expanded: false,
    },
    {
      id: "3",
      title: "운동하기",
      category: "개인",
      time: "18:00",
      completed: true,
      priority: "medium",
      dueDate: "오늘",
      subTasks: [],
      expanded: false,
    },
    {
      id: "4",
      title: "영어 공부 30분",
      category: "학습",
      completed: false,
      priority: "medium",
      dueDate: "오늘",
      subTasks: [],
      expanded: false,
    },
    {
      id: "5",
      title: "장보기",
      category: "개인",
      completed: false,
      priority: "low",
      dueDate: "내일",
      subTasks: [
        { id: "5-1", title: "채소류", completed: false },
        { id: "5-2", title: "과일", completed: false },
        { id: "5-3", title: "생필품", completed: false },
      ],
      expanded: false,
    },
    {
      id: "6",
      title: "월간 보고서 작성",
      category: "업무",
      completed: false,
      priority: "medium",
      dueDate: "이번 주",
      subTasks: [],
      expanded: false,
    },
  ]);

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const toggleExpand = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, expanded: !todo.expanded } : todo
      )
    );
  };

  const toggleSubTask = (todoId: string, subTaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTasks: todo.subTasks?.map((st) =>
                st.id === subTaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : todo
      )
    );
  };

  const addSubTask = (todoId: string) => {
    if (!newSubTaskText.trim()) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTasks: [
                ...(todo.subTasks || []),
                {
                  id: `${todoId}-${Date.now()}`,
                  title: newSubTaskText,
                  completed: false,
                },
              ],
            }
          : todo
      )
    );

    setNewSubTaskText("");
    setNewSubTaskId(null);
  };

  const deleteSubTask = (todoId: string, subTaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTasks: todo.subTasks?.filter((st) => st.id !== subTaskId),
            }
          : todo
      )
    );
  };

  const deleteTodo = (todoId: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    setShowDeleteMenu(null);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowEditModal(true);
    setShowDeleteMenu(null);
  };

  const handleUpdateTodo = () => {
    if (!editingTodo || !editingTodo.title.trim()) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === editingTodo.id
          ? {
              ...editingTodo,
              title: editingTodo.title,
              category: editingTodo.category,
              time: editingTodo.time || undefined,
              priority: editingTodo.priority,
              dueDate: editingTodo.dueDate,
            }
          : todo
      )
    );

    setShowEditModal(false);
    setEditingTodo(null);
  };

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.title,
      category: newTodo.category,
      time: newTodo.time || undefined,
      completed: false,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate,
      subTasks: [],
      expanded: false,
    };

    setTodos([...todos, todo]);
    setShowAddModal(false);
    setNewTodo({
      title: "",
      category: "업무",
      time: "",
      priority: "medium",
      dueDate: "오늘",
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "today") return todo.dueDate === "오늘";
    if (filter === "upcoming") return todo.dueDate !== "오늘";
    return true;
  });

  const completedCount = filteredTodos.filter((t) => t.completed).length;
  const totalCount = filteredTodos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-orange-500",
    low: "bg-gray-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="px-4 pt-10 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => onNavigate('home')}
            className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm"
          >
            <ChevronLeft className="w-4.5 h-4.5 text-gray-700" />
          </button>
          <h1 className="text-[18px] font-bold text-gray-900">할일</h1>
          <button className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm">
            <Search className="w-4.5 h-4.5 text-gray-700" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilter("today")}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              filter === "today"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white/60 text-gray-600 hover:bg-white/80"
            }`}
          >
            오늘
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              filter === "upcoming"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white/60 text-gray-600 hover:bg-white/80"
            }`}
          >
            예정
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
              filter === "all"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white/60 text-gray-600 hover:bg-white/80"
            }`}
          >
            전체
          </button>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="mt-2.5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] text-gray-500 font-medium">
                {completedCount}개 완료 / {totalCount}개
              </p>
              <p className="text-[12px] font-bold text-blue-600">
                {Math.round(progress)}%
              </p>
            </div>
            <div className="w-full bg-white/60 rounded-full h-1.5">
              <div
                className="bg-blue-500 rounded-full h-1.5 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Todo List */}
      <div className="px-4">
        <div className="space-y-1.5">
          {filteredTodos.map((todo) => {
            const hasSubTasks = todo.subTasks && todo.subTasks.length > 0;
            const completedSubTasks = todo.subTasks?.filter(st => st.completed).length || 0;
            const totalSubTasks = todo.subTasks?.length || 0;

            return (
              <div key={todo.id}>
                {/* Main Todo */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/80 hover:bg-white/90 transition-all shadow-sm">
                  <div className="p-2.5">
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-blue-500" />
                        ) : (
                          <Circle className="w-4.5 h-4.5 text-gray-300 hover:text-blue-500 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3
                            className={`text-[13.5px] font-medium flex-1 leading-snug ${
                              todo.completed
                                ? "text-gray-400 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {todo.title}
                          </h3>
                          {!todo.completed && (
                            <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[todo.priority]} mt-1.5 flex-shrink-0`} />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md font-medium">
                            {todo.category}
                          </span>
                          {todo.time && (
                            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {todo.time}
                            </span>
                          )}
                          {hasSubTasks && (
                            <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md font-semibold">
                              {completedSubTasks}/{totalSubTasks}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 flex-shrink-0">
                        {hasSubTasks && (
                          <button
                            onClick={() => toggleExpand(todo.id)}
                            className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            {todo.expanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => setShowDeleteMenu(showDeleteMenu === todo.id ? null : todo.id)}
                          className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors relative"
                        >
                          <MoreVertical className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Delete Menu */}
                    {showDeleteMenu === todo.id && (
                      <div className="absolute right-2 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[100px]">
                        <button
                          onClick={() => handleEditTodo(todo)}
                          className="w-full px-3 py-1.5 text-left text-[12px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit2 className="w-3 h-3" />
                          수정
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="w-full px-3 py-1.5 text-left text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* SubTasks */}
                {todo.expanded && hasSubTasks && (
                  <div className="ml-8 mt-2 space-y-1">
                    {todo.subTasks?.map((subTask) => (
                      <div
                        key={subTask.id}
                        className="flex items-center gap-2.5 group"
                      >
                        <button
                          onClick={() => toggleSubTask(todo.id, subTask.id)}
                          className="flex items-center gap-2.5 flex-1"
                        >
                          {subTask.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                          )}
                          <p
                            className={`text-[13px] text-left ${
                              subTask.completed
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            }`}
                          >
                            {subTask.title}
                          </p>
                        </button>
                        <button
                          onClick={() => deleteSubTask(todo.id, subTask.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-5 h-5 flex items-center justify-center hover:text-red-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Add SubTask Input */}
                    {newSubTaskId === todo.id ? (
                      <div className="flex items-center gap-2.5 mt-2">
                        <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <input
                          type="text"
                          value={newSubTaskText}
                          onChange={(e) => setNewSubTaskText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addSubTask(todo.id);
                            }
                          }}
                          onBlur={() => {
                            if (newSubTaskText.trim()) {
                              addSubTask(todo.id);
                            } else {
                              setNewSubTaskId(null);
                            }
                          }}
                          placeholder="하위 항목 입력..."
                          className="flex-1 text-[13px] text-gray-700 outline-none bg-transparent border-b border-gray-200 pb-1"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setNewSubTaskId(todo.id)}
                        className="flex items-center gap-2.5 text-gray-400 hover:text-blue-500 transition-colors mt-2"
                      >
                        <Plus className="w-4 h-4 flex-shrink-0" />
                        <p className="text-[13px]">하위 항목 추가</p>
                      </button>
                    )}
                  </div>
                )}

                {/* Show SubTask Button or Add First SubTask when collapsed */}
                {!todo.expanded && (
                  <button
                    onClick={() => toggleExpand(todo.id)}
                    className="w-full px-4 pb-3 pt-2 flex items-center justify-center gap-1 text-gray-400 hover:text-blue-600 transition-colors border-t border-gray-100"
                  >
                    {hasSubTasks ? (
                      <>
                        <span className="text-xs">하위 항목 {totalSubTasks}개</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-xs">하위 항목 추가</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-blue-600 shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-105"
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </button>

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-md shadow-2xl animate-slide-up">
            <div className="px-5 pt-4 pb-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">새 할일 추가</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-600 rotate-45" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pb-4">
                {/* Title Input */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">할일</label>
                  <input
                    type="text"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    placeholder="예: 프로젝트 기획서 작성"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    autoFocus
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">카테고리</label>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setNewTodo({ ...newTodo, category })}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                          newTodo.category === category
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                    {showCategoryInput ? (
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            setCategories([...categories, newCategoryName]);
                            setNewTodo({ ...newTodo, category: newCategoryName });
                            setNewCategoryName("");
                            setShowCategoryInput(false);
                          }
                        }}
                        onBlur={() => {
                          if (newCategoryName.trim()) {
                            setCategories([...categories, newCategoryName]);
                            setNewTodo({ ...newTodo, category: newCategoryName });
                            setNewCategoryName("");
                            setShowCategoryInput(false);
                          } else {
                            setShowCategoryInput(false);
                          }
                        }}
                        placeholder="새 카테고리 입력..."
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                      />
                    ) : (
                      <button
                        onClick={() => setShowCategoryInput(true)}
                        className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all bg-gray-100 text-gray-600 hover:bg-gray-150"
                      >
                        + 새 카테고리
                      </button>
                    )}
                  </div>
                </div>

                {/* Time Input */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">시간 (선택)</label>
                  <input
                    type="time"
                    value={newTodo.time}
                    onChange={(e) => setNewTodo({ ...newTodo, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  />
                </div>

                {/* Due Date Selection */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">마감일</label>
                  <div className="flex gap-2">
                    {["오늘", "내일", "이번 주"].map((date) => (
                      <button
                        key={date}
                        onClick={() => setNewTodo({ ...newTodo, dueDate: date })}
                        className={`flex-1 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                          newTodo.dueDate === date
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">우선순위</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setNewTodo({ ...newTodo, priority: "high" })}
                      className={`px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        newTodo.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                      }`}
                    >
                      🔴 높음
                    </button>
                    <button
                      onClick={() => setNewTodo({ ...newTodo, priority: "medium" })}
                      className={`px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        newTodo.priority === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                      }`}
                    >
                      🟠 보통
                    </button>
                    <button
                      onClick={() => setNewTodo({ ...newTodo, priority: "low" })}
                      className={`px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        newTodo.priority === "low"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                      }`}
                    >
                      ⚪ 낮음
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-[14px] hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddTodo}
                  disabled={!newTodo.title.trim()}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium text-[14px] hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  추가하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Todo Modal */}
      {showEditModal && editingTodo && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-md shadow-2xl animate-slide-up">
            <div className="px-5 pt-4 pb-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">할일 수정</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-600 rotate-45" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pb-4">
                {/* Title Input */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">할일</label>
                  <input
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                    placeholder="예: 프로젝트 기획서 작성"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    autoFocus
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">카테고리</label>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setEditingTodo({ ...editingTodo, category })}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                          editingTodo.category === category
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                    {showCategoryInput ? (
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            setCategories([...categories, newCategoryName]);
                            setEditingTodo({ ...editingTodo, category: newCategoryName });
                            setNewCategoryName("");
                            setShowCategoryInput(false);
                          }
                        }}
                        onBlur={() => {
                          if (newCategoryName.trim()) {
                            setCategories([...categories, newCategoryName]);
                            setEditingTodo({ ...editingTodo, category: newCategoryName });
                            setNewCategoryName("");
                            setShowCategoryInput(false);
                          } else {
                            setShowCategoryInput(false);
                          }
                        }}
                        placeholder="새 카테고리 입력..."
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                      />
                    ) : (
                      <button
                        onClick={() => setShowCategoryInput(true)}
                        className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all bg-gray-100 text-gray-600 hover:bg-gray-150"
                      >
                        + 새 카테고리
                      </button>
                    )}
                  </div>
                </div>

                {/* Time Input */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">시간 (선택)</label>
                  <input
                    type="time"
                    value={editingTodo.time}
                    onChange={(e) => setEditingTodo({ ...editingTodo, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  />
                </div>

                {/* Due Date Selection */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">마감일</label>
                  <div className="flex gap-2">
                    {["오늘", "내일", "이번 주"].map((date) => (
                      <button
                        key={date}
                        onClick={() => setEditingTodo({ ...editingTodo, dueDate: date })}
                        className={`flex-1 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                          editingTodo.dueDate === date
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="text-[13px] font-medium text-gray-700 mb-2 block">우선순위</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setEditingTodo({ ...editingTodo, priority: "high" })}
                      className={`px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        editingTodo.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                      }`}
                    >
                      🔴 높음
                    </button>
                    <button
                      onClick={() => setEditingTodo({ ...editingTodo, priority: "medium" })}
                      className={`px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        editingTodo.priority === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                      }`}
                    >
                      🟠 보통
                    </button>
                    <button
                      onClick={() => setEditingTodo({ ...editingTodo, priority: "low" })}
                      className={`px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                        editingTodo.priority === "low"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                      }`}
                    >
                      ⚪ 낮음
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-[14px] hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdateTodo}
                  disabled={!editingTodo.title.trim()}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium text-[14px] hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}