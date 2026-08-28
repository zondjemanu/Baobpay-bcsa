 const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8080;

// FAUSSE BASE DE DONNEES
const transactions = [];
const users = [{numero: "0700000", solde: 50000, nom: "CEO BAOBPAY"}];

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>PAYGLOBE by BAOBPAY</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body{background:#000;color:#FFD700;font-family:Arial;text-align:center;padding:20px}
      h1{font-size:35px;margin:5px 0}
      .menu{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;max-width:500px;margin:20px auto}
      .btn{background:#111;padding:15px;border-radius:15px;border:2px solid #FFD700;cursor:pointer;text-decoration:none;color:#FFD700;font-weight:bold;font-size:14px}
      .btn:hover{background:#FFD700;color:#000}
      .box{background:#111;padding:20px;border-radius:15px;max-width:400px;margin:20px auto;border:2px solid #FFD700;display:none}
      input,button{width:90%;padding:12px;margin:10px 0;border-radius:8px;border:none;font-size:16px}
      button{background:#FFD700;color:#000;font-weight:bold;cursor:pointer}
      .solde{font-size:40px;color:#00FF00}
      #qrcode{margin:20px auto;background:#FFF;padding:10px;border-radius:10px}
      #hist,#admin{color:#FFF;text-align:left;font-size:12px;white-space:pre-wrap}
    </style>
  </head>
  <body>
    <h1>PAYGLOBE</h1>
    <p>by BAOBPAY - Fintech Africa</p>
    
    <div class="menu">
      <a class="btn" onclick="show('portefeuille')">💼 Portefeuille</a>
      <a class="btn" onclick="show('transfert')">💸 Transfert</a>
      <a class="btn" onclick="show('qrcode')">📲 QR Code</a>
      <a class="btn" onclick="show('paiement')">🛒 Paiement</a>
      <a class="btn" onclick="show('facture')">📄 Factures</a>
      <a class="btn" onclick="show('admin')">👑 Admin</a>
    </div>

    <div id="portefeuille" class="box">
      <h3>Mon Portefeuille</h3>
      <p>Solde Disponible</p>
      <div class="solde">50,000 FCFA</div>
      <button onclick="alert('Rechargement via Orange bientôt')">Recharger</button>
    </div>

    <div id="transfert" class="box">
      <h3>Envoyer de l'argent</h3>
      <input type="text" id="numero" placeholder="Numéro Orange: 07XXXXXXX">
      <input type="number" id="montant" placeholder="Montant FCFA">
      <button onclick="envoyer()">ENVOYER</button>
      <div id="result"></div>
    </div>

    <div id="qrcode" class="box">
      <h3>Recevoir de l'argent</h3>
      <p>Scannez ce QR pour me payer</p>
      <div id="qrcode"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYGLOBE:0700000" alt="QR"></div>
      <p>Numéro: 0700000</p>
    </div>

    <div id="paiement" class="box"><h3>Paiement Marchand</h3><p>En attente des clés Orange</p></div>
    <div id="facture" class="box"><h3>Paiement Factures</h3><p>CIE, SODECI, Canal+ bientôt</p></div>
    
    <div id="historique" class="box">
      <h3>Historique WARI CHAIN</h3>
      <button onclick="voirHistorique()">Voir Transactions</button>
      <div id="hist"></div>
    </div>

    <div id="admin" class="box">
      <h3>Panel Admin CEO</h3>
      <button onclick="voirAdmin()">Voir Toutes les Data</button>
      <div id="admin"></div>
    </div>

    <script>
      function show(id){
        document.querySelectorAll('.box').forEach(b=>b.style.display='none');
        document.getElementById(id).style.display='block';
      }
      async function envoyer(){
        const numero=document.getElementById('numero').value;
        const montant=document.getElementById('montant').value;
        document.getElementById('result').innerText='Envoi en cours...';
        const res=await fetch('/transfert',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({numero,montant})});
        const data=await res.json();
        document.getElementById('result').innerText=JSON.stringify(data);
      }
      async function voirHistorique(){
        const res=await fetch('/historique');
        const data=await res.json();
        document.getElementById('hist').innerText=JSON.stringify(data, null, 2);
      }
      async function voirAdmin(){
        const res=await fetch('/admin');
        const data=await res.json();
        document.getElementById('admin').innerText=JSON.stringify(data, null, 2);
      }
    </script>
  </body>
  </html>`);
});

app.get('/health', (req, res) => { res.json({ status: 'ok', service: 'payglobe-v3' });
app.get('/historique', (req, res) => { res.json({ total: transactions.length, data: transactions }); });
app.get('/admin', (req, res) => { res.json({ users, transactions });

app.post('/transfert', (req, res) => { 
  const { numero, montant } = req.body; 
  const nouvelleTransaction = {
    id: Date.now(),
    type: "TRANSFERT",
    numero,
    montant,
    date: new Date(),
    statut: 'en_attente_orange',
    hash: 'WARI' + Date.now()
  };
  transactions.push(nouvelleTransaction);
  res.json({ status: 'recu', transaction: nouvelleTransaction, message: 'Enregistré dans WARI CHAIN' });
});

app.listen(PORT, () => { console.log(`PAYGLOBE V3 tourne sur le port ${PORT}`); });
