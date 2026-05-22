// Chemical Reactions Database for ChemLab
// Defines reaction outcomes, effects, and educational content

export interface Reaction {
  reactants: string[];
  products: string;
  equation: string;
  type: 'neutralization' | 'combustion' | 'displacement' | 'decomposition' | 'synthesis' | 'precipitation' | 'gas-evolution' | 'redox';
  effects: ReactionEffect[];
  colorChange?: {
    from: string;
    to: string;
  };
  temperatureChange?: 'exothermic' | 'endothermic';
  educationalNotes: string;
  safetyWarning?: string;
  animationType: 'bubbles' | 'smoke' | 'fire' | 'explosion' | 'color-change' | 'precipitate' | 'fizz' | 'glow';
}

export interface ReactionEffect {
  type: 'bubbles' | 'smoke' | 'fire' | 'explosion' | 'color-change' | 'precipitate' | 'fizz' | 'glow' | 'heat' | 'gas';
  intensity: 'low' | 'medium' | 'high';
  duration: number; // in milliseconds
  color?: string;
}

export const reactions: Reaction[] = [
  // Sodium + Water - Famous explosive reaction
  {
    reactants: ['na', 'h2o'],
    products: 'Sodium Hydroxide + Hydrogen Gas',
    equation: '2Na + 2H₂O → 2NaOH + H₂',
    type: 'displacement',
    effects: [
      { type: 'fire', intensity: 'high', duration: 2000 },
      { type: 'explosion', intensity: 'medium', duration: 500 },
      { type: 'bubbles', intensity: 'high', duration: 3000, color: '#FFD700' },
      { type: 'heat', intensity: 'high', duration: 3000 }
    ],
    colorChange: { from: 'rgba(192, 192, 192, 0.9)', to: 'rgba(232, 232, 232, 0.7)' },
    temperatureChange: 'exothermic',
    educationalNotes: 'Sodium is a highly reactive alkali metal. When it reacts with water, it displaces hydrogen, producing sodium hydroxide and hydrogen gas. The heat from the reaction ignites the hydrogen, creating a spectacular flame!',
    safetyWarning: 'This is a dangerous reaction! Sodium can explode violently. Always use small pieces and proper safety equipment.',
    animationType: 'explosion'
  },
  
  // Potassium + Water - Even more violent
  {
    reactants: ['k', 'h2o'],
    products: 'Potassium Hydroxide + Hydrogen Gas',
    equation: '2K + 2H₂O → 2KOH + H₂',
    type: 'displacement',
    effects: [
      { type: 'fire', intensity: 'high', duration: 2500, color: '#FF4500' },
      { type: 'explosion', intensity: 'high', duration: 800 },
      { type: 'bubbles', intensity: 'high', duration: 4000, color: '#FFA500' },
      { type: 'heat', intensity: 'high', duration: 4000 }
    ],
    colorChange: { from: 'rgba(212, 212, 212, 0.9)', to: 'rgba(200, 200, 255, 0.6)' },
    temperatureChange: 'exothermic',
    educationalNotes: 'Potassium is even more reactive than sodium! The reaction produces a lilac-colored flame due to potassium\'s emission spectrum.',
    safetyWarning: 'EXTREMELY DANGEROUS! Potassium reacts more violently than sodium. Only perform under controlled conditions.',
    animationType: 'explosion'
  },
  
  // HCl + NaOH - Classic neutralization
  {
    reactants: ['hcl', 'naoh'],
    products: 'Sodium Chloride + Water',
    equation: 'HCl + NaOH → NaCl + H₂O',
    type: 'neutralization',
    effects: [
      { type: 'heat', intensity: 'medium', duration: 2000 },
      { type: 'color-change', intensity: 'low', duration: 1000 }
    ],
    colorChange: { from: 'rgba(255, 215, 0, 0.5)', to: 'rgba(255, 255, 255, 0.3)' },
    temperatureChange: 'exothermic',
    educationalNotes: 'This is a classic acid-base neutralization reaction. The products are salt (NaCl) and water. The reaction is exothermic, releasing heat.',
    animationType: 'color-change'
  },
  
  // H2SO4 + NaOH - Strong acid-base
  {
    reactants: ['h2so4', 'naoh'],
    products: 'Sodium Sulfate + Water',
    equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
    type: 'neutralization',
    effects: [
      { type: 'heat', intensity: 'high', duration: 3000 },
      { type: 'bubbles', intensity: 'low', duration: 1000 }
    ],
    colorChange: { from: 'rgba(255, 165, 0, 0.6)', to: 'rgba(255, 255, 255, 0.4)' },
    temperatureChange: 'exothermic',
    educationalNotes: 'Sulfuric acid is a diprotic acid, meaning it can donate two protons. This requires two moles of NaOH for complete neutralization.',
    safetyWarning: 'Sulfuric acid is highly corrosive. Always add acid to base, never the reverse!',
    animationType: 'color-change'
  },
  
  // CuSO4 + NaOH - Blue precipitate
  {
    reactants: ['cuso4', 'naoh'],
    products: 'Copper(II) Hydroxide + Sodium Sulfate',
    equation: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',
    type: 'precipitation',
    effects: [
      { type: 'precipitate', intensity: 'medium', duration: 2000, color: '#4169E1' },
      { type: 'color-change', intensity: 'medium', duration: 2000 }
    ],
    colorChange: { from: 'rgba(30, 144, 255, 0.7)', to: 'rgba(65, 105, 225, 0.9)' },
    educationalNotes: 'This reaction produces a beautiful blue precipitate of copper(II) hydroxide. This is a classic test for copper ions in solution.',
    animationType: 'precipitate'
  },
  
  // Mg + HCl - Bubbling reaction
  {
    reactants: ['mg', 'hcl'],
    products: 'Magnesium Chloride + Hydrogen Gas',
    equation: 'Mg + 2HCl → MgCl₂ + H₂',
    type: 'displacement',
    effects: [
      { type: 'bubbles', intensity: 'high', duration: 4000, color: '#87CEEB' },
      { type: 'heat', intensity: 'medium', duration: 3000 },
      { type: 'fizz', intensity: 'medium', duration: 4000 }
    ],
    colorChange: { from: 'rgba(224, 224, 224, 0.9)', to: 'rgba(200, 200, 200, 0.6)' },
    temperatureChange: 'exothermic',
    educationalNotes: 'Magnesium reacts with hydrochloric acid to produce hydrogen gas. The reaction is exothermic and produces visible bubbles.',
    animationType: 'bubbles'
  },
  
  // Zn + HCl - Moderate reaction
  {
    reactants: ['zn', 'hcl'],
    products: 'Zinc Chloride + Hydrogen Gas',
    equation: 'Zn + 2HCl → ZnCl₂ + H₂',
    type: 'displacement',
    effects: [
      { type: 'bubbles', intensity: 'medium', duration: 3000, color: '#87CEEB' },
      { type: 'heat', intensity: 'low', duration: 2000 },
      { type: 'fizz', intensity: 'low', duration: 3000 }
    ],
    temperatureChange: 'exothermic',
    educationalNotes: 'Zinc reacts more slowly with acid than magnesium. This reaction is commonly used in labs to produce hydrogen gas.',
    animationType: 'bubbles'
  },
  
  // Fe + CuSO4 - Displacement
  {
    reactants: ['fe', 'cuso4'],
    products: 'Iron(II) Sulfate + Copper',
    equation: 'Fe + CuSO₄ → FeSO₄ + Cu',
    type: 'displacement',
    effects: [
      { type: 'color-change', intensity: 'medium', duration: 3000 },
      { type: 'precipitate', intensity: 'low', duration: 2000, color: '#B87333' }
    ],
    colorChange: { from: 'rgba(30, 144, 255, 0.7)', to: 'rgba(144, 238, 144, 0.5)' },
    educationalNotes: 'Iron is more reactive than copper, so it displaces copper from the solution. You can see copper metal forming and the blue color fading.',
    animationType: 'color-change'
  },
  
  // KMnO4 + H2O2 - Elephant's toothpaste effect
  {
    reactants: ['kmno4', 'h2o2'],
    products: 'Manganese Dioxide + Oxygen + Water + Potassium Hydroxide',
    equation: '2KMnO₄ + 3H₂O₂ → 2MnO₂ + 3O₂ + 2H₂O + 2KOH',
    type: 'redox',
    effects: [
      { type: 'bubbles', intensity: 'high', duration: 5000, color: '#8B008B' },
      { type: 'smoke', intensity: 'medium', duration: 3000 },
      { type: 'heat', intensity: 'medium', duration: 3000 }
    ],
    colorChange: { from: 'rgba(139, 0, 139, 0.8)', to: 'rgba(100, 100, 100, 0.7)' },
    temperatureChange: 'exothermic',
    educationalNotes: 'Potassium permanganate catalyzes the decomposition of hydrogen peroxide, producing oxygen gas rapidly. This creates a spectacular bubbling effect!',
    safetyWarning: 'Use small quantities. The reaction can be vigorous and hot.',
    animationType: 'bubbles'
  },
  
  // NaCl + AgNO3 - White precipitate
  {
    reactants: ['nacl', 'agno3'],
    products: 'Silver Chloride + Sodium Nitrate',
    equation: 'NaCl + AgNO₃ → AgCl↓ + NaNO₃',
    type: 'precipitation',
    effects: [
      { type: 'precipitate', intensity: 'medium', duration: 2000, color: '#FFFFFF' },
      { type: 'color-change', intensity: 'low', duration: 1000 }
    ],
    colorChange: { from: 'rgba(255, 255, 255, 0.3)', to: 'rgba(220, 220, 220, 0.9)' },
    educationalNotes: 'This is a classic test for chloride ions. Silver chloride forms a white precipitate that darkens on exposure to light.',
    animationType: 'precipitate'
  },
  
  // CaCO3 + HCl - Effervescence
  {
    reactants: ['caco3', 'hcl'],
    products: 'Calcium Chloride + Carbon Dioxide + Water',
    equation: 'CaCO₃ + 2HCl → CaCl₂ + CO₂ + H₂O',
    type: 'gas-evolution',
    effects: [
      { type: 'bubbles', intensity: 'high', duration: 4000, color: '#87CEEB' },
      { type: 'fizz', intensity: 'high', duration: 4000 }
    ],
    temperatureChange: 'exothermic',
    educationalNotes: 'Limestone (calcium carbonate) reacts with acid to produce carbon dioxide gas. This is why acid rain damages limestone buildings!',
    animationType: 'fizz'
  },
  
  // Phenolphthalein + NaOH - Color change
  {
    reactants: ['phenolphthalein', 'naoh'],
    products: 'Pink colored solution',
    equation: 'Phenolphthalein + OH⁻ → Pink color (indicator)',
    type: 'neutralization',
    effects: [
      { type: 'color-change', intensity: 'medium', duration: 1000 }
    ],
    colorChange: { from: 'rgba(255, 105, 180, 0.3)', to: 'rgba(255, 20, 147, 0.8)' },
    educationalNotes: 'Phenolphthalein is a pH indicator that turns pink in basic solutions. It is colorless in acidic and neutral solutions.',
    animationType: 'color-change'
  },
  
  // HCl + NH3 - Smoke rings
  {
    reactants: ['hcl', 'nh3'],
    products: 'Ammonium Chloride',
    equation: 'HCl + NH₃ → NH₄Cl',
    type: 'synthesis',
    effects: [
      { type: 'smoke', intensity: 'high', duration: 3000, color: '#FFFFFF' }
    ],
    educationalNotes: 'Hydrogen chloride gas and ammonia gas react to form solid ammonium chloride, appearing as white smoke. This is a classic demonstration!',
    animationType: 'smoke'
  },
  
  // Ethanol + O2 - Combustion
  {
    reactants: ['ethanol', 'o2'],
    products: 'Carbon Dioxide + Water',
    equation: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O',
    type: 'combustion',
    effects: [
      { type: 'fire', intensity: 'medium', duration: 2000, color: '#FF6B35' },
      { type: 'heat', intensity: 'high', duration: 3000 }
    ],
    temperatureChange: 'exothermic',
    educationalNotes: 'Ethanol burns with a clean blue flame, producing carbon dioxide and water. This is why ethanol is used as a biofuel!',
    safetyWarning: 'Ethanol is flammable. Keep away from open flames in real labs.',
    animationType: 'fire'
  }
];

export const findReaction = (chemical1: string, chemical2: string): Reaction | undefined => {
  return reactions.find(r => 
    (r.reactants.includes(chemical1) && r.reactants.includes(chemical2)) ||
    (r.reactants.includes(chemical2) && r.reactants.includes(chemical1))
  );
};

export const getReactionsByType = (type: Reaction['type']): Reaction[] => {
  return reactions.filter(r => r.type === type);
};
