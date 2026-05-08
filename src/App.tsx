import { useState, useRef, useEffect } from "react";
import { ChefHat, Utensils, Clock, ThumbsUp, Trash2, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { getRecipeRecommendation } from "./services/geminiService";
import { cn } from "./lib/utils";

export default function App() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const result = await getRecipeRecommendation(ingredients);
      setRecipe(result || "Maaf, koki belum bisa kasih ide resep nih.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIngredients("");
    setRecipe(null);
    setError(null);
  };

  useEffect(() => {
    if (recipe && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  return (
    <div className="min-h-screen font-sans bg-vibrant-bg text-vibrant-dark p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Header SECTION */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 0, scale: 1.1 }}
              initial={{ rotate: 3 }}
              className="w-14 h-14 md:w-16 md:h-16 bg-vibrant-primary rounded-2xl flex items-center justify-center shadow-lg cursor-pointer transition-transform"
            >
              <span className="text-3xl">🍳</span>
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-vibrant-dark tracking-tight uppercase leading-none">DAPURALGHIAI</h1>
              <p className="text-slate-500 font-medium text-sm md:text-base">Asisten Masak Rumahanmu ✨</p>
            </div>
          </div>
          <div className="hidden sm:flex bg-white px-5 py-2.5 rounded-full shadow-sm border-2 border-vibrant-secondary items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-vibrant-dark font-black text-xs uppercase tracking-wider">Siap Membantu!</span>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Input & Info */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 md:p-8 rounded-[32px] shadow-xl border-b-8 border-vibrant-secondary"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-vibrant-primary uppercase mb-3 tracking-[0.2em]">
                    Bahan yang kamu punya:
                  </label>
                  <div className="relative">
                    <textarea
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="Contoh: telur, nasi sisa semalam, kecap sachet..."
                      className="w-full h-32 md:h-48 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-vibrant-secondary focus:ring-0 outline-none transition-all resize-none text-vibrant-dark placeholder:text-slate-300 font-medium"
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                       {ingredients && (
                        <button
                          type="button"
                          onClick={handleReset}
                          className="p-2 rounded-lg bg-white text-slate-400 hover:text-vibrant-primary shadow-sm border border-slate-100 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !ingredients.trim()}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] uppercase tracking-wider text-sm",
                    isLoading || !ingredients.trim() 
                      ? "bg-slate-200 shadow-none cursor-not-allowed" 
                      : "bg-vibrant-green hover:bg-[#5a9641] shadow-[#6ab04c]/20"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Lagi Racik Resep...
                    </>
                  ) : (
                    <>
                      <Utensils size={18} />
                      Cari Ide Masak! 🚀
                    </>
                  )}
                </button>
              </form>
            </motion.section>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-vibrant-indigo p-6 rounded-3xl text-white shadow-xl lg:flex-1"
            >
              <h3 className="font-black mb-3 flex items-center gap-2 italic text-lg decoration-vibrant-secondary underline decoration-2 underline-offset-4">
                Tips Hemat! 💡
              </h3>
              <p className="text-sm leading-relaxed text-indigo-50 font-medium italic">
                "Kalo lagi tanggal tua, maksimalkan bahan yang ada. Nggak perlu topping mahal, bumbu dasar yang pas udah bikin masakan juara!"
              </p>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Result */}
          <div className="lg:col-span-8 h-full flex flex-col">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="bg-white rounded-[40px] border-4 border-vibrant-dark p-12 flex flex-col items-center justify-center h-full min-h-[400px]"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 border-4 border-vibrant-secondary border-t-vibrant-primary rounded-full mb-6 shadow-inner"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">🔥</div>
                  </div>
                  <h3 className="text-xl font-black text-vibrant-dark uppercase tracking-widest mb-2">Chef lagi mikir...</h3>
                  <p className="text-slate-400 font-medium">Bahan kamu lagi diolah jadi resep mantap!</p>
                </motion.div>
              ) : recipe ? (
                <motion.section
                  key="recipe"
                  ref={resultRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[40px] shadow-2xl p-8 md:p-10 border-4 border-vibrant-dark flex flex-col h-full overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="bg-vibrant-primary px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest">Resep Spesial</span>
                         <span className="bg-vibrant-secondary px-3 py-1 rounded-lg text-vibrant-dark text-[10px] font-black uppercase tracking-widest">Anak Kos</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-vibrant-dark leading-tight md:tracking-tight mb-4">
                        🍽️ Hasil Olahan AI
                      </h2>
                    </div>
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-[#FAB1A0] flex items-center justify-center flex-shrink-0 border-4 border-white shadow-xl -rotate-2">
                      <span className="text-5xl md:text-6xl">🍛</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                    <div className="prose prose-slate prose-headings:font-black prose-headings:text-vibrant-dark prose-headings:uppercase prose-headings:tracking-wider prose-h2:text-sm prose-p:text-vibrant-dark prose-p:font-medium prose-li:text-vibrant-dark prose-li:font-medium max-w-none">
                      <ReactMarkdown>{recipe}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-bold text-slate-400 italic bg-slate-50 px-4 py-2 rounded-full uppercase tracking-tighter">
                      Resep ini disesuaikan dengan bahan kamu
                    </p>
                    <button 
                      onClick={() => window.print()}
                      className="w-full sm:w-auto bg-vibrant-indigo hover:bg-slate-800 text-white font-black py-3 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-sm uppercase tracking-wider"
                    >
                      SIMPAN RESEP 💾
                    </button>
                  </div>
                </motion.section>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/40 rounded-[40px] border-4 border-dashed border-slate-200 h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-2 border-slate-100 italic font-black text-4xl text-slate-200">?</div>
                  <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-2 font-black leading-none">Belum Ada Masakan</h3>
                  <p className="text-slate-300 max-w-xs font-medium italic">Masukkan bahan di sebelah kiri buat dapetin resep pertama kamu!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="mt-12 py-6 border-t border-vibrant-secondary/30 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">DAPURALGHIAI • Masak Gak Harus Ribet • 2024</p>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FF6B6B;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4834D4;
        }
      `}</style>
    </div>
  );
}


