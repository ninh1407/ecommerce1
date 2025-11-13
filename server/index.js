import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import multer from 'multer'
import sharp from 'sharp'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cheerio from 'cheerio'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('tiny'))
app.use('/uploads', express.static(new URL('./uploads', import.meta.url).pathname))

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dienmay'
await mongoose.connect(uri)

const Product = mongoose.model('Product', new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  name: String,
  brand: String,
  category: String,
  price: Number,
  stock: Number,
  image: String,
  images: [String],
  size: Number,
  power: Number,
  tech: String,
  original: Number
}, { timestamps: true }))

const Category = mongoose.model('Category', new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  name: String
}, { timestamps: true }))

const Order = mongoose.model('Order', new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  items: [{ id: Number, qty: Number }],
  amount: Number,
  orderCode: String,
  phone: String,
  method: String,
  status: String,
  returnReason: String,
  createdAt: { type: Date, default: Date.now }
}))

const User = mongoose.model('User', new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  email: String,
  password: String,
  name: String,
  phone: String,
  role: String,
  twofa: Boolean
}, { timestamps: true }))

const Post = mongoose.model('Post', new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  title: String,
  content: String
}, { timestamps: true }))

const Promo = mongoose.model('Promo', new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  code: String,
  percent: Number,
  note: String
}, { timestamps: true }))

const Setting = mongoose.model('Setting', new mongoose.Schema({
  shopName: String,
  logo: String,
  hotline: String,
  email: String,
  shipping: String
}, { timestamps: true }))

app.get('/api/products', async (req, res) => {
  const list = await Product.find().sort({ id: 1 })
  res.json(list)
})
app.post('/api/products', async (req, res) => {
  // require admin
  // minimal RBAC: allow admin only
  try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}
  const p = req.body
  if (!p.id) p.id = Date.now()
  const doc = await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true })
  res.json(doc)
})
app.put('/api/products/:id', async (req, res) => {
  try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'&&payload.role!=='bien-tap'&&payload.role!=='nhan-vien-kho'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}
  const id = Number(req.params.id)
  const doc = await Product.findOneAndUpdate({ id }, req.body, { new: true })
  res.json(doc)
})
app.delete('/api/products/:id', async (req, res) => {
  try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}
  const id = Number(req.params.id)
  await Product.deleteOne({ id })
  res.json({ ok: true })
})

app.get('/api/categories', async (req, res) => {
  const list = await Category.find().sort({ id: 1 })
  res.json(list)
})
app.post('/api/categories', async (req, res) => {
  try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}
  const c = req.body
  if (!c.id) c.id = Date.now()
  const doc = await Category.findOneAndUpdate({ id: c.id }, c, { upsert: true, new: true })
  res.json(doc)
})
app.delete('/api/categories/:id', async (req, res) => {
  try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}
  const id = Number(req.params.id)
  await Category.deleteOne({ id })
  res.json({ ok: true })
})

app.get('/api/orders', async (req, res) => {
  const list = await Order.find().sort({ id: -1 })
  res.json(list)
})
app.post('/api/orders', async (req, res) => {
  const o = req.body
  if (!o.id) o.id = Date.now()
  if (!o.status) o.status = 'Chưa xử lý'
  const doc = await Order.create(o)
  res.json(doc)
})
app.put('/api/orders/:id', async (req, res) => {
  const id = Number(req.params.id)
  const doc = await Order.findOneAndUpdate({ id }, req.body, { new: true })
  res.json(doc)
})

app.get('/api/users', async (req, res) => {
  const list = await User.find().sort({ id: -1 })
  res.json(list)
})
app.post('/api/users', async (req, res) => {
  try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}
  const u = req.body
  if (!u.id) u.id = Date.now()
  if(u.password){u.password = await bcrypt.hash(u.password,10)}
  const doc = await User.findOneAndUpdate({ id: u.id }, u, { upsert: true, new: true })
  res.json(doc)
})
app.put('/api/users/:id', async (req, res) => {
  try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}
  const id = Number(req.params.id)
  const body = {...req.body}
  if(body.password){body.password = await bcrypt.hash(body.password,10)}
  const doc = await User.findOneAndUpdate({ id }, body, { new: true })
  res.json(doc)
})

app.get('/api/posts', async (req, res) => {
  const list = await Post.find().sort({ id: -1 })
  res.json(list)
})
app.post('/api/posts', async (req, res) => {
  const p = req.body
  if (!p.id) p.id = Date.now()
  const doc = await Post.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true })
  res.json(doc)
})
app.delete('/api/posts/:id', async (req, res) => {
  const id = Number(req.params.id)
  await Post.deleteOne({ id })
  res.json({ ok: true })
})

app.get('/api/promos', async (req, res) => {
  const list = await Promo.find().sort({ id: -1 })
  res.json(list)
})
app.post('/api/promos', async (req, res) => {
  const p = req.body
  if (!p.id) p.id = Date.now()
  const doc = await Promo.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true })
  res.json(doc)
})
app.delete('/api/promos/:id', async (req, res) => {
  const id = Number(req.params.id)
  await Promo.deleteOne({ id })
  res.json({ ok: true })
})

app.get('/api/settings', async (req, res) => {
  const s = await Setting.findOne()
  res.json(s || {})
})
app.put('/api/settings', async (req, res) => {
  try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}
  const s = await Setting.findOne()
  if (s) {
    Object.assign(s, req.body)
    await s.save()
    res.json(s)
  } else {
    const created = await Setting.create(req.body)
    res.json(created)
  }
})

app.post('/api/bootstrap/admin', async (req,res)=>{const count=await User.countDocuments();if(count>0){return res.status(400).json({error:'exists'})}const u={id:Date.now(),email:'admin@example.com',password:await bcrypt.hash('admin123',10),name:'Administrator',role:'admin'};await User.create(u);res.json({ok:true})})

app.get('/api/stores', async (req,res)=>{const list=await Store.find().sort({id:1});res.json(list)})
app.post('/api/stores', async (req,res)=>{try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}const s=req.body;if(!s.id)s.id=Date.now();const doc=await Store.findOneAndUpdate({id:s.id}, s, {upsert:true,new:true});res.json(doc)})

const storage = multer.memoryStorage()
const upload = multer({ storage })
app.post('/api/upload', upload.array('files', 6), async (req,res)=>{try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';jwt.verify(t, process.env.JWT_SECRET || 'devsecret')}catch(e){return res.status(401).json({error:'bad_token'})}const out=[];for(const f of req.files){const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;const full = new URL(`./uploads/${name}`, import.meta.url).pathname;await sharp(f.buffer).resize(800).jpeg({quality:85}).toFile(full);out.push(`/uploads/${name}`)}res.json({files:out})})

const port = process.env.PORT || 3000
app.listen(port, () => {})
const Store = mongoose.model('Store', new mongoose.Schema({
  id: { type: Number, index: true, unique: true },
  name: String,
  lat: Number,
  lng: Number,
  address: String,
  phone: String
}, { timestamps: true }))

function authMiddleware(req,res,next){const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';if(!t){return res.status(401).json({error:'no_token'})}try{const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');req.user=payload;next()}catch(e){return res.status(401).json({error:'bad_token'})}}
function roleMiddleware(role){return (req,res,next)=>{if(!req.user||req.user.role!==role){return res.status(403).json({error:'forbidden'})}next()}}

app.post('/api/auth/login', async (req,res)=>{const {email,password}=req.body||{};const u=await User.findOne({email});if(!u){return res.status(401).json({error:'invalid'})}if(u.password && u.password.startsWith('$2')){const ok=await bcrypt.compare(password,u.password);if(!ok){return res.status(401).json({error:'invalid'})}}else{if(u.password!==password){return res.status(401).json({error:'invalid'})}u.password=await bcrypt.hash(password,10);await u.save()}const token=jwt.sign({uid:u.id,email:u.email,role:u.role}, process.env.JWT_SECRET || 'devsecret', {expiresIn:'2h'});res.json({token,role:u.role})})
function parseCSV(text){const lines=text.split(/\r?\n/).filter(l=>l.trim().length>0);if(lines.length===0)return [];const header=splitCSVLine(lines[0]);const rows=[];for(let i=1;i<lines.length;i++){const cols=splitCSVLine(lines[i]);const obj={};header.forEach((h,idx)=>{obj[h]=cols[idx]});rows.push(obj)}return rows}
function splitCSVLine(line){const result=[];let cur='';let inQuotes=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){inQuotes=!inQuotes;continue}if(ch===','&&!inQuotes){result.push(cur.trim());cur='';}else{cur+=ch}}result.push(cur.trim());return result.map(v=>v)}
app.post('/api/import/products', upload.single('file'), async (req,res)=>{try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}const text=(req.file?req.file.buffer.toString('utf8'):String(req.body.csv||''));if(!text)return res.status(400).json({error:'no_csv'});const rows=parseCSV(text);let ok=0;for(const r of rows){const p={id:Number(r.id)||Date.now(),name:r.name,brand:r.brand,category:r.category,price:Number(r.price)||0,original:Number(r.original)||0,stock:Number(r.stock)||0,image:r.image,images:(r.images||'').split('|').filter(Boolean),description:r.description,warranty:r.warranty,delivery:r.delivery};await Product.findOneAndUpdate({id:p.id},p,{upsert:true,new:true});ok++}res.json({imported:ok})})

async function isAllowedByRobots(url){try{const u=new URL(url);const robots=`${u.protocol}//${u.host}/robots.txt`;const txt=await fetch(robots).then(r=>r.ok?r.text():'');if(!txt)return true;const path=u.pathname;const dis=txt.split(/\r?\n/).filter(l=>l.toLowerCase().startsWith('disallow:')).map(l=>l.split(':')[1].trim());return !dis.some(rule=>rule!=='/' && path.startsWith(rule))}catch(e){return true}}
app.post('/api/crawl/preview', async (req,res)=>{const {url,selectors} = req.body || {};if(!url)return res.status(400).json({error:'no_url'});const allow=await isAllowedByRobots(url);if(!allow)return res.status(403).json({error:'robots_disallow'});const html=await fetch(url).then(r=>r.text());const $=cheerio.load(html);const get=(sel)=>sel?$(sel).first().text().trim():'';const getAttr=(sel,attr)=>sel?$(sel).first().attr(attr)||'':'';const name=get(selectors?.name);const priceText=get(selectors?.price);const price=Number(String(priceText).replace(/[^0-9]/g,''))||0;const image=getAttr(selectors?.image,'src');res.json({name,price,image,raw:{priceText}})}
app.post('/api/crawl/import', async (req,res)=>{try{const h=req.headers['authorization']||'';const t=h.startsWith('Bearer ')?h.slice(7):'';const payload=jwt.verify(t, process.env.JWT_SECRET || 'devsecret');if(payload.role!=='admin'){return res.status(403).json({error:'forbidden'})}}catch(e){return res.status(401).json({error:'bad_token'})}const p=req.body;if(!p||!p.name)return res.status(400).json({error:'bad_product'});p.id = Number(p.id)||Date.now();await Product.findOneAndUpdate({id:p.id},p,{upsert:true,new:true});res.json({ok:true})})
