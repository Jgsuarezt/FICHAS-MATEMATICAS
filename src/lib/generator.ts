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

function generateNeighbors(config: WorksheetConfig, id: number): GeneratedExercise {
  const maxVal =
    config.difficulty === "facil" ? 29 : config.difficulty === "medio" ? 199 : 999;
  const n = randInt(2, maxVal);
  return {
    id,
    kind: "neighbors",
    a: n,
    promptText: `____  <  ${n}  <  ____`,
    answer: `${n - 1}, ${n + 1}`,
  };
}

function generatePlaceValue(config: WorksheetConfig, id: number): GeneratedExercise {
  if (config.difficulty === "facil") {
    const d = randInt(1, 9);
    const u = randInt(0, 9);
    const n = d * 10 + u;
    return {
      id,
      kind: "placeValue",
      promptText: `${n} =  ___ D + ___ U`,
      answer: `${d} D + ${u} U`,
    };
  }
  const c = randInt(1, 9);
  const d = randInt(0, 9);
  const u = randInt(0, 9);
  const n = c * 100 + d * 10 + u;
  if (activeRng() > 0.5 && config.difficulty === "dificil") {
    return {
      id,
      kind: "placeValue",
      promptText: `${c} C + ${d} D + ${u} U =`,
      answer: String(n),
    };
  }
  return {
    id,
    kind: "placeValue",
    promptText: `${n} =  ___ C + ___ D + ___ U`,
    answer: `${c} C + ${d} D + ${u} U`,
  };
}

function generateDecimals(config: WorksheetConfig, id: number): GeneratedExercise {
  const scale = config.difficulty === "facil" ? 10 : 100;
  const maxBase = config.difficulty === "dificil" ? 99 : 25;
  const isSub = activeRng() < 0.4;
  let aInt = randInt(scale, maxBase * scale);
  let bInt = randInt(Math.floor(scale / 2), maxBase * scale);
  if (isSub && aInt < bInt) [aInt, bInt] = [bInt, aInt];
  const aStr = (aInt / scale).toFixed(scale === 10 ? 1 : 2).replace(".", ",");
  const bStr = (bInt / scale).toFixed(scale === 10 ? 1 : 2).replace(".", ",");
  const resInt = isSub ? aInt - bInt : aInt + bInt;
  const ansStr = (resInt / scale).toFixed(scale === 10 ? 1 : 2).replace(".", ",");
  return {
    id,
    kind: "decimals",
    operator: isSub ? "-" : "+",
    promptText: `${aStr} ${isSub ? "-" : "+"} ${bStr} =`,
    answer: ansStr,
  };
}

function generateRuleOfThree(config: WorksheetConfig, id: number): GeneratedExercise {
  const unitVal = randInt(2, config.difficulty === "facil" ? 5 : 12);
  const a = randInt(2, config.difficulty === "facil" ? 6 : 10);
  let c = randInt(2, config.difficulty === "dificil" ? 15 : 10);
  if (c === a) c += 1;
  const b = a * unitVal;
  const ans = c * unitVal;
  return {
    id,
    kind: "ruleOfThree",
    promptText: `${a}  ->  ${b}   |   ${c}  ->  ___`,
    answer: String(ans),
  };
}

function generateMcmMcd(config: WorksheetConfig, id: number): GeneratedExercise {
  const pool =
    config.difficulty === "facil"
      ? [4, 6, 8, 9, 10, 12]
      : config.difficulty === "medio"
      ? [6, 8, 10, 12, 14, 15, 16, 18, 20, 24]
      : [12, 15, 18, 20, 24, 28, 30, 36, 40, 45];
  const a = pool[randInt(0, pool.length - 1)];
  let b = pool[randInt(0, pool.length - 1)];
  if (b === a) b = pool[(pool.indexOf(a) + 1) % pool.length];
  const isMcm = activeRng() > 0.45;
  const g = gcd(a, b);
  const ans = isMcm ? (a * b) / g : g;
  return {
    id,
    kind: "mcmMcd",
    promptText: `${isMcm ? "MCM" : "MCD"}(${a}, ${b}) =`,
    answer: String(ans),
  };
}

function generateCombined(config: WorksheetConfig, id: number): GeneratedExercise {
  const a = randInt(2, config.difficulty === "facil" ? 9 : 15);
  const b = randInt(2, config.difficulty === "facil" ? 9 : 12);
  const c = randInt(2, config.difficulty === "facil" ? 5 : 9);
  const d = randInt(1, 10);

  if (config.difficulty === "facil") {
    // a + b x c
    const ans = a + b * c;
    return {
      id,
      kind: "combined",
      promptText: `${a} + ${b} × ${c} =`,
      answer: String(ans),
    };
  }
  if (config.difficulty === "medio") {
    // (a + b) x c
    const ans = (a + b) * c;
    return {
      id,
      kind: "combined",
      promptText: `(${a} + ${b}) × ${c} =`,
      answer: String(ans),
    };
  }
  // (a + b) x c - d (ensure positive)
  const base = (a + b) * c;
  const sub = Math.min(d, base - 1);
  return {
    id,
    kind: "combined",
    promptText: `(${a} + ${b}) × ${c} - ${sub} =`,
    answer: String(base - sub),
  };
}

function generateBalance(config: WorksheetConfig, id: number): GeneratedExercise {
  const x = randInt(2, config.difficulty === "facil" ? 12 : 15);

  if (config.difficulty === "facil") {
    // x + c = total
    const leftConst = randInt(2, 15);
    const rightConst = x + leftConst;
    return {
      id,
      kind: "balance",
      balance: { leftX: 1, leftConst, rightX: 0, rightConst },
      answer: String(x),
    };
  }

  if (config.difficulty === "medio") {
    // 2x + c = total or 3x + c = total
    const leftX = randInt(2, 3);
    const leftConst = randInt(1, 12);
    const rightConst = leftX * x + leftConst;
    return {
      id,
      kind: "balance",
      balance: { leftX, leftConst, rightX: 0, rightConst },
      answer: String(x),
    };
  }

  // dificil: 2x + c = x + d  or  3x + c = x + d
  const rightX = 1;
  const leftX = randInt(2, 3);
  const leftConst = randInt(1, 10);
  const rightConst = (leftX - rightX) * x + leftConst;
  return {
    id,
    kind: "balance",
    balance: { leftX, leftConst, rightX, rightConst },
    answer: String(x),
  };
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(activeRng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildOlympiadOptions(
  correctVal: string,
  distractors: string[]
): { options: { label: string; value: string }[]; correctLabel: string } {
  const unique = [correctVal];
  for (const d of distractors) {
    if (!unique.includes(d) && unique.length < 5) unique.push(d);
  }
  let fallback = 1;
  while (unique.length < 5) {
    const cand = String(fallback++);
    if (!unique.includes(cand)) unique.push(cand);
  }
  const shuffled = shuffleArray(unique);
  const labels = ["A", "B", "C", "D", "E"];
  const options = shuffled.map((val, idx) => ({ label: labels[idx], value: val }));
  const correctLabel = options.find((o) => o.value === correctVal)?.label ?? "A";
  return { options, correctLabel };
}

function generateOlympiad(config: WorksheetConfig, id: number): GeneratedExercise {
  const templatePool =
    config.difficulty === "facil"
      ? [8, 0, 5, 1, 6, 2, 3, 4]
      : config.difficulty === "medio"
      ? [8, 5, 6, 9, 1, 2, 3, 4]
      : [8, 9, 6, 7, 5, 4, 2, 0];

  const tpl = templatePool[(id - 1) % templatePool.length];
  const namesPool = ["Adrián", "María", "Lucía", "Mateo", "Sofía", "Daniel", "Andrea", "Carlos", "Elena", "Hugo"];

  let question = "";
  let correctVal = "";
  let distractors: string[] = [];
  let diagram: NonNullable<GeneratedExercise["olympiad"]>["diagram"] = undefined;

  switch (tpl) {
    case 0: {
      // Ordenación lógica (estilo Problema 2 OMEC)
      const picked = shuffleArray(namesPool).slice(0, 5);
      const [n1, n2, n3, n4, n5] = picked;
      const askTallest = activeRng() > 0.5;
      question = `${n2} es más alto que ${n1}, pero más pequeño que ${n3}. ${n4} es más alto que ${n5}, pero más pequeño que ${n2}. ¿Quién es la persona más ${askTallest ? "alta" : "baja"}?`;
      correctVal = askTallest ? n3 : n5;
      distractors = picked.filter((n) => n !== correctVal);
      break;
    }
    case 1: {
      // Número de dos dígitos + suma (estilo Problema 3 OMEC)
      const firstDigit = randInt(2, 7);
      const secondDigit = randInt(1, 9);
      const twoDigit = firstDigit * 10 + secondDigit;
      const addend = randInt(11, 29);
      const result = twoDigit + addend;
      const askFirst = activeRng() > 0.4;
      question = `Mario escribió un dígito y después escribió otro a su derecha. Luego sumó ${addend} al número de dos dígitos que formó y obtuvo ${result}. ¿Cuál es el ${askFirst ? "primer" : "segundo"} dígito que escribió?`;
      const ansNum = askFirst ? firstDigit : secondDigit;
      correctVal = String(ansNum);
      distractors = [
        String(askFirst ? secondDigit : firstDigit),
        String(ansNum + 1),
        String(Math.max(1, ansNum - 1)),
        String((ansNum + 2) % 10),
      ];
      break;
    }
    case 2: {
      // Precios y compras (estilo Problema 5 OMEC)
      const pPaleta = randInt(3, 8) * 10;
      const pGalleta = randInt(5, 12) * 10;
      const nPal = randInt(2, 4);
      const nGal = randInt(2, 4);
      const totalPal = ((pPaleta * nPal) / 100).toFixed(2);
      const totalGal = ((pGalleta * nGal) / 100).toFixed(2);
      const ansCents = pPaleta + pGalleta;
      question = `Lourdes pagó $${totalPal} por ${nPal} paletas. Matías pagó $${totalGal} por ${nGal} galletas. ¿Cuánto pagó Inés por una paleta y una galleta?`;
      correctVal = `$${(ansCents / 100).toFixed(2)}`;
      distractors = [
        `$${((ansCents + 20) / 100).toFixed(2)}`,
        `$${((ansCents - 10) / 100).toFixed(2)}`,
        `$${((ansCents + 10) / 100).toFixed(2)}`,
        `$${((ansCents + 30) / 100).toFixed(2)}`,
      ];
      break;
    }
    case 3: {
      // Perímetro rectángulo -> lado del cuadrado (estilo Problema 9 OMEC)
      const halfSum = randInt(5, 14);
      const sideA = randInt(2, halfSum - 2);
      const sideB = halfSum * 2 - sideA;
      const squareSide = (sideA + sideB) / 2;
      question = `Un rectángulo tiene lados de ${sideA} cm y ${sideB} cm. ¿Cuánto mide el lado de un cuadrado que tiene el mismo perímetro que el rectángulo?`;
      correctVal = `${squareSide} cm`;
      distractors = [
        `${squareSide * 2} cm`,
        `${squareSide + 2} cm`,
        `${Math.max(2, squareSide - 2)} cm`,
        `${sideA + sideB} cm`,
      ];
      break;
    }
    case 4: {
      // Conteo de pares o impares (estilo Problema 6 OMEC)
      const isOdd = activeRng() > 0.5;
      const start = randInt(10, 40) * 2;
      const count = randInt(18, 42);
      const end = start + count * 2;
      question = `Heivi escribe todos los números ${isOdd ? "impares" : "pares"} estrictamente entre ${start} y ${end}. ¿Cuántos números escribió?`;
      const ans = isOdd ? count : count - 1;
      correctVal = String(ans);
      distractors = [
        String(ans + 1),
        String(ans - 1),
        String(ans + 2),
        String(count * 2),
      ];
      break;
    }
    case 5: {
      // Segmento y fracción con gráfico (estilo Problema 4 OMEC)
      const denom = randInt(3, 5);
      const unit = randInt(4, 12);
      const total = denom * unit;
      const pb = total - unit;
      question = `Se tiene un segmento AB de ${total} cm de longitud. Entre A y B se ubica el punto P de modo que AP = 1/${denom} de AB. ¿Cuánto mide el segmento PB?`;
      correctVal = `${pb} cm`;
      distractors = [
        `${unit} cm`,
        `${pb - 2} cm`,
        `${pb + 4} cm`,
        `${Math.floor(total / 2)} cm`,
      ];
      diagram = { type: "segment", total, denom };
      break;
    }
    case 6: {
      // Baldosas en el borde con gráfico (estilo Problema 8 OMEC)
      const largo = randInt(6, 10);
      const ancho = randInt(4, Math.min(6, largo - 1));
      const border = 2 * largo + 2 * ancho - 4;
      question = `El piso de un cuarto rectangular está cubierto por baldosas cuadradas. Tiene ${largo} baldosas de largo y ${ancho} de ancho. ¿Cuántas baldosas tocan las paredes del cuarto?`;
      correctVal = String(border);
      distractors = [
        String(border + 4),
        String(border + 2),
        String(border - 2),
        String(largo * ancho),
      ];
      diagram = { type: "tiledRoom", cols: largo, rows: ancho };
      break;
    }
    case 7: {
      // Menor entero positivo n para raíz cuadrada exacta (estilo Problema 1 OMEC)
      const base = randInt(5, 11);
      const sq = base * base;
      const sumDigits = randInt(sq - 14, sq - 2);
      const n = sq - sumDigits;
      const a = Math.floor(sumDigits / 3);
      const b = Math.floor((sumDigits - a) / 2);
      const c = sumDigits - a - b;
      question = `¿Cuál es el menor entero positivo n tal que √(${a} + ${b} + ${c} + n) sea un número entero?`;
      correctVal = String(n);
      distractors = [
        String(n + 1),
        String(Math.max(1, n - 1)),
        String(n + 2),
        String(base),
      ];
      break;
    }
    case 8: {
      // Rectángulo con triángulo sombreado (estilo Problema 7 OMEC)
      const height = randInt(4, 9) * 2;
      const width = randInt(height + 2, 20);
      const area = (width * height) / 2;
      question = `En el siguiente rectángulo de ${height} × ${width}, encontrar el área de la región sombreada.`;
      correctVal = String(area);
      distractors = [
        String(width * height),
        String(area + height),
        String(Math.max(4, area - width)),
        String(width + height),
      ];
      diagram = { type: "rectTriangle", width, height };
      break;
    }
    case 9:
    default: {
      // Cuadrado ABCD con 2 semicírculos sombreados (estilo Problema 10 OMEC)
      const side = randInt(2, 6) * 2; // even side: 4, 6, 8, 10, 12
      const area = (side * side) / 2;
      question = `En la figura se muestra un cuadrado ABCD de lado ${side} y dos semicírculos con diámetros AB y AD. ¿Cuál es el área de la región sombreada?`;
      correctVal = String(area);
      distractors = [
        String(side * side),
        String(area / 2),
        String(side * 2),
        String(area + side),
      ];
      diagram = { type: "squareSemicircles", side };
      break;
    }
  }

  const { options, correctLabel } = buildOlympiadOptions(correctVal, distractors);
  return {
    id,
    kind: "olympiad",
    olympiad: {
      question,
      options,
      correctLabel,
      diagram,
    },
    answer: `${correctLabel}) ${correctVal}`,
  };
}

function generateCubeCount(config: WorksheetConfig, id: number): GeneratedExercise {
  const rows =
    config.difficulty === "facil"
      ? 2
      : config.difficulty === "avanzado"
      ? 4
      : 3;
  const cols =
    config.difficulty === "facil"
      ? 2
      : config.difficulty === "medio"
      ? 3
      : 4;
  const maxH =
    config.difficulty === "facil"
      ? 3
      : config.difficulty === "medio"
      ? 3
      : config.difficulty === "dificil"
      ? 4
      : 5;

  const grid: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );

  // Monotonic heights from back-left (0,0) down to front-right so every column top is visible
  let total = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const topLimit = r > 0 ? grid[r - 1][c] : maxH;
      const leftLimit = c > 0 ? grid[r][c - 1] : maxH;
      const upper = Math.min(topLimit, leftLimit);
      const minVal =
        r === 0 && c === 0
          ? Math.max(config.difficulty === "avanzado" ? 4 : 2, upper - 1)
          : r === 0 || c === 0
          ? config.difficulty === "avanzado"
            ? Math.min(2, upper)
            : 1
          : config.difficulty === "avanzado"
          ? Math.min(1, upper)
          : 0;
      const h = randInt(Math.min(minVal, upper), upper);
      grid[r][c] = h;
      total += h;
    }
  }

  return {
    id,
    kind: "cubeCount",
    cubeGrid: grid,
    answer: String(total),
  };
}

function generateTriangleCount(config: WorksheetConfig, id: number): GeneratedExercise {
  if (config.difficulty === "dificil" && activeRng() < 0.35) {
    const mode = activeRng() > 0.5 ? "cross" : "single";
    // Square with 2 diagonals = 8 triangles; with cross + 2 diagonals = 16 triangles
    const ans = mode === "single" ? 8 : 16;
    return {
      id,
      kind: "triangleCount",
      triangleFigure: { type: "diagonals", mode },
      answer: String(ans),
    };
  }

  const sectors =
    config.difficulty === "facil"
      ? randInt(2, 4)
      : config.difficulty === "medio"
      ? randInt(3, 5)
      : config.difficulty === "dificil"
      ? randInt(4, 6)
      : randInt(6, 8);
  const levels =
    config.difficulty === "facil"
      ? 1
      : config.difficulty === "medio"
      ? randInt(1, 2)
      : config.difficulty === "dificil"
      ? randInt(2, 3)
      : randInt(3, 4);

  const ans = levels * ((sectors * (sectors + 1)) / 2);
  return {
    id,
    kind: "triangleCount",
    triangleFigure: { type: "fan", sectors, levels },
    answer: String(ans),
  };
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
        case "neighbors":
          candidate = generateNeighbors(config, i);
          break;
        case "placeValue":
          candidate = generatePlaceValue(config, i);
          break;
        case "decimals":
          candidate = generateDecimals(config, i);
          break;
        case "ruleOfThree":
          candidate = generateRuleOfThree(config, i);
          break;
        case "mcmMcd":
          candidate = generateMcmMcd(config, i);
          break;
        case "combined":
          candidate = generateCombined(config, i);
          break;
        case "balance":
          candidate = generateBalance(config, i);
          break;
        case "olympiad":
          candidate = generateOlympiad(config, i);
          break;
        case "cubeCount":
          candidate = generateCubeCount(config, i);
          break;
        case "triangleCount":
          candidate = generateTriangleCount(config, i);
          break;
        case "mental":
        default:
          candidate = generateMental(config, i);
          break;
      }

      const key = `${candidate.a}-${candidate.operator}-${candidate.b}-${candidate.romanPrompt}-${candidate.promptText}-${candidate.olympiad?.question}-${candidate.cubeGrid?.flat().join(",")}-${candidate.triangleFigure?.type}-${candidate.answer}-${candidate.balance?.leftX}-${candidate.balance?.leftConst}-${candidate.balance?.rightConst}-${candidate.sequence?.join(",")}-${candidate.fracA?.num}/${candidate.fracA?.den}`;
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
