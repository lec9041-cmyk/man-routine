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
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
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
        { id: "1-2", title: "경쟁사 분석", completed: true },
        { id: "1-3", title: "기획서 초안 작성", completed: false },
      ],
    },
    {
      id: "2",
      title: "팀 회의 준비",
      category: "업무",
      time: "14:00",
      completed: true,
      priority: "high",
      dueDate: "오늘",
    },
    {
      id: "3",
      title: "운동하기",
      category: "건강",
      time: "18:00",
      completed: false,
      priority: "medium",
      dueDate: "오늘",
    },
    {
      id: "4",
      title: "영어 공부",
      category: "학습",
      completed: false,
      priority: "medium",
      dueDate: "내일",
    },
    {
      id: "5",
      title: "독서",
      category: "취미",
      completed: false,
      priority: "low",
      dueDate: "이번주",
    },
  ]);

  const priorityColors = {
    high: "bg-red-400",
    medium: "bg-yellow-400",
    low: "bg-blue-400",
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleSubTask = (todoId: string, subTaskId: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId && todo.subTasks) {
          return {
            ...todo,
            subTasks: todo.subTasks.map((st) =>
              st.id === subTaskId ? { ...st, completed: !st.completed } : st
            ),
          };
        }
        return todo;
      })
    );
  };

  const toggleExpand = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));
  };

  const addTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      title: newTodo.title,
      category: newTodo.category,
      time: newTodo.time || undefined,
      completed: false,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate,
    };

    setTodos([...todos, todo]);
    setNewTodo({
      title: "",
      category: "업무",
      time: "",
      priority: "medium",
      dueDate: "오늘",
    });
    setShowAddModal(false);
  };

  const updateTodo = () => {
    if (!editingTodo) return;

    setTodos(todos.map(t => t.id === editingTodo.id ? editingTodo : t));
    setShowEditModal(false);
    setEditingTodo(null);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
    setShowDeleteMenu(null);
  };

  const deleteAllCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
    setShowDeleteAllConfirm(false);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowEditModal(true);
    setShowDeleteMenu(null);
  };

  const addSubTask = (todoId: string) => {
    if (!newSubTaskText.trim()) return;

    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          const subTasks = todo.subTasks || [];
          return {
            ...todo,
            subTasks: [
              ...subTasks,
              {
                id: `${todoId}-${Date.now()}`,
                title: newSubTaskText,
                completed: false,
              },
            ],
          };
        }
        return todo;
      })
    );
    setNewSubTaskText("");
    setNewSubTaskId(null);
  };

  const addCategory = () => {
    if (!newCategoryName.trim() || categories.includes(newCategoryName)) return;
    
    setCategories([...categories, newCategoryName]);
    setNewCategoryName("");
    setShowCategoryInput(false);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "today") return todo.dueDate === "오늘";
    if (filter === "upcoming") return todo.dueDate !== "오늘";
    return true;
  });

  const totalCount = filteredTodos.length;
  const completedCount = filteredTodos.filter(t => t.completed).length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
          <button 
            onClick={() => setShowDeleteAllConfirm(true)}
            className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
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
                  <div className="ml-8 mt-1 space-y-1">
                    {todo.subTasks!.map((subTask) => (
                      <div
                        key={subTask.id}
                        className="bg-white/50 rounded-lg p-2 flex items-center gap-2"
                      >
                        <button
                          onClick={() => toggleSubTask(todo.id, subTask.id)}
                          className="flex-shrink-0"
                        >
                          {subTask.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-gray-300" />
                          )}
                        </button>
                        <p
                          className={`text-[12px] flex-1 ${
                            subTask.completed
                              ? "text-gray-400 line-through"
                              : "text-gray-700"
                          }`}
                        >
                          {subTask.title}
                        </p>
                      </div>
                    ))}
                    {newSubTaskId === todo.id ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={newSubTaskText}
                          onChange={(e) => setNewSubTaskText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSubTask(todo.id)}
                          placeholder="서브태스크 입력..."
                          autoFocus
                          className="flex-1 px-2 py-1 text-[12px] rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => addSubTask(todo.id)}
                          className="px-2 py-1 bg-blue-500 text-white rounded-lg text-[11px]"
                        >
                          추가
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setNewSubTaskId(todo.id)}
                        className="w-full py-1.5 text-[11px] text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        서브태스크 추가
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Delete All Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-[18px] font-bold text-gray-900 mb-2">완료된 할일 모두 삭제</h2>
            <p className="text-[14px] text-gray-600 mb-6">
              완료된 할일 {todos.filter(t => t.completed).length}개를 모두 삭제하시겠습니까?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteAllConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
              >
                취소
              </button>
              <button
                onClick={deleteAllCompleted}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-bold text-gray-900">새 할일</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  할일
                </label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="할일을 입력하세요"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  카테고리
                </label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewTodo({ ...newTodo, category: cat })}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                        newTodo.category === cat
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  {showCategoryInput ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                        placeholder="카테고리명"
                        autoFocus
                        className="px-2 py-1 text-[12px] rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 w-24"
                      />
                      <button
                        onClick={addCategory}
                        className="px-2 py-1 bg-blue-500 text-white rounded-lg text-[11px]"
                      >
                        추가
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCategoryInput(true)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 text-[12px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      추가
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    시간
                  </label>
                  <input
                    type="time"
                    value={newTodo.time}
                    onChange={(e) => setNewTodo({ ...newTodo, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    우선순위
                  </label>
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-[13px]"
                  >
                    <option value="high">높음</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  마감일
                </label>
                <div className="flex gap-2">
                  {["오늘", "내일", "이번주"].map((date) => (
                    <button
                      key={date}
                      onClick={() => setNewTodo({ ...newTodo, dueDate: date })}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                        newTodo.dueDate === date
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addTodo}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Todo Modal */}
      {showEditModal && editingTodo && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-bold text-gray-900">할일 수정</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTodo(null);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  할일
                </label>
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  카테고리
                </label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEditingTodo({ ...editingTodo, category: cat })}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                        editingTodo.category === cat
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    시간
                  </label>
                  <input
                    type="time"
                    value={editingTodo.time || ''}
                    onChange={(e) => setEditingTodo({ ...editingTodo, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                    우선순위
                  </label>
                  <select
                    value={editingTodo.priority}
                    onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-[13px]"
                  >
                    <option value="high">높음</option>
                    <option value="medium">중간</option>
                    <option value="low">낮음</option>
                  </select>
                </div>
              </div>

              <button
                onClick={updateTodo}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
