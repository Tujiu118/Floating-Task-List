/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Settings2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ... (接口定义和翻译文本保持不变，此处省略以保持清爽)

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TimeBlock {
  id: string;
  startTime: string;
  endTime: string;
  todos: Todo[];
}

const translations = {
  en: {
    title: "Tujiu is watching you",
    transparency: 'Widget Transparency',
    fontColor: 'Font Color',
    clear: 'Clear',
    solid: 'Solid',
    addTask: 'Add Task',
    addBlock: 'Add Time Block',
    completed: 'Completed',
    placeholder: 'What needs to be done?',
    language: 'Language',
    zh: 'Chinese',
    en: 'English'
  },
  zh: {
    title: "Tujiu is watching you",
    transparency: '小组件透明度',
    fontColor: '字体颜色',
    clear: '透明',
    solid: '不透明',
    addTask: '添加任务',
    addBlock: '添加时间段',
    completed: '已完成',
    placeholder: '需要做什么？',
    language: '语言',
    zh: '中文',
    en: '英文'
  }
};

// 【新增】定义我们的调色盘
const colorPalette = [
  { name: '深空黑', hex: '#111827' },
  { name: '皓月白', hex: '#FFFFFF' },
  { name: '银河灰', hex: '#6b7280' },
  { name: '深海蓝', hex: '#1e40af' },
  { name: '松针绿', hex: '#14532d' },
];

export default function App() {
  const [language, setLanguage] = useState<'en' | 'zh'>(() => {
    const saved = localStorage.getItem('widget-lang');
    return (saved as 'en' | 'zh') || 'zh';
  });

  const t = translations[language];

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => {
    const saved = localStorage.getItem('time-blocks');
    return saved ? JSON.parse(saved) :[
      {
        id: '1',
        startTime: '09:00',
        endTime: '10:00',
        todos:[
          { id: 't1', text: 'Morning Review', completed: false },
          { id: 't2', text: 'Email Check', completed: true }
        ]
      }
    ];
  });

  const[opacity, setOpacity] = useState(() => {
    const saved = localStorage.getItem('widget-opacity');
    return saved ? parseFloat(saved) : 0.9;
  });

  // 【新增】为字体颜色创建状态，并从本地存储读取
  const [textColor, setTextColor] = useState(() => {
    const saved = localStorage.getItem('widget-textColor');
    return saved || colorPalette[0].hex; // 默认使用黑色
  });

  const[showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('time-blocks', JSON.stringify(timeBlocks));
  }, [timeBlocks]);

  useEffect(() => {
    localStorage.setItem('widget-opacity', opacity.toString());
  }, [opacity]);

  useEffect(() => {
    localStorage.setItem('widget-lang', language);
  }, [language]);
  
  // 【新增】当字体颜色变化时，保存到本地存储
  useEffect(() => {
    localStorage.setItem('widget-textColor', textColor);
  }, [textColor]);

  // ... (所有 add/remove/update 函数保持不变，此处省略)
  const addTimeBlock=()=>{const newBlock:TimeBlock={id:crypto.randomUUID(),startTime:'10:00',endTime:'11:00',todos:[]};setTimeBlocks([...timeBlocks,newBlock]);};const removeTimeBlock=(id:string)=>{setTimeBlocks(timeBlocks.filter(block=>block.id!==id));};const updateTime=(id:string,field:'startTime'|'endTime',value:string)=>{setTimeBlocks(timeBlocks.map(block=>block.id===id?{...block,[field]:value}:block));};const addTodo=(blockId:string)=>{setTimeBlocks(timeBlocks.map(block=>{if(block.id===blockId){return{...block,todos:[...block.todos,{id:crypto.randomUUID(),text:'',completed:false}]};}return block;}));};const updateTodoText=(blockId:string,todoId:string,text:string)=>{setTimeBlocks(timeBlocks.map(block=>{if(block.id===blockId){return{...block,todos:block.todos.map(todo=>todo.id===todoId?{...todo,text}:todo)};}return block;}));};const toggleTodo=(blockId:string,todoId:string)=>{setTimeBlocks(timeBlocks.map(block=>{if(block.id===blockId){return{...block,todos:block.todos.map(todo=>todo.id===todoId?{...todo,completed:!todo.completed}:todo)};}return block;}));};const removeTodo=(blockId:string,todoId:string)=>{setTimeBlocks(timeBlocks.map(block=>{if(block.id===blockId){return{...block,todos:block.todos.filter(todo=>todo.id!==todoId)};}return block;}));};

  return (
    <div 
      className="drag-region h-screen w-screen overflow-hidden bg-transparent flex items-start justify-center p-8 font-sans selection:bg-black selection:text-white"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl overflow-hidden border transition-all duration-300"
        /* 【关键修改】在这里全局应用字体颜色 */
        style={{ 
          color: textColor,
          backgroundColor: `rgba(255, 255, 255, ${opacity})`,
          borderColor: `rgba(0, 0, 0, ${opacity * 0.08})`,
          boxShadow: opacity > 0.2 ? `0 20px 40px -10px rgba(0, 0, 0, ${opacity * 0.15})` : 'none'
        }}
        id="widget-container"
      >
        {/* Header */}
        <div 
          className="p-6 border-b flex items-center justify-between transition-colors duration-300"
          style={{ 
            backgroundColor: `rgba(255, 255, 255, ${opacity * 0.3})`,
            borderColor: `rgba(0, 0, 0, ${opacity * 0.05})`
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-xs font-mono uppercase tracking-widest text-current/40">{t.title}</h1>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="no-drag p-2 hover:bg-black/5 rounded-full transition-colors text-current/60"
            >
              <Settings2 size={18} />
            </button>
            <button 
              onClick={() => window.close()}
              className="no-drag p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-current/30"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="no-drag overflow-hidden bg-stone-50 border-b border-black/5"
            >
              <div className="p-6 space-y-6">
                {/* 透明度设置 */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-black/40">{t.transparency}</label>
                  <input 
                    type="range" min="0" max="1" step="0.01" value={opacity}
                    onInput={(e) => setOpacity(parseFloat((e.target as HTMLInputElement).value))}
                    className="no-drag w-full accent-black h-1 bg-black/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-black/30">
                    <span>{t.clear}</span>
                    <span>{t.solid}</span>
                  </div>
                </div>

                {/* 【新增】字体颜色设置 */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-black/40">{t.fontColor}</label>
                  <div className="flex gap-3">
                    {colorPalette.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setTextColor(color.hex)}
                        className={`no-drag w-6 h-6 rounded-full border border-black/10 transition-all ${
                          textColor === color.hex ? 'ring-2 ring-offset-2 ring-black' : ''
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* 语言设置 */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-black/40">{t.language}</label>
                  <div className="flex gap-2">
                    {(['zh', 'en'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`no-drag flex-1 py-2 text-[10px] font-mono uppercase tracking-wider rounded-lg border transition-all ${
                          language === lang 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-black/40 border-black/5 hover:border-black/20'
                        }`}
                      >
                        {t[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="no-drag p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {timeBlocks.map((block) => (
              <motion.div 
                key={block.id} layout initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="flex items-center gap-3 px-3 py-1.5 rounded-full border transition-colors duration-300"
                    style={{ 
                      backgroundColor: `rgba(0, 0, 0, 0.03)`,
                      borderColor: `rgba(0, 0, 0, ${opacity * 0.05})`
                    }}
                  >
                    <Clock size={14} className="text-current/40" />
                    <div className="flex items-center gap-1">
                      <input 
                        type="time" value={block.startTime}
                        onChange={(e) => updateTime(block.id, 'startTime', e.target.value)}
                        className="bg-transparent text-xs font-mono focus:outline-none cursor-pointer"
                        style={{ color: 'inherit' }} // 继承父级颜色
                      />
                      <span className="text-current/20 text-xs">—</span>
                      <input 
                        type="time" value={block.endTime}
                        onChange={(e) => updateTime(block.id, 'endTime', e.target.value)}
                        className="bg-transparent text-xs font-mono focus:outline-none cursor-pointer"
                        style={{ color: 'inherit' }} // 继承父级颜色
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => removeTimeBlock(block.id)}
                    className="p-1.5 text-current/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-2 pl-4 border-l border-current/5 ml-6">
                  {block.todos.map((todo) => (
                    <motion.div key={todo.id} layout className="flex items-center gap-3 group/todo">
                      <input 
                        type="text" placeholder={t.placeholder} value={todo.text}
                        onChange={(e) => updateTodoText(block.id, todo.id, e.target.value)}
                        className={`flex-1 bg-transparent text-sm focus:outline-none transition-all ${todo.completed ? 'line-through text-current/30' : 'text-current/80'}`}
                      />
                      <button 
                        onClick={() => toggleTodo(block.id, todo.id)}
                        className={`transition-colors flex-shrink-0 ${todo.completed ? 'text-emerald-500' : 'text-current/20 hover:text-current/40'}`}
                      >
                        {todo.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>
                      <button 
                        onClick={() => removeTodo(block.id, todo.id)}
                        className="p-1 text-current/0 group-hover/todo:text-current/20 hover:!text-red-500 transition-all flex-shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                  <button onClick={() => addTodo(block.id)} className="flex items-center gap-2 text-xs text-current/40 hover:text-current/80 transition-colors mt-2 py-1">
                    <Plus size={14} />
                    <span>{t.addTask}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button 
            onClick={addTimeBlock}
            className="w-full py-4 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 transition-all group"
            style={{ 
              borderColor: `rgba(0, 0, 0, ${Math.max(0.05, opacity * 0.1)})`,
              backgroundColor: `rgba(0, 0, 0, ${opacity * 0.02})`,
            }}
          >
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{t.addBlock}</span>
          </button>
        </div>

        {/* Footer Info */}
        <div 
          className="p-6 py-4 border-t flex justify-between items-center transition-colors duration-300"
          style={{ 
            backgroundColor: `rgba(250, 250, 249, ${opacity * 0.5})`,
            borderColor: `rgba(0, 0, 0, ${opacity * 0.05})`
          }}
        >
          <span className="text-[10px] font-mono text-current/30 uppercase tracking-tighter">
            {timeBlocks.reduce((acc, b) => acc + b.todos.filter(t => t.completed).length, 0)} / {timeBlocks.reduce((acc, b) => acc + b.todos.length, 0)} {t.completed}
          </span>
          <span className="text-[10px] font-mono text-current/30 uppercase tracking-tighter">
            {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </motion.div>

      <style>{`
        body, html { overflow: hidden !important; background: transparent !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; margin: 10px 0; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0, 0, 0, 0.3); }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.15) transparent; }
        input[type="time"]::-webkit-calendar-picker-indicator { display: none; }
      `}</style>
    </div>
  );
}