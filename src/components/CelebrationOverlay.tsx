import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useToast } from "@/hooks/use-toast";

interface CelebrationOverlayProps {
  message: string;
}

export const CelebrationOverlay = ({ message }: CelebrationOverlayProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once

  return showConfetti ? (
    <div className="fixed inset-0 pointer-events-none z-50">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 px-8 py-4 rounded-lg shadow-lg animate-scale-in">
          <h2 className="text-2xl font-bold text-primary">{message}</h2>
        </div>
      </div>
    </div>
  ) : null;
};