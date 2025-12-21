export type Theme = 'light' | 'dark' | 'system'

export enum ThemeAnimationType {
  CIRCLE = 'circle',
  BLUR_CIRCLE = 'blur-circle',
  SLIDE = 'slide',
}

export interface UseThemeAnimationProps {
  duration?: number
  easing?: string
  animationType?: ThemeAnimationType
  blurAmount?: number
  styleId?: string
  
  themes?: Theme[]
  colorThemes?: string[]
  defaultTheme?: Theme
  defaultColorTheme?: string
  
  globalClassName?: string
  colorThemePrefix?: string
  
  storageKey?: string
  colorStorageKey?: string
  
  theme?: Theme
  colorTheme?: string
  
  onThemeChange?: (theme: Theme) => void
  onColorThemeChange?: (colorTheme: string) => void
  
  slideDirection?: 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  slideFromX?: number
  slideFromY?: number
  slideToX?: number
  slideToY?: number
}

export interface UseThemeAnimationReturn {
  ref: React.RefObject<HTMLButtonElement | null>
  theme: Theme
  colorTheme: string
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  setColorTheme: (theme: string) => void
  switchTheme: (theme: Theme) => Promise<void>
  switchColorTheme: (theme: string) => void
  toggleTheme: () => Promise<void>
  toggleLightTheme: () => Promise<void>
  toggleDarkTheme: () => Promise<void>
  toggleColorTheme: () => void
  createColorThemeToggle: (theme: string) => () => void
  isColorThemeActive: (theme: string) => boolean
}
