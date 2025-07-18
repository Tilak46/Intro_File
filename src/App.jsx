import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const words = ["Tilak", "Boss 😎", "React Pro 🚀", "Code Master 💻"];

export default function App() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [letterIndex, setLetterIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const word = words[index % words.length];
    if (letterIndex < word.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + word[letterIndex]);
        setLetterIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setText("");
        setLetterIndex(0);
        setIndex((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [letterIndex, index]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    const spawnParticle = (x, y) => {
      for (let i = 0; i < 5; i++) {
        particles.push({
          x,
          y,
          radius: Math.random() * 2 + 1,
          alpha: 1,
          dx: Math.random() * 2 - 1,
          dy: Math.random() * 2 - 1,
          color: `hsl(${Math.random() * 360}, 100%, 70%)`,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) particles.splice(i, 1);
        else {
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      });
      requestAnimationFrame(animate);
    };

    const mouseMove = (e) => spawnParticle(e.clientX, e.clientY);
    window.addEventListener("mousemove", mouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.body.removeChild(canvas);
    };
  }, []);

  const handlePlayMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play();
    }
  };

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-sky-800 via-indigo-700 to-purple-800 text-white transition-colors duration-500 dark:from-gray-900 dark:via-gray-800 dark:to-black"
      onClick={handlePlayMusic}
    >
      <audio ref={audioRef} src="../public/bgaudio.mp3 " />

      {/* ✨ Animated floating emojis */}
      <motion.div
        className="absolute left-10 top-10 text-4xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute right-16 top-20 text-3xl"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        💫
      </motion.div>
      <motion.div
        className="absolute bottom-16 left-20 text-5xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        🚀
      </motion.div>

      {/* 👋 Typewriter Title */}
      <motion.h1
        className="text-center text-5xl font-extrabold drop-shadow-xl md:text-6xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Hello, <span className="text-yellow-300">{text}</span>
        <span className="ml-1 animate-ping">|</span>
      </motion.h1>

      {/* ⚡ Animated Button */}
      <motion.button
        className="absolute bottom-24 mt-12 rounded-2xl bg-white px-8 py-3 text-lg font-semibold text-purple-700 shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95 dark:bg-gray-100 dark:text-black"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => alert("Let’s Build Something Awesome 💥")}
      >
        Let’s Build!
      </motion.button>
    </div>
  );
}
