console.log("SCRIPT CARREGOU");

const buttons = document.querySelectorAll('.botoes button');
const texto = document.getElementById('texto');
const historyContainer = document.getElementById('historyContainer');
const summaryContainer = document.getElementById('summaryContainer');
const chartContainer = document.getElementById('chart');

const messages = {
  feliz: "Que bom que você está feliz! 😄",
  triste: "Tudo bem se sentir triste 😢",
  bravo: "Respire fundo 😡",
  neutro: "Dia normal 😐",
  confiante: "Boa energia 😎",
  ansioso: "Respire 😰",
  desmotivado: "Vai melhorar 😔",
  cansado: "Descanse 😴",
  relaxado: "Que bom 🤗",
  apaixonado: "😍",
  desesperado: "Calma 😭",
  aliviado: "Ufa 😅",
  pensativo: "🤔",
  nervoso: "Calma 😬",
  grato: "😇",
  brincalhao: "😜",
  indeciso: "😶",
  assustado: "😱"
};

const allHumors = [
  "😃 Feliz", "😢 Triste", "😡 Bravo", "😐 Neutro", "😎 Confiante",
  "😰 Ansioso", "😔 Desmotivado", "😴 Cansado", "🤗 Relaxado", "😍 Apaixonado",
  "😭 Desesperado", "😅 Aliviado", "🤔 Pensativo", "😬 Nervoso", "😇 Grato",
  "😜 Brincalhão", "😶 Indeciso", "😱 Assustado"
];

const humorColors = {
  "😃 Feliz": "#FF6384", "😢 Triste": "#36A2EB", "😡 Bravo": "#FFCE56",
  "😐 Neutro": "#9CCC65", "😎 Confiante": "#FF9F40", "😰 Ansioso": "#4BC0C0",
  "😔 Desmotivado": "#9966FF", "😴 Cansado": "#FF6384", "🤗 Relaxado": "#36A2EB",
  "😍 Apaixonado": "#FFCE56", "😭 Desesperado": "#9CCC65", "😅 Aliviado": "#FF9F40",
  "🤔 Pensativo": "#4BC0C0", "😬 Nervoso": "#9966FF", "😇 Grato": "#FF6384",
  "😜 Brincalhão": "#36A2EB", "😶 Indeciso": "#FFCE56", "😱 Assustado": "#9CCC65"
};

const backgroundColors = {
  "😃 Feliz": "#FFF0F0", "😢 Triste": "#E0F0FF", "😡 Bravo": "#FFE0E0",
  "😐 Neutro": "#F0F0F0", "😎 Confiante": "#FFF8E0", "😰 Ansioso": "#E0EFFF",
  "😔 Desmotivado": "#F0E0F8", "😴 Cansado": "#E0E0FF", "🤗 Relaxado": "#E0FFE0",
  "😍 Apaixonado": "#FFE0F0", "😭 Desesperado": "#D0E0FF", "😅 Aliviado": "#FFF8D0",
  "🤔 Pensativo": "#F0F8FF", "😬 Nervoso": "#FFE8E0", "😇 Grato": "#F0FFF0",
  "😜 Brincalhão": "#FFF0E0", "😶 Indeciso": "#F8F8F8", "😱 Assustado": "#FFD0D0"
};

let history = JSON.parse(localStorage.getItem('humorHistory')) || [];

function renderHistory() {
  historyContainer.innerHTML = '';
  const grouped = {};

  history.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  for (let date in grouped) {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${date}</h3>`;

    grouped[date].forEach(e => {
      const p = document.createElement('p');
      p.textContent = `${e.time} - ${e.humor}`;
      div.appendChild(p);
    });

    historyContainer.appendChild(div);
  }
}

function renderChart() {
  chartContainer.innerHTML = '';

  const last7 = new Date();
  last7.setDate(last7.getDate() - 6);

  const filtered = history.filter(h => new Date(h.date) >= last7);

  const counts = {};
  allHumors.forEach(h => counts[h] = 0);

  filtered.forEach(e => {
    if (counts[e.humor] !== undefined) counts[e.humor]++;
  });

  const maxValue = Math.max(...Object.values(counts), 1);

  Object.keys(counts).forEach(label => {
    const value = counts[label];

    const container = document.createElement('div');
    container.className = "bar-container";

    const bar = document.createElement('div');
    bar.className = "bar";
    bar.style.height = (value / maxValue * 100) + "%";
    bar.style.backgroundColor = humorColors[label];

    const text = document.createElement('span');
    text.textContent = label.split(" ")[0];

    container.appendChild(bar);
    container.appendChild(text);
    chartContainer.appendChild(container);
  });
}

function renderSummary() {
  const counts = {};
  history.forEach(e => counts[e.humor] = (counts[e.humor] || 0) + 1);

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (sorted.length > 0) {
    summaryContainer.textContent = `Predominante: ${sorted[0][0]}`;
    document.body.style.backgroundColor = backgroundColors[sorted[0][0]];
  } else {
    summaryContainer.textContent = "Sem dados";
  }
}

function addHumor(humor, displayText) {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  history.push({ date, time, humor: displayText });
  localStorage.setItem('humorHistory', JSON.stringify(history));

  texto.textContent = messages[humor];
  renderHistory();
  renderChart();
  renderSummary();
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    addHumor(btn.dataset.humor, btn.textContent);
  });
});

renderHistory();
renderChart();
renderSummary();