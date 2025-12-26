import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Move, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

interface MindMapNode {
  id: string;
  title: string;
  children?: MindMapNode[];
  color?: string;
}

const vectorsMindMap: MindMapNode = {
  id: "vectors",
  title: "المتجهات",
  color: "#1e3a5f",
  children: [
    {
      id: "types",
      title: "أنواع الكميات",
      children: [
        {
          id: "scalar",
          title: "كميات قياسية",
          children: [
            { id: "s1", title: "الكتلة" },
            { id: "s2", title: "الزمن" },
            { id: "s3", title: "المسافة" },
            { id: "s4", title: "الطاقة" },
            { id: "s5", title: "درجة الحرارة" },
          ],
        },
        {
          id: "vector",
          title: "كميات متجهة",
          children: [
            { id: "v1", title: "الإزاحة" },
            { id: "v2", title: "السرعة" },
            { id: "v3", title: "التسارع" },
            { id: "v4", title: "القوة" },
          ],
        },
      ],
    },
    {
      id: "representation",
      title: "تمثيل المتجهات",
      children: [
        { id: "r1", title: "بيانياً (سهم)" },
        { id: "r2", title: "رياضياً (مركبات)" },
        { id: "r3", title: "المقدار والاتجاه" },
      ],
    },
    {
      id: "operations",
      title: "العمليات",
      children: [
        {
          id: "add",
          title: "الجمع",
          children: [
            { id: "a1", title: "طريقة المثلث" },
            { id: "a2", title: "طريقة متوازي الأضلاع" },
            { id: "a3", title: "جمع المركبات" },
          ],
        },
        {
          id: "sub",
          title: "الطرح",
          children: [
            { id: "sub1", title: "جمع مع السالب" },
          ],
        },
      ],
    },
    {
      id: "formulas",
      title: "القوانين",
      children: [
        { id: "f1", title: "|A| = √(Ax² + Ay²)" },
        { id: "f2", title: "θ = tan⁻¹(Ay/Ax)" },
        { id: "f3", title: "Ax = |A| cos(θ)" },
        { id: "f4", title: "Ay = |A| sin(θ)" },
      ],
    },
  ],
};

const motionMindMap: MindMapNode = {
  id: "motion",
  title: "الحركة",
  color: "#f97316",
  children: [
    {
      id: "concepts",
      title: "المفاهيم الأساسية",
      children: [
        { id: "c1", title: "الإزاحة (متجهة)" },
        { id: "c2", title: "المسافة (قياسية)" },
        { id: "c3", title: "السرعة المتوسطة" },
        { id: "c4", title: "السرعة اللحظية" },
        { id: "c5", title: "التسارع" },
      ],
    },
    {
      id: "1d",
      title: "الحركة في بُعد واحد",
      children: [
        {
          id: "1d-eq",
          title: "معادلات الحركة",
          children: [
            { id: "eq1", title: "v = v₀ + at" },
            { id: "eq2", title: "x = v₀t + ½at²" },
            { id: "eq3", title: "v² = v₀² + 2ax" },
            { id: "eq4", title: "x = ½(v + v₀)t" },
          ],
        },
        { id: "1d-g", title: "السقوط الحر (g = 9.8 m/s²)" },
      ],
    },
    {
      id: "2d",
      title: "الحركة في بُعدين",
      children: [
        {
          id: "proj",
          title: "حركة المقذوفات",
          children: [
            { id: "p1", title: "حركة أفقية منتظمة" },
            { id: "p2", title: "حركة رأسية بتسارع" },
          ],
        },
        {
          id: "proj-eq",
          title: "قوانين المقذوفات",
          children: [
            { id: "pe1", title: "x = v₀ cos(θ) × t" },
            { id: "pe2", title: "y = v₀ sin(θ) × t - ½gt²" },
            { id: "pe3", title: "R = v₀² sin(2θ) / g" },
            { id: "pe4", title: "H = v₀² sin²(θ) / 2g" },
          ],
        },
      ],
    },
    {
      id: "graphs",
      title: "الرسوم البيانية",
      children: [
        { id: "g1", title: "الموقع - الزمن" },
        { id: "g2", title: "السرعة - الزمن" },
        { id: "g3", title: "التسارع - الزمن" },
      ],
    },
  ],
};

const forcesMindMap: MindMapNode = {
  id: "forces",
  title: "القوى",
  color: "#10b981",
  children: [
    {
      id: "newton1",
      title: "قانون نيوتن الأول",
      children: [
        { id: "n1-1", title: "القصور الذاتي" },
        { id: "n1-2", title: "الجسم الساكن يبقى ساكناً" },
        { id: "n1-3", title: "المتحرك يستمر بسرعة ثابتة" },
        { id: "n1-4", title: "ما لم تؤثر قوة محصلة" },
      ],
    },
    {
      id: "newton2",
      title: "قانون نيوتن الثاني",
      children: [
        { id: "n2-1", title: "F = m × a" },
        { id: "n2-2", title: "a ∝ F (طردياً)" },
        { id: "n2-3", title: "a ∝ 1/m (عكسياً)" },
        { id: "n2-4", title: "وحدة القوة: نيوتن (N)" },
      ],
    },
    {
      id: "newton3",
      title: "قانون نيوتن الثالث",
      children: [
        { id: "n3-1", title: "F₁₂ = -F₂₁" },
        { id: "n3-2", title: "متساويتان في المقدار" },
        { id: "n3-3", title: "متعاكستان في الاتجاه" },
        { id: "n3-4", title: "تؤثران في جسمين مختلفين" },
      ],
    },
    {
      id: "weight",
      title: "الوزن والكتلة",
      children: [
        { id: "w1", title: "W = m × g" },
        { id: "w2", title: "الكتلة ثابتة" },
        { id: "w3", title: "الوزن يتغير بتغير g" },
      ],
    },
    {
      id: "types",
      title: "أنواع القوى",
      children: [
        { id: "t1", title: "قوة الجاذبية" },
        { id: "t2", title: "القوة العمودية" },
        { id: "t3", title: "قوة الاحتكاك" },
        { id: "t4", title: "قوة الشد" },
      ],
    },
  ],
};

// Mind Map Node Component
function MindMapNodeComponent({ 
  node, 
  level = 0, 
  parentColor 
}: { 
  node: MindMapNode; 
  level?: number; 
  parentColor?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const color = node.color || parentColor || "#1e3a5f";
  const hasChildren = node.children && node.children.length > 0;
  
  const bgColors = [
    "bg-white",
    "bg-gray-50",
    "bg-gray-100",
    "bg-gray-50",
  ];
  
  const paddingLeft = level * 1.5;
  
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.05 }}
        className={`${bgColors[level % bgColors.length]} rounded-xl mb-2 overflow-hidden`}
        style={{ 
          marginRight: `${paddingLeft}rem`,
          borderRight: level > 0 ? `3px solid ${color}` : 'none',
        }}
      >
        <div
          className={`p-3 flex items-center justify-between cursor-pointer hover:bg-opacity-80 transition-colors`}
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
          style={{ 
            backgroundColor: level === 0 ? color : 'transparent',
            color: level === 0 ? 'white' : '#1e3a5f',
          }}
        >
          <span className={`font-medium ${level === 0 ? 'text-lg font-bold' : 'text-sm'}`}>
            {node.title}
          </span>
          {hasChildren && (
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              {isExpanded ? (
                <ChevronUp size={16} style={{ color: level === 0 ? 'white' : color }} />
              ) : (
                <ChevronDown size={16} style={{ color: level === 0 ? 'white' : color }} />
              )}
            </Button>
          )}
        </div>
        
        {isExpanded && hasChildren && (
          <div className="p-2 pt-0">
            {node.children!.map((child) => (
              <MindMapNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
                parentColor={color}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Visual Mind Map Component
function VisualMindMap({ data, color }: { data: MindMapNode; color: string }) {
  return (
    <div className="relative p-8 overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Center node */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-8 py-4 rounded-2xl text-white font-bold text-xl shadow-lg"
            style={{ backgroundColor: color }}
          >
            {data.title}
          </motion.div>
        </div>
        
        {/* First level branches */}
        <div className="flex justify-center gap-4 flex-wrap">
          {data.children?.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              {/* Connection line */}
              <div 
                className="w-0.5 h-8 mb-2"
                style={{ backgroundColor: color }}
              />
              
              {/* Branch node */}
              <div 
                className="px-4 py-2 rounded-xl text-white font-medium text-sm shadow-md mb-4"
                style={{ backgroundColor: color, opacity: 0.85 }}
              >
                {child.title}
              </div>
              
              {/* Sub-branches */}
              <div className="flex flex-col gap-2">
                {child.children?.slice(0, 4).map((subChild, subIndex) => (
                  <motion.div
                    key={subChild.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + subIndex * 0.05 }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border-2"
                    style={{ 
                      borderColor: color,
                      color: color,
                      backgroundColor: `${color}10`
                    }}
                  >
                    {subChild.title}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MindMaps() {
  const [activeMap, setActiveMap] = useState<"vectors" | "motion" | "forces">("vectors");
  
  const maps = {
    vectors: { data: vectorsMindMap, color: "#1e3a5f", icon: ArrowRight, title: "المتجهات" },
    motion: { data: motionMindMap, color: "#f97316", icon: Move, title: "الحركة" },
    forces: { data: forcesMindMap, color: "#10b981", icon: Zap, title: "القوى" },
  };
  
  const currentMap = maps[activeMap];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#10b981] flex items-center justify-center">
                <BookOpen className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-[#1e3a5f]">
                  الخرائط الذهنية
                </h1>
                <p className="text-[#1e3a5f]/60">Mind Maps</p>
              </div>
            </div>
            <p className="text-[#1e3a5f]/70 max-w-2xl">
              خرائط ذهنية تفاعلية تساعدك على ربط المفاهيم وفهم العلاقات بين الموضوعات المختلفة.
            </p>
          </motion.div>
          
          {/* Unit Selector */}
          <div className="flex flex-wrap gap-4 mb-8">
            {Object.entries(maps).map(([key, map]) => {
              const Icon = map.icon;
              const isActive = activeMap === key;
              return (
                <Button
                  key={key}
                  onClick={() => setActiveMap(key as typeof activeMap)}
                  className={`px-6 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "text-white shadow-lg" 
                      : "bg-white text-[#1e3a5f] hover:bg-gray-50"
                  }`}
                  style={{ 
                    backgroundColor: isActive ? map.color : undefined,
                  }}
                >
                  <Icon size={20} className="ml-2" />
                  {map.title}
                </Button>
              );
            })}
          </div>
          
          {/* Mind Map Display */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tree View */}
            <motion.div
              key={activeMap + "-tree"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-display font-bold text-[#1e3a5f] mb-6">
                العرض التفصيلي
              </h2>
              <MindMapNodeComponent node={currentMap.data} />
            </motion.div>
            
            {/* Visual View */}
            <motion.div
              key={activeMap + "-visual"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <h2 className="text-xl font-display font-bold text-[#1e3a5f] p-6 pb-0">
                العرض المرئي
              </h2>
              <VisualMindMap data={currentMap.data} color={currentMap.color} />
            </motion.div>
          </div>
          
          {/* Quick Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-br from-[#1e3a5f] to-[#10b981] rounded-3xl p-8 text-white"
          >
            <h2 className="text-2xl font-display font-bold mb-6">
              نصائح للدراسة
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
                <h3 className="font-bold mb-3">1. افهم المفاهيم</h3>
                <p className="text-white/80 text-sm">
                  ابدأ بفهم المفاهيم الأساسية قبل الانتقال للقوانين والتطبيقات.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
                <h3 className="font-bold mb-3">2. اربط المعلومات</h3>
                <p className="text-white/80 text-sm">
                  استخدم الخرائط الذهنية لربط المفاهيم ببعضها وتسهيل التذكر.
                </p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
                <h3 className="font-bold mb-3">3. تدرب بالمحاكاة</h3>
                <p className="text-white/80 text-sm">
                  استخدم المحاكاة التفاعلية لتطبيق ما تعلمته ورؤية النتائج.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
