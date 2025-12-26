import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, RotateCcw, Info, Plus, Minus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";

interface Vector {
  x: number;
  y: number;
  color: string;
  name: string;
}

// Vector Addition Simulation Component
function VectorAdditionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vectorA, setVectorA] = useState<Vector>({ x: 100, y: 50, color: "#1e3a5f", name: "A" });
  const [vectorB, setVectorB] = useState<Vector>({ x: 50, y: 100, color: "#10b981", name: "B" });
  const [showResultant, setShowResultant] = useState(true);
  
  const resultant = {
    x: vectorA.x + vectorB.x,
    y: vectorA.y + vectorB.y,
    color: "#f97316",
    name: "R"
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += 25) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += 25) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Draw vector function
    const drawVector = (startX: number, startY: number, vec: Vector, label: string) => {
      const endX = startX + vec.x;
      const endY = startY - vec.y;
      
      ctx.strokeStyle = vec.color;
      ctx.fillStyle = vec.color;
      ctx.lineWidth = 3;
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Draw arrowhead
      const angle = Math.atan2(startY - endY, endX - startX);
      const headLength = 15;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLength * Math.cos(angle - Math.PI / 6),
        endY + headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 6),
        endY + headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      
      // Draw label
      ctx.font = "bold 16px IBM Plex Sans Arabic";
      ctx.fillText(label, endX + 10, endY - 10);
    };
    
    // Draw vectors
    drawVector(centerX, centerY, vectorA, "A⃗");
    drawVector(centerX, centerY, vectorB, "B⃗");
    
    if (showResultant) {
      // Draw dashed lines for parallelogram
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(centerX + vectorA.x, centerY - vectorA.y);
      ctx.lineTo(centerX + resultant.x, centerY - resultant.y);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX + vectorB.x, centerY - vectorB.y);
      ctx.lineTo(centerX + resultant.x, centerY - resultant.y);
      ctx.stroke();
      
      ctx.setLineDash([]);
      
      // Draw resultant
      drawVector(centerX, centerY, resultant, "R⃗");
    }
    
  }, [vectorA, vectorB, showResultant, resultant]);

  const magnitude = (v: Vector) => Math.sqrt(v.x * v.x + v.y * v.y).toFixed(1);
  const angle = (v: Vector) => ((Math.atan2(v.y, v.x) * 180) / Math.PI).toFixed(1);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          className="w-full h-auto sim-canvas"
        />
      </div>
      
      <div className="space-y-6">
        {/* Vector A Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full bg-[#1e3a5f]" />
            <h3 className="font-display font-bold text-[#1e3a5f]">المتجه A⃗</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">المركبة الأفقية (x): {vectorA.x}</label>
              <Slider
                value={[vectorA.x]}
                onValueChange={([x]) => setVectorA({ ...vectorA, x })}
                min={-150}
                max={150}
                step={5}
                className="slider-track"
              />
            </div>
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">المركبة الرأسية (y): {vectorA.y}</label>
              <Slider
                value={[vectorA.y]}
                onValueChange={([y]) => setVectorA({ ...vectorA, y })}
                min={-150}
                max={150}
                step={5}
              />
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-[#1e3a5f]/60">المقدار: <strong>{magnitude(vectorA)}</strong></span>
              <span className="text-[#1e3a5f]/60">الزاوية: <strong>{angle(vectorA)}°</strong></span>
            </div>
          </div>
        </div>
        
        {/* Vector B Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full bg-[#10b981]" />
            <h3 className="font-display font-bold text-[#1e3a5f]">المتجه B⃗</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">المركبة الأفقية (x): {vectorB.x}</label>
              <Slider
                value={[vectorB.x]}
                onValueChange={([x]) => setVectorB({ ...vectorB, x })}
                min={-150}
                max={150}
                step={5}
              />
            </div>
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">المركبة الرأسية (y): {vectorB.y}</label>
              <Slider
                value={[vectorB.y]}
                onValueChange={([y]) => setVectorB({ ...vectorB, y })}
                min={-150}
                max={150}
                step={5}
              />
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-[#1e3a5f]/60">المقدار: <strong>{magnitude(vectorB)}</strong></span>
              <span className="text-[#1e3a5f]/60">الزاوية: <strong>{angle(vectorB)}°</strong></span>
            </div>
          </div>
        </div>
        
        {/* Resultant Info */}
        {showResultant && (
          <div className="bg-gradient-to-br from-[#f97316]/10 to-[#f97316]/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full bg-[#f97316]" />
              <h3 className="font-display font-bold text-[#1e3a5f]">المحصلة R⃗</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#1e3a5f]/60">Rx = </span>
                <strong className="text-[#f97316]">{resultant.x}</strong>
              </div>
              <div>
                <span className="text-[#1e3a5f]/60">Ry = </span>
                <strong className="text-[#f97316]">{resultant.y}</strong>
              </div>
              <div>
                <span className="text-[#1e3a5f]/60">المقدار = </span>
                <strong className="text-[#f97316]">{magnitude(resultant)}</strong>
              </div>
              <div>
                <span className="text-[#1e3a5f]/60">الزاوية = </span>
                <strong className="text-[#f97316]">{angle(resultant)}°</strong>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4">
          <Button
            onClick={() => setShowResultant(!showResultant)}
            className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90"
          >
            {showResultant ? "إخفاء المحصلة" : "إظهار المحصلة"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setVectorA({ x: 100, y: 50, color: "#1e3a5f", name: "A" });
              setVectorB({ x: 50, y: 100, color: "#10b981", name: "B" });
            }}
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Summary Component
function VectorsSummary() {
  return (
    <div className="space-y-8">
      {/* Scalar vs Vector */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-display font-bold text-[#1e3a5f] mb-6">
          الكميات القياسية والكميات المتجهة
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1e3a5f]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm">1</span>
              الكميات القياسية (Scalar)
            </h4>
            <p className="text-[#1e3a5f]/70 mb-4">
              هي الكميات التي تُحدد بالمقدار فقط، ولا يوجد لها اتجاه.
            </p>
            <div className="space-y-2">
              <p className="text-sm"><strong>أمثلة:</strong></p>
              <ul className="text-sm text-[#1e3a5f]/70 space-y-1 mr-4">
                <li>• الكتلة (kg)</li>
                <li>• درجة الحرارة (°C)</li>
                <li>• الزمن (s)</li>
                <li>• المسافة (m)</li>
                <li>• الطاقة (J)</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-[#10b981]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center text-sm">2</span>
              الكميات المتجهة (Vector)
            </h4>
            <p className="text-[#1e3a5f]/70 mb-4">
              هي الكميات التي تُحدد بالمقدار والاتجاه معاً.
            </p>
            <div className="space-y-2">
              <p className="text-sm"><strong>أمثلة:</strong></p>
              <ul className="text-sm text-[#1e3a5f]/70 space-y-1 mr-4">
                <li>• الإزاحة (m)</li>
                <li>• السرعة (m/s)</li>
                <li>• التسارع (m/s²)</li>
                <li>• القوة (N)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vector Representation */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-display font-bold text-[#1e3a5f] mb-6">
          تمثيل المتجهات
        </h3>
        
        <div className="space-y-6">
          <div className="bg-[#faf8f5] rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-3">التمثيل البياني</h4>
            <p className="text-[#1e3a5f]/70">
              يُمثَّل المتجه بسهم، حيث يدل طول السهم على مقدار المتجه، ويدل اتجاه السهم على اتجاه المتجه.
            </p>
          </div>
          
          <div className="bg-[#faf8f5] rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-3">التمثيل الرياضي</h4>
            <p className="text-[#1e3a5f]/70 mb-4">
              يُمكن تمثيل المتجه بمركبتيه الأفقية والرأسية:
            </p>
            <div className="bg-white rounded-xl p-4 font-mono text-center text-lg">
              <p>A⃗ = Ax î + Ay ĵ</p>
              <p className="text-sm text-[#1e3a5f]/60 mt-2">
                حيث î و ĵ متجهات الوحدة في اتجاهي x و y
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vector Operations */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-display font-bold text-[#1e3a5f] mb-6">
          العمليات على المتجهات
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#f97316]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <Plus className="text-[#f97316]" size={20} />
              جمع المتجهات
            </h4>
            <div className="space-y-3 text-[#1e3a5f]/70">
              <p><strong>طريقة المثلث:</strong> نضع بداية المتجه الثاني عند نهاية الأول.</p>
              <p><strong>طريقة متوازي الأضلاع:</strong> نرسم المتجهين من نقطة واحدة.</p>
              <div className="bg-white rounded-xl p-3 font-mono text-sm">
                R⃗ = A⃗ + B⃗
                <br />
                Rx = Ax + Bx
                <br />
                Ry = Ay + By
              </div>
            </div>
          </div>
          
          <div className="bg-[#1e3a5f]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
              <Minus className="text-[#1e3a5f]" size={20} />
              طرح المتجهات
            </h4>
            <div className="space-y-3 text-[#1e3a5f]/70">
              <p>طرح متجه يعني جمعه مع سالبه (عكس اتجاهه).</p>
              <div className="bg-white rounded-xl p-3 font-mono text-sm">
                A⃗ - B⃗ = A⃗ + (-B⃗)
                <br />
                Rx = Ax - Bx
                <br />
                Ry = Ay - By
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulas */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#10b981] rounded-3xl p-8 text-white">
        <h3 className="text-2xl font-display font-bold mb-6">
          القوانين الأساسية
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h4 className="font-bold mb-3">مقدار المتجه</h4>
            <p className="font-mono text-lg">|A⃗| = √(Ax² + Ay²)</p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h4 className="font-bold mb-3">اتجاه المتجه</h4>
            <p className="font-mono text-lg">θ = tan⁻¹(Ay / Ax)</p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h4 className="font-bold mb-3">المركبة الأفقية</h4>
            <p className="font-mono text-lg">Ax = |A⃗| × cos(θ)</p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h4 className="font-bold mb-3">المركبة الرأسية</h4>
            <p className="font-mono text-lg">Ay = |A⃗| × sin(θ)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Vectors() {
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
              <div className="w-14 h-14 rounded-2xl bg-[#1e3a5f] flex items-center justify-center">
                <ArrowRight className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-[#1e3a5f]">
                  الوحدة الأولى: المتجهات
                </h1>
                <p className="text-[#1e3a5f]/60">Vectors</p>
              </div>
            </div>
            <p className="text-[#1e3a5f]/70 max-w-2xl">
              تعرف على الكميات القياسية والمتجهة، وتعلم كيفية جمع وطرح المتجهات بيانياً ورياضياً.
            </p>
          </motion.div>
          
          {/* Tabs */}
          <Tabs defaultValue="simulation" className="space-y-8">
            <TabsList className="bg-white p-1 rounded-2xl shadow-lg">
              <TabsTrigger value="simulation" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
                <Play size={18} className="ml-2" />
                المحاكاة
              </TabsTrigger>
              <TabsTrigger value="summary" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#1e3a5f] data-[state=active]:text-white">
                <BookOpen size={18} className="ml-2" />
                الملخص
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="simulation">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-[#10b981]/10 rounded-2xl p-4 mb-8 flex items-start gap-3">
                  <Info className="text-[#10b981] mt-1 flex-shrink-0" size={20} />
                  <p className="text-[#1e3a5f]/80 text-sm">
                    استخدم المنزلقات لتغيير مركبات المتجهات A و B، وشاهد كيف تتغير المحصلة R.
                    المحصلة هي ناتج جمع المتجهين باستخدام طريقة متوازي الأضلاع.
                  </p>
                </div>
                <VectorAdditionSim />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="summary">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VectorsSummary />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
