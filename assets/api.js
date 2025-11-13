const API_BASE = 'http://localhost:3000';
function httpGet(path){return fetch(path,{headers:{'Accept':'application/json'}}).then(r=>{if(!r.ok)throw new Error('http');return r.json()})}
function httpPost(path,body){return fetch(path,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)}).then(r=>{if(!r.ok)throw new Error('http');return r.json()})}
function httpPut(path,body){return fetch(path,{method:'PUT',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)}).then(r=>{if(!r.ok)throw new Error('http');return r.json()})}
function httpDelete(path){return fetch(path,{method:'DELETE'}).then(r=>{if(!r.ok)throw new Error('http');return r.json()})}
function lsGet(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return []}}
function lsSet(k,v){localStorage.setItem(k,JSON.stringify(v))}
function lsGetObj(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return {}}}
function lsSetObj(k,v){localStorage.setItem(k,JSON.stringify(v))}
export const api={
  setToken(token){localStorage.setItem('jwt',token)},
  getToken(){return localStorage.getItem('jwt')||''},
  authHeaders(){const t=this.getToken();return t?{'Authorization':'Bearer '+t}:{}},
  async getProducts(){try{const base=await httpGet(API_BASE+'/api/products');const overrides=lsGet('productsOverrides');if(Array.isArray(overrides)&&overrides.length){const map=new Map(base.map(p=>[p.id,p]));overrides.forEach(p=>map.set(p.id,p));return Array.from(map.values())}return base}catch(e){const base=await httpGet('data/products.json');const overrides=lsGet('productsOverrides');if(Array.isArray(overrides)&&overrides.length){const map=new Map(base.map(p=>[p.id,p]));overrides.forEach(p=>map.set(p.id,p));return Array.from(map.values())}return base}},
  async upsertProduct(p){try{const h=this.authHeaders();if(p && p.id){return await fetch(API_BASE+'/api/products/'+p.id,{method:'PUT',headers:{'Content-Type':'application/json','Accept':'application/json',...h},body:JSON.stringify(p)}).then(r=>r.json())}return await fetch(API_BASE+'/api/products',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',...h},body:JSON.stringify(p)}).then(r=>r.json())}catch(e){const overrides=lsGet('productsOverrides');const idx=overrides.findIndex(x=>x.id===p.id);if(idx>=0)overrides[idx]=p;else overrides.push(p);lsSet('productsOverrides',overrides);return p}},
  async deleteProduct(id){try{const h=this.authHeaders();return await fetch(API_BASE+'/api/products/'+id,{method:'DELETE',headers:h}).then(r=>r.json())}catch(e){const overrides=lsGet('productsOverrides').filter(x=>x.id!==id);lsSet('productsOverrides',overrides);return true}},
  async getCategories(){return lsGet('categories')},
  async upsertCategory(c){const cats=lsGet('categories');const idx=cats.findIndex(x=>x.id===c.id);if(idx>=0)cats[idx]=c;else cats.push(c);lsSet('categories',cats);return c},
  async deleteCategory(id){lsSet('categories',lsGet('categories').filter(x=>x.id!==id));return true},
  async getStores(){try{return await httpGet(API_BASE+'/api/stores')}catch(e){return await httpGet('data/stores.json')}},
  async createOrder(order){try{return await httpPost(API_BASE+'/api/orders',order)}catch(e){const list=lsGet('orders');const id=Date.now();const o={id,...order,status:'Chưa xử lý',createdAt:new Date().toISOString()};list.push(o);lsSet('orders',list);return o}},
  async listOrders(){try{return await httpGet(API_BASE+'/api/orders')}catch(e){return lsGet('orders')}},
  async updateOrderStatus(id,status){try{const h=this.authHeaders();return await fetch(API_BASE+'/api/orders/'+id,{method:'PUT',headers:{'Content-Type':'application/json','Accept':'application/json',...h},body:JSON.stringify({status})}).then(r=>r.json())}catch(e){const list=lsGet('orders');const it=list.find(x=>String(x.id)===String(id));if(it){it.status=status;lsSet('orders',list)}return it}},
  async updateInventory(items){const inv=lsGet('inventory');items.forEach(it=>{const cur=inv.find(x=>x.id===it.id);if(cur){cur.stock=Math.max(0,(cur.stock||0)-(it.qty||0))}else{inv.push({id:it.id,stock:Math.max(0,-(it.qty||0))})}});lsSet('inventory',inv);return inv},
  async getInventory(){return lsGet('inventory')},
  async getUsers(){try{return await httpGet(API_BASE+'/api/users')}catch(e){return lsGet('users')}},
  async createUser(u){try{const h=this.authHeaders();return await fetch(API_BASE+'/api/users',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',...h},body:JSON.stringify(u)}).then(r=>r.json())}catch(e){const users=lsGet('users');const id=Date.now();users.push({id,...u});lsSet('users',users);return id}},
  async getPosts(){try{return await httpGet(API_BASE+'/api/posts')}catch(e){return lsGet('posts')}},
  async upsertPost(p){try{const h=this.authHeaders();return await fetch(API_BASE+'/api/posts',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',...h},body:JSON.stringify(p)}).then(r=>r.json())}catch(e){const posts=lsGet('posts');const idx=posts.findIndex(x=>x.id===p.id);if(idx>=0)posts[idx]=p;else posts.push(p);lsSet('posts',posts);return p}},
  async deletePost(id){try{const h=this.authHeaders();return await fetch(API_BASE+'/api/posts/'+id,{method:'DELETE',headers:h}).then(r=>r.json())}catch(e){lsSet('posts',lsGet('posts').filter(x=>x.id!==id));return true}},
  async getPromos(){try{return await httpGet(API_BASE+'/api/promos')}catch(e){return lsGet('promos')}},
  async upsertPromo(p){try{const h=this.authHeaders();return await fetch(API_BASE+'/api/promos',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json',...h},body:JSON.stringify(p)}).then(r=>r.json())}catch(e){const promos=lsGet('promos');const idx=promos.findIndex(x=>x.id===p.id);if(idx>=0)promos[idx]=p;else promos.push(p);lsSet('promos',promos);return p}},
  async deletePromo(id){try{const h=this.authHeaders();return await fetch(API_BASE+'/api/promos/'+id,{method:'DELETE',headers:h}).then(r=>r.json())}catch(e){lsSet('promos',lsGet('promos').filter(x=>x.id!==id));return true}},
  async getSettings(){try{return await httpGet(API_BASE+'/api/settings')}catch(e){return lsGetObj('settings')}},
  async updateSettings(s){try{const h=this.authHeaders();return await fetch(API_BASE+'/api/settings',{method:'PUT',headers:{'Content-Type':'application/json','Accept':'application/json',...h},body:JSON.stringify(s)}).then(r=>r.json())}catch(e){lsSetObj('settings',s);return s}},
  async login(email,password){const res=await fetch(API_BASE+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({email,password})}).then(r=>r.json());if(res && res.token){this.setToken(res.token)}return res}
};
