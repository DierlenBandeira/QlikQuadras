"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 3000) // Redireciona após 3 segundos

    return () => clearTimeout(timer)
  }, [router])

  const handleSkip = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-accent rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 border-2 border-accent rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-accent rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 border-2 border-accent rounded-full"></div>
      </div>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Clik%20Quadras%20em%20Azul%20Marinho%20%281%29-ygObWxFy9FNoxP0gfnVOkZA3Uc8Gn3.png"
            alt="Clik Quadras Logo"
            width={300}
            height={200}
            className="drop-shadow-2xl animate-pulse-slow"
            priority
          />
        </div>

        {/* Loading Animation */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>

        {/* Tagline */}
        <p className="text-background text-lg font-medium text-center max-w-md px-4 animate-fade-in-up">
          Reserve sua quadra com apenas um clique
        </p>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 text-background/70 hover:text-background transition-colors duration-200 text-sm font-medium"
      >
        Pular →
      </button>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.5s both;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
