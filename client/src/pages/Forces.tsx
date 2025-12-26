import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, Play, Pause, RotateCcw, Info, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";

// Newton's Second Law Simulation
function NewtonSecondLawSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [mass, setMass] = useState(5);
  const [force, setForce] = useState(20);
  const [position, setPosition] = useState(50);
  const [velocity, setVelocity] = useState(0);
  
  const acceleration = force / mass;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Draw floor
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, height - 40, width, 40);
    
    // Draw grid on floor
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, height - 40);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    // Draw box
    const boxSize = 30 + mass * 4;
    const boxX = position;
    const boxY = height - 40 - boxSize;
    
    ctx.fillStyle = "#1e3a5f";
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxSize, boxSize, 5);
    ctx.fill();
    
    // Draw mass label on box
    ctx.fillStyle = "white";
    ctx.font = "bold 14px IBM Plex Sans Arabic";
    ctx.textAlign = "center";
    ctx.fillText(`${mass} kg`, boxX + boxSize / 2, boxY + boxSize / 2 + 5);
    
    // Draw force arrow
    if (force !== 0) {
      const arrowLength = Math.abs(force) * 3;
      const arrowY = boxY + boxSize / 2;
      const arrowStartX = force > 0 ? boxX + boxSize : boxX;
      const arrowEndX = force > 0 ? arrowStartX + arrowLength : arrowStartX - arrowLength;
      
      ctx.strokeStyle = "#f97316";
      ctx.fillStyle = "#f97316";
      ctx.lineWidth = 4;
      
      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowY);
      ctx.lineTo(arrowEndX, arrowY);
      ctx.stroke();
      
      // Arrow head
      const headSize = 12;
      const direction = force > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(arrowEndX, arrowY);
      ctx.lineTo(arrowEndX - direction * headSize, arrowY - headSize / 2);
      ctx.lineTo(arrowEndX - direction * headSize, arrowY + headSize / 2);
      ctx.closePath();
      ctx.fill();
      
      // Force label
      ctx.fillStyle = "#f97316";
      ctx.font = "bold 14px IBM Plex Sans Arabic";
      ctx.fillText(`F = ${force} N`, arrowEndX + direction * 20, arrowY - 10);
    }
    
    // Draw info
    ctx.fillStyle = "#1e3a5f";
    ctx.font = "bold 14px IBM Plex Sans Arabic";
    ctx.textAlign = "right";
    ctx.fillText(`التسارع: a = ${acceleration.toFixed(2)} m/s²`, width - 20, 30);
    ctx.fillText(`السرعة: v = ${velocity.toFixed(2)} m/s`, width - 20, 50);
    ctx.fillText(`الزمن: t = ${time.toFixed(2)} s`, width - 20, 70);
    
    // Draw formula
    ctx.textAlign = "left";
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 16px monospace";
    ctx.fillText("F = m × a", 20, 30);
    ctx.fillText(`${force} = ${mass} × ${acceleration.toFixed(2)}`, 20, 55);
    
  }, [position, mass, force, acceleration, velocity, time]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (isPlaying) {
      const dt = 0.016;
      const animate = () => {
        setTime(t => t + dt);
        setVelocity(v => v + acceleration * dt);
        setPosition(p => {
          const newPos = p + velocity * dt + 0.5 * acceleration * dt * dt;
          if (newPos > 500 || newPos < 20) {
            setIsPlaying(false);
            return p;
          }
          return newPos;
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
  }, [isPlaying, acceleration, velocity]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setPosition(50);
    setVelocity(0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <canvas
          ref={canvasRef}
          width={600}
          height={250}
          className="w-full h-auto sim-canvas"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-display font-bold text-[#1e3a5f] mb-4">التحكم</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">
                الكتلة (m): {mass} kg
              </label>
              <Slider
                value={[mass]}
                onValueChange={([m]) => { setMass(m); reset(); }}
                min={1}
                max={20}
                step={1}
                disabled={isPlaying}
              />
            </div>
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">
                القوة (F): {force} N
              </label>
              <Slider
                value={[force]}
                onValueChange={([f]) => { setForce(f); reset(); }}
                min={-50}
                max={50}
                step={5}
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
        
        <div className="bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/5 rounded-2xl p-6">
          <h3 className="font-display font-bold text-[#1e3a5f] mb-4">قانون نيوتن الثاني</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="font-mono text-2xl text-[#1e3a5f]">F = m × a</p>
            </div>
            <p className="text-[#1e3a5f]/70 text-sm">
              القوة المحصلة المؤثرة في جسم تساوي حاصل ضرب كتلته في تسارعه.
            </p>
            <div className="bg-white rounded-xl p-3 font-mono text-sm">
              <p>a = F / m = {force} / {mass} = {acceleration.toFixed(2)} m/s²</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Action-Reaction Simulation
function ActionReactionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [mass1, setMass1] = useState(5);
  const [mass2, setMass2] = useState(10);
  const [pos1, setPos1] = useState(200);
  const [pos2, setPos2] = useState(350);
  const [vel1, setVel1] = useState(30);
  const [vel2, setVel2] = useState(-15);
  const [collided, setCollided] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Draw floor
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, height - 40, width, 40);
    
    // Draw ball 1
    const radius1 = 20 + mass1 * 2;
    ctx.fillStyle = "#1e3a5f";
    ctx.beginPath();
    ctx.arc(pos1, height - 40 - radius1, radius1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "bold 12px IBM Plex Sans Arabic";
    ctx.textAlign = "center";
    ctx.fillText(`${mass1}kg`, pos1, height - 40 - radius1 + 4);
    
    // Draw ball 2
    const radius2 = 20 + mass2 * 2;
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(pos2, height - 40 - radius2, radius2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText(`${mass2}kg`, pos2, height - 40 - radius2 + 4);
    
    // Draw velocity arrows
    const arrowScale = 2;
    
    // Ball 1 velocity
    if (Math.abs(vel1) > 0.1) {
      ctx.strokeStyle = "#f97316";
      ctx.fillStyle = "#f97316";
      ctx.lineWidth = 3;
      const arrowEnd1 = pos1 + vel1 * arrowScale;
      ctx.beginPath();
      ctx.moveTo(pos1, height - 40 - radius1 * 2 - 20);
      ctx.lineTo(arrowEnd1, height - 40 - radius1 * 2 - 20);
      ctx.stroke();
      
      const dir1 = vel1 > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(arrowEnd1, height - 40 - radius1 * 2 - 20);
      ctx.lineTo(arrowEnd1 - dir1 * 8, height - 40 - radius1 * 2 - 25);
      ctx.lineTo(arrowEnd1 - dir1 * 8, height - 40 - radius1 * 2 - 15);
      ctx.closePath();
      ctx.fill();
    }
    
    // Ball 2 velocity
    if (Math.abs(vel2) > 0.1) {
      ctx.strokeStyle = "#f97316";
      ctx.fillStyle = "#f97316";
      const arrowEnd2 = pos2 + vel2 * arrowScale;
      ctx.beginPath();
      ctx.moveTo(pos2, height - 40 - radius2 * 2 - 20);
      ctx.lineTo(arrowEnd2, height - 40 - radius2 * 2 - 20);
      ctx.stroke();
      
      const dir2 = vel2 > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(arrowEnd2, height - 40 - radius2 * 2 - 20);
      ctx.lineTo(arrowEnd2 - dir2 * 8, height - 40 - radius2 * 2 - 25);
      ctx.lineTo(arrowEnd2 - dir2 * 8, height - 40 - radius2 * 2 - 15);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw collision effect
    if (collided) {
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      const collisionX = (pos1 + pos2) / 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const len = 20 + Math.random() * 10;
        ctx.beginPath();
        ctx.moveTo(collisionX, height - 60);
        ctx.lineTo(
          collisionX + Math.cos(angle) * len,
          height - 60 + Math.sin(angle) * len
        );
        ctx.stroke();
      }
    }
    
    // Draw info
    ctx.fillStyle = "#1e3a5f";
    ctx.font = "bold 14px IBM Plex Sans Arabic";
    ctx.textAlign = "right";
    ctx.fillText(`v₁ = ${vel1.toFixed(1)} m/s`, width - 20, 30);
    ctx.fillText(`v₂ = ${vel2.toFixed(1)} m/s`, width - 20, 50);
    
    // Momentum
    const p1 = mass1 * vel1;
    const p2 = mass2 * vel2;
    const totalP = p1 + p2;
    ctx.fillText(`كمية الحركة الكلية: ${totalP.toFixed(1)} kg·m/s`, width - 20, 80);
    
  }, [pos1, pos2, vel1, vel2, mass1, mass2, collided]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (isPlaying) {
      const dt = 0.016;
      const animate = () => {
        setTime(t => t + dt);
        
        const radius1 = 20 + mass1 * 2;
        const radius2 = 20 + mass2 * 2;
        
        // Check collision
        if (Math.abs(pos1 - pos2) <= radius1 + radius2 && !collided) {
          // Elastic collision
          const newVel1 = ((mass1 - mass2) * vel1 + 2 * mass2 * vel2) / (mass1 + mass2);
          const newVel2 = ((mass2 - mass1) * vel2 + 2 * mass1 * vel1) / (mass1 + mass2);
          setVel1(newVel1);
          setVel2(newVel2);
          setCollided(true);
          setTimeout(() => setCollided(false), 200);
        }
        
        setPos1(p => {
          const newP = p + vel1 * dt;
          if (newP < radius1 || newP > 600 - radius1) {
            setVel1(v => -v * 0.8);
            return p;
          }
          return newP;
        });
        
        setPos2(p => {
          const newP = p + vel2 * dt;
          if (newP < radius2 || newP > 600 - radius2) {
            setVel2(v => -v * 0.8);
            return p;
          }
          return newP;
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
  }, [isPlaying, vel1, vel2, mass1, mass2, collided, pos1, pos2]);

  const reset = () => {
    setIsPlaying(false);
    setTime(0);
    setPos1(200);
    setPos2(350);
    setVel1(30);
    setVel2(-15);
    setCollided(false);
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
                كتلة الكرة الأولى: {mass1} kg
              </label>
              <Slider
                value={[mass1]}
                onValueChange={([m]) => { setMass1(m); reset(); }}
                min={1}
                max={15}
                step={1}
                disabled={isPlaying}
              />
            </div>
            <div>
              <label className="text-sm text-[#1e3a5f]/60 mb-2 block">
                كتلة الكرة الثانية: {mass2} kg
              </label>
              <Slider
                value={[mass2]}
                onValueChange={([m]) => { setMass2(m); reset(); }}
                min={1}
                max={15}
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
        
        <div className="bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-2xl p-6">
          <h3 className="font-display font-bold text-[#1e3a5f] mb-4">قانون نيوتن الثالث</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="font-mono text-xl text-[#1e3a5f]">F₁₂ = -F₂₁</p>
            </div>
            <p className="text-[#1e3a5f]/70 text-sm">
              لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه.
            </p>
            <p className="text-[#1e3a5f]/70 text-sm">
              لاحظ كيف تتبادل الكرتان كمية الحركة عند التصادم، مع بقاء كمية الحركة الكلية ثابتة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Summary Component
function ForcesSummary() {
  return (
    <div className="space-y-8">
      {/* Newton's First Law */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-display font-bold text-[#1e3a5f] mb-6">
          قانون نيوتن الأول (القصور الذاتي)
        </h3>
        
        <div className="bg-[#1e3a5f]/5 rounded-2xl p-6">
          <p className="text-lg text-[#1e3a5f] mb-4 font-medium">
            "يبقى الجسم الساكن ساكناً، والجسم المتحرك يستمر في حركته بسرعة ثابتة 
            في خط مستقيم، ما لم تؤثر فيه قوة محصلة تغير من حالته."
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-[#1e3a5f] mb-2">القصور الذاتي</h4>
              <p className="text-[#1e3a5f]/70 text-sm">
                هو ممانعة الجسم لتغيير حالته الحركية. كلما زادت كتلة الجسم، زاد قصوره الذاتي.
              </p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-[#1e3a5f] mb-2">أمثلة</h4>
              <ul className="text-[#1e3a5f]/70 text-sm space-y-1">
                <li>• اندفاع الراكب للأمام عند توقف السيارة فجأة</li>
                <li>• استمرار دوران الغسالة بعد إيقافها</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newton's Second Law */}
      <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-3xl p-8 text-white">
        <h3 className="text-2xl font-display font-bold mb-6">
          قانون نيوتن الثاني
        </h3>
        
        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur mb-6">
          <p className="text-lg mb-4">
            "التسارع الذي يكتسبه جسم يتناسب طردياً مع القوة المحصلة المؤثرة فيه، 
            وعكسياً مع كتلته."
          </p>
          <div className="text-center">
            <p className="font-mono text-3xl">F = m × a</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
            <h4 className="font-bold mb-2">القوة (F)</h4>
            <p className="text-white/80 text-sm">تُقاس بالنيوتن (N)</p>
            <p className="text-white/60 text-xs mt-1">1 N = 1 kg·m/s²</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
            <h4 className="font-bold mb-2">الكتلة (m)</h4>
            <p className="text-white/80 text-sm">تُقاس بالكيلوغرام (kg)</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
            <h4 className="font-bold mb-2">التسارع (a)</h4>
            <p className="text-white/80 text-sm">يُقاس بـ (m/s²)</p>
          </div>
        </div>
      </div>
      
      {/* Newton's Third Law */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-display font-bold text-[#1e3a5f] mb-6">
          قانون نيوتن الثالث (الفعل ورد الفعل)
        </h3>
        
        <div className="bg-[#f97316]/5 rounded-2xl p-6">
          <p className="text-lg text-[#1e3a5f] mb-4 font-medium">
            "لكل فعل رد فعل مساوٍ له في المقدار ومعاكس له في الاتجاه."
          </p>
          
          <div className="text-center my-6">
            <p className="font-mono text-2xl text-[#f97316]">F₁₂ = -F₂₁</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-[#1e3a5f]">خصائص قوتي الفعل ورد الفعل:</h4>
            <ul className="text-[#1e3a5f]/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center text-xs flex-shrink-0">1</span>
                <span>متساويتان في المقدار</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center text-xs flex-shrink-0">2</span>
                <span>متعاكستان في الاتجاه</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center text-xs flex-shrink-0">3</span>
                <span>تؤثران في جسمين مختلفين</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-[#f97316] text-white flex items-center justify-center text-xs flex-shrink-0">4</span>
                <span>من نفس النوع (تلامس أو مجال)</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#1e3a5f]/5 rounded-xl p-4">
            <h4 className="font-bold text-[#1e3a5f] mb-2">مثال: المشي</h4>
            <p className="text-[#1e3a5f]/70 text-sm">
              عند المشي، تدفع قدمك الأرض للخلف (فعل)، فتدفعك الأرض للأمام (رد فعل).
            </p>
          </div>
          <div className="bg-[#1e3a5f]/5 rounded-xl p-4">
            <h4 className="font-bold text-[#1e3a5f] mb-2">مثال: السباحة</h4>
            <p className="text-[#1e3a5f]/70 text-sm">
              تدفع يداك الماء للخلف (فعل)، فيدفعك الماء للأمام (رد فعل).
            </p>
          </div>
        </div>
      </div>
      
      {/* Weight and Mass */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-display font-bold text-[#1e3a5f] mb-6">
          الوزن والكتلة
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1e3a5f]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-3">الكتلة (m)</h4>
            <ul className="text-[#1e3a5f]/70 text-sm space-y-2">
              <li>• كمية المادة في الجسم</li>
              <li>• كمية قياسية</li>
              <li>• ثابتة لا تتغير بتغير المكان</li>
              <li>• تُقاس بالكيلوغرام (kg)</li>
            </ul>
          </div>
          
          <div className="bg-[#10b981]/5 rounded-2xl p-6">
            <h4 className="font-bold text-[#1e3a5f] mb-3">الوزن (W)</h4>
            <ul className="text-[#1e3a5f]/70 text-sm space-y-2">
              <li>• قوة جذب الأرض للجسم</li>
              <li>• كمية متجهة (اتجاهها نحو مركز الأرض)</li>
              <li>• يتغير بتغير المكان</li>
              <li>• يُقاس بالنيوتن (N)</li>
            </ul>
            <div className="bg-white rounded-xl p-3 mt-4 text-center font-mono">
              W = m × g
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Forces() {
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
              <div className="w-14 h-14 rounded-2xl bg-[#10b981] flex items-center justify-center">
                <Zap className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-[#1e3a5f]">
                  الوحدة الثالثة: القوى
                </h1>
                <p className="text-[#1e3a5f]/60">Forces</p>
              </div>
            </div>
            <p className="text-[#1e3a5f]/70 max-w-2xl">
              اكتشف قوانين نيوتن الثلاثة للحركة من خلال محاكاة تفاعلية وملخصات شاملة.
            </p>
          </motion.div>
          
          {/* Tabs */}
          <Tabs defaultValue="newton2" className="space-y-8">
            <TabsList className="bg-white p-1 rounded-2xl shadow-lg flex-wrap">
              <TabsTrigger value="newton2" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
                <Play size={18} className="ml-2" />
                القانون الثاني
              </TabsTrigger>
              <TabsTrigger value="newton3" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
                <Play size={18} className="ml-2" />
                الفعل ورد الفعل
              </TabsTrigger>
              <TabsTrigger value="summary" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
                <BookOpen size={18} className="ml-2" />
                الملخص
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="newton2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-[#10b981]/10 rounded-2xl p-4 mb-8 flex items-start gap-3">
                  <Info className="text-[#10b981] mt-1 flex-shrink-0" size={20} />
                  <p className="text-[#1e3a5f]/80 text-sm">
                    غيّر الكتلة والقوة لترى تأثيرهما على التسارع. لاحظ العلاقة: F = m × a
                  </p>
                </div>
                <NewtonSecondLawSim />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="newton3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-[#f97316]/10 rounded-2xl p-4 mb-8 flex items-start gap-3">
                  <Info className="text-[#f97316] mt-1 flex-shrink-0" size={20} />
                  <p className="text-[#1e3a5f]/80 text-sm">
                    شاهد تصادم كرتين وكيف تتبادلان كمية الحركة. لاحظ أن كمية الحركة الكلية تبقى ثابتة.
                  </p>
                </div>
                <ActionReactionSim />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="summary">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ForcesSummary />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
