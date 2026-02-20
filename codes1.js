// Ek kod örnekleri — Paket 1-50
const EXTRA_CODES = {
    'express': [
        {
            title: 'middleware-ornek.js', code: `const express = require('express');
const app = express();

// JSON body parser
app.use(express.json());

// Özel loglama middleware
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// Hata yakalama middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Sunucu hatası!' });
});`},
        {
            title: 'router-ornek.js', code: `const express = require('express');
const router = express.Router();

// Parametre middleware
router.param('id', (req, res, next, id) => {
  req.userId = parseInt(id);
  next();
});

router.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Ali' }]);
});

router.get('/users/:id', (req, res) => {
  res.json({ id: req.userId });
});

router.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 2, name, email });
});

module.exports = router;`}
    ],

    'lodash': [
        {
            title: 'koleksiyon-islemleri.js', code: `const _ = require('lodash');

const users = [
  { name: 'Ali', age: 28, dept: 'Yazılım' },
  { name: 'Ayşe', age: 32, dept: 'Tasarım' },
  { name: 'Mehmet', age: 25, dept: 'Yazılım' },
  { name: 'Fatma', age: 30, dept: 'Tasarım' }
];

// Departmana göre grupla
const grouped = _.groupBy(users, 'dept');
console.log(grouped);

// En yaşlı kullanıcı
const oldest = _.maxBy(users, 'age');
console.log(oldest.name); // "Ayşe"

// Sadece isimler
const names = _.map(users, 'name');
console.log(names); // ["Ali","Ayşe","Mehmet","Fatma"]`},
        {
            title: 'nesne-islemleri.js', code: `const _ = require('lodash');

const defaults = { theme: 'dark', lang: 'tr', notifications: { email: true, sms: false } };
const userPrefs = { lang: 'en', notifications: { sms: true } };

// Derin birleştirme (merge)
const config = _.merge({}, defaults, userPrefs);
console.log(config);
// { theme:'dark', lang:'en', notifications:{ email:true, sms:true } }

// Güvenli iç içe erişim
const email = _.get(config, 'notifications.email', false);
console.log(email); // true

// Belirli alanları seç
const picked = _.pick(config, ['theme', 'lang']);
console.log(picked); // { theme:'dark', lang:'en' }`}
    ],

    'axios': [
        {
            title: 'interceptor-ornek.js', code: `const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// İstek interceptor — token ekleme
api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

// Yanıt interceptor — hata yönetimi
api.interceptors.response.use(
  res => res.data, // sadece data döner
  err => {
    if (err.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(err);
  }
);`},
        {
            title: 'paralel-istek.js', code: `const axios = require('axios');

// Paralel istekler
const [users, products, orders] = await Promise.all([
  axios.get('/api/users'),
  axios.get('/api/products'),
  axios.get('/api/orders')
]);

console.log(users.data.length, 'kullanıcı');
console.log(products.data.length, 'ürün');

// Dosya yükleme
const FormData = require('form-data');
const form = new FormData();
form.append('avatar', fs.createReadStream('photo.jpg'));

await axios.post('/upload', form, {
  headers: form.getHeaders(),
  onUploadProgress: (p) => {
    console.log(Math.round(p.loaded / p.total * 100) + '%');
  }
});`}
    ],

    'dotenv': [
        {
            title: 'coklu-ortam.js', code: `// .env.development
// DB_HOST=localhost
// DB_PORT=5432
// API_KEY=dev_key_123

// .env.production
// DB_HOST=prod-db.example.com
// DB_PORT=5432
// API_KEY=prod_key_456

const path = require('path');
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';

require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });

console.log('DB:', process.env.DB_HOST);
console.log('Ortam:', process.env.NODE_ENV);`}
    ],

    'typescript': [
        {
            title: 'generics-ornek.ts', code: `// Generic fonksiyon
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = firstElement([1, 2, 3]);    // number
const str = firstElement(['a', 'b']);    // string

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User { id: number; name: string; }

async function getUser(id: number): Promise<ApiResponse<User>> {
  const res = await fetch('/api/users/' + id);
  return res.json();
}

const response = await getUser(1);
console.log(response.data.name); // tip güvenli`},
        {
            title: 'utility-types.ts', code: `interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Partial — tüm alanlar opsiyonel
type UpdateUser = Partial<User>;

// Pick — sadece belirli alanlar
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;

// Omit — belirli alanlar hariç
type SafeUser = Omit<User, 'password'>;

// Record — anahtar-değer map
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

const roles: UserRoles = {
  ali: 'admin',
  ayse: 'user'
};`}
    ],

    'react': [
        {
            title: 'custom-hook.jsx', code: `import { useState, useEffect } from 'react';

// Özel hook: API veri çekme
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Kullanım
function UserList() {
  const { data, loading } = useFetch('/api/users');
  if (loading) return <p>Yükleniyor...</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`},
        {
            title: 'context-ornek.jsx', code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Header() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <header className={theme}>
      <h1>Uygulama</h1>
      <button onClick={toggle}>{theme === 'dark' ? '☀️' : '🌙'}</button>
    </header>
  );
}`}
    ],

    'jest': [
        {
            title: 'async-test.js', code: `const { fetchUser, createUser } = require('./userService');

describe('User Service', () => {
  test('kullanıcı getirir', async () => {
    const user = await fetchUser(1);
    expect(user).toHaveProperty('name');
    expect(user.id).toBe(1);
  });

  test('yeni kullanıcı oluşturur', async () => {
    const user = await createUser({ name: 'Ali', email: 'ali@test.com' });
    expect(user.id).toBeDefined();
    expect(user.name).toBe('Ali');
  });

  test('geçersiz ID ile hata fırlatır', async () => {
    await expect(fetchUser(-1)).rejects.toThrow('Geçersiz ID');
  });
});`},
        {
            title: 'mock-ornek.js', code: `const axios = require('axios');
const { getWeather } = require('./weather');

// Modülü mock'la
jest.mock('axios');

describe('Weather Service', () => {
  test('hava durumu döner', async () => {
    axios.get.mockResolvedValue({
      data: { temp: 22, city: 'İstanbul' }
    });

    const result = await getWeather('İstanbul');
    expect(result.temp).toBe(22);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('İstanbul')
    );
  });

  test('API hatası yakalar', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    await expect(getWeather('X')).rejects.toThrow();
  });
});`}
    ],

    'mongoose': [
        {
            title: 'schema-detay.js', code: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'İsim zorunlu'], trim: true },
  email: { type: String, unique: true, lowercase: true },
  age: { type: Number, min: 18, max: 120 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

// Virtual alan
userSchema.virtual('info').get(function() {
  return this.name + ' (' + this.email + ')';
});

// Middleware (pre-save)
userSchema.pre('save', function(next) {
  console.log(this.name, 'kaydediliyor...');
  next();
});

const User = mongoose.model('User', userSchema);`},
        {
            title: 'aggregate-ornek.js', code: `// Aggregation Pipeline
const stats = await User.aggregate([
  { $match: { role: 'user' } },
  { $group: {
    _id: '$department',
    count: { $sum: 1 },
    avgAge: { $avg: '$age' },
    names: { $push: '$name' }
  }},
  { $sort: { count: -1 } },
  { $limit: 5 }
]);

console.log(stats);
// [{ _id:'Yazılım', count:15, avgAge:28, names:[...] }, ...]

// Populate ile ilişkili veri
const user = await User.findById(id)
  .populate('posts', 'title createdAt')
  .select('name email')
  .lean();`}
    ],

    'jsonwebtoken': [
        {
            title: 'auth-middleware.js', code: `const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

// Token oluşturma
function generateTokens(user) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { sub: user.id },
    SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

// Koruma middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token gerekli' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Geçersiz token' });
  }
}`}
    ],

    'nodemon': [
        {
            title: 'nodemon-config.json', code: `// nodemon.json yapılandırma dosyası
{
  "watch": ["src", "config"],
  "ext": "js,json,ejs",
  "ignore": ["src/public/*", "tests/*"],
  "delay": "500",
  "env": {
    "NODE_ENV": "development",
    "PORT": 3000
  },
  "exec": "node --inspect src/server.js"
}

// package.json scripts:
// "dev": "nodemon",
// "dev:debug": "nodemon --inspect src/server.js",
// "dev:ts": "nodemon --exec ts-node src/index.ts"`}
    ],

    'cors': [
        {
            title: 'gelismis-cors.js', code: `const cors = require('cors');

// Dinamik origin kontrolü
const whitelist = ['https://app.example.com', 'https://admin.example.com'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS izni yok'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  maxAge: 86400 // preflight cache 24 saat
}));

// Tek route için CORS
app.get('/public', cors(), (req, res) => {
  res.json({ data: 'Herkese açık' });
});`}
    ],

    'uuid': [
        {
            title: 'uuid-kullanim.js', code: `const { v4: uuidv4, v5: uuidv5, validate, version } = require('uuid');

// Her istek için benzersiz ID
app.use((req, res, next) => {
  req.requestId = uuidv4();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// Deterministik UUID (aynı input = aynı output)
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const userId = uuidv5('ali@example.com', NAMESPACE);
console.log(userId); // Her zaman aynı değer

// Doğrulama
console.log(validate('not-a-uuid'));           // false
console.log(validate(uuidv4()));               // true
console.log(version('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')); // 4`}
    ],

    'chalk': [
        {
            title: 'renkli-log.js', code: `const chalk = require('chalk');

// Özel log fonksiyonları
const log = {
  info: (...args) => console.log(chalk.blue('ℹ INFO:'), ...args),
  success: (...args) => console.log(chalk.green('✔ OK:'), ...args),
  warn: (...args) => console.log(chalk.yellow('⚠ UYARI:'), ...args),
  error: (...args) => console.log(chalk.red.bold('✖ HATA:'), ...args),
};

log.info('Sunucu başlatılıyor...');
log.success('Veritabanı bağlantısı kuruldu');
log.warn('Cache süresi dolmak üzere');
log.error('Dosya bulunamadı:', 'config.json');

// Tablo benzeri çıktı
const header = chalk.bgCyan.black(' Durum Raporu ');
console.log('\\n' + header);
console.log(chalk.dim('─'.repeat(40)));`}
    ],

    'helmet': [
        {
            title: 'detayli-helmet.js', code: `const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "cdn.example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "*.cloudinary.com"],
      connectSrc: ["'self'", "api.example.com"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Tek bir başlık kapatma
app.use(helmet({ frameguard: false }));`}
    ],

    'prisma': [
        {
            title: 'prisma-crud.js', code: `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Oluştur + İlişki
const user = await prisma.user.create({
  data: {
    name: 'Ali',
    email: 'ali@test.com',
    posts: {
      create: [
        { title: 'İlk Yazı', content: 'Merhaba!' },
        { title: 'İkinci Yazı', content: 'Prisma harika!' }
      ]
    }
  },
  include: { posts: true }
});

// Filtreleme + Sıralama + Sayfalama
const users = await prisma.user.findMany({
  where: { name: { contains: 'Ali' } },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 10,
  include: { posts: { select: { title: true } } }
});`},
        {
            title: 'prisma-transaction.js', code: `// Transaction — para transferi örneği
const transfer = await prisma.$transaction(async (tx) => {
  const sender = await tx.account.update({
    where: { id: senderId },
    data: { balance: { decrement: amount } }
  });

  if (sender.balance < 0) {
    throw new Error('Yetersiz bakiye');
  }

  const receiver = await tx.account.update({
    where: { id: receiverId },
    data: { balance: { increment: amount } }
  });

  return { sender, receiver };
});

console.log('Transfer başarılı:', transfer);`}
    ],

    'socket.io': [
        {
            title: 'chat-sunucu.js', code: `const { Server } = require('socket.io');
const io = new Server(3000, { cors: { origin: '*' } });

const users = new Map();

io.on('connection', (socket) => {
  console.log('Bağlandı:', socket.id);

  socket.on('join', (username) => {
    users.set(socket.id, username);
    socket.join('genel');
    io.to('genel').emit('system', username + ' katıldı');
  });

  socket.on('message', (msg) => {
    const username = users.get(socket.id);
    io.to('genel').emit('message', { user: username, text: msg, time: Date.now() });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.to('genel').emit('system', username + ' ayrıldı');
  });
});`},
        {
            title: 'chat-istemci.js', code: `const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Bağlantı kuruldu:', socket.id);
  socket.emit('join', 'Ali');
});

socket.on('message', (msg) => {
  console.log(msg.user + ': ' + msg.text);
});

socket.on('system', (text) => {
  console.log('[SİSTEM]', text);
});

// Mesaj gönder
socket.emit('message', 'Herkese merhaba!');`}
    ],

    'bcryptjs': [
        {
            title: 'auth-service.js', code: `const bcrypt = require('bcryptjs');

class AuthService {
  static async register(email, password) {
    // Şifreyi hashle (10 round)
    const hash = await bcrypt.hash(password, 10);
    const user = await db.users.create({ email, password: hash });
    return { id: user.id, email: user.email };
  }

  static async login(email, password) {
    const user = await db.users.findOne({ email });
    if (!user) throw new Error('Kullanıcı bulunamadı');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Şifre yanlış');

    return generateToken(user);
  }

  static async changePassword(userId, oldPass, newPass) {
    const user = await db.users.findById(userId);
    const isValid = await bcrypt.compare(oldPass, user.password);
    if (!isValid) throw new Error('Mevcut şifre yanlış');
    user.password = await bcrypt.hash(newPass, 12);
    await user.save();
  }
}`}
    ],

    'winston': [
        {
            title: 'logger-config.js', code: `const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Geliştirme ortamında console da ekle
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;`}
    ],

    'morgan': [
        {
            title: 'dosya-log.js', code: `const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

// Dönen log dosyası — her gün yeni dosya
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'logs')
});

// Üretim: dosyaya yaz
app.use(morgan('combined', { stream: accessLogStream }));

// Geliştirme: konsola renkli çıktı
app.use(morgan('dev'));

// Özel format
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));`}
    ],

    'multer': [
        {
            title: 'dosya-yukleme.js', code: `const multer = require('multer');
const path = require('path');

// Özel depolama ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// Dosya filtresi
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Sadece resim dosyaları kabul edilir'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

app.post('/avatar', upload.single('photo'), (req, res) => {
  res.json({ file: req.file.filename, size: req.file.size });
});`}
    ],

    'passport': [
        {
            title: 'local-strateji.js', code: `const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Kullanıcı bulunamadı' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Şifre yanlış' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));`}
    ],

    'sequelize': [
        {
            title: 'model-iliskiler.js', code: `const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true }
});

const Post = sequelize.define('Post', {
  title: DataTypes.STRING,
  content: DataTypes.TEXT
});

// İlişkiler
User.hasMany(Post, { foreignKey: 'authorId' });
Post.belongsTo(User, { foreignKey: 'authorId' });

await sequelize.sync();

// Kullanıcı ve yazılarını getir
const user = await User.findOne({
  where: { name: 'Ali' },
  include: [{ model: Post, limit: 5, order: [['createdAt', 'DESC']] }]
});`},
        {
            title: 'migration-ornek.js', code: `// migrations/001-create-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true },
      role: { type: Sequelize.ENUM('user', 'admin'), defaultValue: 'user' },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    await queryInterface.addIndex('Users', ['email']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  }
};

// Çalıştırma: npx sequelize-cli db:migrate`}
    ],

    'zod': [
        {
            title: 'api-dogrulama.js', code: `const { z } = require('zod');

// Kullanıcı kayıt şeması
const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter').max(50),
  email: z.string().email('Geçerli email giriniz'),
  password: z.string()
    .min(8, 'Şifre en az 8 karakter')
    .regex(/[A-Z]/, 'En az 1 büyük harf gerekli')
    .regex(/[0-9]/, 'En az 1 rakam gerekli'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword']
});

// Express middleware olarak
app.post('/register', (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }
  // result.data tip-güvenli ve doğrulanmış
  createUser(result.data);
});`}
    ],

    'dayjs': [
        {
            title: 'tarih-islemleri.js', code: `const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const isBetween = require('dayjs/plugin/isBetween');
require('dayjs/locale/tr');

dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.locale('tr');

// Formatlama
console.log(dayjs().format('DD MMMM YYYY, dddd')); // "21 Şubat 2026, Cumartesi"

// Göreceli zaman
console.log(dayjs('2026-01-01').fromNow()); // "2 ay önce"

// Tarih kontrolü
const start = dayjs('2026-03-01');
const end = dayjs('2026-03-31');
const today = dayjs();
console.log(today.isBetween(start, end)); // false

// Fark hesaplama
const birthday = dayjs('1995-06-15');
console.log(dayjs().diff(birthday, 'year')); // 30`}
    ],

    'commander': [
        {
            title: 'cli-ornek.js', code: `const { Command } = require('commander');
const program = new Command();

program
  .name('my-tool')
  .version('1.0.0')
  .description('Proje yönetim aracı');

program.command('init <name>')
  .description('Yeni proje oluştur')
  .option('-t, --template <type>', 'Şablon tipi', 'basic')
  .option('--git', 'Git repo başlat', true)
  .action((name, opts) => {
    console.log('Proje:', name);
    console.log('Şablon:', opts.template);
    if (opts.git) initGitRepo(name);
  });

program.command('deploy')
  .description('Uygulamayı deploy et')
  .option('-e, --env <env>', 'Ortam', 'staging')
  .action((opts) => {
    console.log(opts.env, 'ortamına deploy ediliyor...');
  });

program.parse();`}
    ],

    'fastify': [
        {
            title: 'fastify-detay.js', code: `const fastify = require('fastify')({ logger: true });

// JSON Schema ile doğrulama
const userSchema = {
  body: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' }
      }
    }
  }
};

fastify.post('/users', { schema: userSchema }, async (request, reply) => {
  const user = await db.createUser(request.body);
  return user; // otomatik serialize
});

fastify.listen({ port: 3000 });`}
    ],

    'nodemailer': [
        {
            title: 'html-email.js', code: `const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
});

// HTML e-posta gönderimi
await transporter.sendMail({
  from: '"Uygulama" <noreply@app.com>',
  to: 'user@example.com',
  subject: 'Hesabınız Onaylandı ✔',
  html: \`
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Hoş Geldiniz!</h2>
      <p>Hesabınız başarıyla oluşturuldu.</p>
      <a href="https://app.com/login"
         style="background:#2563eb;color:white;padding:12px 24px;
                border-radius:6px;text-decoration:none;">
        Giriş Yap
      </a>
    </div>
  \`
});`}
    ],

    'sharp': [
        {
            title: 'resim-isleme.js', code: `const sharp = require('sharp');

// Thumbnail oluşturma
await sharp('input.jpg')
  .resize(200, 200, { fit: 'cover', position: 'center' })
  .webp({ quality: 80 })
  .toFile('thumb.webp');

// Watermark ekleme
const watermark = Buffer.from(
  '<svg><text x="10" y="30" font-size="24" fill="white" opacity="0.5">© MyApp</text></svg>'
);

await sharp('photo.jpg')
  .composite([{ input: watermark, gravity: 'southeast' }])
  .jpeg({ quality: 90 })
  .toFile('watermarked.jpg');

// Toplu dönüştürme
const files = ['a.jpg', 'b.png', 'c.webp'];
for (const file of files) {
  await sharp(file)
    .resize(800, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile('optimized/' + file.replace(/\\..+$/, '.webp'));
}`}
    ],

    'puppeteer': [
        {
            title: 'web-scraping.js', code: `const puppeteer = require('puppeteer');

async function scrapeProducts() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://example-shop.com/products');

  // Sayfadaki ürünleri çek
  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product-card')).map(el => ({
      name: el.querySelector('.title')?.textContent,
      price: el.querySelector('.price')?.textContent,
      image: el.querySelector('img')?.src
    }));
  });

  // PDF olarak kaydet
  await page.pdf({ path: 'products.pdf', format: 'A4' });

  await browser.close();
  return products;
}`},
        {
            title: 'form-otomasyon.js', code: `const puppeteer = require('puppeteer');

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

await page.goto('https://example.com/login');

// Form doldur
await page.type('#email', 'test@example.com', { delay: 50 });
await page.type('#password', 'sifre123', { delay: 50 });
await page.click('#loginButton');

// Navigasyon bekle
await page.waitForNavigation();
await page.waitForSelector('.dashboard');

// Cookie'leri kaydet
const cookies = await page.cookies();
require('fs').writeFileSync('cookies.json', JSON.stringify(cookies));

await page.screenshot({ path: 'dashboard.png', fullPage: true });
await browser.close();`}
    ],

    'fs-extra': [
        {
            title: 'dosya-islemleri.js', code: `const fs = require('fs-extra');

// Güvenli dizin oluşturma (iç içe)
await fs.ensureDir('output/images/thumbnails');

// Proje scaffolding — şablon kopyalama
await fs.copy('templates/react-app', 'projects/my-new-app', {
  filter: (src) => !src.includes('node_modules')
});

// JSON ayar dosyası okuma/yazma
const config = await fs.readJson('config.json');
config.version = '2.0.0';
config.updatedAt = new Date().toISOString();
await fs.writeJson('config.json', config, { spaces: 2 });

// Dosya varlık kontrolü
if (await fs.pathExists('data/cache.json')) {
  console.log('Cache mevcut');
  await fs.remove('data/cache.json');
}

// Taşıma
await fs.move('temp/upload.jpg', 'public/images/avatar.jpg', { overwrite: true });`}
    ],

    'joi': [
        {
            title: 'detayli-dogrulama.js', code: `const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().precision(2).required(),
  category: Joi.string().valid('elektronik', 'giyim', 'gıda').required(),
  tags: Joi.array().items(Joi.string()).min(1).max(5),
  details: Joi.object({
    weight: Joi.number().positive(),
    color: Joi.string()
  }).optional(),
  publishDate: Joi.date().iso().min('now')
}).with('price', 'category'); // price varsa category zorunlu

// Express middleware
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(d => d.message);
      return res.status(400).json({ errors });
    }
    req.body = value; // temizlenmiş veri
    next();
  };
}

app.post('/products', validate(productSchema), handler);`}
    ],

    'inquirer': [
        {
            title: 'proje-sihirbazi.js', code: `const { input, select, checkbox, confirm } = require('@inquirer/prompts');

async function createProject() {
  const name = await input({ message: 'Proje adı:' });

  const framework = await select({
    message: 'Framework seçin:',
    choices: [
      { name: 'Express', value: 'express' },
      { name: 'Fastify', value: 'fastify' },
      { name: 'Koa', value: 'koa' }
    ]
  });

  const features = await checkbox({
    message: 'Özellikler:',
    choices: [
      { name: 'TypeScript', value: 'typescript' },
      { name: 'ESLint', value: 'eslint' },
      { name: 'Docker', value: 'docker' },
      { name: 'Jest', value: 'jest' }
    ]
  });

  const useGit = await confirm({ message: 'Git repo oluşturulsun mu?' });

  console.log({ name, framework, features, useGit });
  // Proje oluşturma mantığı...
}

createProject();`}
    ],

    'webpack': [
        {
            title: 'webpack-config.js', code: `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: { path: path.resolve(__dirname, 'dist'), filename: '[name].[contenthash].js', clean: true },
  module: {
    rules: [
      { test: /\\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\\.(png|jpg|gif|svg)$/, type: 'asset/resource' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })
  ],
  optimization: {
    splitChunks: { chunks: 'all' }
  },
  devServer: { port: 3000, hot: true, open: true }
};`}
    ],

    'body-parser': [
        {
            title: 'veri-islemleri.js', code: `const express = require('express');
const app = express();

// JSON — API istekleri
app.use(express.json({ limit: '10mb' }));

// URL-encoded — HTML form
app.use(express.urlencoded({ extended: true }));

// Webhook — ham body
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const event = JSON.parse(req.body);
  console.log('Webhook:', event.type);
  res.sendStatus(200);
});

// Dosya boyutu hatası yakalama
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Veri boyutu çok büyük' });
  }
  next(err);
});`}
    ],

    'cheerio': [
        {
            title: 'veri-cekme.js', code: `const cheerio = require('cheerio');
const axios = require('axios');

async function scrapeNews() {
  const { data: html } = await axios.get('https://news.example.com');
  const $ = cheerio.load(html);

  const articles = [];
  $('article.news-item').each((i, el) => {
    articles.push({
      title: $(el).find('h2 a').text().trim(),
      link: $(el).find('h2 a').attr('href'),
      summary: $(el).find('.summary').text().trim(),
      date: $(el).find('time').attr('datetime'),
      image: $(el).find('img').attr('src')
    });
  });

  return articles;
}

// HTML düzenleme
const $ = cheerio.load('<ul><li>A</li><li>B</li></ul>');
$('ul').append('<li>C</li>');
$('li').addClass('item');
console.log($.html()); // düzenlenmiş HTML`}
    ],

    'node-cron': [
        {
            title: 'zamanlanmis-gorevler.js', code: `const cron = require('node-cron');

// Her gün saat 09:00'da
cron.schedule('0 9 * * *', () => {
  sendDailyReport();
  console.log('Günlük rapor gönderildi');
}, { timezone: 'Europe/Istanbul' });

// Her 5 dakikada cache temizle
cron.schedule('*/5 * * * *', () => {
  clearExpiredCache();
});

// Her Pazartesi saat 08:00
cron.schedule('0 8 * * 1', () => {
  sendWeeklyNewsletter();
});

// Her ayın 1'inde veritabanı yedekleme
const backup = cron.schedule('0 3 1 * *', () => {
  backupDatabase();
}, { scheduled: false });

// Manuel başlat/durdur
backup.start();
// backup.stop();`}
    ],

    'express-validator': [
        {
            title: 'form-dogrulama.js', code: `const { body, param, query, validationResult } = require('express-validator');

// Kullanıcı kayıt doğrulama
app.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Geçerli email girin'),
  body('password').isLength({ min: 8 }).withMessage('En az 8 karakter'),
  body('name').trim().notEmpty().escape(),
  body('age').optional().isInt({ min: 18, max: 120 }),
  body('website').optional().isURL()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Doğrulanmış ve temizlenmiş verilerle devam
  createUser(req.body);
});

// Parametre doğrulama
app.get('/users/:id', [
  param('id').isMongoId().withMessage('Geçersiz ID')
], handler);

// Query string doğrulama
app.get('/search', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], handler);`}
    ],

    'ejs': [
        {
            title: 'layout-pattern.js', code: `const express = require('express');
const app = express();
app.set('view engine', 'ejs');

// views/layout.ejs:
// <html>
//   <head><title><%= title %></title></head>
//   <body>
//     <%- include('partials/header') %>
//     <%- body %>
//     <%- include('partials/footer') %>
//   </body>
// </html>

// views/partials/header.ejs:
// <nav><a href="/">Ana Sayfa</a> | <a href="/hakkinda">Hakkında</a></nav>

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Ana Sayfa',
    users: [
      { name: 'Ali', role: 'admin' },
      { name: 'Ayşe', role: 'user' }
    ]
  });
});

// views/index.ejs:
// <h1><%= title %></h1>
// <% users.forEach(u => { %>
//   <div class="<%= u.role %>"><%= u.name %></div>
// <% }) %>`}
    ],

    'pino': [
        {
            title: 'pino-kullanim.js', code: `const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'HH:MM:ss' }
  } : undefined,
  redact: ['req.headers.authorization', 'password'] // hassas veri gizleme
});

// Child logger
const dbLogger = logger.child({ module: 'database' });
dbLogger.info('Bağlantı kuruldu');
dbLogger.error({ err: new Error('Timeout') }, 'Sorgu hatası');

// Express ile kullanım (pino-http)
const pinoHttp = require('pino-http')({ logger });
app.use(pinoHttp);`}
    ],

    'got': [
        {
            title: 'gelismis-istek.js', code: `const got = require('got');

// Retry + timeout
const client = got.extend({
  prefixUrl: 'https://api.example.com',
  timeout: { request: 5000 },
  retry: { limit: 3, methods: ['GET'] },
  hooks: {
    beforeRequest: [opts => {
      opts.headers['x-api-key'] = process.env.API_KEY;
    }],
    afterResponse: [res => {
      console.log(res.statusCode, res.url);
      return res;
    }]
  }
});

const data = await client.get('users').json();

// Stream ile büyük dosya indirme
const pipeline = require('stream/promises').pipeline;
await pipeline(
  got.stream('https://example.com/large-file.zip'),
  require('fs').createWriteStream('file.zip')
);`}
    ],

    'pg': [
        {
            title: 'transaction-ornek.js', code: `const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Transaction ile güvenli veri değişikliği
async function transferMoney(from, to, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING balance',
      [amount, from]
    );

    if (rows[0].balance < 0) throw new Error('Yetersiz bakiye');

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, to]
    );

    await client.query('COMMIT');
    console.log('Transfer başarılı');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}`}
    ],

    'vite': [
        {
            title: 'vite-config.js', code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'dayjs']
        }
      }
    }
  },
  resolve: {
    alias: { '@': '/src' }
  }
});`}
    ],

    'knex': [
        {
            title: 'knex-sorgular.js', code: `const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

// Kompleks sorgu
const results = await knex('orders')
  .join('users', 'orders.user_id', 'users.id')
  .join('products', 'orders.product_id', 'products.id')
  .where('orders.status', 'completed')
  .whereBetween('orders.created_at', ['2026-01-01', '2026-12-31'])
  .select(
    'users.name as customer',
    'products.name as product',
    'orders.total',
    'orders.created_at'
  )
  .orderBy('orders.total', 'desc')
  .limit(20);

// Alt sorgu
const topCustomers = await knex('orders')
  .select('user_id')
  .sum('total as total_spent')
  .groupBy('user_id')
  .having(knex.raw('sum(total) > ?', [1000]))
  .orderBy('total_spent', 'desc');`}
    ],

    'express-rate-limit': [
        {
            title: 'coklu-limiter.js', code: `const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

// Genel API limiti
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Çok fazla istek, 15 dk sonra tekrar deneyin' },
  standardHeaders: true,
  legacyHeaders: false
});

// Login — daha sıkı limit
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5,
  message: { error: 'Çok fazla giriş denemesi' },
  skipSuccessfulRequests: true
});

// Admin paneli bypass
const adminSkip = rateLimit({
  max: 100,
  skip: (req) => req.user?.role === 'admin'
});

app.use('/api/', apiLimiter);
app.post('/login', loginLimiter);`}
    ],

    'mocha': [
        {
            title: 'mocha-test.js', code: `const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  let authToken;

  before(async () => {
    await db.connect();
    await db.seed();
  });

  after(async () => {
    await db.cleanup();
  });

  describe('POST /login', () => {
    it('geçerli bilgilerle token döner', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'test@test.com', password: '123456' })
        .expect(200);

      expect(res.body).to.have.property('token');
      authToken = res.body.token;
    });

    it('yanlış şifreyle 401 döner', async () => {
      await request(app)
        .post('/login')
        .send({ email: 'test@test.com', password: 'wrong' })
        .expect(401);
    });
  });
});`}
    ],

    'glob': [
        {
            title: 'dosya-bulma.js', code: `const { glob, globSync } = require('glob');

// Tüm JS dosyaları (recursive)
const jsFiles = await glob('src/**/*.js');
console.log(jsFiles.length, 'JS dosyası bulundu');

// Belirli dosyaları hariç tut
const sourceFiles = await glob('src/**/*.{js,ts}', {
  ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
});

// Senkron kullanım
const configs = globSync('config/*.{json,yaml,yml}');

// Birden fazla kalıp
const assets = await glob(['public/**/*.{png,jpg,svg}', 'src/**/*.css']);
console.log(assets.length, 'asset dosyası');`}
    ],

    'ioredis': [
        {
            title: 'cache-pattern.js', code: `const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// Cache-aside pattern
async function getCached(key, fetchFn, ttl = 3600) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// Kullanım
const users = await getCached('users:all', () => db.users.findAll(), 300);

// Pub/Sub
const sub = new Redis();
sub.subscribe('notifications');
sub.on('message', (channel, message) => {
  console.log('Bildirim:', JSON.parse(message));
});

// Yayınlama
await redis.publish('notifications', JSON.stringify({ type: 'new_order', id: 42 }));`}
    ],

    'compression': [
        {
            title: 'sıkistirma-ayar.js', code: `const compression = require('compression');

// Özel filtre — sadece belirli tipleri sıkıştır
app.use(compression({
  threshold: 1024, // 1KB altı sıkıştırılmaz
  level: 6,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Büyük JSON yanıtları otomatik sıkıştırılır
app.get('/api/data', (req, res) => {
  const bigData = generateLargeDataset(); // 500KB+
  res.json(bigData); // gzip ile ~50KB
});`}
    ],

    'supertest': [
        {
            title: 'api-test.js', code: `const request = require('supertest');
const app = require('../app');

describe('Products API', () => {
  let productId;

  test('POST /products — ürün oluşturur', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', 'Bearer ' + token)
      .send({ name: 'Test Ürün', price: 99.99 })
      .expect('Content-Type', /json/)
      .expect(201);

    productId = res.body.id;
    expect(res.body.name).toBe('Test Ürün');
  });

  test('GET /products/:id — ürün getirir', async () => {
    const res = await request(app)
      .get('/products/' + productId)
      .expect(200);

    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('price');
  });

  test('DELETE /products/:id — ürün siler', async () => {
    await request(app)
      .delete('/products/' + productId)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);
  });
});`}
    ],

    'cookie-parser': [
        {
            title: 'cerez-yonetimi.js', code: `const cookieParser = require('cookie-parser');

app.use(cookieParser('gizli_anahtar'));

// Çerez oluşturma
app.get('/set-prefs', (req, res) => {
  res.cookie('theme', 'dark', { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
  res.cookie('lang', 'tr', { maxAge: 365 * 24 * 60 * 60 * 1000 });
  // İmzalı çerez
  res.cookie('userId', '12345', { signed: true, secure: true, httpOnly: true });
  res.json({ message: 'Tercihler kaydedildi' });
});

// Çerez okuma
app.get('/get-prefs', (req, res) => {
  const theme = req.cookies.theme;           // 'dark'
  const userId = req.signedCookies.userId;   // '12345' (doğrulanmış)
  res.json({ theme, userId });
});

// Çerez silme
app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/');
});`}
    ]
};
