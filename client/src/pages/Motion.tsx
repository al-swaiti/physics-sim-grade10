import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Move, Play, Pause, RotateCcw, Info, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";

// 1D Motion Simulation
function Motion1DSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [initialVelocity, setInitialVelocity] = useState(20);
  const [acceleration, setAcceleration] = useState(5);
  
  const maxTime = 5;
  
  const calculatePosition = useCallback((t: number) => {
    // x = v₀t + ½at²
    return initialVelocity * t + 0.5 * acceleration * t * t;
  }, [initialVelocity, acceleration]);
  
  const calculateVelocity = useCallback((t: number) => {
    // v = v₀ + at
    return initialVelocity + acceleration * t;
  }, [initialVelocity, acceleration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Draw road
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, height / 2 - 30, width, 60);
    
    // Draw road lines
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw distance markers
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px IBM Plex Sans Arabic";
    for (let i = 0; i <= 200; i += 50) {
      const x = 50 + (i / 200) * (width - 100);
      ctx.beginPath();
      ctx.moveTo(x, height / 2 + 30);
      ctx.lineTo(x, height / 2 + 40);
      ctx.stroke();
      ctx.fillText(`${i}m`, x - 10, height / 2 + 55);
    }
    
    // Calculate car position
    const position = calculatePosition(time);
    const carX = 50 + (position / 200) * (width - 100);
    
    // Draw car
    ctx.fillStyle = "#1e3a5f";
    ctx.beginPath();
    ctx.roundRect(carX - 30, height / 2 - 20, 60, 25, 5);
    ctx.fill();
    
    // Car roof
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.roundRect(carX - 15, height / 2 - 35, 30, 18, 3);
    ctx.fill();
    
    // Wheels
    ctx.fillStyle = "#374151";
    ctx.beginPath();
    ctx.arc(carX - 15, height / 2 + 5, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(carX + 15, height / 2 + 5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw info
    ctx.fillStyle = "#1e3a5f";
    ctx.font = "bold 14px IBM Plex Sans Arabic";
    ctx.fillText(`الموقع: ${position.toFixed(1)} m`, 20, 30);
    ctx.fillText(`السرعة: ${calculateVelocity(time).toFixed(1)} m/s`, 20, 50);
    ctx.fillText(`الزمن: ${time.toFixed(2)} s`, 20, 70);
    
  }, [time, calculatePosition, calculateVelocity]);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime(t => {
          if (t >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return t + 0.02;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-auto sim-canvas"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-display font-bold text-[#1e3a5f] mb-4">التحكم</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">
                السرعة الابتدائية (v₀): {initialVelocity} m/s
              </label>
              <Slider
                value={[initialVelocity]}
                onValueChange={([v]) => { setInitialVelocity(v); reset(); }}
                min={0}
                max={50}
                step={1}
                disabled={isPlaying}
              />
            </div>
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">
                التسارع (a): {acceleration} m/s²
              </label>
              <Slider
                value={[acceleration]}
                onValueChange={([a]) => { setAcceleration(a); reset(); }}
                min={-10}
                max={20}
                step={1}
                disabled={isPlaying}
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90"
            >
              {isPlaying ? <Pause size={18} className="ml-2" /> : <Play size={18} className="ml-2" />}
              {isPlaying ? "إيقاف" : "تشغيل"}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw size={18} />
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#f97316]/10 to-[#f97316]/5 rounded-2xl p-6">
          <h3 className="font-display font-bold text-[#1e3a5f] mb-4">المعادلات المستخدمة</h3>
          <div className="space-y-3 font-mono text-sm">
            <div className="bg-white rounded-xl p-3">
              <p className="text-[#1e3a5f]/60 text-xs mb-1">معادلة الموقع:</p>
              <p>x = v₀t + ½at²</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-[#1e3a5f]/60 text-xs mb-1">معادلة السرعة:</p>
              <p>v = v₀ + at</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Projectile Motion Simulation
function ProjectileMotionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [initialSpeed, setInitialSpeed] = useState(30);
  const [angle, setAngle] = useState(45);
  const [trajectory, setTrajectory] = useState<{x: number, y: number}[]>([]);
  
  const g = 9.8;
  const angleRad = (angle * Math.PI) / 180;
  const v0x = initialSpeed * Math.cos(angleRad);
  const v0y = initialSpeed * Math.sin(angleRad);
  
  const maxTime = (2 * v0y) / g;
  const maxRange = v0x * maxTime;
  const maxHeight = (v0y * v0y) / (2 * g);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const scale = Math.min((width - 100) / maxRange, (height - 100) / maxHeight) * 0.8;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Draw ground
    ctx.fillStyle = "#10b981";
    ctx.fillRect(0, height - 30, width, 30);
    
    // Draw grass
    ctx.strokeStyle = "#059669";
    for (let i = 0; i < width; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, height - 30);
      ctx.lineTo(i + 3, height - 35);
      ctx.stroke();
    }
    
    // Draw trajectory path
    if (trajectory.length > 1) {
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(50 + trajectory[0].x * scale, height - 30 - trajectory[0].y * scale);
      trajectory.forEach(point => {
        ctx.lineTo(50 + point.x * scale, height - 30 - point.y * scale);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Calculate current position
    const x = v0x * time;
    const y = v0y * time - 0.5 * g * time * time;
    
    // Draw ball
    if (y >= 0) {
      const ballX = 50 + x * scale;
      const ballY = height - 30 - y * scale;
      
      ctx.fillStyle = "#1e3a5f";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw velocity vector
      const vx = v0x;
      const vy = v0y - g * time;
      const vScale = 2;
      
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + vx * vScale, ballY - vy * vScale);
      ctx.stroke();
      
      // Arrow head
      const vAngle = Math.atan2(-vy, vx);
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(ballX + vx * vScale, ballY - vy * vScale);
      ctx.lineTo(
        ballX + vx * vScale - 10 * Math.cos(vAngle - Math.PI / 6),
        ballY - vy * vScale + 10 * Math.sin(vAngle - Math.PI / 6)
      );
      ctx.lineTo(
        ballX + vx * vScale - 10 * Math.cos(vAngle + Math.PI / 6),
        ballY - vy * vScale + 10 * Math.sin(vAngle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw info
    ctx.fillStyle = "#1e3a5f";
    ctx.font = "bold 14px IBM Plex Sans Arabic";
    ctx.fillText(`x: ${x.toFixed(1)} m`, 20, 30);
    ctx.fillText(`y: ${Math.max(0, y).toFixed(1)} m`, 20, 50);
    ctx.fillText(`t: ${time.toFixed(2)} s`, 20, 70);
    ctx.fillText(`المدى: ${maxRange.toFixed(1)} m`, width - 120, 30);
    ctx.fillText(`أقصى ارتفاع: ${maxHeight.toFixed(1)} m`, width - 150, 50);
    
  }, [time, trajectory, v0x, v0y, maxRange, maxHeight, g]);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime(t => {
          const newTime = t + 0.02;
          const x = v0x * newTime;
          const y = v0y * newTime - 0.5 * g * newTime * newTime;
          
          if (y < 0) {
            setIsPlaying(false);
            return t;
          }
          
          setTrajectory(prev => [...prev, { x, y }]);
          return newTime;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, v0x, v0y, g]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setTrajectory([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <canvas
          ref={canvasRef}
          width={600}
          height={350}
          className="w-full h-auto sim-canvas"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-display font-bold text-[#1e3a5f] mb-4">التحكم</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">
                السرعة الابتدائية: {initialSpeed} m/s
              </label>
              <Slider
                value={[initialSpeed]}
                onValueChange={([v]) => { setInitialSpeed(v); reset(); }}
                min={10}
                max={50}
                step={1}
                disabled={isPlaying}
              />
            </div>
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">
                زاوية الإطلاق: {angle}°
              </label>
              <Slider
                value={[angle]}
                onValueChange={([a]) => { setAngle(a); reset(); }}
                min={10}
                max={80}
                step={1}
                disabled={isPlaying}
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90"
            >
              {isPlaying ? <Pause size={18} className="ml-2" /> : <Play size={18} className="ml-2" />}
              {isPlaying ? "إيقاف" : "إطلاق"}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw size={18} />
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-2xl p-6">
          <h3 className="font-display font-bold text-[#1e3a5f] mb-4">معادلات حركة المقذوفات</h3>
          <div className="space-y-3 font-mono text-sm">
            <div className="bg-white rounded-xl p-3">
              <p className="text-[#1e3a5f]/60 text-xs mb-1">الموقع الأفقي:</p>
              <p>x = v₀ × cos(θ) × t</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-[#1e3a5f]/60 text-xs mb-1">الموقع الرأسي:</p>
              <p>y = v₀ × sin(θ) × t - ½gt²</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Summary Component
function MotionSummary() {
  return (
    <div className="space-y-8">
      {/* Basic Concepts */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-display font-bold text-[#1e3a5f] mb-6">
          المفاهيم الأساسية
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1e3a5f]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-3">الإزاحة (Displacement)</h4>
            <p className="text-[#1e3a5f]/70 text-sm">
              هي المسافة المستقيمة بين نقطة البداية ونقطة النهاية مع تحديد الاتجاه. 
              كمية متجهة تُقاس بالمتر (m).
            </p>
          </div>
          
          <div className="bg-[#10b981]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-3">المسافة (Distance)</h4>
            <p className="text-[#1e3a5f]/70 text-sm">
              هي الطول الكلي للمسار الذي يقطعه الجسم. 
              كمية قياسية تُقاس بالمتر (m).
            </p>
          </div>
          
          <div className="bg-[#f97316]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-3">السرعة المتوسطة (Average Velocity)</h4>
            <p className="text-[#1e3a5f]/70 text-sm">
              هي معدل تغير الإزاحة بالنسبة للزمن. 
              كمية متجهة تُقاس بـ (m/s).
            </p>
            <div className="bg-white rounded-xl p-2 mt-2 font-mono text-center">
              v̄ = Δx / Δt
            </div>
          </div>
          
          <div className="bg-[#1e3a5f]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-3">التسارع (Acceleration)</h4>
            <p className="text-[#1e3a5f]/70 text-sm">
              هو معدل تغير السرعة بالنسبة للزمن. 
              كمية متجهة تُقاس بـ (m/s²).
            </p>
            <div className="bg-white rounded-xl p-2 mt-2 font-mono text-center">
              a = Δv / Δt
            </div>
          </div>
        </div>
      </div>
      
      {/* Motion Equations */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#10b981] rounded-3xl p-8 text-white">
        <h3 className="text-2xl font-display font-bold mb-6">
          معادلات الحركة بتسارع ثابت
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h4 className="font-bold mb-2">المعادلة الأولى</h4>
            <p className="font-mono text-xl">v = v₀ + at</p>
            <p className="text-white/70 text-sm mt-2">السرعة النهائية</p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h4 className="font-bold mb-2">المعادلة الثانية</h4>
            <p className="font-mono text-xl">x = v₀t + ½at²</p>
            <p className="text-white/70 text-sm mt-2">الإزاحة</p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h4 className="font-bold mb-2">المعادلة الثالثة</h4>
            <p className="font-mono text-xl">v² = v₀² + 2ax</p>
            <p className="text-white/70 text-sm mt-2">بدون الزمن</p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h4 className="font-bold mb-2">المعادلة الرابعة</h4>
            <p className="font-mono text-xl">x = ½(v + v₀)t</p>
            <p className="text-white/70 text-sm mt-2">متوسط السرعة</p>
          </div>
        </div>
      </div>
      
      {/* Projectile Motion */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-display font-bold text-[#1e3a5f] mb-6">
          حركة المقذوفات
        </h3>
        
        <div className="space-y-6">
          <p className="text-[#1e3a5f]/70">
            حركة المقذوف هي حركة في بُعدين تحت تأثير الجاذبية الأرضية فقط. 
            تتكون من حركة أفقية منتظمة وحركة رأسية بتسارع ثابت.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#f97316]/5 rounded-2xl p-6">
              <h4 className="font-bold text-[#1e3a5f] mb-3">الحركة الأفقية</h4>
              <ul className="space-y-2 text-sm text-[#1e3a5f]/70">
                <li>• السرعة ثابتة: vₓ = v₀ cos(θ)</li>
                <li>• التسارع = صفر</li>
                <li>• الإزاحة: x = v₀ cos(θ) × t</li>
              </ul>
            </div>
            
            <div className="bg-[#10b981]/5 rounded-2xl p-6">
              <h4 className="font-bold text-[#1e3a5f] mb-3">الحركة الرأسية</h4>
              <ul className="space-y-2 text-sm text-[#1e3a5f]/70">
                <li>• السرعة الابتدائية: vᵧ = v₀ sin(θ)</li>
                <li>• التسارع = -g (للأسفل)</li>
                <li>• الإزاحة: y = v₀ sin(θ) × t - ½gt²</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-[#1e3a5f]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-3">القوانين المهمة</h4>
            <div className="grid md:grid-cols-3 gap-4 font-mono text-sm">
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-[#1e3a5f]/60 text-xs mb-1">المدى الأفقي</p>
                <p>R = v₀² sin(2θ) / g</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-[#1e3a5f]/60 text-xs mb-1">أقصى ارتفاع</p>
                <p>H = v₀² sin²(θ) / 2g</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-[#1e3a5f]/60 text-xs mb-1">زمن الطيران</p>
                <p>T = 2v₀ sin(θ) / g</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Motion() {
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
              <div className="w-14 h-14 rounded-2xl bg-[#f97316] flex items-center justify-center">
                <Move className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-[#1e3a5f]">
                  الوحدة الثانية: الحركة
                </h1>
                <p className="text-[#1e3a5f]/60">Motion</p>
              </div>
            </div>
            <p className="text-[#1e3a5f]/70 max-w-2xl">
              استكشف الحركة في بُعد واحد وبُعدين، وتعلم معادلات الحركة وحركة المقذوفات.
            </p>
          </motion.div>
          
          {/* Tabs */}
          <Tabs defaultValue="1d" className="space-y-8">
            <TabsList className="bg-white p-1 rounded-2xl shadow-lg flex-wrap">
              <TabsTrigger value="1d" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                <Play size={18} className="ml-2" />
                حركة في بُعد واحد
              </TabsTrigger>
              <TabsTrigger value="projectile" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                <Play size={18} className="ml-2" />
                حركة المقذوفات
              </TabsTrigger>
              <TabsTrigger value="summary" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#f97316] data-[state=active]:text-white">
                <BookOpen size={18} className="ml-2" />
                الملخص
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="1d">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-[#10b981]/10 rounded-2xl p-4 mb-8 flex items-start gap-3">
                  <Info className="text-[#10b981] mt-1 flex-shrink-0" size={20} />
                  <p className="text-[#1e3a5f]/80 text-sm">
                    شاهد حركة السيارة بتسارع ثابت. غيّر السرعة الابتدائية والتسارع لترى تأثيرهما على الحركة.
                  </p>
                </div>
                <Motion1DSim />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="projectile">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-[#f97316]/10 rounded-2xl p-4 mb-8 flex items-start gap-3">
                  <Info className="text-[#f97316] mt-1 flex-shrink-0" size={20} />
                  <p className="text-[#1e3a5f]/80 text-sm">
                    أطلق الكرة وشاهد مسارها. جرّب زوايا وسرعات مختلفة لتكتشف أفضل زاوية للحصول على أقصى مدى.
                  </p>
                </div>
                <ProjectileMotionSim />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="summary">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MotionSummary />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
