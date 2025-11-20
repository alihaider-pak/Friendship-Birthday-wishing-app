import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import cakeImage from "@assets/generated_images/cute_3d_birthday_cake.png";

export default function Home() {
  const [wished, setWished] = useState(false);

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#FFC0CB", "#FF69B4", "#FFD700", "#00BFFF"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleWish = () => {
    if (!wished) {
      triggerConfetti();
      setWished(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-sky-50 flex items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Floating background elements */}
      <motion.div 
        className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full blur-2xl opacity-50"
        animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-50"
        animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8 flex flex-col items-center text-center gap-6">
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100 to-pink-100 rounded-full blur-xl opacity-60 animate-pulse" />
              <img 
                src={cakeImage} 
                alt="Birthday Cake" 
                className="w-48 h-48 object-cover rounded-2xl shadow-sm relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500"
                data-testid="img-cake"
              />
            </motion.div>

            <div className="space-y-2">
              <motion.h1 
                className="text-5xl md:text-6xl font-['Pacifico'] text-pink-500 drop-shadow-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                data-testid="text-header"
              >
                Happy Birthday!
              </motion.h1>
              <motion.p 
                className="text-lg text-slate-600 font-medium leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                data-testid="text-message"
              >
                Hope your day is filled with joy, laughter, and lots of cake! 🎂✨
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="w-full pt-2"
            >
              <Button 
                onClick={handleWish}
                className={`w-full h-12 text-lg font-bold transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1
                  ${wished 
                    ? "bg-green-400 hover:bg-green-500 text-white" 
                    : "bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white"
                  }`}
                data-testid="button-wish"
              >
                {wished ? "Yay! Wishes Sent! 🎉" : "Make a Wish ✨"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
        
        <motion.p 
          className="text-center mt-6 text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Sending you big hugs! ❤️
        </motion.p>
      </motion.div>
    </div>
  );
}
