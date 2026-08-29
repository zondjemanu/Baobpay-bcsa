 const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8080;

// ===== BASE DE DONNÉES PILOTE BCSA =====
let taux_or = 85000; // 1g d'Or = 85000 FCFA
let users = [
    {id:1, nom:"ETAT PILOTE CI", pays:"Côte d'Ivoire", solde_baob:1000, solde_fcfa:50000000, kyc:"VALIDE_ETAT"},
    {id:2, nom:"ENTREPRISE TEST", pays:"Sénégal", solde_baob:50, solde_fcfa:2000000, kyc:"VALIDE"}
];
let transactions = [];

// ===== CSS SOUVERAIN NOIR + OR + BAOBAB =====
const style = `<style>body{background:#000;color:#FFD700;font-family:'Segoe UI';margin:0;padding:20px} header{text-align:center;border-bottom:3px solid #FFD700;padding-bottom:10px}.logo{font-size:40px} h1{margin:5px}.devise{font-size:14px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin:20px 0}.card{background:#111;padding:20px;border-radius:15px;border:2px solid #FFD700;cursor:pointer}.card:hover{background:#FFD700;color:#000}.solde{font-size:35px;color:#00FF00}.box{background:#111;padding:20px;border-radius:15px;margin:20px 0;border:2px solid #FFD700;display:none} input,select,button{width:95%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #FFD700;background:#000;color:#FFD700} button{background:#FFD700;color:#000;font-weight:bold;cursor:pointer} table{width:100%;border-collapse:collapse} th,td{border:1px solid #FFD700;padding:8px} th{background:#FFD700;color:#000}</style>`;

app.get('/', (req,res)=>{
res.send(`<!DOCTYPE html><html><head><title>BAOBPAY - BCSA</title><meta name="viewport" content="width=device-width, initial-scale=1">${style}</head><body><header><div class="logo">🌳</div><h1>BAOBPAY</h1><div class="devise">BANQUE CENTRALE DES SERVICES AFRICAINS | DEVISE: L'OR</div></header>
<div class="grid">
<div class="card" onclick="show('portefeuille')"><h3>💼 Portefeuille Souverain</h3></div>
<div class="card" onclick="show('transfert')"><h3>🌍 Transfert Intra-Afrique</h3></div>
<div class="card" onclick="show('change')"><h3>💱 Bureau de Change Or</h3></div>
<div class="card" onclick="show('depot')"><h3>📈 Dépôt Or/FCFA</h3></div>
<div class="card" onclick="show('retrait')"><h3>📉 Retrait OM/MoMo</h3></div>
<div class="card" onclick="show('etat')"><h3>👑 Panel État</h3></div>
</div>

<div id="portefeuille" class="box"><h2>Portefeuille Baob</h2><div class="solde">${users[0].solde_baob} Baob</div><p>≈ ${(users[0].solde_baob * taux_or/1000).toLocaleString()} FCFA</p><div class="solde" style="font-size:20px">${users[0].solde_fcfa.toLocaleString()} FCFA</div></div>

<div id="transfert" class="box"><h2>Transfert vers 54 États</h2><select id="t_pays"><option>Côte d'Ivoire</option><option>Sénégal</option><option>Nigeria</option><option>Ghana</option></select><input id="t_mont" placeholder="Montant en Baob"><button onclick="transfert()">TRANSFÉRER VIA WARI CHAIN</button><div id="t_res"></div></div>

<div id="change" class="box"><h2>Bureau de Change Or</h2><p>1 Baob = ${(taux_or/1000).toFixed(2)} FCFA</p><input id="c_mont" placeholder="Montant en Baob"><button onclick="changer()">CONVERTIR EN FCFA</button><div id="c_res"></div></div>

<div id="depot" class="box"><h2>Dépôt Souverain</h2><input id="d_mont" placeholder="Montant FCFA à déposer"><button onclick="depot()">CRÉDITER EN BAOB</button><div id="d_res"></div></div>

<div id="retrait" class="box"><h2>Retrait Mobile Money</h2><input id="r_num" placeholder="Numéro OM/MoMo"><input id="r_mont" placeholder="Montant FCFA"><button onclick="retrait()">DEMANDER RETRAIT</button><div id="r_res"></div></div>

<div id="etat" class="box"><h2>Panel de Souveraineté - État</h2><button onclick="etat()">VOIR FLUX DU PAYS</button><pre id="e_data" style="color:#FFF;font-size:10px"></pre></div>

<script>
function show(id){document.querySelectorAll('.box').forEach(b=>b.style.display='none');document.getElementById(id).style.display='block';}
async function transfert(){const r=await fetch('/api/transfert',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pays:t_pays.value,montant:t_mont.value})});t_res.innerText=(await r.json()).msg;location.reload();}
async function changer(){const r=await fetch('/api/change',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({montant:c_mont.value})});c_res.innerText=(await r.json()).msg;location.reload();}
async function depot(){const r=await fetch('/api/depot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({montant:d_mont.value})});d_res.innerText=(await r.json()).msg;location.reload();}
async function retrait(){const r=await fetch('/api/retrait',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({numero:r_num.value,montant:r_mont.value})});r_res.innerText=(await r.json()).msg;location.reload();}
async function etat(){e_data.innerText=JSON.stringify(await(await fetch('/api/etat')).json(),null,2);}
</script></body></html>`);
});

// ===== API BCSA =====
app.get('/api/etat',(req,res)=>res.json({pays:"Côte d'Ivoire",transactions:transactions.length,volume:transactions.reduce((a,b)=>a+parseInt(b.montant||0),0)}));
app.post('/api/depot',(req,res)=>{const baob=parseInt(req.body.montant)/(taux_or/1000); users[0].solde_baob+=baob; users[0].solde_fcfa+=parseInt(req.body.montant); transactions.push({type:"DEPOT_OR",montant:req.body.montant,hash:'WARI'+Date.now()}); res.json({msg:`✅ ${baob.toFixed(3)} Baob crédités`});
app.post('/api/retrait',(req,res)=>{users[0].solde_fcfa-=parseInt(req.body.montant); transactions.push({type:"RETRAIT_MOMO",montant:req.body.montant,hash:'WARI'+Date.now()}); res.json({msg:`✅ Retrait de ${req.body.montant} FCFA initié`});});
app.post('/api/transfert',(req,res)=>{users[0].solde_baob-=parseInt(req.body.montant); transactions.push({type:"TRANSFERT_"+req.body.pays,montant:req.body.montant,hash:'WARI'+Date.now()}); res.json({msg:`✅ ${req.body.montant} Baob envoyés vers ${req.body.pays}`});
app.post('/api/change',(req,res)=>{const fcfa=parseInt(req.body.montant)*(taux_or/1000); users[0].solde_baob-=parseInt(req.body.montant); users[0].solde_fcfa+=fcfa; res.json({msg:`✅ ${req.body.montant} Baob convertis en ${fcfa.toLocaleString()} FCFA`});

app.listen(PORT,()=>console.log('BAOBPAY BCSA V1.0 EN LIGNE'));
