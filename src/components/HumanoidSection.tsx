
import React, { useEffect, useRef, useState } from "react";

const PharmaceuticalSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  // More responsive timing function with shorter duration
  const cardStyle = {
    height: '60vh',
    maxHeight: '600px',
    borderRadius: '20px',
    transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
    willChange: 'transform, opacity'
  };

  useEffect(() => {
    // Create intersection observer to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 } // Start observing when 10% of element is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Optimized scroll handler using requestAnimationFrame
    const handleScroll = () => {
      if (!ticking.current) {
        lastScrollY.current = window.scrollY;

        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;

          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const totalScrollDistance = viewportHeight * 2;

          // Calculate the scroll progress
          let progress = 0;
          if (sectionRect.top <= 0) {
            progress = Math.min(1, Math.max(0, Math.abs(sectionRect.top) / totalScrollDistance));
          }

          // Determine which card should be visible based on progress
          if (progress >= 0.66) {
            setActiveCardIndex(2);
          } else if (progress >= 0.33) {
            setActiveCardIndex(1);
          } else {
            setActiveCardIndex(0);
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Card visibility based on active index instead of direct scroll progress
  const isFirstCardVisible = isIntersecting;
  const isSecondCardVisible = activeCardIndex >= 1;
  const isThirdCardVisible = activeCardIndex >= 2;

  return (
    <div
      ref={sectionRef}
      className="relative animate-on-scroll opacity-0"
      style={{ height: '300vh' }}
    >
      <section className="w-full h-screen py-10 md:py-16 sticky top-0 overflow-hidden bg-white dark:bg-black" id="why-pharmaceutical">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pulse-100/20 via-transparent to-transparent dark:from-pulse-900/10"></div>
        </div>
        <div className="container px-6 lg:px-8 mx-auto h-full flex flex-col">
          <div className="mb-2 md:mb-3">
            <div className="flex items-center gap-4 mb-2 md:mb-2 pt-8 sm:pt-6 md:pt-4">
              <div className="pulse-chip opacity-0 animate-fade-in" style={{
                animationDelay: "0.1s"
              }}>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">02</span>
                <span>Manufacturing</span>
              </div>
            </div>

            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-1 md:mb-2">
              Why Aster
            </h2>
          </div>

          <div ref={cardsContainerRef} className="relative flex-1 perspective-1000">
            {/* First Card */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-2xl rounded-[2rem] border border-white/20 dark:border-white/10 ${isFirstCardVisible ? 'animate-card-enter' : ''}`}
              style={{
                ...cardStyle,
                zIndex: 10,
                transform: `translateY(${isFirstCardVisible ? '4rem' : '15rem'}) scale(0.92)`,
                opacity: isFirstCardVisible ? 0.6 : 0,
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 z-10"></div> {/* Glass layer */}
              <div
                className="absolute inset-0 z-0 opacity-80"
                style={{
                  backgroundImage: "url('/background-section1.webp')",
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                }}
              ></div>

              <div className="absolute top-6 right-6 z-30">
                <div className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md text-slate-900 dark:text-white border border-white/20 shadow-lg">
                  <span className="text-xs font-semibold tracking-wider uppercase">Our Vision</span>
                </div>
              </div>

              <div className="relative z-20 p-8 sm:p-12 h-full flex flex-col justify-end">
                <div className="max-w-2xl">
                  <h3 className="text-4xl sm:text-5xl md:text-6xl font-display text-slate-900 dark:text-white font-bold leading-tight mb-6">
                    Advancing healthcare through <span className="text-pulse-600 dark:text-pulse-500">precision medicine</span>
                  </h3>
                </div>
              </div>
            </div>

            {/* Second Card */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-2xl rounded-[2rem] border border-white/20 dark:border-white/10 ${isSecondCardVisible ? 'animate-card-enter' : ''}`}
              style={{
                ...cardStyle,
                zIndex: 20,
                transform: `translateY(${isSecondCardVisible ? activeCardIndex === 1 ? '7rem' : '4rem' : '20rem'}) scale(0.96)`,
                opacity: isSecondCardVisible ? 1 : 0,
                pointerEvents: isSecondCardVisible ? 'auto' : 'none',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 z-10 transition-opacity duration-500"></div>

              <div
                className="absolute inset-0 z-0 opacity-80"
                style={{
                  backgroundImage: "url('/background-section2.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              <div className="absolute top-6 right-6 z-30">
                <div className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md text-slate-900 dark:text-white border border-white/20 shadow-lg">
                  <span className="text-xs font-semibold tracking-wider uppercase">Our Mission</span>
                </div>
              </div>

              <div className="relative z-20 p-8 sm:p-12 h-full flex flex-col justify-end">
                <div className="max-w-2xl">
                  <h3 className="text-4xl sm:text-5xl md:text-6xl font-display text-slate-900 dark:text-white font-bold leading-tight mb-6">
                    Global solutions for <br /> <span className="text-blue-600 dark:text-blue-400">global healthcare</span>
                  </h3>
                </div>
              </div>
            </div>

            {/* Third Card */}
            <div
              className={`absolute inset-0 overflow-hidden shadow-2xl rounded-[2rem] border border-white/20 dark:border-white/10 ${isThirdCardVisible ? 'animate-card-enter' : ''}`}
              style={{
                ...cardStyle,
                zIndex: 30,
                transform: `translateY(${isThirdCardVisible ? activeCardIndex === 2 ? '10rem' : '0' : '25rem'}) scale(1)`,
                opacity: isThirdCardVisible ? 1 : 0,
                pointerEvents: isThirdCardVisible ? 'auto' : 'none',
              }}
            >
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-10"></div>

              <div
                className="absolute inset-0 z-0 opacity-80"
                style={{
                  backgroundImage: "url('/background-section3.webp')",
                  backgroundSize: "cover",
                  backgroundPosition: "bottom center",
                }}
              ></div>

              <div className="absolute top-6 right-6 z-30">
                <div className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md text-slate-900 dark:text-white border border-white/20 shadow-lg">
                  <span className="text-xs font-semibold tracking-wider uppercase">Our Promise</span>
                </div>
              </div>

              <div className="relative z-20 p-8 sm:p-12 h-full flex flex-col justify-end">
                <div className="max-w-2xl">
                  <h3 className="text-4xl sm:text-5xl md:text-6xl font-display text-slate-900 dark:text-white font-bold leading-tight mb-6">
                    Life-saving medicines, <br /> <span className="text-[#FC4D0A] relative inline-block">
                      not just products
                      <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#FC4D0A]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <line x1="0" y1="5" x2="100" y2="5" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PharmaceuticalSection;
