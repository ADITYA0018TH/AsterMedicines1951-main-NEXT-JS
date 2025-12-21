import { Theme } from '../types/theme'

export const injectBaseStyles = (styleId: string = 'spaceman-theme-style') => {
  if (typeof document === 'undefined') return
  if (document.getElementById(styleId)) return

  const style = document.createElement('style')
  style.id = styleId
  style.innerHTML = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
  `
  document.head.appendChild(style)
}

export const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const supportsViewTransitions = () => {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface CircleAnimationConfig {
  x: number
  y: number
  duration: number
  easing: string
  animationType: string
  blurAmount: number
  styleId: string
  a?: number
  b?: number
}

export const createCircleAnimation = (config: CircleAnimationConfig) => {
  const { x, y, duration, easing } = config
  
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]
    },
    {
      duration,
      easing,
      pseudoElement: '::view-transition-new(root)'
    }
  )
}

export const createBlurCircleAnimation = (config: CircleAnimationConfig) => {
  const { x, y, duration, easing, blurAmount } = config
  
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ],
      filter: [`blur(${blurAmount}px)`, 'blur(0px)']
    },
    {
      duration,
      easing,
      pseudoElement: '::view-transition-new(root)'
    }
  )
}

export const createSlideAnimation = (config: CircleAnimationConfig & { x?: number; y?: number }) => {
  const { a = -100, b = 0, duration, easing } = config
  
  // Slide out old content
  document.documentElement.animate(
    {
      transform: ['translate(0, 0)', `translate(${a}%, ${b}%)`]
    },
    {
      duration,
      easing,
      pseudoElement: '::view-transition-old(root)'
    }
  )

  // Slide in new content
  document.documentElement.animate(
    {
      transform: [`translate(${-a}%, ${-b}%)`, 'translate(0, 0)']
    },
    {
      duration,
      easing,
      pseudoElement: '::view-transition-new(root)'
    }
  )
}
