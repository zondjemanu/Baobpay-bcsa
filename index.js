 const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

let transactions = [];
let users = [{numero: "0700000", solde: 50000, nom: "CEO BAOBPAY"}];

app.get('/', (req, res) => {
res.send(`<!DOCTYPE html><html><head><title>PAYGLOBE</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#000;color:#FFD700;font-family:Arial;text-align:center;padding:20px}h1{font-size:35px}.menu{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;max-width:500px;margin:20px auto}.btn{background:#111;padding:15px;border-radius:15px;border:2px solid #FFD700;color:#FFD700;font-weight:bold;cursor:pointer}.box{background:#111;padding:20px;border-radius:15px;max-width:400px;margin:20px auto;border:2px solid #FFD700;display:none}input,button{width:90%;padding:12px;margin:10px 0;border-radius:8px;border:none}.solde{font-size:40px;color:#00FF00}</style></head><body><h1>PAYGLOBE</h1><p>by BAOBPAY</p><div class="menu"><div class="btn" onclick="show('portefeuille')">💼 Portefeuille</div><div class="btn" onclick="show('transfert')">💸 Transfert</div><div class="btn" onclick="show('qrcode')">📲 QR Code</div><div class="btn" onclick="show('admin')">👑 Admin</div></div><div id="portefeuille" class="box"><h3>Mon Portefeuille</h3><div class="solde">50,000 FCFA</div></div><div id="transfert" class="box"><h3>Envoyer</h3><input id="numero" placeholder="07XXXXXXX"><input id="montant" placeholder="Montant"><button onclick="envoyer()">ENVOYER</button><div id="result"></div></div><div id="qrcode" class="box"><h3>Recevoir</h3><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYGLOBE:0700000"></div><div id="admin" class="box"><h3>Admin</h3><button onclick="voirAdmin()">Voir Data</button><pre id="admin"></pre></div><script>function show(id){document.querySelectorAll('.box').forEach(b=>b.style.display='none');document.getElementById(id).style.display='block';}async function envoyer(){const r=await fetch('/transfert',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({numero:numero.value,montant:montant.value})});result.innerText=JSON.stringify(await r.json());}async function voirAdmin(){admin.innerText=JSON.stringify(await (await fetch('/admin')).json(),null,2);}</script></body></html>`);
});

app.get('/health', (req, res) => res.json({status:'ok'}));
app.get('/admin', (req, res) => res.json({users, transactions}));
app.post('/transfert', (req, res) => {
const t = {id:Date.now(), ...req.body, statut:'en_attente_orange', hash:'WARI'+Date.now()};
transactions.push(t);
res.json({status:'recu', transaction:t});
});

app.listen(PORT, () => console.log('PAYGLOBE V3.2 OK'));
