/**
 * Question Generator — Math Master v3.0
 * Unified factory for ALL math categories (replaces 15 duplicate screens)
 */

const generators = {
  addition: (difficulty) => {
    const max = 10 + difficulty * 15;
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    return { question: `${a} + ${b}`, answer: a + b, hint: `Start with ${a} and count up ${b}` };
  },

  subtraction: (difficulty) => {
    const max = 10 + difficulty * 15;
    let a = Math.floor(Math.random() * max) + 1;
    let b = Math.floor(Math.random() * max) + 1;
    if (b > a) [a, b] = [b, a];
    return { question: `${a} - ${b}`, answer: a - b, hint: `Start with ${a} and count back ${b}` };
  },

  multiplication: (difficulty) => {
    const max = 4 + difficulty * 3;
    const a = Math.floor(Math.random() * max) + 2;
    const b = Math.floor(Math.random() * max) + 2;
    return { question: `${a} × ${b}`, answer: a * b, hint: `Think: ${a} groups of ${b}` };
  },

  division: (difficulty) => {
    const max = 4 + difficulty * 3;
    const b = Math.floor(Math.random() * max) + 2;
    const answer = Math.floor(Math.random() * max) + 1;
    const a = b * answer;
    return { question: `${a} ÷ ${b}`, answer, hint: `How many ${b}s fit in ${a}?` };
  },

  mixed: (difficulty) => {
    const ops = ['addition', 'subtraction', 'multiplication', 'division'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    return generators[op](difficulty);
  },

  geometry: (difficulty) => {
    const types = [
      () => {
        const l = Math.floor(Math.random() * (5 + difficulty * 3)) + 3;
        const w = Math.floor(Math.random() * (5 + difficulty * 3)) + 3;
        return { question: `📐 Rectangle Area\nLength: ${l}  Width: ${w}`, answer: l * w, hint: 'Area = length × width', formula: `${l} × ${w}` };
      },
      () => {
        const b = Math.floor(Math.random() * (5 + difficulty * 3)) + 3;
        const h = Math.floor(Math.random() * (5 + difficulty * 3)) + 3;
        return { question: `🔺 Triangle Area\nBase: ${b}  Height: ${h}`, answer: Math.round(0.5 * b * h), hint: 'Area = ½ × base × height', formula: `½ × ${b} × ${h}` };
      },
      () => {
        const r = Math.floor(Math.random() * (3 + difficulty * 2)) + 2;
        return { question: `⭕ Circle Area\nRadius: ${r}`, answer: Math.round(Math.PI * r * r), hint: 'Area = π × r²', formula: `π × ${r}²` };
      },
      () => {
        const s = Math.floor(Math.random() * (5 + difficulty * 3)) + 2;
        return { question: `⬛ Square Perimeter\nSide: ${s}`, answer: 4 * s, hint: 'Perimeter = 4 × side', formula: `4 × ${s}` };
      },
    ];
    return types[Math.floor(Math.random() * types.length)]();
  },

  fractions: (difficulty) => {
    const types = [
      () => {
        const d = Math.floor(Math.random() * 6) + 2;
        const n1 = Math.floor(Math.random() * d) + 1;
        const n2 = Math.floor(Math.random() * d) + 1;
        const sum = n1 + n2;
        return { question: `${n1}/${d} + ${n2}/${d} = ?/${d}`, answer: sum, hint: 'Same denominator: just add numerators' };
      },
      () => {
        const whole = Math.floor(Math.random() * 5) + 1;
        const d = Math.floor(Math.random() * 4) + 2;
        return { question: `${whole} = ?/${d}\nFind the numerator`, answer: whole * d, hint: `Multiply ${whole} × ${d}` };
      },
      () => {
        const n = Math.floor(Math.random() * 8) + 2;
        const d = Math.floor(Math.random() * 8) + 2;
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const g = gcd(n, d);
        return { question: `Simplify ${n}/${d}\nWhat is the numerator?`, answer: n / g, hint: `Find GCD of ${n} and ${d}` };
      },
    ];
    return types[Math.floor(Math.random() * Math.min(types.length, 1 + difficulty))]();
  },

  exponents: (difficulty) => {
    const bases = difficulty < 3 ? [2, 3, 4, 5] : [2, 3, 4, 5, 6, 7, 8, 9, 10];
    const base = bases[Math.floor(Math.random() * bases.length)];
    const exp = Math.floor(Math.random() * 3) + 2;
    return { question: `${base}^${exp} = ?`, answer: Math.pow(base, exp), hint: `Multiply ${base} by itself ${exp} times` };
  },

  algebra: (difficulty) => {
    const a = Math.floor(Math.random() * (5 + difficulty * 2)) + 1;
    const x = Math.floor(Math.random() * 10) + 1;
    const b = a * x + Math.floor(Math.random() * 10);
    return { question: `${a}x + ${b - a * x} = ${b}\nFind x`, answer: x, hint: `Subtract ${b - a * x} from both sides, then divide by ${a}` };
  },

  roots: (difficulty) => {
    const perfects = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
    const max = Math.min(4 + difficulty * 2, perfects.length);
    const idx = Math.floor(Math.random() * max);
    const n = perfects[idx];
    return { question: `√${n} = ?`, answer: Math.sqrt(n), hint: `What number times itself = ${n}?` };
  },

  equations: (difficulty) => {
    const x = Math.floor(Math.random() * 15) + 1;
    const a = Math.floor(Math.random() * 5) + 2;
    const c = a * x;
    return { question: `${a} × ? = ${c}`, answer: x, hint: `Divide ${c} by ${a}` };
  },

  numberPatterns: (difficulty) => {
    const types = [
      () => {
        const start = Math.floor(Math.random() * 5) + 1;
        const step = Math.floor(Math.random() * 5) + 2;
        const seq = Array.from({length: 4}, (_, i) => start + step * i);
        return { question: `${seq.join(', ')}, ?`, answer: start + step * 4, hint: `Pattern: +${step}` };
      },
      () => {
        const start = Math.floor(Math.random() * 3) + 2;
        const mult = Math.floor(Math.random() * 2) + 2;
        const seq = Array.from({length: 4}, (_, i) => start * Math.pow(mult, i));
        return { question: `${seq.join(', ')}, ?`, answer: start * Math.pow(mult, 4), hint: `Pattern: ×${mult}` };
      },
    ];
    return types[Math.floor(Math.random() * types.length)]();
  },

  probability: (difficulty) => {
    const types = [
      () => {
        const total = Math.floor(Math.random() * 8) + 4;
        const favorable = Math.floor(Math.random() * (total - 1)) + 1;
        return { question: `A bag has ${total} balls.\n${favorable} are red.\nProbability of red? (%)`, answer: Math.round((favorable / total) * 100), hint: `(${favorable}/${total}) × 100` };
      },
      () => {
        return { question: `A fair coin is flipped.\nProbability of heads? (%)`, answer: 50, hint: '1 out of 2 outcomes' };
      },
      () => {
        const faces = 6;
        const target = Math.floor(Math.random() * 6) + 1;
        return { question: `Roll a dice.\nProbability of getting ${target}?\nAnswer as percentage (rounded)`, answer: Math.round(100 / faces), hint: `1 out of ${faces}` };
      },
    ];
    return types[Math.floor(Math.random() * types.length)]();
  },

  measurement: (difficulty) => {
    const types = [
      () => ({ question: `Convert 1 km to meters`, answer: 1000, hint: '1 km = 1000 m' }),
      () => { const m = (Math.floor(Math.random() * 5) + 1) * 100; return { question: `${m} cm = ? meters`, answer: m / 100, hint: 'Divide by 100' }; },
      () => { const kg = Math.floor(Math.random() * 5) + 1; return { question: `${kg} kg = ? grams`, answer: kg * 1000, hint: '1 kg = 1000 g' }; },
      () => { const h = Math.floor(Math.random() * 5) + 1; return { question: `${h} hours = ? minutes`, answer: h * 60, hint: '1 hour = 60 min' }; },
      () => { const l = Math.floor(Math.random() * 5) + 1; return { question: `${l} liters = ? ml`, answer: l * 1000, hint: '1 liter = 1000 ml' }; },
    ];
    return types[Math.floor(Math.random() * types.length)]();
  },

  moneyMath: (difficulty) => {
    const price = Math.floor(Math.random() * 50) + 5;
    const qty = Math.floor(Math.random() * 5) + 2;
    const types = [
      { question: `${qty} items at $${price} each.\nTotal cost?`, answer: price * qty, hint: `${qty} × $${price}` },
      { question: `You have $${price * qty}.\nEach item costs $${price}.\nHow many can you buy?`, answer: qty, hint: `$${price * qty} ÷ $${price}` },
      (() => { const paid = Math.ceil(price / 10) * 10; return { question: `Item costs $${price}.\nYou pay $${paid}.\nChange?`, answer: paid - price, hint: `$${paid} - $${price}` }; })(),
    ];
    return types[Math.floor(Math.random() * types.length)];
  },

  logicPuzzles: (difficulty) => {
    const puzzles = [
      { question: `I am an odd number.\nTake away a letter and I become even.\nWhat number am I?`, answer: 7, hint: 'SEVEN → EVEN' },
      { question: `If 2 = 6, 3 = 12, 4 = 20\nThen 5 = ?`, answer: 30, hint: 'Pattern: n × (n+1)' },
      { question: `A clock shows 3:15.\nWhat is the angle between\nthe hour and minute hands?`, answer: 8, hint: 'Almost 0, but hour hand moved slightly' },
      { question: `If you multiply me by any number,\nthe answer will always be 0.\nWhat am I?`, answer: 0, hint: 'Any number × ? = 0' },
      { question: `How many times does the\ndigit 1 appear from 1 to 100?`, answer: 21, hint: 'Count 1, 10-19, 21, 31...' },
      { question: `3 friends share 24 candies equally.\nEach gets how many?`, answer: 8, hint: '24 ÷ 3' },
      { question: `I am between 10 and 20.\nI am odd.\nMy digits sum to 8.\nWhat am I?`, answer: 17, hint: '1 + 7 = 8' },
      { question: `A square has perimeter 40.\nWhat is the area?`, answer: 100, hint: 'Side = 40/4 = 10, Area = 10²' },
      { question: `If 1=5, 2=25, 3=125,\nthen 4=?`, answer: 625, hint: 'Pattern: 5^n' },
      { question: `Which is bigger:\n3/4 or 5/8?\nAnswer 1 for 3/4, 2 for 5/8`, answer: 1, hint: '3/4 = 6/8 > 5/8' },
    ];
    return puzzles[Math.floor(Math.random() * puzzles.length)];
  },

  wordProblems: (difficulty) => {
    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 15) + 3;
    const problems = [
      { question: `Tom has ${a} apples.\nHe gives ${b} to Sara.\nHow many does Tom have?`, answer: a - b, hint: `${a} - ${b}` },
      { question: `A train travels ${a * 10} km\nin ${b} hours.\nSpeed in km/h?`, answer: Math.round((a * 10) / b), hint: 'Speed = Distance ÷ Time' },
      { question: `${a} students sit in rows of ${Math.min(b, 5)}.\nHow many full rows?`, answer: Math.floor(a / Math.min(b, 5)), hint: `${a} ÷ ${Math.min(b, 5)}` },
      { question: `A book has ${a * 10} pages.\nYou read ${b * 2} pages per day.\nDays to finish?`, answer: Math.ceil((a * 10) / (b * 2)), hint: `${a * 10} ÷ ${b * 2}` },
    ];
    return problems[Math.floor(Math.random() * problems.length)];
  },

  statistics: (difficulty) => {
    const count = 5;
    const nums = Array.from({length: count}, () => Math.floor(Math.random() * 20) + 1).sort((a,b) => a-b);
    const sum = nums.reduce((s, n) => s + n, 0);
    const types = [
      { question: `Find the mean:\n${nums.join(', ')}`, answer: Math.round(sum / count), hint: `Sum all, divide by ${count}` },
      { question: `Find the median:\n${nums.join(', ')}`, answer: nums[Math.floor(count / 2)], hint: 'Middle value when sorted' },
      { question: `Find the range:\n${nums.join(', ')}`, answer: nums[count - 1] - nums[0], hint: 'Largest − Smallest' },
    ];
    return types[Math.floor(Math.random() * types.length)];
  },
};

/**
 * Generate a problem with options
 */
export function generateProblem(category, difficulty = 1) {
  const gen = generators[category] || generators.mixed;
  const problem = gen(difficulty);
  const answer = problem.answer;

  // Generate smart wrong answers
  const wrongs = new Set();
  wrongs.add(answer + Math.floor(Math.random() * 5) + 1);
  wrongs.add(Math.max(0, answer - Math.floor(Math.random() * 5) - 1));
  wrongs.add(answer + Math.floor(Math.random() * 10) + 5);
  wrongs.add(Math.max(0, answer * 2 - Math.floor(Math.random() * 3)));
  
  // Remove correct answer from wrongs
  wrongs.delete(answer);
  
  const wrongArr = [...wrongs].slice(0, 3);
  const options = [...wrongArr, answer].sort(() => Math.random() - 0.5);

  return { ...problem, options, answer };
}

/**
 * Generate daily challenge (10 mixed questions)
 */
export function generateDailyChallenge() {
  const cats = ['addition', 'subtraction', 'multiplication', 'division', 'geometry',
    'fractions', 'algebra', 'numberPatterns', 'measurement', 'mixed'];
  return cats.map((cat, i) => generateProblem(cat, Math.floor(i / 3) + 1));
}

export default generators;
