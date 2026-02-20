// Ek kod örnekleri — Paket 51-100
// EXTRA_CODES nesnesine ekleniyor (codes1.js'de tanımlanmış)
Object.assign(EXTRA_CODES, {
    'chokidar': [
        {
            title: 'dosya-izleme.js', code: `const chokidar = require('chokidar');
const path = require('path');

const watcher = chokidar.watch('src/**/*.{js,ts,css}', {
  ignored: /(node_modules|\.git)/,
  persistent: true,
  awaitWriteFinish: { stabilityThreshold: 300 }
});

watcher
  .on('ready', () => console.log('İzleme başladı'))
  .on('add', f => console.log('Yeni:', path.basename(f)))
  .on('change', f => {
    console.log('Değişti:', path.basename(f));
    rebuildProject();
  })
  .on('unlink', f => console.log('Silindi:', path.basename(f)))
  .on('error', err => console.error('Hata:', err));

// Temizlik
process.on('SIGINT', () => { watcher.close(); process.exit(); });`}
    ],

    'ws': [
        {
            title: 'broadcast-server.js', code: `const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Tüm bağlı istemcilere yayın
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    broadcast({ user: msg.user, text: msg.text, time: Date.now() });
  });
});

// Ping/pong — bağlantı kontrolü
setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);`}
    ],

    'ora': [
        {
            title: 'async-spinner.js', code: `const ora = require('ora');

async function deploy() {
  const spinner = ora('Bağımlılıklar kuruluyor...').start();

  await installDeps();
  spinner.text = 'Testler çalıştırılıyor...';

  const testResult = await runTests();
  if (!testResult.success) {
    spinner.fail('Testler başarısız: ' + testResult.failed + ' hata');
    return;
  }
  spinner.text = 'Derleniyor...';

  await buildProject();
  spinner.text = 'Sunucuya yükleniyor...';

  await uploadToServer();
  spinner.succeed('Deploy tamamlandı! 🚀');
}

deploy().catch(err => {
  ora().fail('Deploy hatası: ' + err.message);
  process.exit(1);
});`}
    ],

    'yargs': [
        {
            title: 'cli-tool.js', code: `const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .command('create <type>', 'Yeni kaynak oluştur', (yargs) => {
    yargs.positional('type', {
      choices: ['component', 'page', 'api'],
      describe: 'Kaynak tipi'
    })
    .option('name', { alias: 'n', type: 'string', demandOption: true })
    .option('dir', { alias: 'd', type: 'string', default: 'src' });
  }, (argv) => {
    console.log(argv.type, 'oluşturuluyor:', argv.name);
    // scaffold logic
  })
  .command('serve', 'Geliştirme sunucusu başlat', {
    port: { alias: 'p', default: 3000, type: 'number' },
    open: { alias: 'o', default: false, type: 'boolean' }
  }, (argv) => {
    startServer(argv.port, argv.open);
  })
  .demandCommand(1, 'En az bir komut belirtin')
  .help()
  .parse();`}
    ],

    'express-session': [
        {
            title: 'redis-session.js', code: `const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
  store: new RedisStore({ client: redisClient, prefix: 'sess:' }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 gün
    sameSite: 'strict'
  }
}));

// Oturum kullanımı
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  req.session.userId = user.id;
  req.session.role = user.role;
  res.json({ success: true });
});`}
    ],

    'pug': [
        {
            title: 'pug-sablonlar.pug', code: `//- layout.pug
doctype html
html(lang="tr")
  head
    title= title
    link(rel="stylesheet" href="/style.css")
  body
    include partials/nav
    block content
    include partials/footer

//- index.pug
extends layout

block content
  h1= title
  .user-grid
    each user in users
      .user-card
        img(src=user.avatar alt=user.name)
        h3= user.name
        p= user.email
        if user.role === 'admin'
          span.badge Admin

//- mixin kullanımı
mixin button(text, type)
  button(class="btn btn-" + type)= text

+button('Kaydet', 'primary')
+button('İptal', 'secondary')`}
    ],

    'bull': [
        {
            title: 'kuyruk-yonetimi.js', code: `const Queue = require('bull');

// Farklı kuyruklar
const emailQueue = new Queue('email', process.env.REDIS_URL);
const imageQueue = new Queue('image', process.env.REDIS_URL);

// E-posta kuyruğu
emailQueue.process(3, async (job) => { // 3 paralel
  const { to, subject, html } = job.data;
  await sendEmail(to, subject, html);
  return { sent: true, to };
});

// Resim işleme kuyruğu
imageQueue.process(async (job) => {
  job.progress(10);
  const resized = await sharp(job.data.path).resize(800).toBuffer();
  job.progress(50);
  await uploadToS3(resized);
  job.progress(100);
  return { url: 's3://...' };
});

// Event'ler
emailQueue.on('completed', (job, result) => {
  console.log('E-posta gönderildi:', result.to);
});

emailQueue.on('failed', (job, err) => {
  console.error('Gönderim hatası:', err.message);
});`}
    ],

    'handlebars': [
        {
            title: 'email-sablon.js', code: `const Handlebars = require('handlebars');

// Custom helper
Handlebars.registerHelper('formatPrice', (price) => {
  return new Handlebars.SafeString(price.toFixed(2) + ' ₺');
});

Handlebars.registerHelper('ifEquals', function(a, b, opts) {
  return a === b ? opts.fn(this) : opts.inverse(this);
});

const template = Handlebars.compile(\`
  <h2>Sipariş #{{orderId}}</h2>
  <table>
    {{#each items}}
    <tr>
      <td>{{name}}</td>
      <td>{{formatPrice price}}</td>
      <td>{{quantity}} adet</td>
    </tr>
    {{/each}}
  </table>
  {{#ifEquals status "delivered"}}
    <p style="color:green">Teslim edildi ✔</p>
  {{else}}
    <p>Durum: {{status}}</p>
  {{/ifEquals}}
\`);

const html = template({ orderId: 1234, items: [...], status: 'delivered' });`}
    ],

    'pm2': [
        {
            title: 'ecosystem-config.js', code: `// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'api',
      script: './src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'development', PORT: 3000 },
      env_production: { NODE_ENV: 'production', PORT: 8080 },
      max_memory_restart: '300M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/output.log'
    },
    {
      name: 'worker',
      script: './src/worker.js',
      instances: 2,
      cron_restart: '0 */6 * * *' // Her 6 saatte restart
    }
  ]
};

// Komutlar:
// pm2 start ecosystem.config.js --env production
// pm2 reload api --update-env`}
    ],

    'date-fns': [
        {
            title: 'tarih-araclari.js', code: `const { format, addDays, differenceInBusinessDays, eachDayOfInterval,
  isWeekend, startOfMonth, endOfMonth, isSameDay } = require('date-fns');
const { tr } = require('date-fns/locale');

// İş günü hesaplama
const start = new Date('2026-03-01');
const end = new Date('2026-03-31');
const businessDays = differenceInBusinessDays(end, start);
console.log('İş günü:', businessDays);

// Ay içindeki tüm günler
const days = eachDayOfInterval({
  start: startOfMonth(new Date()),
  end: endOfMonth(new Date())
});

const calendar = days.map(day => ({
  date: format(day, 'dd', { locale: tr }),
  dayName: format(day, 'EEEE', { locale: tr }),
  isWeekend: isWeekend(day),
  isToday: isSameDay(day, new Date())
}));`}
    ],

    'nanoid': [
        {
            title: 'id-stratejileri.js', code: `const { nanoid, customAlphabet } = require('nanoid');

// URL kısaltma
const urlId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 7);
// urlId() => "k8f3j2a"

// Sipariş numarası
const orderId = customAlphabet('0123456789', 10);
// orderId() => "3847195628"

// Dosya adı için güvenli ID
const fileId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 12);

// Express middleware — her isteğe ID ekle
app.use((req, res, next) => {
  req.id = nanoid();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Veritabanı primary key
const user = {
  id: nanoid(),    // "V1StGXR8_Z5jdHi6B-myT"
  name: 'Ali',
  slug: urlId()    // "k8f3j2a"
};`}
    ],

    'typeorm': [
        {
            title: 'entity-relations.ts', code: `import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.posts)
  author: User;
}

// Sorgu
const users = await userRepo.find({
  relations: { posts: true },
  where: { posts: { title: Like('%TypeORM%') } },
  take: 10
});`}
    ],

    'esbuild': [
        {
            title: 'build-script.js', code: `const esbuild = require('esbuild');

// Geliştirme — watch modu
const ctx = await esbuild.context({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outdir: 'dist',
  sourcemap: true,
  loader: { '.png': 'file', '.svg': 'text' },
  define: { 'process.env.NODE_ENV': '"development"' },
  plugins: [{
    name: 'rebuild-notify',
    setup(build) {
      build.onEnd(result => {
        console.log('Rebuild:', result.errors.length, 'hata');
      });
    }
  }]
});

await ctx.watch();
console.log('Watch modu aktif...');

// Üretim build
await esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: true,
  splitting: true,
  format: 'esm',
  outdir: 'dist',
  metafile: true
});`}
    ],

    'mysql2': [
        {
            title: 'crud-islemleri.js', code: `const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost', user: 'root', password: 'sifre',
  database: 'mydb', waitForConnections: true, connectionLimit: 10
});

// CRUD işlemleri
async function createUser(name, email) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );
  return result.insertId;
}

async function findUsers(search) {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE name LIKE ? ORDER BY created_at DESC LIMIT 20',
    ['%' + search + '%']
  );
  return rows;
}

// Transaction
const conn = await pool.getConnection();
try {
  await conn.beginTransaction();
  await conn.execute('UPDATE accounts SET balance = balance - ? WHERE id = ?', [100, 1]);
  await conn.execute('UPDATE accounts SET balance = balance + ? WHERE id = ?', [100, 2]);
  await conn.commit();
} catch (e) {
  await conn.rollback();
  throw e;
} finally {
  conn.release();
}`}
    ],

    'yup': [
        {
            title: 'form-sema.js', code: `const yup = require('yup');

const productSchema = yup.object({
  name: yup.string().required('Ürün adı zorunlu').min(3).max(100),
  price: yup.number().required().positive('Fiyat pozitif olmalı'),
  category: yup.string().oneOf(['elektronik', 'giyim', 'gıda']),
  stock: yup.number().integer().min(0).default(0),
  discount: yup.number()
    .when('price', {
      is: (price) => price > 100,
      then: (schema) => schema.max(50, 'Max %50 indirim'),
      otherwise: (schema) => schema.max(20, 'Max %20 indirim')
    }),
  tags: yup.array().of(yup.string()).min(1, 'En az 1 etiket gerekli'),
  images: yup.array().of(
    yup.object({ url: yup.string().url(), alt: yup.string() })
  )
});

try {
  const valid = await productSchema.validate(req.body, { abortEarly: false });
  console.log('Geçerli:', valid);
} catch (err) {
  console.log('Hatalar:', err.errors);
}`}
    ],

    'sinon': [
        {
            title: 'test-mocking.js', code: `const sinon = require('sinon');
const { expect } = require('chai');
const userService = require('./userService');
const emailService = require('./emailService');

describe('UserService', () => {
  let sandbox;

  beforeEach(() => { sandbox = sinon.createSandbox(); });
  afterEach(() => { sandbox.restore(); });

  it('kullanıcı oluşturur ve email gönderir', async () => {
    const dbStub = sandbox.stub(userService, 'saveToDb').resolves({ id: 1, name: 'Ali' });
    const emailSpy = sandbox.spy(emailService, 'sendWelcome');

    await userService.register({ name: 'Ali', email: 'ali@test.com' });

    expect(dbStub.calledOnce).to.be.true;
    expect(emailSpy.calledWith('ali@test.com')).to.be.true;
  });

  it('sahte zamanlayıcı ile timeout test', () => {
    const clock = sandbox.useFakeTimers();
    const spy = sandbox.spy();
    setTimeout(spy, 5000);
    clock.tick(5000);
    expect(spy.calledOnce).to.be.true;
  });
});`}
    ],

    'rxjs': [
        {
            title: 'reactive-ornek.js', code: `const { fromEvent, interval, merge } = require('rxjs');
const { debounceTime, map, filter, switchMap, takeUntil, scan } = require('rxjs/operators');

// Gerçek zamanlı arama (debounce)
const search$ = fromEvent(searchInput, 'input').pipe(
  map(e => e.target.value.trim()),
  filter(q => q.length >= 2),
  debounceTime(300),
  switchMap(q => fetch('/api/search?q=' + q).then(r => r.json()))
);

search$.subscribe(results => renderResults(results));

// Sayaç — birden fazla kaynak birleştirme
const increment$ = fromEvent(addBtn, 'click').pipe(map(() => 1));
const decrement$ = fromEvent(subBtn, 'click').pipe(map(() => -1));

const count$ = merge(increment$, decrement$).pipe(
  scan((total, change) => Math.max(0, total + change), 0)
);

count$.subscribe(count => {
  counterEl.textContent = count;
});`}
    ],

    'playwright': [
        {
            title: 'e2e-test.spec.js', code: `const { test, expect } = require('@playwright/test');

test.describe('Login Flow', () => {
  test('başarılı giriş', async ({ page }) => {
    await page.goto('/login');

    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'sifre123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('.welcome')).toContainText('Hoş geldin');
  });

  test('yanlış şifre — hata mesajı', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'yanlis');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText('Şifre yanlış');
  });

  test('mobil görünüm — responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('.mobile-menu')).toBeVisible();
  });
});`}
    ],

    'agenda': [
        {
            title: 'gorev-zamanlama.js', code: `const Agenda = require('agenda');

const agenda = new Agenda({
  db: { address: process.env.MONGO_URL, collection: 'jobs' },
  processEvery: '30 seconds',
  maxConcurrency: 5
});

// Görev tanımları
agenda.define('günlük rapor', { priority: 'high' }, async (job) => {
  const report = await generateReport(job.attrs.data.type);
  await sendEmail('admin@app.com', 'Günlük Rapor', report);
});

agenda.define('cache temizle', async () => {
  const deleted = await redis.del(await redis.keys('cache:*'));
  console.log(deleted, 'cache anahtarı silindi');
});

agenda.define('kullanıcı hatırlatma', async (job) => {
  const users = await User.find({ lastLogin: { $lt: daysAgo(30) } });
  for (const user of users) {
    await sendReminderEmail(user);
  }
});

await agenda.start();
await agenda.every('0 9 * * *', 'günlük rapor', { type: 'daily' });
await agenda.every('*/10 * * * *', 'cache temizle');
await agenda.every('0 10 * * 1', 'kullanıcı hatırlatma');`}
    ],

    'eslint': [
        {
            title: 'eslint-config.js', code: `// eslint.config.js (flat config)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' }
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js']
  }
];

// package.json: "lint": "eslint src/ --fix"`}
    ],

    'prettier': [
        {
            title: 'prettier-config.js', code: `// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.md',
      options: { printWidth: 80, proseWrap: 'always' }
    },
    {
      files: '*.json',
      options: { tabWidth: 4 }
    }
  ]
};

// .prettierignore
// dist/
// node_modules/
// coverage/
// *.min.js

// package.json:
// "format": "prettier --write 'src/**/*.{js,ts,css,json}'",
// "format:check": "prettier --check 'src/**/*.{js,ts,css,json}'"`}
    ],

    'husky': [
        {
            title: 'git-hooks-setup.sh', code: `# Husky + lint-staged kurulum
# npm install -D husky lint-staged

# Husky başlat
npx husky init

# .husky/pre-commit dosyası:
npx lint-staged

# .husky/commit-msg dosyası:
npx --no -- commitlint --edit $1

# package.json — lint-staged yapılandırma:
# {
#   "lint-staged": {
#     "*.{js,ts}": ["eslint --fix", "prettier --write"],
#     "*.{css,scss}": ["prettier --write"],
#     "*.{json,md}": ["prettier --write"]
#   }
# }

# Artık her commit öncesi:
# 1. Sadece stage'lenmiş dosyalarda ESLint çalışır
# 2. Prettier ile formatlanır
# 3. Commit mesajı kontrol edilir`}
    ]
});
