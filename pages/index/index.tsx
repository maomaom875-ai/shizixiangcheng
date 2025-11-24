import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { PolynomialCoeffs, FactorResult, FactorStep, AppState } from '../../types';
import { DEFAULT_COEFFS, USE_TTS_FALLBACK, FORMULA_DISPLAY } from '../../constants';
import './index.css';

const MathMasterApp: React.FC = () => {
  const [coeffs, setCoeffs] = useState<PolynomialCoeffs>(DEFAULT_COEFFS);
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [result, setResult] = useState<FactorResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<{
    colL?: [string, string];
    colM?: [string, string];
    colR?: [string, string];
  }>({});
  const [animationState, setAnimationState] = useState<'idle' | 'beaming' | 'complete'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: 'Math Master 十字君' });
  }, []);

  const handleCoeffChange = (key: keyof PolynomialCoeffs, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    setCoeffs(prev => ({ ...prev, [key]: numValue }));
  };

  const factorizePolynomial = (coeffs: PolynomialCoeffs): FactorResult => {
    const { A, B, D, G, H, K } = coeffs;
    
    // 尝试十字相乘法分解 Ax² + Dxy + By² + Gx + Hy + K
    // 目标形式: (a₁x + b₁y + c₁)(a₂x + b₂y + c₂)
    
    // 首先检查是否可以简单分解
    if (A === 0 && B === 0 && D === 0) {
      return { success: false };
    }

    const steps: FactorStep[] = [];

    // Step 1: 引入
    steps.push({
      type: 'intro',
      audioKey: 'intro',
      description: '让我们用十字相乘法分解这个多项式',
    });

    // Step 2: 输入 x² 和 y² 系数
    steps.push({
      type: 'input_AB',
      audioKey: 'input_ab',
      description: `首先，分解 ${A}x² 和 ${B}y²`,
      highlightTerm: 'A',
      interactive: true,
    });

    // 尝试分解 A 和 B
    const factorsA = findFactors(A);
    const factorsB = findFactors(B);

    let found = false;
    let a1 = 0, a2 = 0, b1 = 0, b2 = 0, c1 = 0, c2 = 0;

    // 尝试所有可能的因数组合
    for (const [fa1, fa2] of factorsA) {
      for (const [fb1, fb2] of factorsB) {
        // 检查 xy 项
        if (fa1 * fb2 + fa2 * fb1 === D) {
          // 现在尝试分解常数项
          const factorsK = findFactors(K);
          for (const [fk1, fk2] of factorsK) {
            // 检查 x 和 y 项
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
      return { success: false };
    }

    // Step 3: 验证 xy 项
    steps.push({
      type: 'verify_xy',
      audioKey: 'verify_xy',
      description: `验证 xy 项: ${a1} × ${b2} + ${a2} × ${b1} = ${D}`,
      highlightTerm: 'D',
      expectedL: [a1, a2],
      expectedM: [b1, b2],
      visualData: {
        termLeft: 'x',
        termMid: 'y',
        colL: [a1, a2],
        colM: [b1, b2],
        crossCalc: `${a1}×${b2} + ${a2}×${b1} = ${D}`,
      },
    });

    // Step 4: 输入常数项
    steps.push({
      type: 'input_K',
      audioKey: 'input_k',
      description: `现在分解常数项 ${K}`,
      highlightTerm: 'K',
      interactive: true,
    });

    // Step 5: 验证线性项
    steps.push({
      type: 'verify_linear',
      audioKey: 'verify_linear',
      description: `验证 x 项: ${a1} × ${c2} + ${a2} × ${c1} = ${G}\n验证 y 项: ${b1} × ${c2} + ${b2} × ${c1} = ${H}`,
      highlightTerm: 'G',
      expectedL: [a1, a2],
      expectedM: [b1, b2],
      expectedR: [c1, c2],
      visualData: {
        termLeft: 'x',
        termMid: 'y',
        termRight: '',
        colL: [a1, a2],
        colM: [b1, b2],
        colR: [c1, c2],
        crossCalc: `x: ${a1}×${c2} + ${a2}×${c1} = ${G}\ny: ${b1}×${c2} + ${b2}×${c1} = ${H}`,
      },
    });

    // Step 6: 最终结果
    steps.push({
      type: 'final',
      audioKey: 'final',
      description: `因式分解结果: (${a1}x ${b1 >= 0 ? '+' : ''}${b1}y ${c1 >= 0 ? '+' : ''}${c1})(${a2}x ${b2 >= 0 ? '+' : ''}${b2}y ${c2 >= 0 ? '+' : ''}${c2})`,
    });

    return {
      success: true,
      terms: {
        group1: { a: a1, b: b1, c: c1 },
        group2: { a: a2, b: b2, c: c2 },
      },
      steps,
    };
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

  const handleSolve = () => {
    setAppState(AppState.SOLVING);
    setCurrentStepIndex(0);
    setUserInputs({});
    setAnimationState('idle');

    const factorResult = factorizePolynomial(coeffs);
    setResult(factorResult);

    if (!factorResult.success) {
      Taro.showToast({
        title: '无法分解此多项式',
        icon: 'none',
        duration: 2000,
      });
      setTimeout(() => {
        setAppState(AppState.INPUT);
      }, 2000);
    }
  };

  const handleNextStep = () => {
    if (result && result.steps && currentStepIndex < result.steps.length - 1) {
      const currentStep = result.steps[currentStepIndex];
      
      if (currentStep.interactive) {
        // 验证用户输入
        const isValid = validateUserInputs(currentStep);
        if (!isValid) {
          Taro.showToast({
            title: '输入有误，请重试',
            icon: 'none',
          });
          return;
        }
      }

      setCurrentStepIndex(prev => prev + 1);
      
      if (currentStepIndex === result.steps!.length - 2) {
        // 最后一步，显示动画
        setAnimationState('beaming');
        setTimeout(() => {
          setAnimationState('complete');
        }, 800);
      }
    } else {
      // 完成，返回输入界面
      setAppState(AppState.INPUT);
      setResult(null);
      setAnimationState('idle');
    }
  };

  const validateUserInputs = (step: FactorStep): boolean => {
    if (step.expectedL && userInputs.colL) {
      const [l1, l2] = userInputs.colL;
      if (parseFloat(l1) !== step.expectedL[0] || parseFloat(l2) !== step.expectedL[1]) {
        return false;
      }
    }
    if (step.expectedM && userInputs.colM) {
      const [m1, m2] = userInputs.colM;
      if (parseFloat(m1) !== step.expectedM[0] || parseFloat(m2) !== step.expectedM[1]) {
        return false;
      }
    }
    if (step.expectedR && userInputs.colR) {
      const [r1, r2] = userInputs.colR;
      if (parseFloat(r1) !== step.expectedR[0] || parseFloat(r2) !== step.expectedR[1]) {
        return false;
      }
    }
    return true;
  };

  const handleUserInput = (col: 'colL' | 'colM' | 'colR', index: 0 | 1, value: string) => {
    setUserInputs(prev => ({
      ...prev,
      [col]: index === 0 
        ? [value, prev[col]?.[1] || '']
        : [prev[col]?.[0] || '', value]
    }));
  };

  const renderInputForm = () => {
    return (
      <View className="input-container">
        <Text className="title">数学十字君 - 因式分解助手</Text>
        <Text className="subtitle">输入多项式系数</Text>
        
        <View className="formula-display">
          <Text className="formula-text">
            {coeffs.A !== 0 && `${coeffs.A}x²`}
            {coeffs.D !== 0 && ` ${coeffs.D >= 0 ? '+' : ''}${coeffs.D}xy`}
            {coeffs.B !== 0 && ` ${coeffs.B >= 0 ? '+' : ''}${coeffs.B}y²`}
            {coeffs.G !== 0 && ` ${coeffs.G >= 0 ? '+' : ''}${coeffs.G}x`}
            {coeffs.H !== 0 && ` ${coeffs.H >= 0 ? '+' : ''}${coeffs.H}y`}
            {coeffs.K !== 0 && ` ${coeffs.K >= 0 ? '+' : ''}${coeffs.K}`}
          </Text>
        </View>

        <View className="input-grid">
          {FORMULA_DISPLAY.map(({ key, term }) => (
            <View key={key} className="input-item">
              <Text className="input-label">{term || '常数'}</Text>
              <Input
                type="digit"
                className="input-field"
                value={String(coeffs[key as keyof PolynomialCoeffs])}
                onInput={(e) => handleCoeffChange(key as keyof PolynomialCoeffs, e.detail.value)}
                placeholder="0"
              />
            </View>
          ))}
        </View>

        <Button className="solve-button" onClick={handleSolve}>
          开始分解
        </Button>

        <View className="examples">
          <Text className="examples-title">示例多项式：</Text>
          <Button 
            className="example-button"
            onClick={() => setCoeffs({ A: 1, B: 1, C: 0, D: 5, E: 0, F: 0, G: 2, H: 3, K: 6 })}
          >
            x² + 5xy + y² + 2x + 3y + 6
          </Button>
          <Button 
            className="example-button"
            onClick={() => setCoeffs({ A: 2, B: 3, C: 0, D: 7, E: 0, F: 0, G: 1, H: 4, K: -1 })}
          >
            2x² + 7xy + 3y² + x + 4y - 1
          </Button>
        </View>
      </View>
    );
  };

  const renderSolvingSteps = () => {
    if (!result || !result.steps) return null;

    const currentStep = result.steps[currentStepIndex];

    return (
      <View className="solving-container">
        <Text className="step-title">
          步骤 {currentStepIndex + 1} / {result.steps.length}
        </Text>

        <Text className="step-description">{currentStep.description}</Text>

        {currentStep.visualData && (
          <View className={`cross-diagram ${animationState}`}>
            {currentStep.visualData.colL && (
              <View className="column left-col animate-beam-left">
                <Text className="term-label">{currentStep.visualData.termLeft}</Text>
                <View className="col-values">
                  <Text className="col-value">{currentStep.visualData.colL[0]}</Text>
                  <Text className="col-value">{currentStep.visualData.colL[1]}</Text>
                </View>
              </View>
            )}

            {currentStep.visualData.colM && (
              <View className="column mid-col">
                <Text className="term-label">{currentStep.visualData.termMid}</Text>
                <View className="col-values">
                  <Text className="col-value">{currentStep.visualData.colM[0]}</Text>
                  <Text className="col-value">{currentStep.visualData.colM[1]}</Text>
                </View>
              </View>
            )}

            {currentStep.visualData.colR && (
              <View className="column right-col animate-beam-right">
                <Text className="term-label">{currentStep.visualData.termRight || '常数'}</Text>
                <View className="col-values">
                  <Text className="col-value">{currentStep.visualData.colR[0]}</Text>
                  <Text className="col-value">{currentStep.visualData.colR[1]}</Text>
                </View>
              </View>
            )}

            {currentStep.visualData.crossCalc && animationState === 'complete' && (
              <View className="cross-calc animate-explode">
                <Text className="calc-text">{currentStep.visualData.crossCalc}</Text>
              </View>
            )}
          </View>
        )}

        {currentStep.interactive && (
          <View className="input-section">
            <Text className="input-hint">请输入分解后的值：</Text>
            <View className="interactive-inputs">
              <Input
                type="digit"
                className="small-input"
                placeholder="值1"
                onInput={(e) => handleUserInput('colL', 0, e.detail.value)}
              />
              <Input
                type="digit"
                className="small-input"
                placeholder="值2"
                onInput={(e) => handleUserInput('colL', 1, e.detail.value)}
              />
            </View>
          </View>
        )}

        <View className="button-group">
          <Button className="next-button" onClick={handleNextStep}>
            {currentStepIndex === result.steps.length - 1 ? '完成' : '下一步'}
          </Button>
          <Button 
            className="back-button" 
            onClick={() => {
              setAppState(AppState.INPUT);
              setResult(null);
            }}
          >
            返回
          </Button>
        </View>
      </View>
    );
  };

  return (
    <View className="math-master-container">
      {appState === AppState.INPUT ? renderInputForm() : renderSolvingSteps()}
    </View>
  );
};

export default MathMasterApp;
