import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, ArrowRight, Zap, Move, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "الرئيسية", icon: Home },
  { path: "/vectors", label: "المتجهات", icon: ArrowRight },
  { path: "/motion", label: "الحركة", icon: Move },
  { path: "/forces", label: "القوى", icon: Zap },
  { path: "/mindmaps", label: "الخرائط الذهنية", icon: BookOpen },
];

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#10b981] flex items-center justify-center">
                <span className="text-white font-bold text-lg">ف</span>
              </div>
              <span className="font-display font-bold text-lg text-[#1e3a5f] hidden sm:block">
                محاكي الفيزياء
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#1e3a5f] text-white"
                        : "text-[#1e3a5f]/70 hover:bg-[#1e3a5f]/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#1e3a5f] text-white"
                          : "text-[#1e3a5f]/70 hover:bg-[#1e3a5f]/10"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
