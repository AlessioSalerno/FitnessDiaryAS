/* =========================
   CARICA DATI
========================= */
const user = JSON.parse(localStorage.getItem("fitnessUser"));
const days = JSON.parse(localStorage.getItem("fitnessDays")) || [];

if (!user || !user.weightHistory) {
  alert("Nessun dato peso disponibile");
}

/* =========================
   DATI GRAFICO
========================= */
const labels = user.weightHistory.map(w => w.date);
const weights = user.weightHistory.map(w => w.weight);

/* =========================
   GRAFICO PESO
========================= */
const ctx = document.getElementById("weightChart");

new Chart(ctx, {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Peso corporeo (kg)",
      data: weights,
      borderWidth: 3,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  }
});
