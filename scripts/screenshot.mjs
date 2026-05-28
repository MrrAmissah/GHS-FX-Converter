import { chromium } from 'playwright'
import { createServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const out  = join(root, 'preview.png')

const server = await createServer({ root, server: { port: 5199 } })
await server.listen()

const browser = await chromium.launch()
const page    = await browser.newPage()

await page.setViewportSize({ width: 1280, height: 800 })
await page.goto('http://localhost:5199', { waitUntil: 'networkidle' })

// Wait for the converter card to be visible
await page.waitForSelector('#amount', { timeout: 10000 })

// Give rates a moment to load
await page.waitForTimeout(1500)

await page.screenshot({ path: out, fullPage: false })
console.log(`Screenshot saved to ${out}`)

await browser.close()
await server.close()
