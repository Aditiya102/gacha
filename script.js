const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let currentUser = null;

const hadiah = [
  "Diamond 5 💎",
  "Diamond 10 💎",
  "Pulsa 5K 📱",
  "Diamond 50 💎🔥",
  "ZONK 😢"
];

const colors = ["#FFD700", "#FF5733", "#33FF57", "#3399FF", "#999"];

function drawWheel() {
  const arc = (2 * Math.PI) / hadiah.length;

  for (let i = 0; i < hadiah.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, arc * i, arc * (i + 1));
    ctx.fill();

    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(arc * i + arc / 2);
    ctx.fillStyle = "#000";
    ctx.fillText(hadiah[i], 50, 0);
    ctx.restore();
  }
}

drawWheel();

// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.error) return alert(data.error);

  currentUser = email;
  updateSaldo(data.saldo);
  loadHistory();
}

// REGISTER
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  alert("Register berhasil");
}

// SPIN
async function spin() {
  if (!currentUser) return alert("Login dulu!");

  const res = await fetch("http://localhost:3000/spin", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email: currentUser })
  });

  const data = await res.json();

  if (data.error) return alert(data.error);

  const index = hadiah.findIndex(h => h === data.hadiah);

  const arc = 360 / hadiah.length;
  const angle = 360 * 5 + (360 - index * arc);

  canvas.style.transition = "transform 3s ease-out";
  canvas.style.transform = `rotate(${angle}deg)`;

  document.getElementById("result").innerText = data.hadiah;
  updateSaldo(data.saldo);
  loadHistory();
}

// HISTORY
async function loadHistory() {
  const res = await fetch(`http://localhost:3000/history/${currentUser}`);
  const data = await res.json();

  const list = document.getElementById("history");
  list.innerHTML = "";

  data.forEach(h => {
    const li = document.createElement("li");
    li.innerText = h;
    list.appendChild(li);
  });
}

// SALDO
function updateSaldo(saldo) {
  document.getElementById("saldo").innerText = "Saldo: " + saldo;
}

// TOPUP
async function topup() {
  const res = await fetch("http://localhost:3000/topup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email: currentUser, amount: 10000 })
  });

  const data = await res.json();
  updateSaldo(data.saldo);
}