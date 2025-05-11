
'use client';

import type { FractionValue, FractionOperator, FractionExpressionDef } from '@/types/fractionDuel';

// GCD and LCM functions (can be imported from mathUtils if preferred)
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b) || 0; // Ensure not NaN if gcd is 0 (though unlikely for den)
}

export function simplifyFraction(fraction: FractionValue): FractionValue {
  if (fraction.den === 0) {
    // Handle division by zero, perhaps return as is or throw error
    // For game purposes, might return a specific "undefined" marker if needed
    return { num: fraction.num, den: 0 }; 
  }
  if (fraction.num === 0) {
    return { num: 0, den: 1 }; // 0/den simplifies to 0/1
  }
  const commonDivisor = gcd(Math.abs(fraction.num), Math.abs(fraction.den));
  let num = fraction.num / commonDivisor;
  let den = fraction.den / commonDivisor;

  // Ensure denominator is positive
  if (den < 0) {
    num = -num;
    den = -den;
  }
  return { num, den };
}

function addFractions(f1: FractionValue, f2: FractionValue): FractionValue {
  const commonDen = lcm(f1.den, f2.den);
  if (commonDen === 0) return { num: 1, den: 0 }; // Error case
  const num1 = f1.num * (commonDen / f1.den);
  const num2 = f2.num * (commonDen / f2.den);
  return simplifyFraction({ num: num1 + num2, den: commonDen });
}

function subtractFractions(f1: FractionValue, f2: FractionValue): FractionValue {
  return addFractions(f1, { num: -f2.num, den: f2.den });
}

function multiplyFractions(f1: FractionValue, f2: FractionValue): FractionValue {
  return simplifyFraction({ num: f1.num * f2.num, den: f1.den * f2.den });
}

function divideFractions(f1: FractionValue, f2: FractionValue): FractionValue {
  if (f2.num === 0) return { num: 1, den: 0 }; // Division by zero fraction
  return multiplyFractions(f1, { num: f2.den, den: f2.num });
}

export function evaluateExpression(expression: FractionExpressionDef): FractionValue {
  if (!expression.fractions || expression.fractions.length === 0) {
    return { num: 0, den: 1 }; // Or throw error
  }

  let result = expression.fractions[0];
  for (let i = 1; i < expression.fractions.length; i++) {
    const nextFraction = expression.fractions[i];
    switch (expression.operator) {
      case '+':
        result = addFractions(result, nextFraction);
        break;
      case '-':
        result = subtractFractions(result, nextFraction);
        break;
      case '*':
        result = multiplyFractions(result, nextFraction);
        break;
      case '/':
        result = divideFractions(result, nextFraction);
        break;
      default:
        // Should not happen with typed operator
        return { num: 1, den: 0 }; // Error
    }
    if (result.den === 0) return result; // Propagate error
  }
  return result;
}

function generateRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateFraction(difficultyLevel: number): FractionValue {
  let minDen = 2, maxDen = 6;
  if (difficultyLevel >= 2) { minDen = 3; maxDen = 8; }
  if (difficultyLevel >= 3) { minDen = 4; maxDen = 10; }
  if (difficultyLevel >= 4) { minDen = 5; maxDen = 12; }

  const den = generateRandomInt(minDen, maxDen);
  // Numerator generally smaller than denominator for "proper" fractions in quiz
  const num = generateRandomInt(1, den -1 > 0 ? den-1 : 1); 
  return simplifyFraction({ num, den });
}

export function generateOperator(difficultyLevel: number): FractionOperator {
  const operators: FractionOperator[] = ['+'];
  if (difficultyLevel >= 2) operators.push('-');
  if (difficultyLevel >= 3) operators.push('*');
  if (difficultyLevel >= 4) operators.push('/');
  return operators[generateRandomInt(0, operators.length - 1)];
}

export function generateQuestion(turn: number): {
  expression: FractionExpressionDef;
  correctAnswer: FractionValue;
  choices: FractionValue[];
} {
  let difficultyLevel = 1; // 1-3
  if (turn >= 4) difficultyLevel = 2; // 4-6
  if (turn >= 7) difficultyLevel = 3; // 7-8
  if (turn >= 9) difficultyLevel = 4; // 9-10

  let numTerms = 2;
  if (difficultyLevel >= 2 && Math.random() > 0.5) numTerms = 3; // 2-3 terms for mid difficulty
  if (difficultyLevel >= 4) numTerms = 3; // 3 terms for highest difficulty

  const fractions: FractionValue[] = [];
  for (let i = 0; i < numTerms; i++) {
    fractions.push(generateFraction(difficultyLevel));
  }
  const operator = generateOperator(difficultyLevel);
  const expression: FractionExpressionDef = { fractions, operator };
  const correctAnswer = evaluateExpression(expression);

  const choices = generateDistractors(correctAnswer, 3, difficultyLevel);
  choices.push(correctAnswer);
  // Shuffle choices
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return { expression, correctAnswer, choices };
}

export function generateDistractors(
  correctAnswer: FractionValue,
  count: number,
  difficultyLevel: number
): FractionValue[] {
  const distractors: FractionValue[] = [];
  const usedDistractors = new Set<string>(); // To avoid duplicate distractors as strings "num/den"
  usedDistractors.add(`${correctAnswer.num}/${correctAnswer.den}`);

  while (distractors.length < count) {
    let distractor: FractionValue;
    const type = generateRandomInt(1, 4);

    switch (type) {
      case 1: // Slightly off numerator
        distractor = { num: correctAnswer.num + generateRandomInt(-2, 2) || 1, den: correctAnswer.den };
        break;
      case 2: // Slightly off denominator
        distractor = { num: correctAnswer.num, den: correctAnswer.den + generateRandomInt(-2, 2) || 1 };
        break;
      case 3: // Unsimplified version (if possible) or common mistake
        if (Math.random() > 0.5 && correctAnswer.num !== 0) { // Try unsimplified
            const factor = generateRandomInt(2,3);
            distractor = { num: correctAnswer.num * factor, den: correctAnswer.den * factor};
        } else { // Common mistake, e.g. adding/multiplying numerators and denominators directly
            distractor = {num: correctAnswer.num +1, den: correctAnswer.den +1}; // Placeholder for more complex common error
        }
        break;
      default: // Reciprocal or inverted sign
         if (correctAnswer.num !== 0 && Math.random() > 0.5) {
            distractor = { num: correctAnswer.den, den: correctAnswer.num };
         } else {
            distractor = { num: -correctAnswer.num, den: correctAnswer.den };
         }
        break;
    }
    
    distractor = simplifyFraction(distractor);
    // Ensure distractor is not same as correct answer and not already added
    const distractorString = `${distractor.num}/${distractor.den}`;
    if (distractor.den > 0 && !usedDistractors.has(distractorString) && (distractor.num !== correctAnswer.num || distractor.den !== correctAnswer.den)) {
      distractors.push(distractor);
      usedDistractors.add(distractorString);
    }
  }
  return distractors;
}
