import React, { useState } from 'react';
import './App.css';

interface PolynomialCoeffs {
  A: number;
  B: number;
  D: number;
  G: number;
  H: number;
  K: number;
}

interface FactorResult {
  success: boolean;
  a1?: number;
  a2?: number;
  b1?: number;
  b2?: number;
  c1?: number;
  c2?: number;
}

const App: React.FC = () => {
  const [coeffs, setCoeffs] = useState<PolynomialCoeffs>({
    A: 0,
    B: 0,
    D: 0,
    G: 0,
    H: 0,
    K: 0,
  });

  const [result, setResult] = useState<FactorResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCoeffChange = (key: keyof PolynomialCoeffs, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    setCoeffs((prev) => ({ ...prev, [key]: numValue }));
  };

  const findFactors = (n: number): [number, number][] => {
    if (n === 0) return [[0, 1]];

    const factors: [number, number][] = [];
    const absN = Math.abs(n);

    for (let i = 1; i <= Math.sqrt(absN); i++) {
      if (absN % i === 0) {
        const j = absN / i;
        if (n > 0) {
          factors.push([i, j]);
          factors.push([-i, -j]);
          if (i !== j) {
            factors.push([j, i]);
            factors.push([-j, -i]);
          }
        } else {
          factors.push([i, -j]);
          factors.push([-i, j]);
          if (i !== j) {
            factors.push([j, -i]);
            factors.push([-j, i]);
          }
        }
      }
    }

    return factors;
  };

  const solvePolynomial = () => {
    const { A, B, D, G, H, K } = coeffs;

    if (A === 0 && B === 0 && D === 0) {
      setError('无法分解：缺少二次项');
      setResult(null);
      return;
    }

    const factorsA = findFactors(A);
    const factorsB = findFactors(B);

    let found = false;
    let a1 = 0,
      a2 = 0,
      b1 = 0,
      b2 = 0,
      c1 = 0,
      c2 = 0;

    for (const [fa1, fa2] of factorsA) {
      for (const [fb1, fb2] of factorsB) {
        if (fa1 * fb2 + fa2 * fb1 === D) {
          const factorsK = findFactors(K);
          for (const [fk1, fk2] of factorsK) {
            if (fa1 * fk2 + fa2 * fk1 === G && fb1 * fk2 + fb2 * fk1 === H) {
              found = true;
              a1 = fa1;
              a2 = fa2;
              b1 = fb1;
              b2 = fb2;
              c1 = fk1;
              c2 = fk2;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }
      if (found) break;
    }

    if (!found) {
      setError('该多项式不能用十字相乘法分解');
      setResult(null);
      return;
    }

    setError('');
    setResult({ success: true, a1, a2, b1, b2, c1, c2 });
  };

  const loadExample = (A: number, D: number, B: number, G: number, H: number, K: number) => {
    setCoeffs({ A, D, B, G, H, K });
    setError('');
    setResult(null);
  };

  const formatCoeff = (coeff: number, variable: string) => {
    if (coeff === 0) return '';
    const absCoeff = Math.abs(coeff);
    const sign = coeff > 0 ? '+' : '-';
    const coeffStr = absCoeff === 1 && variable ? '' : absCoeff;
    return ` ${sign} ${coeffStr}${variable}`;
  };

  const getFormulaDisplay = () => {
    const { A, D, B, G, H, K } = coeffs;
    let formula = '';

    if (A !== 0) formula += `${A === 1 ? '' : A === -1 ? '-' : A}x²`;
    if (D !== 0) formula += `${formula ? (D > 0 ? ' + ' : ' - ') : D < 0 ? '-' : ''}${Math.abs(D) === 1 ? '' : Math.abs(D)}xy`;
    if (B !== 0) formula += `${formula ? (B > 0 ? ' + ' : ' - ') : B < 0 ? '-' : ''}${Math.abs(B) === 1 ? '' : Math.abs(B)}y²`;
    if (G !== 0) formula += `${formula ? (G > 0 ? ' + ' : ' - ') : G < 0 ? '-' : ''}${Math.abs(G) === 1 ? '' : Math.abs(G)}x`;
    if (H !== 0) formula += `${formula ? (H > 0 ? ' + ' : ' - ') : H < 0 ? '-' : ''}${Math.abs(H) === 1 ? '' : Math.abs(H)}y`;
    if (K !== 0) formula += `${formula ? (K > 0 ? ' + ' : ' - ') : K < 0 ? '-' : ''}${Math.abs(K)}`;

    return formula || '0';
  };

  return (
    <div className="container">
      <div className="title">数学十字君</div>
      <div className="subtitle">十字相乘法因式分解计算器</div>

      <div className="formula-display">
        <div className="formula-text">{getFormulaDisplay()}</div>
      </div>

      <div className="input-grid">
        <div className="input-item">
          <label className="input-label">x²</label>
          <input
            type="number"
            className="input-field"
            value={coeffs.A}
            onChange={(e) => handleCoeffChange('A', e.target.value)}
            step="any"
          />
        </div>
        <div className="input-item">
          <label className="input-label">xy</label>
          <input
            type="number"
            className="input-field"
            value={coeffs.D}
            onChange={(e) => handleCoeffChange('D', e.target.value)}
            step="any"
          />
        </div>
        <div className="input-item">
          <label className="input-label">y²</label>
          <input
            type="number"
            className="input-field"
            value={coeffs.B}
            onChange={(e) => handleCoeffChange('B', e.target.value)}
            step="any"
          />
        </div>
        <div className="input-item">
          <label className="input-label">x</label>
          <input
            type="number"
            className="input-field"
            value={coeffs.G}
            onChange={(e) => handleCoeffChange('G', e.target.value)}
            step="any"
          />
        </div>
        <div className="input-item">
          <label className="input-label">y</label>
          <input
            type="number"
            className="input-field"
            value={coeffs.H}
            onChange={(e) => handleCoeffChange('H', e.target.value)}
            step="any"
          />
        </div>
        <div className="input-item">
          <label className="input-label">常数</label>
          <input
            type="number"
            className="input-field"
            value={coeffs.K}
            onChange={(e) => handleCoeffChange('K', e.target.value)}
            step="any"
          />
        </div>
      </div>

      <button className="solve-button" onClick={solvePolynomial}>
        开始分解
      </button>

      <div className="example-buttons">
        <div style={{ color: '#22d3ee', fontSize: '14px', marginBottom: '5px' }}>示例多项式：</div>
        <button className="example-button" onClick={() => loadExample(1, 5, 1, 2, 3, 6)}>
          x² + 5xy + y² + 2x + 3y + 6
        </button>
        <button className="example-button" onClick={() => loadExample(2, 7, 3, 1, 4, -1)}>
          2x² + 7xy + 3y² + x + 4y - 1
        </button>
        <button className="example-button" onClick={() => loadExample(1, 5, 6, 5, 6, 0)}>
          x² + 5xy + 6y² + 5x + 6y
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {result && result.success && (
        <div className="result-container">
          <div className="result-title">✨ 分解结果 ✨</div>

          <div className="result-text" style={{ fontSize: '24px', color: '#fbbf24', fontWeight: 'bold' }}>
            ({result.a1 === 1 ? '' : result.a1 === -1 ? '-' : result.a1}x{formatCoeff(result.b1!, 'y')}
            {formatCoeff(result.c1!, '')}) ({result.a2 === 1 ? '' : result.a2 === -1 ? '-' : result.a2}x
            {formatCoeff(result.b2!, 'y')}
            {formatCoeff(result.c2!, '')})
          </div>

          <div className="cross-diagram">
            <div className="column">
              <div className="term-label">x</div>
              <div className="col-value">{result.a1}</div>
              <div className="col-value">{result.a2}</div>
            </div>

            <div className="column">
              <div className="term-label">y</div>
              <div className="col-value">{result.b1}</div>
              <div className="col-value">{result.b2}</div>
            </div>

            <div className="column">
              <div className="term-label">常数</div>
              <div className="col-value">{result.c1}</div>
              <div className="col-value">{result.c2}</div>
            </div>
          </div>

          <div className="result-text" style={{ fontSize: '16px' }}>
            <strong style={{ color: '#22d3ee' }}>验证过程：</strong>
          </div>

          <div className="calc-text">
            <strong>x² 项:</strong> {result.a1} × {result.a2} = {coeffs.A}
          </div>

          <div className="calc-text">
            <strong>xy 项:</strong> {result.a1} × {result.b2} + {result.a2} × {result.b1} ={' '}
            {result.a1! * result.b2!} + {result.a2! * result.b1!} = {coeffs.D}
          </div>

          <div className="calc-text">
            <strong>y² 项:</strong> {result.b1} × {result.b2} = {result.b1! * result.b2!}
          </div>

          <div className="calc-text">
            <strong>x 项:</strong> {result.a1} × {result.c2} + {result.a2} × {result.c1} ={' '}
            {result.a1! * result.c2!} + {result.a2! * result.c1!} = {coeffs.G}
          </div>

          <div className="calc-text">
            <strong>y 项:</strong> {result.b1} × {result.c2} + {result.b2} × {result.c1} ={' '}
            {result.b1! * result.c2!} + {result.b2! * result.c1!} = {coeffs.H}
          </div>

          <div className="calc-text">
            <strong>常数项:</strong> {result.c1} × {result.c2} = {coeffs.K}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
