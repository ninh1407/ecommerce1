function getUsers(){try{return JSON.parse(localStorage.getItem('users')||'[]')}catch(e){return []}}
function setUsers(v){localStorage.setItem('users',JSON.stringify(v))}
function getSession(){try{return JSON.parse(localStorage.getItem('session')||'{}')}catch(e){return {}}}
function setSession(v){localStorage.setItem('session',JSON.stringify(v))}
function initDefaultAdmin(){const users=getUsers();if(!users.find(u=>u.role==='admin')){users.push({id:Date.now(),email:'admin@example.com',password:'admin123',name:'Administrator',role:'admin',twofa:false});setUsers(users)}}
function genCode(){return String(Math.floor(100000+Math.random()*900000))}
export const auth={
  init(){initDefaultAdmin()},
  login(email,password){const u=getUsers().find(x=>x.email===email&&x.password===password);if(!u)return {ok:false};const session={uid:u.id,email:u.email,role:u.role,exp:Date.now()+3600*1000};if(u.twofa){const code=genCode();localStorage.setItem('twofa_code',JSON.stringify({uid:u.id,code,exp:Date.now()+5*60*1000}));return {ok:false,twofa:true,session}}
    setSession(session);return {ok:true}},
  verify2fa(code,session){try{const data=JSON.parse(localStorage.getItem('twofa_code')||'{}');if(!data.code||Date.now()>data.exp||String(code)!==String(data.code)||data.uid!==session.uid){return false}setSession(session);localStorage.removeItem('twofa_code');return true}catch(e){return false}},
  logout(){localStorage.removeItem('session')},
  current(){return getSession()},
  requireRole(role){const s=getSession();if(!s.role||Date.now()>(s.exp||0))return false;return role?String(s.role)===String(role):true},
  requireAny(roles){const s=getSession();if(!s.role||Date.now()>(s.exp||0))return false;return Array.isArray(roles)?roles.includes(String(s.role)):false},
  upsertUser(u){const list=getUsers();const idx=list.findIndex(x=>x.id===u.id);if(idx>=0)list[idx]={...list[idx],...u};else{u.id=Date.now();list.push(u)}setUsers(list);return u},
  setRole(id,role){const list=getUsers();const u=list.find(x=>x.id===id);if(u){u.role=role;setUsers(list)}return u},
  changePassword(id,newPass){const list=getUsers();const u=list.find(x=>x.id===id);if(u){u.password=newPass;setUsers(list)}return !!u},
  toggle2fa(id,enabled){const list=getUsers();const u=list.find(x=>x.id===id);if(u){u.twofa=!!enabled;setUsers(list)}return !!u},
  startReset(email){const u=getUsers().find(x=>x.email===email);if(!u)return null;const token=genCode()+Date.now();localStorage.setItem('reset_token',JSON.stringify({uid:u.id,token,exp:Date.now()+10*60*1000}));return token},
  confirmReset(token,newPass){try{const data=JSON.parse(localStorage.getItem('reset_token')||'{}');if(!data.token||String(token)!==String(data.token)||Date.now()>data.exp)return false;auth.changePassword(data.uid,newPass);localStorage.removeItem('reset_token');return true}catch(e){return false}}
};
