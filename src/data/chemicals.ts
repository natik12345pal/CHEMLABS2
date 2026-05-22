// Comprehensive Chemical Database for ChemLab
// Optimized for performance with lazy loading support

export interface Chemical {
  id: string;
  name: string;
  formula: string;
  type: 'acid' | 'base' | 'salt' | 'metal' | 'nonmetal' | 'indicator' | 'solvent' | 'oxidizer' | 'reducer';
  color: string;
  liquidColor: string;
  density: number;
  ph?: number;
  state: 'solid' | 'liquid' | 'gas';
  hazard: 'safe' | 'caution' | 'dangerous';
  description: string;
  properties: string[];
  uses: string[];
  meltingPoint?: number;
  boilingPoint?: number;
  molarMass: number;
  reactsWith: string[];
  icon: string;
}

export const chemicals: Chemical[] = [
  // Water
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H₂O',
    type: 'solvent',
    color: '#87CEEB',
    liquidColor: 'rgba(135, 206, 235, 0.6)',
    density: 1.0,
    ph: 7,
    state: 'liquid',
    hazard: 'safe',
    description: 'The universal solvent, essential for all known forms of life.',
    properties: ['Polar molecule', 'High surface tension', 'Excellent solvent', 'High specific heat'],
    uses: ['Solvent in reactions', 'Dilution', 'Cooling agent', 'Cleaning'],
    meltingPoint: 0,
    boilingPoint: 100,
    molarMass: 18.015,
    reactsWith: ['na', 'k', 'ca', 'li'],
    icon: '💧'
  },
  // Hydrochloric Acid
  {
    id: 'hcl',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    type: 'acid',
    color: '#FFD700',
    liquidColor: 'rgba(255, 215, 0, 0.5)',
    density: 1.18,
    ph: 1,
    state: 'liquid',
    hazard: 'dangerous',
    description: 'A strong mineral acid, highly corrosive and widely used in industry.',
    properties: ['Strong acid', 'Corrosive', 'Fumes in air', 'Reacts with metals'],
    uses: ['Metal cleaning', 'pH adjustment', 'Chemical synthesis', 'Food processing'],
    meltingPoint: -30,
    boilingPoint: 110,
    molarMass: 36.46,
    reactsWith: ['naoh', 'na', 'mg', 'zn', 'caco3'],
    icon: '⚗️'
  },
  // Sulfuric Acid
  {
    id: 'h2so4',
    name: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    type: 'acid',
    color: '#FFA500',
    liquidColor: 'rgba(255, 165, 0, 0.6)',
    density: 1.84,
    ph: 0,
    state: 'liquid',
    hazard: 'dangerous',
    description: 'The "king of chemicals" - one of the most important industrial chemicals.',
    properties: ['Strong acid', 'Dehydrating agent', 'Oxidizing agent', 'Highly corrosive'],
    uses: ['Battery acid', 'Fertilizer production', 'Metal processing', 'Chemical synthesis'],
    meltingPoint: 10,
    boilingPoint: 337,
    molarMass: 98.08,
    reactsWith: ['naoh', 'na', 'sugar', 'cu'],
    icon: '🧪'
  },
  // Sodium Hydroxide
  {
    id: 'naoh',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    type: 'base',
    color: '#E8E8E8',
    liquidColor: 'rgba(232, 232, 232, 0.7)',
    density: 2.13,
    ph: 14,
    state: 'solid',
    hazard: 'dangerous',
    description: 'Also known as caustic soda, a strong base used in many industries.',
    properties: ['Strong base', 'Hygroscopic', 'Exothermic dissolution', 'Corrosive'],
    uses: ['Soap making', 'Paper production', 'Drain cleaners', 'Aluminum production'],
    meltingPoint: 318,
    boilingPoint: 1388,
    molarMass: 40.0,
    reactsWith: ['hcl', 'h2so4', 'cu', 'al'],
    icon: '🧫'
  },
  // Copper Sulfate
  {
    id: 'cuso4',
    name: 'Copper(II) Sulfate',
    formula: 'CuSO₄',
    type: 'salt',
    color: '#1E90FF',
    liquidColor: 'rgba(30, 144, 255, 0.7)',
    density: 2.28,
    state: 'solid',
    hazard: 'caution',
    description: 'A bright blue compound, commonly used as a fungicide and in electroplating.',
    properties: ['Blue crystalline solid', 'Hygroscopic', 'Forms pentahydrate', 'Moderately toxic'],
    uses: ['Electroplating', 'Fungicide', 'Dyeing', 'Chemical tests'],
    meltingPoint: 110,
    boilingPoint: 650,
    molarMass: 159.61,
    reactsWith: ['naoh', 'fe', 'zn'],
    icon: '💎'
  },
  // Potassium Permanganate
  {
    id: 'kmno4',
    name: 'Potassium Permanganate',
    formula: 'KMnO₄',
    type: 'oxidizer',
    color: '#8B008B',
    liquidColor: 'rgba(139, 0, 139, 0.8)',
    density: 2.7,
    state: 'solid',
    hazard: 'caution',
    description: 'A powerful oxidizing agent with a distinctive purple color.',
    properties: ['Strong oxidizer', 'Purple crystals', 'Stains skin', 'Disinfectant'],
    uses: ['Water treatment', 'Disinfectant', 'Organic synthesis', 'Analytical chemistry'],
    meltingPoint: 240,
    boilingPoint: 400,
    molarMass: 158.03,
    reactsWith: ['h2o2', 'glycerin', 'h2so4'],
    icon: '🔮'
  },
  // Sodium Chloride
  {
    id: 'nacl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    type: 'salt',
    color: '#FFFFFF',
    liquidColor: 'rgba(255, 255, 255, 0.3)',
    density: 2.16,
    state: 'solid',
    hazard: 'safe',
    description: 'Common table salt, essential for life and widely used in cooking.',
    properties: ['Ionic compound', 'High solubility', 'Conducts electricity in solution', 'Essential nutrient'],
    uses: ['Food seasoning', 'Preservation', 'Chemical industry', 'De-icing'],
    meltingPoint: 801,
    boilingPoint: 1465,
    molarMass: 58.44,
    reactsWith: ['agno3', 'h2so4'],
    icon: '🧂'
  },
  // Ethanol
  {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    type: 'solvent',
    color: '#F0E68C',
    liquidColor: 'rgba(240, 230, 140, 0.4)',
    density: 0.789,
    state: 'liquid',
    hazard: 'caution',
    description: 'A common alcohol used as fuel, solvent, and in beverages.',
    properties: ['Volatile', 'Flammable', 'Good solvent', 'Mild intoxicant'],
    uses: ['Fuel', 'Solvent', 'Disinfectant', 'Beverages'],
    meltingPoint: -114,
    boilingPoint: 78,
    molarMass: 46.07,
    reactsWith: ['na', 'o2', 'kmno4'],
    icon: '🍷'
  },
  // Sodium
  {
    id: 'na',
    name: 'Sodium',
    formula: 'Na',
    type: 'metal',
    color: '#C0C0C0',
    liquidColor: 'rgba(192, 192, 192, 0.9)',
    density: 0.97,
    state: 'solid',
    hazard: 'dangerous',
    description: 'A soft, silvery-white, highly reactive metal. Reacts violently with water!',
    properties: ['Soft metal', 'Highly reactive', 'Conducts electricity', 'Stored under oil'],
    uses: ['Sodium vapor lamps', 'Chemical synthesis', 'Heat transfer', 'Nuclear reactors'],
    meltingPoint: 98,
    boilingPoint: 883,
    molarMass: 22.99,
    reactsWith: ['h2o', 'hcl', 'cl2', 'o2'],
    icon: '⚡'
  },
  // Potassium
  {
    id: 'k',
    name: 'Potassium',
    formula: 'K',
    type: 'metal',
    color: '#D4D4D4',
    liquidColor: 'rgba(212, 212, 212, 0.9)',
    density: 0.89,
    state: 'solid',
    hazard: 'dangerous',
    description: 'A soft, silvery metal that is even more reactive than sodium.',
    properties: ['Soft metal', 'Very reactive', 'Low melting point', 'Stored under oil'],
    uses: ['Fertilizers', 'Soap', 'Glass production', 'Medical applications'],
    meltingPoint: 64,
    boilingPoint: 759,
    molarMass: 39.1,
    reactsWith: ['h2o', 'hcl', 'cl2', 'o2'],
    icon: '💥'
  },
  // Chlorine
  {
    id: 'cl2',
    name: 'Chlorine',
    formula: 'Cl₂',
    type: 'nonmetal',
    color: '#90EE90',
    liquidColor: 'rgba(144, 238, 144, 0.5)',
    density: 3.2,
    state: 'gas',
    hazard: 'dangerous',
    description: 'A yellow-green gas with a pungent odor, used for disinfection.',
    properties: ['Toxic gas', 'Strong oxidizer', 'Disinfectant', 'Greenish-yellow color'],
    uses: ['Water treatment', 'Bleach production', 'PVC production', 'Disinfectant'],
    meltingPoint: -101,
    boilingPoint: -34,
    molarMass: 70.9,
    reactsWith: ['na', 'h2', 'fe'],
    icon: '💨'
  },
  // Oxygen
  {
    id: 'o2',
    name: 'Oxygen',
    formula: 'O₂',
    type: 'nonmetal',
    color: '#ADD8E6',
    liquidColor: 'rgba(173, 216, 230, 0.3)',
    density: 1.43,
    state: 'gas',
    hazard: 'safe',
    description: 'Essential for respiration and combustion.',
    properties: ['Colorless gas', 'Supports combustion', 'Essential for life', 'Forms oxides'],
    uses: ['Respiration', 'Medical use', 'Welding', 'Rocket fuel'],
    meltingPoint: -219,
    boilingPoint: -183,
    molarMass: 32.0,
    reactsWith: ['na', 'fe', 'c', 'h2'],
    icon: '🫁'
  },
  // Hydrogen
  {
    id: 'h2',
    name: 'Hydrogen',
    formula: 'H₂',
    type: 'nonmetal',
    color: '#F5F5F5',
    liquidColor: 'rgba(245, 245, 245, 0.2)',
    density: 0.09,
    state: 'gas',
    hazard: 'caution',
    description: 'The lightest element, highly flammable and used as fuel.',
    properties: ['Lightest element', 'Highly flammable', 'Colorless', 'Low density'],
    uses: ['Fuel cells', 'Ammonia production', 'Rocket fuel', 'Welding'],
    meltingPoint: -259,
    boilingPoint: -253,
    molarMass: 2.02,
    reactsWith: ['o2', 'cl2', 'na'],
    icon: '🎈'
  },
  // Phenolphthalein
  {
    id: 'phenolphthalein',
    name: 'Phenolphthalein',
    formula: 'C₂₀H₁₄O₄',
    type: 'indicator',
    color: '#FF69B4',
    liquidColor: 'rgba(255, 105, 180, 0.3)',
    density: 1.28,
    state: 'solid',
    hazard: 'safe',
    description: 'A pH indicator that turns pink in basic solutions.',
    properties: ['pH indicator', 'Colorless in acid', 'Pink in base', 'Laxative properties'],
    uses: ['Titration', 'pH testing', 'Invisible ink', 'Laxative'],
    meltingPoint: 263,
    boilingPoint: 400,
    molarMass: 318.32,
    reactsWith: ['naoh', 'hcl', 'koh'],
    icon: '🎭'
  },
  // Litmus
  {
    id: 'litmus',
    name: 'Litmus',
    formula: 'C₉H₁₀N₂O₃',
    type: 'indicator',
    color: '#9370DB',
    liquidColor: 'rgba(147, 112, 219, 0.5)',
    density: 1.5,
    state: 'solid',
    hazard: 'safe',
    description: 'A natural dye that turns red in acid and blue in base.',
    properties: ['Natural indicator', 'Red in acid', 'Blue in base', 'Made from lichens'],
    uses: ['pH testing', 'Education', 'Acid-base indicators'],
    molarMass: 194.19,
    reactsWith: ['hcl', 'naoh'],
    icon: '🎨'
  },
  // Calcium Carbonate
  {
    id: 'caco3',
    name: 'Calcium Carbonate',
    formula: 'CaCO₃',
    type: 'salt',
    color: '#FFFAF0',
    liquidColor: 'rgba(255, 250, 240, 0.4)',
    density: 2.71,
    state: 'solid',
    hazard: 'safe',
    description: 'A common compound found in rocks, shells, and pearls.',
    properties: ['White solid', 'Insoluble in water', 'Effervesces with acid', 'Antacid'],
    uses: ['Construction', 'Chalk', 'Antacid', 'Calcium supplement'],
    meltingPoint: 1339,
    molarMass: 100.09,
    reactsWith: ['hcl', 'h2so4'],
    icon: '🪨'
  },
  // Iron
  {
    id: 'fe',
    name: 'Iron',
    formula: 'Fe',
    type: 'metal',
    color: '#708090',
    liquidColor: 'rgba(112, 128, 144, 0.9)',
    density: 7.87,
    state: 'solid',
    hazard: 'safe',
    description: 'The most common metal on Earth, essential for life and industry.',
    properties: ['Magnetic', 'Good conductor', 'Forms alloys', 'Essential nutrient'],
    uses: ['Construction', 'Steel production', 'Tools', 'Nutrition'],
    meltingPoint: 1538,
    boilingPoint: 2862,
    molarMass: 55.85,
    reactsWith: ['o2', 'hcl', 'cuso4', 'cl2'],
    icon: '🔩'
  },
  // Magnesium
  {
    id: 'mg',
    name: 'Magnesium',
    formula: 'Mg',
    type: 'metal',
    color: '#E0E0E0',
    liquidColor: 'rgba(224, 224, 224, 0.9)',
    density: 1.74,
    state: 'solid',
    hazard: 'caution',
    description: 'A lightweight metal that burns with a bright white flame.',
    properties: ['Lightweight', 'Burns brightly', 'Good conductor', 'Reactive'],
    uses: ['Alloys', 'Fireworks', 'Aircraft', 'Medical'],
    meltingPoint: 650,
    boilingPoint: 1090,
    molarMass: 24.31,
    reactsWith: ['hcl', 'o2', 'h2o'],
    icon: '🔥'
  },
  // Zinc
  {
    id: 'zn',
    name: 'Zinc',
    formula: 'Zn',
    type: 'metal',
    color: '#A9A9A9',
    liquidColor: 'rgba(169, 169, 169, 0.9)',
    density: 7.14,
    state: 'solid',
    hazard: 'safe',
    description: 'A bluish-white metal used for galvanization and batteries.',
    properties: ['Corrosion resistant', 'Blue-gray color', 'Good conductor', 'Essential nutrient'],
    uses: ['Galvanization', 'Batteries', 'Alloys', 'Sunscreen'],
    meltingPoint: 420,
    boilingPoint: 907,
    molarMass: 65.38,
    reactsWith: ['hcl', 'cuso4', 'o2'],
    icon: '🔋'
  },
  // Ammonia
  {
    id: 'nh3',
    name: 'Ammonia',
    formula: 'NH₃',
    type: 'base',
    color: '#E6E6FA',
    liquidColor: 'rgba(230, 230, 250, 0.4)',
    density: 0.73,
    ph: 11,
    state: 'gas',
    hazard: 'caution',
    description: 'A pungent gas used in fertilizers and cleaning products.',
    properties: ['Pungent odor', 'Weak base', 'Highly soluble', 'Forms ammonium salts'],
    uses: ['Fertilizers', 'Cleaning products', 'Refrigeration', 'Chemical synthesis'],
    meltingPoint: -78,
    boilingPoint: -33,
    molarMass: 17.03,
    reactsWith: ['hcl', 'h2so4', 'cu'],
    icon: '🧹'
  },
  // Hydrogen Peroxide
  {
    id: 'h2o2',
    name: 'Hydrogen Peroxide',
    formula: 'H₂O₂',
    type: 'oxidizer',
    color: '#F8F8FF',
    liquidColor: 'rgba(248, 248, 255, 0.4)',
    density: 1.45,
    state: 'liquid',
    hazard: 'caution',
    description: 'A pale blue liquid used as a disinfectant and bleach.',
    properties: ['Oxidizing agent', 'Decomposes easily', 'Bleaching agent', 'Disinfectant'],
    uses: ['Disinfectant', 'Bleach', 'Rocket fuel', 'Hair dye'],
    meltingPoint: -0.4,
    boilingPoint: 150,
    molarMass: 34.02,
    reactsWith: ['kmno4', 'na', 'fe'],
    icon: '💊'
  },
  // Silver Nitrate
  {
    id: 'agno3',
    name: 'Silver Nitrate',
    formula: 'AgNO₃',
    type: 'salt',
    color: '#C0C0C0',
    liquidColor: 'rgba(192, 192, 192, 0.5)',
    density: 4.35,
    state: 'solid',
    hazard: 'caution',
    description: 'A light-sensitive compound used in photography and analytical chemistry.',
    properties: ['Light sensitive', 'Forms silver', 'Causes stains', 'Antiseptic'],
    uses: ['Photography', 'Antiseptic', 'Chemical testing', 'Mirrors'],
    meltingPoint: 212,
    boilingPoint: 444,
    molarMass: 169.87,
    reactsWith: ['nacl', 'hcl', 'cu'],
    icon: '📷'
  }
];

export const getChemicalById = (id: string): Chemical | undefined => {
  return chemicals.find(c => c.id === id);
};

export const getChemicalsByType = (type: Chemical['type']): Chemical[] => {
  return chemicals.filter(c => c.type === type);
};

export const checkReaction = (chemical1: string, chemical2: string): boolean => {
  const chem1 = getChemicalById(chemical1);
  const chem2 = getChemicalById(chemical2);
  
  if (!chem1 || !chem2) return false;
  
  return chem1.reactsWith.includes(chemical2) || chem2.reactsWith.includes(chemical1);
};
