import 'dotenv/config';
import { chromium } from 'playwright';
import readline from 'node:readline/promises';

const { MATADOURO_NIF, MATADOURO_SENHA } = process.env;

if (!MATADOURO_NIF || !MATADOURO_SENHA) {
  console.error('Falta preencher MATADOURO_NIF e MATADOURO_SENHA no ficheiro .env (copia .env.example para .env primeiro).');
  process.exit(1);
}

// dd/mm/yyyy de ontem, por defeito (pode passar-se outra data: node test-login.js 10/07/2026)
function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

const ilha = process.argv[3] ?? 'TE';
const esp = process.argv[4] ?? 'B';
const data = process.argv[2] ?? yesterday();

console.log(`A testar: ilha=${ilha} especie=${esp} data=${data}`);

const browser = await chromium.launch({ headless: false, slowMo: 150 });
const page = await browser.newPage();

await page.goto('https://matadouros.azores.gov.pt/');
await page.getByText('Cliente', { exact: true }).click();
await page.waitForSelector('#ilha');

await page.selectOption('#ilha', ilha);
await page.selectOption('#esp', esp);
await page.fill('#dataabate', data);
await page.fill('#codapr', MATADOURO_NIF);
await page.fill('#senha', MATADOURO_SENHA);
await page.click('#home-form-submit');

await page.waitForTimeout(4000);

const warning = page.locator('#warning');
const dadosContainer = page.locator('.dados.container');

const warningVisible = await warning.isVisible();
const dadosVisible = await dadosContainer.evaluate((el) => el.style.display !== 'none');

console.log('---');
if (warningVisible) {
  console.log('RESULTADO: aviso de "evento suspeito" apareceu mesmo com credenciais reais.');
} else if (dadosVisible) {
  console.log('RESULTADO: sucesso — a tabela de dados carregou normalmente.');
} else {
  console.log('RESULTADO: nem aviso nem tabela visível — inspeciona a janela do browser para perceber o que aconteceu (ex: credenciais erradas, sem dados para essa data).');
}
console.log('---');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
await rl.question('Janela do browser aberta para inspecionares. Prime Enter para fechar...');
rl.close();

await browser.close();
