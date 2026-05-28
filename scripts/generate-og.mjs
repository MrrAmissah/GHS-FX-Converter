import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0A1F2D"/>
      <stop offset="60%" stop-color="#0D2D28"/>
      <stop offset="100%" stop-color="#0A1520"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="#162F2A" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0F1E2E" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0D9488"/>
      <stop offset="100%" stop-color="#0A7268"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle grid lines -->
  <g stroke="#1A3A32" stroke-width="1" opacity="0.4">
    <line x1="0" y1="105" x2="1200" y2="105"/>
    <line x1="0" y1="210" x2="1200" y2="210"/>
    <line x1="0" y1="315" x2="1200" y2="315"/>
    <line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="0" y1="525" x2="1200" y2="525"/>
    <line x1="200" y1="0" x2="200" y2="630"/>
    <line x1="400" y1="0" x2="400" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="800" y1="0" x2="800" y2="630"/>
    <line x1="1000" y1="0" x2="1000" y2="630"/>
  </g>

  <!-- Glow blob -->
  <ellipse cx="600" cy="315" rx="400" ry="220" fill="#0D9488" opacity="0.06"/>
  <ellipse cx="200" cy="500" rx="250" ry="180" fill="#0D9488" opacity="0.04"/>
  <ellipse cx="1050" cy="130" rx="200" ry="150" fill="#0D9488" opacity="0.05"/>

  <!-- Logo pill top-left -->
  <rect x="60" y="60" width="160" height="48" rx="12" fill="url(#accent)"/>
  <text x="140" y="91" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="white" text-anchor="middle">GHS FX</text>

  <!-- Main icon -->
  <rect x="520" y="150" width="160" height="160" rx="32" fill="url(#accent)"/>
  <g stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <line x1="555" y1="205" x2="645" y2="205"/>
    <polyline points="628,190 645,205 628,220"/>
    <line x1="645" y1="275" x2="555" y2="275"/>
    <polyline points="572,260 555,275 572,290"/>
  </g>

  <!-- Title -->
  <text x="600" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" fill="white" text-anchor="middle" letter-spacing="-1">GHS FX Converter</text>

  <!-- Subtitle -->
  <text x="600" y="440" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400" fill="#5E849A" text-anchor="middle">Real-time Ghana Cedi currency rates</text>

  <!-- Currency chips -->
  <g font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600">
    <!-- USD -->
    <rect x="200" y="504" width="110" height="44" rx="22" fill="#162F2A" stroke="#1F4A40" stroke-width="1.5"/>
    <text x="255" y="531" fill="#2DD4BF" text-anchor="middle">USD</text>
    <!-- GBP -->
    <rect x="326" y="504" width="110" height="44" rx="22" fill="#162F2A" stroke="#1F4A40" stroke-width="1.5"/>
    <text x="381" y="531" fill="#2DD4BF" text-anchor="middle">GBP</text>
    <!-- GHS -->
    <rect x="452" y="500" width="120" height="52" rx="26" fill="url(#accent)"/>
    <text x="512" y="531" fill="white" text-anchor="middle" font-size="22" font-weight="700">GHS ₵</text>
    <!-- EUR -->
    <rect x="588" y="504" width="110" height="44" rx="22" fill="#162F2A" stroke="#1F4A40" stroke-width="1.5"/>
    <text x="643" y="531" fill="#2DD4BF" text-anchor="middle">EUR</text>
    <!-- NGN -->
    <rect x="714" y="504" width="110" height="44" rx="22" fill="#162F2A" stroke="#1F4A40" stroke-width="1.5"/>
    <text x="769" y="531" fill="#2DD4BF" text-anchor="middle">NGN</text>
    <!-- CAD -->
    <rect x="840" y="504" width="110" height="44" rx="22" fill="#162F2A" stroke="#1F4A40" stroke-width="1.5"/>
    <text x="895" y="531" fill="#2DD4BF" text-anchor="middle">CAD</text>
  </g>

  <!-- Bottom tagline -->
  <text x="600" y="598" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#3D5A6C" text-anchor="middle">Live rates · 15+ currencies · Free &amp; open source</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
})
const png = resvg.render().asPng()
writeFileSync(join(__dirname, '../public/og-image.png'), png)
console.log('Generated public/og-image.png')
