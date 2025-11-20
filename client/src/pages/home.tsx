import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useLocation, useSearch } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Link as LinkIcon, Image as ImageIcon, ArrowLeft, Sparkles, Upload, Wand2, Music, Pause, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import cakeImage from "@assets/generated_images/cute_3d_birthday_cake.png";

const PREDEFINED_WISHES = [
  "Hope your day is filled with joy, laughter, and lots of cake! 🎂✨",
  "Wishing you a day that is as special in every way as you are! 🌟",
  "Cheers to another trip around the sun! Keep shining bright! ☀️",
  "May this year bring you endless happiness and amazing adventures! 🚀",
  "Happy Birthday! May all your dreams come true this year! 🌠",
  "Sending you a universe of good vibes on your special day! 🪐",
  "Wishing you the happiest of birthdays and a fantastic year ahead! 🎉",
  "Hope your birthday is as awesome as you are! 🎸",
  "Eat cake, celebrate, and enjoy your special day! 🍰",
  "May your day be filled with love, laughter, and unforgettable moments! ❤️"
];

const HINDI_SONGS = [
  {
    title: "Classic Happy Birthday (Mohammad Rafi)",
    url: "https://archive.org/download/BestBirthdaySongsHindi/MOHAMMAD%20RAFI%20-%20HAPPY%20BIRTHDAY%20TO%20YOU%20-%20EK%20PHOOL%20DO%20MALI%201969.mp3"
  },
  {
    title: "Happy Birthday (Udit Narayan)",
    url: "https://archive.org/download/BestBirthdaySongsHindi/Teri%20Hasi%20Mein%20%28Happy%20Birthday%20To%20You%29%20Udit%20Narayan%20Rare%20Song%20To%20Neelesh.mp3"
  },
  {
    title: "Funny Teddy Bear Song",
    url: "https://archive.org/download/BestBirthdaySongsHindi/Life%20Bekar%20Hai-Cute%20Teddy%20Bear%20Singing%20Funny%20Hindi%20Song%20Lyrics.mp3"
  },
  {
    title: "Happy Birthday Instrumental",
    url: "https://archive.org/download/BestBirthdaySongsHindi/Happy%20Birthday.mp3"
  },
  {
    title: "Romantic Birthday Song",
    url: "https://archive.org/download/BestBirthdaySongsHindi/Romantic%20Happy%20Birthday%20Song.mp3"
  }
];

export default function Home() {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  
  // Default state
  const [name, setName] = useState("");
  const [message, setMessage] = useState(PREDEFINED_WISHES[0]);
  const [imageSrc, setImageSrc] = useState(cakeImage);
  const [isViewMode, setIsViewMode] = useState(false);
  
  // Interaction state
  const [wished, setWished] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(HINDI_SONGS[0]);

  // Initialize from URL params
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const pName = params.get("name");
    const pMessage = params.get("message");
    const pImage = params.get("image");

    if (pName || pMessage || pImage) {
      setIsViewMode(true);
      if (pName) setName(pName);
      if (pMessage) setMessage(pMessage);
      if (pImage) setImageSrc(pImage);
    }
  }, [searchString]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
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
      playRandomSong(); // Auto play song on wish!
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageSrc(result);
        toast({
          title: "Image Uploaded! 📸",
          description: "Your custom image has been added to the card.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomWish = () => {
    const randomWish = PREDEFINED_WISHES[Math.floor(Math.random() * PREDEFINED_WISHES.length)];
    setMessage(randomWish);
    toast({
      title: "Magic! ✨",
      description: "A new wish has been generated for you.",
      duration: 2000,
    });
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed:", e);
          toast({
            variant: "destructive",
            title: "Playback Error",
            description: "Could not play audio. Please check your device settings.",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playRandomSong = () => {
    // Pick a random song different from current if possible
    let nextSongIndex = Math.floor(Math.random() * HINDI_SONGS.length);
    if (HINDI_SONGS.length > 1 && HINDI_SONGS[nextSongIndex].url === currentSong.url) {
      nextSongIndex = (nextSongIndex + 1) % HINDI_SONGS.length;
    }
    
    const nextSong = HINDI_SONGS[nextSongIndex];
    setCurrentSong(nextSong);
    
    // Need to wait for state update or just set src directly
    if (audioRef.current) {
      audioRef.current.src = nextSong.url;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        toast({
          title: "Now Playing 🎵",
          description: nextSong.title,
        });
      }).catch(e => {
        console.error("Audio playback failed:", e);
      });
    }
  };

  const generateLink = () => {
    // Check if image is a data URL (uploaded file)
    if (imageSrc.startsWith("data:")) {
      toast({
        variant: "destructive",
        title: "Cannot Share Uploaded Image",
        description: "Uploaded images are too large to share via link. Please use an Image URL instead for sharing.",
      });
      return;
    }

    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (message) params.set("message", message);
    if (imageSrc !== cakeImage) params.set("image", imageSrc);
    
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    setGeneratedLink(url);
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied! 🎉",
      description: "Share this link with your friend to surprise them!",
    });
  };

  const resetToCreator = () => {
    setIsViewMode(false);
    setGeneratedLink("");
    setLocation("/");
    // Stop music when going back
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!isViewMode) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-sky-50 flex items-center justify-center p-4 font-sans">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-pink-500 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Create a Birthday Card
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Friend's Name (Optional)</Label>
              <Input 
                id="name" 
                placeholder="e.g. Sarah" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="message">Message</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={generateRandomWish}
                  className="h-6 px-2 text-xs text-pink-500 hover:text-pink-600 hover:bg-pink-50"
                  title="Generate random wish"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Auto-Generate
                </Button>
              </div>
              <Textarea 
                id="message" 
                placeholder="Write your wish here..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input 
                    id="image" 
                    placeholder="https://example.com/photo.jpg" 
                    value={imageSrc.startsWith("data:") ? "" : (imageSrc === cakeImage ? "" : imageSrc)} 
                    onChange={(e) => setImageSrc(e.target.value || cakeImage)} 
                    disabled={imageSrc.startsWith("data:")}
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Image"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                {imageSrc.startsWith("data:") && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 flex items-center gap-2">
                     <span>⚠️ Uploaded images are for local preview only and cannot be shared via link.</span>
                     <Button variant="link" size="sm" className="h-auto p-0 text-amber-700" onClick={() => setImageSrc(cakeImage)}>Clear</Button>
                  </div>
                )}
                {!imageSrc.startsWith("data:") && (
                  <p className="text-xs text-slate-500">
                    Use an Image URL to share custom photos, or upload for local preview.
                  </p>
                )}
              </div>
            </div>

            <Button onClick={generateLink} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold">
              <LinkIcon className="w-4 h-4 mr-2" />
              Generate & Copy Link
            </Button>

            {generatedLink && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-green-50 text-green-700 rounded-lg text-sm break-all border border-green-100"
              >
                {generatedLink}
              </motion.div>
            )}

            <div className="relative my-4">
               <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Preview</span></div>
            </div>

            <Button variant="secondary" onClick={() => setIsViewMode(true)} className="w-full">
              Preview Card
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // View Mode (The Card)
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 to-sky-50 flex items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentSong.url} onEnded={() => setIsPlaying(false)} />

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
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden relative">
          {/* Back Button for Creator context */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 z-20"
            onClick={resetToCreator}
            title="Create your own"
          >
            <Sparkles className="w-4 h-4" />
          </Button>

          <CardContent className="p-8 flex flex-col items-center text-center gap-6">
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100 to-pink-100 rounded-full blur-xl opacity-60 animate-pulse" />
              <img 
                src={imageSrc} 
                alt="Birthday Visual" 
                className="w-48 h-48 object-cover rounded-2xl shadow-sm relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500 bg-white"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = cakeImage; 
                }}
                data-testid="img-cake"
              />
              {/* Music Control Overlay on Image */}
              <div className="absolute bottom-2 right-2 z-20">
                 <Button 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-pink-500 shadow-md"
                    onClick={togglePlay}
                    title={isPlaying ? "Pause Music" : "Play Music"}
                 >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                 </Button>
              </div>
            </motion.div>

            <div className="space-y-2">
              <motion.h1 
                className="text-5xl md:text-6xl font-['Pacifico'] text-pink-500 drop-shadow-sm leading-tight"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                data-testid="text-header"
              >
                Happy Birthday {name ? name : ""}!
              </motion.h1>
              <motion.p 
                className="text-lg text-slate-600 font-medium leading-relaxed whitespace-pre-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                data-testid="text-message"
              >
                {message}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="w-full pt-2 space-y-3"
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
              
              <Button 
                variant="outline"
                onClick={playRandomSong}
                className="w-full h-10 text-sm font-medium text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
              >
                <Music className="w-4 h-4 mr-2" />
                Play Another Song
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
