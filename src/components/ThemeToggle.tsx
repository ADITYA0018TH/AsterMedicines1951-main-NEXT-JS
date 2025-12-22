"use client";

import React, { useEffect, useState } from "react";

import { useThemeAnimation } from "../hooks/use-theme-animation";
import { useTheme } from "next-themes";
import { Theme } from "../types/theme";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { toggleTheme, resolvedTheme, ref } = useThemeAnimation({
    theme: theme as Theme,
    onThemeChange: (t) => setTheme(t),
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="[--toggle-size:10px] [--container-width:5.625em] [--container-height:2.5em] [--container-radius:6.25em] [--container-light-bg:#3D7EAE] [--container-night-bg:#1D1F2C] [--circle-container-diameter:3.375em] [--sun-moon-diameter:2.125em] [--sun-bg:#ECCA2F] [--moon-bg:#C4C9D1] [--spot-color:#959DB1] [--circle-container-offset:calc((var(--circle-container-diameter)-var(--container-height))/2*-1)] [--stars-color:#fff] [--clouds-color:#F3FDFF] [--back-clouds-color:#AACADF] [--transition:.5s_cubic-bezier(0,-0.02,0.4,1.25)] [--circle-transition:.3s_cubic-bezier(0,-0.02,0.35,1.17)] text-[length:var(--toggle-size)]" style={{ viewTransitionName: "theme-toggle" } as React.CSSProperties}>
      <label className="block text-[length:var(--toggle-size)] m-0 p-0 box-border">
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          type="checkbox"
          className="hidden"
          checked={isDark}
          onChange={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        />
        <div className={`w-[var(--container-width)] h-[var(--container-height)] bg-[var(--container-light-bg)] rounded-[var(--container-radius)] overflow-hidden cursor-pointer shadow-[0em_-0.062em_0.062em_rgba(0,0,0,0.25),0em_0.062em_0.125em_rgba(255,255,255,0.94)] transition-[background-color] duration-500 ease-elastic-toggle relative before:content-[''] before:absolute before:inset-0 before:z-[1] before:shadow-[0em_0.05em_0.187em_rgba(0,0,0,0.25)_inset,0em_0.05em_0.187em_rgba(0,0,0,0.25)_inset] before:rounded-[var(--container-radius)] ${isDark ? '!bg-[var(--container-night-bg)]' : ''}`}>

          {/* Clouds */}
          <div className={`w-[1.25em] h-[1.25em] bg-[var(--clouds-color)] rounded-[var(--container-radius)] absolute bottom-[-0.625em] left-[0.312em] shadow-[0.937em_0.312em_var(--clouds-color),-0.312em_-0.312em_var(--back-clouds-color),1.437em_0.375em_var(--clouds-color),0.5em_-0.125em_var(--back-clouds-color),2.187em_0_var(--clouds-color),1.25em_-0.062em_var(--back-clouds-color),2.937em_0.312em_var(--clouds-color),2em_-0.312em_var(--back-clouds-color),3.625em_-0.062em_var(--clouds-color),2.625em_0em_var(--back-clouds-color),4.5em_-0.312em_var(--clouds-color),3.375em_-0.437em_var(--back-clouds-color),4.625em_-1.75em_0_0.437em_var(--clouds-color),4em_-0.625em_var(--back-clouds-color),4.125em_-2.125em_0_0.437em_var(--back-clouds-color)] transition-all duration-500 ease-elastic-toggle ${isDark ? '!bottom-[-4.062em]' : ''}`}></div>

          {/* Stars */}
          <div className={`absolute text-[var(--stars-color)] top-[-100%] left-[0.312em] w-[2.75em] h-auto transition-all duration-500 ease-elastic-toggle ${isDark ? '!top-1/2 -translate-y-1/2' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"></path>
            </svg>
          </div>

          <div className={`w-[var(--circle-container-diameter)] h-[var(--circle-container-diameter)] bg-[rgba(255,255,255,0.1)] absolute left-[var(--circle-container-offset)] top-[var(--circle-container-offset)] rounded-[var(--container-radius)] shadow-[inset_0_0_0_3.375em_rgba(255,255,255,0.1),inset_0_0_0_3.375em_rgba(255,255,255,0.1),0_0_0_0.625em_rgba(255,255,255,0.1),0_0_0_1.25em_rgba(255,255,255,0.1)] flex transition-all duration-300 ease-elastic-circle pointer-events-none hover:left-[calc(var(--circle-container-offset)+0.187em)] ${isDark ? '!left-[calc(100%-var(--circle-container-offset)-var(--circle-container-diameter))] hover:!left-[calc(100%-var(--circle-container-offset)-var(--circle-container-diameter)-0.187em)]' : ''}`}>

            <div className={`pointer-events-auto relative z-[2] w-[var(--sun-moon-diameter)] h-[var(--sun-moon-diameter)] m-auto rounded-[var(--container-radius)] bg-[var(--sun-bg)] shadow-[0.062em_0.062em_0.062em_0em_rgba(254,255,239,0.61)_inset,0em_-0.062em_0.062em_0em_#a1872a_inset] drop-shadow-[0.062em_0.125em_0.125em_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-500 ease-elastic-toggle`}>

              <div className={`translate-x-full w-full h-full bg-[var(--moon-bg)] rounded-[inherit] shadow-[0.062em_0.062em_0.062em_0em_rgba(254,255,239,0.61)_inset,0em_-0.062em_0.062em_0em_#969696_inset] transition-transform duration-500 ease-elastic-toggle relative ${isDark ? '!translate-x-0' : ''}`}>
                <div className="absolute top-[0.75em] left-[0.312em] w-[0.75em] h-[0.75em] rounded-[var(--container-radius)] bg-[var(--spot-color)] shadow-[0em_0.0312em_0.062em_rgba(0,0,0,0.25)_inset]"></div>
                <div className="absolute top-[0.937em] left-[1.375em] w-[0.375em] h-[0.375em] rounded-[var(--container-radius)] bg-[var(--spot-color)] shadow-[0em_0.0312em_0.062em_rgba(0,0,0,0.25)_inset]"></div>
                <div className="absolute top-[0.312em] left-[0.812em] w-[0.25em] h-[0.25em] rounded-[var(--container-radius)] bg-[var(--spot-color)] shadow-[0em_0.0312em_0.062em_rgba(0,0,0,0.25)_inset]"></div>
              </div>

            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ThemeToggle;
