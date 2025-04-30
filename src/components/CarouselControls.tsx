"use client";

interface CarouselControlsProps {
  totalSlides: number;
  currentIndex: number;
}

export function CarouselControls({ totalSlides, currentIndex}: CarouselControlsProps) {
  return (
    <div className="flex justify-center items-center mt-4 space-x-2 z-20 relative">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div key={index} className="relative flex items-center">
          <div
            className={`w-4 h-4 rounded-full ml-2 ${
              currentIndex === index ? "bg-primary-foreground" : "bg-transparent border-2 border-primary-foreground"
            }`}
          ></div>

          {(currentIndex + 1 === index && currentIndex !== 4) && (
            <div className="absolute left-[-7px] top-1/2 transform -translate-y-1/2 h-[2px] bg-primary-foreground animate-slide-in"></div>
          )}
        </div>
      ))}
      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0;
          }
          to {
            width: 12px;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards; 
        }
      `}</style>
    </div>
  );
}
