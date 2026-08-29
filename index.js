 const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

let transactions = [];
let users = [{numero: "0700000", solde: 50000, nom: "CEO BAOBPAY"}];

// PAGE PRINCIPALE
app.get('/', (req, res) => {
res.send(`<!DOCTYPE html><html><head><title>PAYGLOBE</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#000;color:#FFD700;font-family:Arial;text-align:center;padding:20px}h1{font-size:35px}a{display:block;background:#111;padding:20px;margin:10px auto;border-radius:15px;border:2px solid #FFD700;color:#FFD700;font-weight:bold;text-decoration:none;max-width:300px}.solde{font-size:40px;color:#00FF00}pre{background:#111;color:#FFF;text-align:left;padding:10px;border-radius:10px;overflow-x:auto}</style></head><body><h1>PAYGLOBE</h1><p>by BAOBPAY</p><a href="/portefeuille">💼 Portefeuille</a><a href="/transfert">💸 Transfert</a><a href="/qrcode">📲 QR Code</a><a href="/admin">👑 Admin</a></body></html>`);
});

// PORTEFEUILLE
app.get('/portefeuille', (req, res) => {
res.send(`<!DOCTYPE html><html><head><title>Portefeuille</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#000;color:#FFD700;text-align:center;padding:20px}a{color:#FFD700}.solde{font-size:40px;color:#00FF00}</style></head><body><h1>💼 Portefeuille</h1><p>Solde Disponible</p><div class="solde">50,000 FCFA</div><br><a href="/">← Retour</a></body></html>`);
});

// QR CODE
app.get('/qrcode', (req, res) => {
res.send(`<!DOCTYPE html><html><head><title>QR Code</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#000;color:#FFD700;text-align:center;padding:20px}a{color:#FFD700}img{background:#FFF;padding:10px;border-radius:10px}</style></head><body><h1>📲 QR Code</h1><p>Scanne pour me payer</p><img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PAYGLOBE:0700000"><p>0700000</p><br><a href="/">← Retour</a></body></html>`);
});

// TRANSFERT
app.get('/transfert', (req, res) => {
res.send(`<!DOCTYPE html><html><head><title>Transfert</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#000;color:#FFD700;text-align:center;padding:20px}input,button{width:80%;padding:12px;margin:10px 0;border-radius:8px;border:none}button{background:#FFD700;color:#000;font-weight:bold}a{color:#FFD700}</style></head><body><h1>💸 Transfert</h1><form method="POST" action="/transfert"><input name="numero" placeholder="07XXXXXXX" required><input name="montant" placeholder="Montant FCFA" required><button>ENVOYER</button></form><br><a href="/">← Retour</a></body></html>`);
});

// ADMIN
 app.get('/admin', async (req, res) => {
const data = {users, transactions};
res.send(`<!DOCTYPE html><html><head><title>Admin CEO</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#000;color:#FFD700;font-family:Arial;padding:20px}h1{text-align:center}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #FFD700;padding:10px;text-align:left}th{background:#FFD700;color:#000}a{color:#FFD700;display:block;text-align:center;margin-top:20px}</style></head><body><h1>👑 PANEL ADMIN CEO</h1><h2>💼 Utilisateurs</h2><table><tr><th>Nom</th><th>Numéro</th><th>Solde</th></tr>${users.map(u=>`<tr><td>${u.nom}</td><td>${u.numero}</td><td>${u.solde} FCFA</td></tr>`).join('')}</table><h2>📊 WARI CHAIN - Transactions</h2><table><tr><th>ID</th><th>Numéro</th><th>Montant</th><th>Hash</th><th>Statut</th></tr>${transactions.length > 0 ? transactions.map(t=>`<tr><td>${t.id}</td><td>${t.numero}</td><td>${t.montant}</td><td>${t.hash}</td><td>${t.statut}</td></tr>`).join('') : '<tr><td colspan="5">Aucune transaction</td></tr>'}</table><a href="/">← Retour Accueil</a></body></html>`);
});

// API TRANSFERT
app.post('/transfert', (req, res) => {
const { numero, montant } = req.body;
const t = {id:Date.now(), numero, montant, statut:'en_attente_orange', hash:'WARI'+Date.now(), date:new Date()};
transactions.push(t);
res.send(`<!DOCTYPE html><html><head><title>OK</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#000;color:#00FF00;text-align:center;padding:50px}a{color:#FFD700}</style></head><body><h1>✅ TRANSFERT ENREGISTRÉ</h1><p>Hash: ${t.hash}</p><p>Statut: en_attente_orange</p><br><a href="/transfert">Nouveau Transfert</a><br><a href="/admin">Voir Admin</a></body></html>`);
});

app.get('/health', (req, res) => res.json({status:'ok'}));
app.listen(PORT, () => console.log('PAYGLOBE V3.4 OK'));
