/**
 * Modern Color Palette & Gradient System
 * RiddleX v3.0 — Math Master
 */

export const Colors = {
  // Primary palette
  primary: '#667eea',
  primaryDark: '#5a67d8',
  primaryLight: '#818cf8',
  
  // Background
  bgDark: '#0f0c29',
  bgMid: '#302b63',
  bgLight: '#24243e',
  
  // Surface (cards, containers)
  surface: 'rgba(255, 255, 255, 0.08)',
  surfaceLight: 'rgba(255, 255, 255, 0.12)',
  surfaceHover: 'rgba(255, 255, 255, 0.16)',
  
  // Glass effect
  glass: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.18)',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  textDark: '#1a1a2e',
  
  // Accent colors
  accent: '#00d2ff',
  accentGreen: '#00E676',
  accentRed: '#FF5252',
  accentYellow: '#FFD740',
  accentOrange: '#FF9100',
  accentPink: '#FF4081',
  accentPurple: '#E040FB',
  
  // Gamification
  xpGold: '#FFD700',
  coinGold: '#FFC107',
  streakFire: '#FF6D00',
  achievementBlue: '#448AFF',
  
  // Status
  correct: '#00E676',
  wrong: '#FF5252',
  warning: '#FFD740',
  info: '#40C4FF',
  
  // Tab bar
  tabActive: '#667eea',
  tabInactive: 'rgba(255, 255, 255, 0.4)',
  tabBg: '#1a1a2e',
};

export const Gradients = {
  // Main backgrounds
  screenBg: ['#0f0c29', '#302b63', '#24243e'],
  headerBg: ['#667eea', '#764ba2'],
  
  // Category gradients
  addition: ['#11998e', '#38ef7d'],
  subtraction: ['#ee0979', '#ff6a00'],
  multiplication: ['#7F00FF', '#E100FF'],
  division: ['#FC5C7D', '#6A82FB'],
  mixed: ['#f12711', '#f5af19'],
  geometry: ['#8E2DE2', '#4A00E0'],
  fractions: ['#F7971E', '#FFD200'],
  exponents: ['#e53935', '#e35d5b'],
  wordProblems: ['#56ab2f', '#a8e063'],
  logicPuzzles: ['#DA4453', '#89216B'],
  measurement: ['#00b09b', '#96c93d'],
  algebra: ['#4568DC', '#B06AB3'],
  numberPatterns: ['#0575E6', '#021B79'],
  moneyMath: ['#F09819', '#EDDE5D'],
  equations: ['#1A2980', '#26D0CE'],
  probability: ['#C33764', '#1D2671'],
  roots: ['#c0392b', '#8e44ad'],
  statistics: ['#2193b0', '#6dd5ed'],
  riddles: ['#FF416C', '#FF4B2B'],
  timeChallenge: ['#f857a6', '#ff5858'],
  
  // UI gradients
  button: ['#667eea', '#764ba2'],
  buttonSuccess: ['#11998e', '#38ef7d'],
  buttonDanger: ['#ff416c', '#ff4b2b'],
  card: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
  gold: ['#f7971e', '#ffd200'],
  coin: ['#FFD700', '#FFA000'],
  xp: ['#667eea', '#764ba2'],
  streak: ['#FF6D00', '#FF9100'],
};

export const CategoryConfig = {
  addition: { gradient: Gradients.addition, icon: 'plus', label: 'Addition', emoji: '➕' },
  subtraction: { gradient: Gradients.subtraction, icon: 'minus', label: 'Subtraction', emoji: '➖' },
  multiplication: { gradient: Gradients.multiplication, icon: 'times', label: 'Multiplication', emoji: '✖️' },
  division: { gradient: Gradients.division, icon: 'divide', label: 'Division', emoji: '➗' },
  mixed: { gradient: Gradients.mixed, icon: 'random', label: 'Mixed', emoji: '🔀' },
  geometry: { gradient: Gradients.geometry, icon: 'shapes', label: 'Geometry', emoji: '📐' },
  fractions: { gradient: Gradients.fractions, icon: 'pizza-slice', label: 'Fractions', emoji: '🍕' },
  exponents: { gradient: Gradients.exponents, icon: 'superscript', label: 'Exponents', emoji: '📈' },
  wordProblems: { gradient: Gradients.wordProblems, icon: 'comment-dots', label: 'Word Problems', emoji: '💬' },
  logicPuzzles: { gradient: Gradients.logicPuzzles, icon: 'puzzle-piece', label: 'Logic Puzzles', emoji: '🧩' },
  measurement: { gradient: Gradients.measurement, icon: 'ruler-combined', label: 'Measurement', emoji: '📏' },
  algebra: { gradient: Gradients.algebra, icon: 'cube', label: 'Algebra', emoji: '🧮' },
  numberPatterns: { gradient: Gradients.numberPatterns, icon: 'wave-square', label: 'Patterns', emoji: '🔢' },
  moneyMath: { gradient: Gradients.moneyMath, icon: 'coins', label: 'Money Math', emoji: '💰' },
  equations: { gradient: Gradients.equations, icon: 'balance-scale', label: 'Equations', emoji: '⚖️' },
  probability: { gradient: Gradients.probability, icon: 'dice', label: 'Probability', emoji: '🎲' },
  roots: { gradient: Gradients.roots, icon: 'square-root-alt', label: 'Roots', emoji: '√' },
  statistics: { gradient: Gradients.statistics, icon: 'chart-bar', label: 'Statistics', emoji: '📊' },
  riddles: { gradient: Gradients.riddles, icon: 'brain', label: 'Riddles', emoji: '🧠' },
  timeChallenge: { gradient: Gradients.timeChallenge, icon: 'stopwatch', label: 'Time Challenge', emoji: '⏱️' },
};

export const CategoryGroups = [
  {
    title: 'Basics',
    emoji: '🟢',
    categories: ['addition', 'subtraction', 'multiplication', 'division'],
  },
  {
    title: 'Intermediate',
    emoji: '🟡',
    categories: ['fractions', 'geometry', 'measurement', 'moneyMath'],
  },
  {
    title: 'Advanced',
    emoji: '🔴',
    categories: ['algebra', 'exponents', 'roots', 'equations'],
  },
  {
    title: 'Brain Teasers',
    emoji: '🧠',
    categories: ['logicPuzzles', 'wordProblems', 'numberPatterns', 'probability'],
  },
  {
    title: 'Special',
    emoji: '🏆',
    categories: ['riddles', 'mixed', 'timeChallenge', 'statistics'],
  },
];
