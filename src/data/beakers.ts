// Beaker and Container Types for ChemLab
// Optimized for 2D rendering with SVG
// Sizes increased for better visibility

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
  // Standard Beaker - ENLARGED
  {
    id: 'beaker-250',
    name: '250mL Beaker',
    type: 'beaker',
    capacity: 250,
    width: 140,
    height: 170,
    description: 'Standard laboratory beaker for general use',
    svgPath: 'M15,15 L125,15 L140,25 L140,160 L15,160 L15,15 Z',
    liquidArea: { x: 18, y: 30, width: 119, height: 127 },
    pourPoint: { x: 125, y: 25 },
    icon: '🧪'
  },
  {
    id: 'beaker-100',
    name: '100mL Beaker',
    type: 'beaker',
    capacity: 100,
    width: 110,
    height: 140,
    description: 'Small beaker for smaller experiments',
    svgPath: 'M12,12 L98,12 L110,20 L110,130 L12,130 L12,12 Z',
    liquidArea: { x: 15, y: 25, width: 92, height: 102 },
    pourPoint: { x: 98, y: 20 },
    icon: '🧪'
  },
  {
    id: 'beaker-500',
    name: '500mL Beaker',
    type: 'beaker',
    capacity: 500,
    width: 170,
    height: 200,
    description: 'Large beaker for bigger quantities',
    svgPath: 'M15,15 L155,15 L170,25 L170,190 L15,190 L15,15 Z',
    liquidArea: { x: 18, y: 30, width: 149, height: 158 },
    pourPoint: { x: 155, y: 25 },
    icon: '🧪'
  },
  
  // Erlenmeyer Flask - ENLARGED
  {
    id: 'flask-125',
    name: '125mL Erlenmeyer Flask',
    type: 'flask',
    capacity: 125,
    width: 120,
    height: 160,
    description: 'Conical flask for mixing and heating',
    svgPath: 'M45,8 L75,8 L75,40 L110,150 L10,150 L45,40 Z',
    liquidArea: { x: 15, y: 70, width: 90, height: 78 },
    pourPoint: { x: 75, y: 8 },
    icon: '⚗️'
  },
  {
    id: 'flask-250',
    name: '250mL Erlenmeyer Flask',
    type: 'flask',
    capacity: 250,
    width: 150,
    height: 190,
    description: 'Large conical flask for bigger reactions',
    svgPath: 'M55,8 L95,8 L95,50 L140,180 L10,180 L55,50 Z',
    liquidArea: { x: 15, y: 85, width: 120, height: 93 },
    pourPoint: { x: 95, y: 8 },
    icon: '⚗️'
  },
  
  // Round Bottom Flask - ENLARGED
  {
    id: 'round-flask',
    name: 'Round Bottom Flask',
    type: 'flask',
    capacity: 100,
    width: 140,
    height: 170,
    description: 'For heating and distillation',
    svgPath: 'M55,8 L85,8 L85,50 Q140,85 140,120 Q140,165 70,165 Q0,165 0,120 Q0,85 55,50 Z',
    liquidArea: { x: 10, y: 70, width: 120, height: 92 },
    pourPoint: { x: 85, y: 8 },
    icon: '🧫'
  },
  
  // Test Tube - ENLARGED
  {
    id: 'test-tube',
    name: 'Test Tube',
    type: 'test-tube',
    capacity: 15,
    width: 45,
    height: 140,
    description: 'Small tube for testing small samples',
    svgPath: 'M8,8 L37,8 L37,110 Q37,135 22.5,135 Q8,135 8,110 Z',
    liquidArea: { x: 10, y: 15, width: 25, height: 118 },
    pourPoint: { x: 37, y: 8 },
    icon: '🧫'
  },
  {
    id: 'test-tube-large',
    name: 'Large Test Tube',
    type: 'test-tube',
    capacity: 25,
    width: 55,
    height: 170,
    description: 'Larger test tube for more volume',
    svgPath: 'M8,8 L47,8 L47,140 Q47,165 27.5,165 Q8,165 8,140 Z',
    liquidArea: { x: 10, y: 15, width: 35, height: 148 },
    pourPoint: { x: 47, y: 8 },
    icon: '🧫'
  },
  
  // Graduated Cylinder - ENLARGED
  {
    id: 'cylinder-50',
    name: '50mL Graduated Cylinder',
    type: 'cylinder',
    capacity: 50,
    width: 60,
    height: 160,
    description: 'For precise volume measurements',
    svgPath: 'M8,8 L52,8 L52,155 L8,155 Z',
    liquidArea: { x: 10, y: 12, width: 40, height: 140 },
    pourPoint: { x: 52, y: 8 },
    icon: '🧫'
  },
  {
    id: 'cylinder-100',
    name: '100mL Graduated Cylinder',
    type: 'cylinder',
    capacity: 100,
    width: 75,
    height: 190,
    description: 'For larger precise measurements',
    svgPath: 'M8,8 L67,8 L67,185 L8,185 Z',
    liquidArea: { x: 10, y: 12, width: 55, height: 172 },
    pourPoint: { x: 67, y: 8 },
    icon: '🧫'
  },
  
  // Burette - ENLARGED
  {
    id: 'burette',
    name: '50mL Burette',
    type: 'burette',
    capacity: 50,
    width: 55,
    height: 200,
    description: 'For precise liquid dispensing',
    svgPath: 'M18,8 L37,8 L37,25 L42,25 L42,195 L13,195 L13,25 L18,25 Z',
    liquidArea: { x: 15, y: 12, width: 25, height: 180 },
    pourPoint: { x: 27.5, y: 195 },
    icon: '🧪'
  },
  
  // Pipette - ENLARGED
  {
    id: 'pipette-10',
    name: '10mL Pipette',
    type: 'pipette',
    capacity: 10,
    width: 40,
    height: 170,
    description: 'For transferring small volumes',
    svgPath: 'M14,8 L26,8 L26,140 L32,150 L32,165 L8,165 L8,150 L14,140 Z',
    liquidArea: { x: 10, y: 12, width: 20, height: 150 },
    pourPoint: { x: 20, y: 165 },
    icon: '💉'
  },
  
  // Reagent Bottle - ENLARGED
  {
    id: 'bottle-100',
    name: '100mL Reagent Bottle',
    type: 'bottle',
    capacity: 100,
    width: 90,
    height: 140,
    description: 'For storing chemicals',
    svgPath: 'M28,8 L62,8 L62,25 L80,25 L80,135 L10,135 L10,25 L28,25 Z',
    liquidArea: { x: 12, y: 30, width: 66, height: 102 },
    pourPoint: { x: 62, y: 8 },
    icon: '🧴'
  },
  
  // Petri Dish - ENLARGED
  {
    id: 'petri-dish',
    name: 'Petri Dish',
    type: 'dish',
    capacity: 20,
    width: 120,
    height: 35,
    description: 'For culturing and observing',
    svgPath: 'M8,8 Q60,-8 112,8 Q128,15 112,27 Q60,43 8,27 Q-8,15 8,8 Z',
    liquidArea: { x: 18, y: 10, width: 84, height: 15 },
    pourPoint: { x: 60, y: 27 },
    icon: '🥼'
  }
];

export const getBeakerById = (id: string): BeakerType | undefined => {
  return beakerTypes.find(b => b.id === id);
};

export const getBeakersByType = (type: BeakerType['type']): BeakerType[] => {
  return beakerTypes.filter(b => b.type === type);
};
