/**
 * Utility for scaling recipe ingredient quantities dynamically (Minimalist Baker feature)
 * e.g. "200 gr" at 2x becomes "400 gr", "1/2 kaleng" at 2x becomes "1 kaleng"
 */

export function scaleAmount(amount: string, scaleFactor: number): string {
  if (!amount || scaleFactor === 1) return amount;

  const trimmed = amount.trim();

  // If amount is qualitative (e.g. "Secukupnya", "Opsional", "Sesuai selera", "Taburan")
  if (/secukupnya|opsional|sesuai selera|taburan/i.test(trimmed)) {
    return trimmed;
  }

  // Handle fractions like "1/2 kaleng", "1/4 sdt"
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)\s*(.*)$/);
  if (fractionMatch) {
    const num = parseInt(fractionMatch[1], 10);
    const denom = parseInt(fractionMatch[2], 10);
    const unit = fractionMatch[3];
    const total = (num / denom) * scaleFactor;

    if (total === 1) return `1 ${unit}`.trim();
    if (total === 0.5) return `1/2 ${unit}`.trim();
    if (total === 1.5) return `1.5 ${unit}`.trim();
    if (total === 2) return `2 ${unit}`.trim();
    if (Number.isInteger(total)) return `${total} ${unit}`.trim();
    return `${total.toFixed(1).replace(/\.0$/, '')} ${unit}`.trim();
  }

  // Handle ranges like "4-6 buah", "2-3 butir"
  const rangeMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(.*)$/);
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]) * scaleFactor;
    const high = parseFloat(rangeMatch[2]) * scaleFactor;
    const unit = rangeMatch[3];
    const fmtLow = Number.isInteger(low) ? low : low.toFixed(1);
    const fmtHigh = Number.isInteger(high) ? high : high.toFixed(1);
    return `${fmtLow}-${fmtHigh} ${unit}`.trim();
  }

  // Handle standard decimal or integer: "250 gr", "1.5 sdm", "4 siung"
  const singleMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]) * scaleFactor;
    const unit = singleMatch[2];
    const formatted = Number.isInteger(val) ? val : val.toFixed(1).replace(/\.0$/, '');
    return `${formatted} ${unit}`.trim();
  }

  return trimmed;
}

export interface PantryStapleItem {
  name: string;
  quantity: string;
  category: 'bumbu';
  shelf: 'chiller' | 'door';
  urgency: 'safe';
  icon: string;
}

export const PANTRY_STAPLES: PantryStapleItem[] = [
  { name: 'Minyak Goreng', quantity: '1 botol', category: 'bumbu', shelf: 'door', urgency: 'safe', icon: '🫒' },
  { name: 'Garam Dapur', quantity: '1 bungkus', category: 'bumbu', shelf: 'door', urgency: 'safe', icon: '🧂' },
  { name: 'Bawang Putih', quantity: '1 bonggol', category: 'bumbu', shelf: 'chiller', urgency: 'safe', icon: '🧄' },
  { name: 'Bawang Merah', quantity: '150 gr', category: 'bumbu', shelf: 'chiller', urgency: 'safe', icon: '🧅' },
  { name: 'Kecap Manis', quantity: '1 botol', category: 'bumbu', shelf: 'door', urgency: 'safe', icon: '🥫' },
  { name: 'Merica / Lada Bubuk', quantity: '1 botol', category: 'bumbu', shelf: 'door', urgency: 'safe', icon: '🌶️' },
];
