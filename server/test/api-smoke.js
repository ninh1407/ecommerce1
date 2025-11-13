import assert from 'assert'
const base = 'http://localhost:3000'
async function j(method,path,body){const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});const t=await r.text();try{return JSON.parse(t)}catch{return t}}
(async()=>{
  const bootstrap = await j('POST','/api/bootstrap/admin')
  const login = await j('POST','/api/auth/login',{email:'admin@example.com',password:'admin123'})
  assert.ok(login.token)
  const token = login.token
  const headers = { 'Authorization':'Bearer '+token, 'Content-Type':'application/json' }
  let r = await fetch(base+'/api/products').then(r=>r.json())
  assert.ok(Array.isArray(r))
  r = await fetch(base+'/api/orders').then(r=>r.json())
  assert.ok(Array.isArray(r))
  console.log('API smoke OK')
})()
