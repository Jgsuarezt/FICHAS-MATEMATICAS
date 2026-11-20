import {
  FractionValue,
  GeneratedExercise,
  WorksheetConfig,
} from "@/lib/types";

function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let activeRng: () => number = createRng(1);

function randInt(min: number, max: number): number {
  return Math.floor(activeRng() * (max - min + 1)) + min;
}

function rangeForDigits(digits: number): [number, number] {
  if (digits <= 1) return [1, 9];
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return [min, max];
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function simplifyFraction(num: number, den: number): FractionValue {
  if (num === 0) return { num: 0, den: 1 };
  const divisor = gcd(num, den);
  return { num: num / divisor, den: den / divisor };
}

function formatFractionAnswer(f: FractionValue): string {
  const s = simplifyFraction(f.num, f.den);
  if (s.den === 1) return String(s.num);
  return `${s.num}/${s.den}`;
}

function hasAdditionCarry(a: number, b: number): boolean {
  let x = a;
  let y = b;
  while (x > 0 || y > 0) {
    if ((x % 10) + (y % 10) >= 10) return true;
    x = Math.floor(x / 10);
    y = Math.floor(y / 10);
  }
  return false;
}

function hasSubtractionBorrow(a: number, b: number): boolean {
  let x = a;
  let y = b;
  while (x > 0 || y > 0) {
    if (x % 10 < y % 10) return true;
    x = Math.floor(x / 10);
    y = Math.floor(y / 10);
  }
  return false;
}

function toRoman(num: number): string {
  const map: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let n = num;
  let res = "";
  for (const [val, sym] of map) {
    while (n >= val) {
      res += sym;
      n -= val;
    }
  }
  return res;
}

function generateAddition(config: WorksheetConfig, id: number): GeneratedExercise {
  const [minA, maxA] = rangeForDigits(config.digitsA);
  const [minB, maxB] = rangeForDigits(config.digitsB);

  for (let attempt = 0; attempt < 60; attempt++) {
    const a = randInt(minA, maxA);
    const b = randInt(minB, maxB);
    const carry = hasAdditionCarry(a, b);
    if (config.carry && carry) {
      return { id, kind: "addition", a, b, operator: "+", answer: String(a + b) };
    }
    if (!config.carry && !carry) {
      return { id, kind: "addition", a, b, operator: "+", answer: String(a + b) };
    }
  }
  // Constructive fallback for no-carry
  if (!config.carry) {
    let a = 0;
    let b = 0;
    const len = Math.max(config.digitsA, config.digitsB);
    for (let i = 0; i < len; i++) {
      const da = i < config.digitsA ? randInt(i === config.digitsA - 1 ? 1 : 0, 8) : 0;
      const maxDb = 9 - da;
      const db = i < config.digitsB ? randInt(i === config.digitsB - 1 && maxDb >= 1 ? 1 : 0, maxDb) : 0;
      a += da * Math.pow(10, i);
      b += db * Math.pow(10, i);
    }
    return { id, kind: "addition", a, b, operator: "+", answer: String(a + b) };
  }
  const a = randInt(minA, maxA);
  const b = randInt(minB, maxB);
  return { id, kind: "addition", a, b, operator: "+", answer: String(a + b) };
}

function generateSubtraction(config: WorksheetConfig, id: number): GeneratedExercise {
  const [minA, maxA] = rangeForDigits(config.digitsA);
  const [minB, maxB] = rangeForDigits(config.digitsB);

  for (let attempt = 0; attempt < 80; attempt++) {
    let a = randInt(minA, maxA);
    let b = randInt(minB, Math.min(maxB, a));
    if (a < b) [a, b] = [b, a];
    if (a === b) continue;
    const borrow = hasSubtractionBorrow(a, b);
    if (config.carry && borrow) {
      return { id, kind: "subtraction", a, b, operator: "-", answer: String(a - b) };
    }
    if (!config.carry && !borrow) {
      return { id, kind: "subtraction", a, b, operator: "-", answer: String(a - b) };
    }
  }
  // Constructive fallback
  if (!config.carry) {
    let a = 0;
    let b = 0;
    for (let i = 0; i < config.digitsA; i++) {
      const da = randInt(i === config.digitsA - 1 ? 2 : 1, 9);
      const db = i < config.digitsB ? randInt(i === config.digitsB - 1 ? 1 : 0, da) : 0;
      a += da * Math.pow(10, i);
      b += db * Math.pow(10, i);
    }
    return { id, kind: "subtraction", a, b, operator: "-", answer: String(a - b) };
  }
  const a = Math.max(minA + 10, randInt(minA, maxA));
  const b = randInt(minB, Math.min(maxB, a - 1));
  return { id, kind: "subtraction", a, b, operator: "-", answer: String(a - b) };
}

function generateMultiplication(config: WorksheetConfig, id: number): GeneratedExercise {
  if (config.tableNumber !== undefined) {
    const table = config.tableNumber === 0 ? randInt(1, 12) : config.tableNumber;
    const factor = randInt(1, 12);
    const swap = config.tableNumber === 0 && activeRng() > 0.5;
    const a = swap ? factor : table;
    const b = swap ? table : factor;
    return { id, kind: "multiplication", a, b, operator: "×", answer: String(a * b) };
  }
  const [minA, maxA] = rangeForDigits(config.digitsA);
  const [minB, maxB] = rangeForDigits(config.digitsB);
  const a = randInt(Math.max(2, minA), maxA);
  const b = randInt(Math.max(2, minB), maxB);
  return { id, kind: "multiplication", a, b, operator: "×", answer: String(a * b) };
}

function generateDivision(config: WorksheetConfig, id: number): GeneratedExercise {
  const [minB, maxB] = rangeForDigits(config.digitsB);
  const divisor = randInt(Math.max(2, minB), maxB);

  const [minA, maxA] = rangeForDigits(config.digitsA);
  let dividend = randInt(Math.max(divisor * 2, minA), Math.max(divisor * 3, maxA));

  // For "facil", prefer exact divisions 70% of the time
  if (config.difficulty === "facil" && activeRng() < 0.7) {
    const q = randInt(Math.max(2, Math.floor(minA / divisor)), Math.max(3, Math.floor(maxA / divisor)));
    dividend = q * divisor;
  }

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  const answer = remainder === 0 ? String(quotient) : `${quotient} (R ${remainder})`;

  return {
    id,
    kind: "division",
    a: dividend,
    b: divisor,
    operator: "÷",
    answer,
    remainder,
  };
}

function generateFractions(config: WorksheetConfig, id: number): GeneratedExercise {
  const isMultiply = config.topicSlug.includes("multiplicar");
  const operator: "+" | "-" | "×" = isMultiply
    ? "×"
    : activeRng() < 0.35 && config.difficulty !== "facil"
    ? "-"
    : "+";

  if (operator === "×") {
    const denA = randInt(2, 9);
    const numA = randInt(1, denA - 1);
    const denB = randInt(2, 9);
    const numB = randInt(1, denB - 1);
    const ans = formatFractionAnswer({ num: numA * numB, den: denA * denB });
    return {
      id,
      kind: "fractions",
      operator: "×",
      fracA: { num: numA, den: denA },
      fracB: { num: numB, den: denB },
      answer: ans,
    };
  }

  // Addition or subtraction
  const sameDen = config.difficulty === "facil";
  const denA = randInt(2, config.difficulty === "dificil" ? 12 : 8);
  const denB = sameDen ? denA : randInt(2, config.difficulty === "dificil" ? 12 : 8);

  let numA = randInt(1, denA);
  let numB = randInt(1, denB);

  if (operator === "-") {
    // Ensure fracA >= fracB
    if (numA * denB < numB * denA) {
      [numA, numB] = [numB, numA];
      if (!sameDen) {
        // Re-clamp to avoid improper if needed, or just return positive diff
      }
    }
    const rawNum = numA * denB - numB * denA;
    if (rawNum < 0) {
      return generateFractions(config, id);
    }
    const ans = formatFractionAnswer({ num: rawNum, den: denA * denB });
    return {
      id,
      kind: "fractions",
      operator: "-",
      fracA: { num: numA, den: denA },
      fracB: { num: numB, den: denB },
      answer: ans,
    };
  }

  const rawNum = numA * denB + numB * denA;
  const ans = formatFractionAnswer({ num: rawNum, den: denA * denB });
  return {
    id,
    kind: "fractions",
    operator: "+",
    fracA: { num: numA, den: denA },
    fracB: { num: numB, den: denB },
    answer: ans,
  };
}

function generateComparison(config: WorksheetConfig, id: number): GeneratedExercise {
  const [minA, maxA] = rangeForDigits(config.digitsA);
  const a = randInt(minA, maxA);
  let b = randInt(minA, maxA);
  if (activeRng() < 0.15) b = a; // 15% equal
  const ans = a > b ? ">" : a < b ? "<" : "=";
  return { id, kind: "comparison", a, b, answer: ans };
}

function generateSequence(config: WorksheetConfig, id: number): GeneratedExercise {
  const stepChoices =
    config.difficulty === "facil"
      ? [1, 2, 5, 10]
      : config.difficulty === "medio"
      ? [2, 3, 4, 5, 10, -2, -5]
      : [3, 4, 6, 7, 8, 9, -3, -4, -6];
  const step = stepChoices[randInt(0, stepChoices.length - 1)];
  const start =
    step > 0
      ? randInt(1, config.difficulty === "facil" ? 20 : 60)
      : randInt(Math.abs(step) * 6 + 5, 99);

  const length = 6;
  const full = Array.from({ length }, (_, idx) => start + idx * step);
  // Hide 2 positions (never index 0 and 1 together so pattern is clear)
  const hide1 = randInt(2, 3);
  const hide2 = randInt(4, 5);
  const sequence = full.map((val, idx) => (idx === hide1 || idx === hide2 ? null : val));
  const answer = `${full[hide1]}, ${full[hide2]}`;
  return { id, kind: "sequence", sequence, answer };
}

function generateRoman(config: WorksheetConfig, id: number): GeneratedExercise {
  const maxVal =
    config.difficulty === "facil" ? 50 : config.difficulty === "medio" ? 400 : 2500;
  const n = randInt(2, maxVal);
  const roman = toRoman(n);
  const askRomanToArabic = activeRng() > 0.5;
  if (askRomanToArabic) {
    return { id, kind: "roman", romanPrompt: `${roman} =`, answer: String(n) };
  }
  return { id, kind: "roman", romanPrompt: `${n} =`, answer: roman };
}

function generateMental(config: WorksheetConfig, id: number): GeneratedExercise {
  const opRoll = activeRng();
  const maxNum =
    config.difficulty === "facil" ? 20 : config.difficulty === "medio" ? 99 : 250;

  if (opRoll < 0.38) {
    const a = randInt(2, maxNum);
    const b = randInt(2, config.difficulty === "facil" ? 15 : 50);
    return { id, kind: "mental", a, b, operator: "+", answer: String(a + b) };
  }
  if (opRoll < 0.72) {
    const a = randInt(10, maxNum);
    const b = randInt(2, a - 1);
    return { id, kind: "mental", a, b, operator: "-", answer: String(a - b) };
  }
  const a = randInt(2, config.difficulty === "facil" ? 6 : 12);
  const b = randInt(2, config.difficulty === "dificil" ? 15 : 10);
  return { id, kind: "mental", a, b, operator: "×", answer: String(a * b) };
}

export function generateWorksheet(
  config: WorksheetConfig,
  seed = 1
): GeneratedExercise[] {
  activeRng = createRng(seed);
  const exercises: GeneratedExercise[] = [];
  const seen = new Set<string>();

  for (let i = 1; i <= config.count; i++) {
    let ex: GeneratedExercise | null = null;
    for (let retry = 0; retry < 15; retry++) {
      let candidate: GeneratedExercise;
      switch (config.kind) {
        case "addition":
          candidate = generateAddition(config, i);
          break;
        case "subtraction":
          candidate = generateSubtraction(config, i);
          break;
        case "multiplication":
          candidate = generateMultiplication(config, i);
          break;
        case "division":
          candidate = generateDivision(config, i);
          break;
        case "fractions":
          candidate = generateFractions(config, i);
          break;
        case "comparison":
          candidate = generateComparison(config, i);
          break;
        case "sequence":
          candidate = generateSequence(config, i);
          break;
        case "roman":
          candidate = generateRoman(config, i);
          break;
        case "mental":
        default:
          candidate = generateMental(config, i);
          break;
      }

      const key = `${candidate.a}-${candidate.operator}-${candidate.b}-${candidate.romanPrompt}-${candidate.sequence?.join(",")}-${candidate.fracA?.num}/${candidate.fracA?.den}`;
      if (!seen.has(key) || retry === 14) {
        seen.add(key);
        ex = candidate;
        break;
      }
    }
    if (ex) exercises.push(ex);
  }

  return exercises;
}
