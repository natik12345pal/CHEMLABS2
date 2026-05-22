// Beaker and Container Types for ChemLab
// Optimized for 2D rendering with SVG

export interface BeakerType {
  id: string;
  name: string;
  type: 'beaker' | 'flask' | 'test-tube' | 'burette' | 'pipette' | 'cylinder' | 'bottle' | 'dish';
  capacity: number; // in mL
  width: number;
  height: number;
  description: string;
  svgPath: string;
  liquidArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  pourPoint: { x: number; y: number };
  icon: string;
}

export const beakerTypes: BeakerType[] = [
  // Standard Beaker
  {
    id: 'beaker-250',
    name: '250mL Beaker',
    type: 'beaker',
    capacity: 250,
    width: 80,
    height: 100,
    description: 'Standard laboratory beaker for general use',
    svgPath: 'M10,10 L70,10 L80,15 L80,95 L10,95 L10,10 Z',
    liquidArea: { x: 12, y: 20, width: 66, height: 73 },
    pourPoint: { x: 70, y: 15 },
    icon: '🧪'
  },
  {
    id: 'beaker-100',
    name: '100mL Beaker',
    type: 'beaker',
    capacity: 100,
    width: 60,
    height: 80,
    description: 'Small beaker for smaller experiments',
    svgPath: 'M8,8 L52,8 L60,12 L60,75 L8,75 L8,8 Z',
    liquidArea: { x: 10, y: 15, width: 48, height: 58 },
    pourPoint: { x: 52, y: 12 },
    icon: '🧪'
  },
  {
    id: 'beaker-500',
    name: '500mL Beaker',
    type: 'beaker',
    capacity: 500,
    width: 100,
    height: 120,
    description: 'Large beaker for bigger quantities',
    svgPath: 'M10,10 L90,10 L100,15 L100,115 L10,115 L10,10 Z',
    liquidArea: { x: 12, y: 20, width: 86, height: 93 },
    pourPoint: { x: 90, y: 15 },
    icon: '🧪'
  },
  
  // Erlenmeyer Flask
  {
    id: 'flask-125',
    name: '125mL Erlenmeyer Flask',
    type: 'flask',
    capacity: 125,
    width: 70,
    height: 90,
    description: 'Conical flask for mixing and heating',
    svgPath: 'M25,5 L45,5 L45,25 L65,85 L5,85 L25,25 Z',
    liquidArea: { x: 8, y: 40, width: 54, height: 43 },
    pourPoint: { x: 45, y: 5 },
    icon: '⚗️'
  },
  {
    id: 'flask-250',
    name: '250mL Erlenmeyer Flask',
    type: 'flask',
    capacity: 250,
    width: 85,
    height: 110,
    description: 'Large conical flask for bigger reactions',
    svgPath: 'M30,5 L55,5 L55,30 L80,105 L5,105 L30,30 Z',
    liquidArea: { x: 8, y: 50, width: 69, height: 53 },
    pourPoint: { x: 55, y: 5 },
    icon: '⚗️'
  },
  
  // Round Bottom Flask
  {
    id: 'round-flask',
    name: 'Round Bottom Flask',
    type: 'flask',
    capacity: 100,
    width: 80,
    height: 100,
    description: 'For heating and distillation',
    svgPath: 'M30,5 L50,5 L50,30 Q80,50 80,70 Q80,95 40,95 Q0,95 0,70 Q0,50 30,30 Z',
    liquidArea: { x: 5, y: 40, width: 70, height: 52 },
    pourPoint: { x: 50, y: 5 },
    icon: '🧫'
  },
  
  // Test Tube
  {
    id: 'test-tube',
    name: 'Test Tube',
    type: 'test-tube',
    capacity: 15,
    width: 25,
    height: 80,
    description: 'Small tube for testing small samples',
    svgPath: 'M5,5 L20,5 L20,60 Q20,75 12.5,75 Q5,75 5,60 Z',
    liquidArea: { x: 6, y: 10, width: 13, height: 63 },
    pourPoint: { x: 20, y: 5 },
    icon: '🧫'
  },
  {
    id: 'test-tube-large',
    name: 'Large Test Tube',
    type: 'test-tube',
    capacity: 25,
    width: 30,
    height: 100,
    description: 'Larger test tube for more volume',
    svgPath: 'M5,5 L25,5 L25,80 Q25,95 15,95 Q5,95 5,80 Z',
    liquidArea: { x: 6, y: 10, width: 18, height: 83 },
    pourPoint: { x: 25, y: 5 },
    icon: '🧫'
  },
  
  // Graduated Cylinder
  {
    id: 'cylinder-50',
    name: '50mL Graduated Cylinder',
    type: 'cylinder',
    capacity: 50,
    width: 35,
    height: 90,
    description: 'For precise volume measurements',
    svgPath: 'M5,5 L30,5 L30,85 L5,85 Z',
    liquidArea: { x: 6, y: 8, width: 23, height: 75 },
    pourPoint: { x: 30, y: 5 },
    icon: '🧫'
  },
  {
    id: 'cylinder-100',
    name: '100mL Graduated Cylinder',
    type: 'cylinder',
    capacity: 100,
    width: 45,
    height: 110,
    description: 'For larger precise measurements',
    svgPath: 'M5,5 L40,5 L40,105 L5,105 Z',
    liquidArea: { x: 6, y: 8, width: 33, height: 95 },
    pourPoint: { x: 40, y: 5 },
    icon: '🧫'
  },
  
  // Burette
  {
    id: 'burette',
    name: '50mL Burette',
    type: 'burette',
    capacity: 50,
    width: 30,
    height: 120,
    description: 'For precise liquid dispensing',
    svgPath: 'M10,5 L20,5 L20,15 L22,15 L22,115 L8,115 L8,15 L10,15 Z',
    liquidArea: { x: 9, y: 8, width: 12, height: 105 },
    pourPoint: { x: 15, y: 115 },
    icon: '🧪'
  },
  
  // Pipette
  {
    id: 'pipette-10',
    name: '10mL Pipette',
    type: 'pipette',
    capacity: 10,
    width: 20,
    height: 100,
    description: 'For transferring small volumes',
    svgPath: 'M8,5 L12,5 L12,80 L15,85 L15,95 L5,95 L5,85 L8,80 Z',
    liquidArea: { x: 6, y: 8, width: 8, height: 85 },
    pourPoint: { x: 10, y: 95 },
    icon: '💉'
  },
  
  // Reagent Bottle
  {
    id: 'bottle-100',
    name: '100mL Reagent Bottle',
    type: 'bottle',
    capacity: 100,
    width: 50,
    height: 80,
    description: 'For storing chemicals',
    svgPath: 'M15,5 L35,5 L35,15 L45,15 L45,75 L5,75 L5,15 L15,15 Z',
    liquidArea: { x: 7, y: 18, width: 36, height: 55 },
    pourPoint: { x: 35, y: 5 },
    icon: '🧴'
  },
  
  // Petri Dish
  {
    id: 'petri-dish',
    name: 'Petri Dish',
    type: 'dish',
    capacity: 20,
    width: 70,
    height: 20,
    description: 'For culturing and observing',
    svgPath: 'M5,5 Q35,-5 65,5 Q75,10 65,15 Q35,25 5,15 Q-5,10 5,5 Z',
    liquidArea: { x: 10, y: 6, width: 50, height: 8 },
    pourPoint: { x: 35, y: 15 },
    icon: '🥼'
  }
];

export const getBeakerById = (id: string): BeakerType | undefined => {
  return beakerTypes.find(b => b.id === id);
};

export const getBeakersByType = (type: BeakerType['type']): BeakerType[] => {
  return beakerTypes.filter(b => b.type === type);
};
