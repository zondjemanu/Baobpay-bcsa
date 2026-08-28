const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><title>BAOBPAY MVP</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#000;color:#FFD700;font-family:Arial;text-align:center;padding:30px}h1{font-size:40px}.box{background:#111;padding:30px;border-radius:15px;max-width:400px;margin:auto;border:2px solid #FFD700}input,button{width:90%;padding:12px;margin:10px 0;border-radius:8px;border:none;font-size:16px}button{background:#FFD700;color:#000;font-weight:bold;cursor:pointer}#result{margin-top:20px;color:#FFF}</style></head><body><h1>🌳 BAOBPAY MVP</h1><p>Transfert Orange Money CI</p><div class="box"><h3>Envoyer de l'argent</h3><form id="transferForm"><input type="text" id="numero" placeholder="Numéro Orange: 07XXXXXXX" required><input type="number" id="montant" placeholder="Montant FCFA" required><button type="submit">ENVOYER</button></form><div id="result"></div></div><script>document.getElementById('transferForm').onsubmit=async(e)=>{e.preventDefault();const numero=document.getElementById('numero').value;const montant=document.getElementById('montant').value;document.getElementById('result').innerText='Envoi en cours...';const res=await fetch('/transfert',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({numero,montant})});const data=await res.json();document.getElementById('result').innerText=JSON.stringify(data)}</script></body></html>`);
});

app.get('/health', (req, res) => { res.json({ status: 'ok', service: 'baobpay-mvp' });
app.post('/transfert', (req, res) => { const { numero, montant } = req.body; res.json({ status: 'recu', numero, montant, message: 'En attente des clés Orange Money' });
app.listen(PORT, () => console.log(`Baobpay tourne sur le port ${PORT}`));
