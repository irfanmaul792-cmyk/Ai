import { UploadedPhoto } from "../types";

/**
 * Creates SVG data URIs for instant testing of Gemini Vision:
 * 1. Realistic Fridge interior with food & sauces
 * 2. Realistic Supermarket Grocery Receipt (Struk Belanja)
 */

function createFridgePhotoDataUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#EBF3F8"/>
        <stop offset="50%" stop-color="#DAE7EF"/>
        <stop offset="100%" stop-color="#C5D7E2"/>
      </linearGradient>
      <linearGradient id="shelf" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#A9C2D1"/>
        <stop offset="50%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#A9C2D1"/>
      </linearGradient>
    </defs>
    <!-- Interior Fridge walls -->
    <rect width="600" height="600" fill="url(#bg)"/>
    
    <!-- Top Shelf -->
    <rect x="20" y="160" width="560" height="14" rx="4" fill="url(#shelf)" stroke="#92ADC0" stroke-width="2"/>
    <!-- Middle Shelf -->
    <rect x="20" y="320" width="560" height="14" rx="4" fill="url(#shelf)" stroke="#92ADC0" stroke-width="2"/>
    <!-- Bottom Crisper Drawer top -->
    <rect x="20" y="470" width="560" height="14" rx="4" fill="url(#shelf)" stroke="#92ADC0" stroke-width="2"/>
    
    <!-- Top Shelf Items: Milk, Sauce, Cheese -->
    <g transform="translate(60, 45)">
      <!-- Milk Carton -->
      <rect x="0" y="25" width="45" height="90" rx="4" fill="#3B82F6"/>
      <polygon points="0,25 22,5 45,25" fill="#2563EB"/>
      <rect x="15" y="0" width="15" height="8" fill="#FFFFFF"/>
      <text x="22" y="70" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SUSU</text>
    </g>
    
    <g transform="translate(130, 40)">
      <!-- Pasta Sauce Jar -->
      <rect x="5" y="25" width="50" height="95" rx="8" fill="#B91C1C"/>
      <rect x="15" y="12" width="30" height="15" rx="3" fill="#D97706"/>
      <rect x="8" y="55" width="44" height="40" fill="#FEF3C7"/>
      <text x="30" y="75" font-family="sans-serif" font-size="8" font-weight="bold" fill="#B91C1C" text-anchor="middle">PREGO</text>
      <text x="30" y="87" font-family="sans-serif" font-size="7" fill="#78350F" text-anchor="middle">SAUS PASTA</text>
    </g>
    
    <g transform="translate(210, 50)">
      <!-- Kecap Manis -->
      <rect x="10" y="25" width="40" height="85" rx="6" fill="#1C1917"/>
      <rect x="20" y="10" width="20" height="18" fill="#F59E0B"/>
      <text x="30" y="72" font-family="sans-serif" font-size="8" font-weight="bold" fill="#FEF08A" text-anchor="middle">BANGO</text>
    </g>

    <!-- Egg Carton Middle Shelf -->
    <g transform="translate(50, 220)">
      <rect x="0" y="40" width="170" height="60" rx="8" fill="#D6C5A9" stroke="#B8A385" stroke-width="2"/>
      <ellipse cx="30" cy="40" rx="16" ry="22" fill="#FDE68A" stroke="#F59E0B" stroke-width="1.5"/>
      <ellipse cx="65" cy="38" rx="16" ry="22" fill="#FDE68A" stroke="#F59E0B" stroke-width="1.5"/>
      <ellipse cx="100" cy="40" rx="16" ry="22" fill="#FDE68A" stroke="#F59E0B" stroke-width="1.5"/>
      <ellipse cx="135" cy="39" rx="16" ry="22" fill="#FDE68A" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="85" y="80" font-family="sans-serif" font-size="11" font-weight="bold" fill="#78350F" text-anchor="middle">TELUR AYAM (10 Butir)</text>
    </g>
    
    <!-- Fresh Beef Pack Middle Shelf -->
    <g transform="translate(250, 215)">
      <rect x="0" y="25" width="140" height="80" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      <rect x="10" y="35" width="120" height="60" rx="6" fill="#881337"/>
      <rect x="15" y="40" width="55" height="25" fill="#FFFFFF" opacity="0.9"/>
      <text x="42" y="52" font-family="sans-serif" font-size="8" font-weight="bold" fill="#0F172A" text-anchor="middle">BEEF STEAK</text>
      <text x="42" y="61" font-family="sans-serif" font-size="7" fill="#475569" text-anchor="middle">350g FRESH</text>
    </g>

    <!-- Tahu & Tempe Middle Shelf -->
    <g transform="translate(415, 230)">
      <rect x="0" y="15" width="130" height="75" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
      <rect x="10" y="25" width="50" height="55" rx="3" fill="#FEF9C3" stroke="#FDE047"/>
      <rect x="68" y="25" width="52" height="55" rx="3" fill="#D97706" stroke="#B45309"/>
      <text x="35" y="55" font-family="sans-serif" font-size="9" font-weight="bold" fill="#854D0E" text-anchor="middle">TAHU</text>
      <text x="94" y="55" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">TEMPE</text>
    </g>
    
    <!-- Bottom Crisper Drawer: Fresh Veggies -->
    <g transform="translate(40, 480)">
      <!-- Translucent Crisper Box -->
      <rect x="0" y="10" width="520" height="100" rx="10" fill="#FFFFFF" opacity="0.4" stroke="#94A3B8" stroke-width="2"/>
      <!-- Veggies inside -->
      <!-- Kangkung bundle -->
      <path d="M 40,80 Q 90,30 140,50 Q 180,30 210,60" stroke="#15803D" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M 60,85 Q 110,40 160,55" stroke="#16A34A" stroke-width="10" stroke-linecap="round" fill="none"/>
      <!-- Carrots -->
      <polygon points="260,85 320,45 325,55" fill="#EA580C"/>
      <polygon points="280,90 340,50 345,60" fill="#EA580C"/>
      <circle cx="342" cy="48" r="8" fill="#16A34A"/>
      <!-- Tomat Segar -->
      <circle cx="390" cy="70" r="22" fill="#DC2626"/>
      <circle cx="430" cy="75" r="20" fill="#EF4444"/>
      <!-- Cabai Rawit Merah & Bawang -->
      <path d="M 465,85 Q 480,55 495,65" stroke="#DC2626" stroke-width="6" stroke-linecap="round" fill="none"/>
      <ellipse cx="485" cy="82" rx="10" ry="12" fill="#A855F7"/>
      <ellipse cx="505" cy="85" rx="9" ry="11" fill="#E2E8F0"/>
    </g>

    <!-- Watermark Header Banner -->
    <rect x="0" y="0" width="600" height="32" fill="#0F172A" opacity="0.85"/>
    <text x="300" y="21" font-family="sans-serif" font-size="13" font-weight="bold" fill="#F8FAFC" text-anchor="middle">🧊 FOTO NYATA ISI KULKAS (DETEKSI GEMINI VISION)</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function createReceiptPhotoDataUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="550" height="750" viewBox="0 0 550 750">
    <defs>
      <filter id="paperShadow" x="-10%" y="-5%" width="120%" height="110%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.18"/>
      </filter>
    </defs>
    <!-- Background Wooden Kitchen Counter -->
    <rect width="550" height="750" fill="#E5D9C8"/>
    
    <!-- Receipt Paper -->
    <g filter="url(#paperShadow)" transform="translate(35, 25)">
      <!-- Receipt body with jagged top & bottom edges -->
      <rect x="0" y="10" width="480" height="680" fill="#FAF9F5"/>
      
      <!-- Top header line -->
      <line x1="20" y1="120" x2="460" y2="120" stroke="#71717A" stroke-width="1.5" stroke-dasharray="6,4"/>
      
      <!-- Supermarket Logo / Header -->
      <text x="240" y="55" font-family="monospace, monospace" font-size="22" font-weight="bold" fill="#B91C1C" text-anchor="middle">SUPER INDO</text>
      <text x="240" y="78" font-family="monospace, monospace" font-size="12" fill="#3F3F46" text-anchor="middle">SUPERMARKET LEBIH SEGAR, LEBIH HEMAT</text>
      <text x="240" y="98" font-family="monospace, monospace" font-size="11" fill="#71717A" text-anchor="middle">Cabang Mall Kelapa Gading - Kasir #04</text>
      
      <!-- Receipt Metadata -->
      <text x="30" y="145" font-family="monospace, monospace" font-size="11" fill="#52525B">Tgl: 14/10/2026 10:24 WIB</text>
      <text x="450" y="145" font-family="monospace, monospace" font-size="11" fill="#52525B" text-anchor="end">No: TRX-98214</text>
      <line x1="20" y1="160" x2="460" y2="160" stroke="#71717A" stroke-width="1.5" stroke-dasharray="6,4"/>
      
      <!-- Purchased Items List -->
      <!-- Item 1: Dada Ayam Fillet -->
      <text x="30" y="195" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B">DADA AYAM FILLET SEGAR</text>
      <text x="30" y="215" font-family="monospace, monospace" font-size="11" fill="#71717A">1 x 500 GRAM @ 69.000/KG</text>
      <text x="450" y="205" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">34.500</text>
      
      <!-- Item 2: Telur Ayam Negeri -->
      <text x="30" y="250" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B">TELUR AYAM NEGERI 1KG</text>
      <text x="30" y="270" font-family="monospace, monospace" font-size="11" fill="#71717A">1 TRAY (16 BUTIR)</text>
      <text x="450" y="260" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">29.500</text>
      
      <!-- Item 3: Buncis Baby Segar -->
      <text x="30" y="305" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B">BUNCIS BABY SEGAR 250G</text>
      <text x="30" y="325" font-family="monospace, monospace" font-size="11" fill="#71717A">1 PACK CRISPER FRESH</text>
      <text x="450" y="315" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">9.800</text>
      
      <!-- Item 4: Saus Tiram Lee Kum Kee -->
      <text x="30" y="360" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B">SAUS TIRAM LKK BOTOL</text>
      <text x="30" y="380" font-family="monospace, monospace" font-size="11" fill="#71717A">1 BOTOL 255 GRAM</text>
      <text x="450" y="370" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">16.200</text>
      
      <!-- Item 5: Bawang Merah Brebes -->
      <text x="30" y="415" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B">BAWANG MERAH BREBES 250G</text>
      <text x="30" y="435" font-family="monospace, monospace" font-size="11" fill="#71717A">1 JARING FRESH</text>
      <text x="450" y="425" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">11.500</text>
      
      <!-- Item 6: Minyak Goreng Bimoli 1L -->
      <text x="30" y="470" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B">MINYAK GORENG REF 1L</text>
      <text x="30" y="490" font-family="monospace, monospace" font-size="11" fill="#71717A">1 POUCH KELAPA SAWIT</text>
      <text x="450" y="480" font-family="monospace, monospace" font-size="13" font-weight="bold" fill="#18181B" text-anchor="end">19.500</text>

      <!-- Totals & Taxes -->
      <line x1="20" y1="520" x2="460" y2="520" stroke="#18181B" stroke-width="2"/>
      
      <text x="30" y="550" font-family="monospace, monospace" font-size="13" fill="#27272A">SUBTOTAL (6 ITEMS)</text>
      <text x="450" y="550" font-family="monospace, monospace" font-size="13" fill="#27272A" text-anchor="end">Rp 121.000</text>

      <text x="30" y="575" font-family="monospace, monospace" font-size="13" fill="#16A34A">DISKON MEMBER SUPER INDO</text>
      <text x="450" y="575" font-family="monospace, monospace" font-size="13" fill="#16A34A" text-anchor="end">-Rp 33.500</text>

      <line x1="20" y1="595" x2="460" y2="595" stroke="#18181B" stroke-width="2"/>

      <text x="30" y="625" font-family="monospace, monospace" font-size="16" font-weight="bold" fill="#18181B">TOTAL BELANJA</text>
      <text x="450" y="625" font-family="monospace, monospace" font-size="17" font-weight="bold" fill="#B91C1C" text-anchor="end">Rp 87.500</text>
      
      <!-- Barcode simulation at bottom -->
      <g transform="translate(140, 645)">
        <rect x="0" y="0" width="3" height="25" fill="#18181B"/>
        <rect x="6" y="0" width="6" height="25" fill="#18181B"/>
        <rect x="16" y="0" width="2" height="25" fill="#18181B"/>
        <rect x="22" y="0" width="5" height="25" fill="#18181B"/>
        <rect x="31" y="0" width="2" height="25" fill="#18181B"/>
        <rect x="38" y="0" width="7" height="25" fill="#18181B"/>
        <rect x="50" y="0" width="3" height="25" fill="#18181B"/>
        <rect x="58" y="0" width="5" height="25" fill="#18181B"/>
        <rect x="68" y="0" width="2" height="25" fill="#18181B"/>
        <rect x="74" y="0" width="6" height="25" fill="#18181B"/>
        <rect x="85" y="0" width="3" height="25" fill="#18181B"/>
        <rect x="94" y="0" width="5" height="25" fill="#18181B"/>
        <rect x="104" y="0" width="2" height="25" fill="#18181B"/>
        <rect x="110" y="0" width="6" height="25" fill="#18181B"/>
        <rect x="122" y="0" width="4" height="25" fill="#18181B"/>
        <rect x="130" y="0" width="2" height="25" fill="#18181B"/>
        <rect x="138" y="0" width="5" height="25" fill="#18181B"/>
        <rect x="148" y="0" width="3" height="25" fill="#18181B"/>
        <rect x="156" y="0" width="6" height="25" fill="#18181B"/>
        <rect x="168" y="0" width="2" height="25" fill="#18181B"/>
        <rect x="175" y="0" width="5" height="25" fill="#18181B"/>
        <rect x="185" y="0" width="3" height="25" fill="#18181B"/>
        <rect x="194" y="0" width="6" height="25" fill="#18181B"/>
      </g>
    </g>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export const SAMPLE_FRIDGE_PHOTO: UploadedPhoto = {
  id: "sample-fridge-photo-01",
  url: createFridgePhotoDataUrl(),
  label: "Foto Kulkas Nyata (Telur, Daging, Sayur & Saus)",
  isSample: true,
  type: "fridge"
};

export const SAMPLE_RECEIPT_PHOTO: UploadedPhoto = {
  id: "sample-receipt-photo-01",
  url: createReceiptPhotoDataUrl(),
  label: "Struk Belanja Super Indo (Dada Ayam, Buncis, Telur)",
  isSample: true,
  type: "receipt"
};
