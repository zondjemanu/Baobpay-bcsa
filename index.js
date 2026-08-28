const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let db = {
  users: {
    "22507010101": { nom: "CEO CI", solde: 10000, pin: "1234" },
    "22177020202": { nom: "Client SN", solde: 5000, pin: "1234" }
  }
};

app.post('/login', (req, res) => {
  const { tel, pin } = req.body;
  if(db.users[tel] && db.users[tel].pin == pin) {
    res.json({ success: true, nom: db.users[tel].nom, solde: db.users[tel].solde });
  } else {
    res.status(401).json({ error: "Tel ou PIN incorrect" });
  }
});

app.post('/transfert', (req, res) => {
  const { fromTel, toTel, montant, pin } = req.body;
  let m = parseFloat(montant);
  const frais = m * 0.01;
  if(!db.users[fromTel] || db.users[fromTel].pin!= pin) return res.status(401).json({ error: "PIN incorrect" });
  if(db.users[fromTel].solde < m) return res.status(400).json({ error: "Solde insuffisant" });
  if(!db.users[toTel]) return res.status(404).json({ error: "Destinataire introuvable" });
  db.users[fromTel].solde -= m;
  db.users[toTel].solde += (m - frais);
  res.json({ success: true, envoye: m, frais: frais, recu: m-frais, solde: db.users[fromTel].solde });
});

app.get('/', (req, res) => {
  res.send(`<h1 style="color:gold;background:#000;text-align:center;padding:30px">🌳 BAOBPAY MVP EN LIGNE</h1>`);
});


const PORT = process.env.PORT || 8080;

app.get('/health', (req, res) => {
  res.json({status: 'ok', service: 'baobpay-mvp'});
});

app.listen(PORT, () => {
  console.log(`BAOBPAY running on port ${PORT}`);
});
