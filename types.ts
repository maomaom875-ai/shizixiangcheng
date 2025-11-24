
// Coefficient Map: Ax^2 + By^2 + Cz^2 + Dxy + Eyz + Fzx + Gx + Hy + K
export interface PolynomialCoeffs {
  A: number; // x^2
  B: number; // y^2
  C: number; // z^2
  D: number; // xy
  E: number; // yz
  F: number; // zx
  G: number; // x
  H: number; // y
  K: number; // constant
}

// Result format: (a1x + b1y + c1)(a2x + b2y + c2)
// Note: mapped as a=coeff of x, b=coeff of y, c=constant
export interface FactorResult {
  success: boolean;
  terms?: {
    group1: { a: number; b: number; c: number };
    group2: { a: number; b: number; c: number };
  };
  steps?: FactorStep[];
}

export interface FactorStep {
  type: 'intro' | 'input_AB' | 'verify_xy' | 'input_K' | 'verify_linear' | 'final';
  audioKey: string;
  description: string;
  
  highlightTerm?: keyof PolynomialCoeffs; // Which term in equation to glow
  targetInfo?: {
      term: string; // e.g. "xy"
      val: number;  // e.g. 12
      formula: string; // e.g. "Ax + By"
  };

  // Interaction State
  interactive?: boolean; 
  
  // Expectations for validation
  expectedL?: [number, number]; // Column 1 (x)
  expectedM?: [number, number]; // Column 2 (y)
  expectedR?: [number, number]; // Column 3 (const)
  
  visualData?: {
    termLeft?: string;
    termMid?: string;
    termRight?: string;
    
    colL?: [number, number];
    colM?: [number, number];
    colR?: [number, number];
    
    crossCalc?: string;
  };
}

export type PlayListItem = string; 

export enum AppState {
  INPUT,
  SOLVING,
}
