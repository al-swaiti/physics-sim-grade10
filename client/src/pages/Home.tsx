import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Move, Zap, BookOpen, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const units = [
  {
    id: "vectors",
    title: "المتجهات",
    subtitle: "Vectors",
    description: "تعلم الكميات القياسية والمتجهة، جمع وطرح المتجهات، والتمثيل البياني",
    icon: ArrowRight,
    color: "#1e3a5f",
    bgColor: "from-[#1e3a5f]/10 to-[#1e3a5f]/5",
    image: "/images/hero-vectors.png",
    path: "/vectors",
    topics: ["الكميات القياسية والمتجهة", "جمع المتجهات", "طرح المتجهات", "تحليل المتجهات"],
  },
  {
    id: "motion",
    title: "الحركة",
    subtitle: "Motion",
    description: "استكشف الحركة في بُعد واحد وبُعدين، السرعة، التسارع، والإزاحة",
    icon: Move,
    color: "#f97316",
    bgColor: "from-[#f97316]/10 to-[#f97316]/5",
    image: "/images/hero-motion.png",
    path: "/motion",
    topics: ["الحركة في بُعد واحد", "السرعة والتسارع", "الحركة في بُعدين", "حركة المقذوفات"],
  },
  {
    id: "forces",
    title: "القوى",
    subtitle: "Forces",
    description: "اكتشف قوانين نيوتن للحركة، القصور الذاتي، والفعل ورد الفعل",
    icon: Zap,
    color: "#10b981",
    bgColor: "from-[#10b981]/10 to-[#10b981]/5",
    image: "/images/hero-forces.png",
    path: "/forces",
    topics: ["قانون نيوتن الأول", "قانون نيوتن الثاني", "قانون نيوتن الثالث", "تطبيقات القوى"],
  },
];

const features = [
  {
    icon: Play,
    title: "محاكاة تفاعلية",
    description: "تجارب افتراضية تفاعلية لفهم المفاهيم الفيزيائية",
  },
  {
    icon: BookOpen,
    title: "ملخصات شاملة",
    description: "ملخصات مبسطة لجميع الدروس والمفاهيم الأساسية",
  },
  {
    icon: Sparkles,
    title: "خرائط ذهنية",
    description: "خرائط ذهنية تربط المفاهيم ببعضها لتسهيل الفهم",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10b981]/10 text-[#10b981] text-sm font-medium mb-6">
                <Sparkles size={16} />
                <span>الصف العاشر - الفصل الأول</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#1e3a5f] leading-tight mb-6">
                تعلّم الفيزياء
                <br />
                <span className="gradient-text">بطريقة تفاعلية</span>
              </h1>
              
              <p className="text-lg text-[#1e3a5f]/70 mb-8 max-w-lg">
                اكتشف عالم الفيزياء من خلال محاكاة تفاعلية، ملخصات شاملة، وخرائط ذهنية 
                تساعدك على فهم المفاهيم بسهولة ومتعة.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/vectors">
                  <Button size="lg" className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-xl px-8">
                    ابدأ التعلم
                    <ArrowRight className="mr-2 rotate-180" size={20} />
                  </Button>
                </Link>
                <Link href="/mindmaps">
                  <Button size="lg" variant="outline" className="rounded-xl px-8 border-[#1e3a5f]/20 text-[#1e3a5f]">
                    الخرائط الذهنية
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#10b981]/20 rounded-full blur-3xl blob-animate" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#f97316]/20 rounded-full blur-3xl blob-animate" style={{ animationDelay: '2s' }} />
              
              <img
                src="/images/hero-main.png"
                alt="Physics Simulation"
                className="relative z-10 w-full rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-[#1e3a5f] mb-4">
              مميزات التطبيق
            </h2>
            <p className="text-[#1e3a5f]/60 max-w-2xl mx-auto">
              أدوات متكاملة لمساعدتك في فهم واستيعاب مادة الفيزياء
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#faf8f5] rounded-2xl p-8 card-hover"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#10b981] flex items-center justify-center mb-6">
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-display font-bold text-[#1e3a5f] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#1e3a5f]/60">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Units Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-display font-bold text-[#1e3a5f] mb-4">
              الوحدات الدراسية
            </h2>
            <p className="text-[#1e3a5f]/60 max-w-2xl mx-auto">
              ثلاث وحدات شاملة تغطي أساسيات الفيزياء للصف العاشر
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {units.map((unit, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Link href={unit.path}>
                  <div className="group bg-white rounded-3xl overflow-hidden shadow-lg card-hover cursor-pointer h-full">
                    <div className={`relative h-48 bg-gradient-to-br ${unit.bgColor} overflow-hidden`}>
                      <img
                        src={unit.image}
                        alt={unit.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: unit.color }}
                        >
                          <unit.icon className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-display font-bold text-[#1e3a5f]">
                          {unit.title}
                        </h3>
                        <span className="text-sm text-[#1e3a5f]/40 font-medium">
                          {unit.subtitle}
                        </span>
                      </div>
                      
                      <p className="text-[#1e3a5f]/60 mb-4">
                        {unit.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {unit.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${unit.color}15`,
                              color: unit.color 
                            }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1e3a5f] to-[#10b981] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              هل أنت مستعد لاستكشاف عالم الفيزياء؟
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              ابدأ رحلتك التعليمية الآن واكتشف المفاهيم الفيزيائية بطريقة ممتعة وتفاعلية
            </p>
            <Link href="/vectors">
              <Button size="lg" className="bg-white text-[#1e3a5f] hover:bg-white/90 rounded-xl px-8">
                ابدأ الآن
                <ArrowRight className="mr-2 rotate-180" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#10b981] flex items-center justify-center">
                <span className="text-white font-bold text-sm">ف</span>
              </div>
              <span className="font-display font-bold text-[#1e3a5f]">
                محاكي الفيزياء
              </span>
            </div>
            <p className="text-sm text-[#1e3a5f]/50">
              الصف العاشر - الفصل الدراسي الأول
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
