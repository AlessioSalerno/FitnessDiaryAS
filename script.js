/* ========= NAV ========= */
document.querySelectorAll("[data-page]").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(btn.dataset.page).classList.add("active");
    if (btn.dataset.page === "progressi") renderChart();
  };
});

/* ========= STORAGE ========= */
let user = JSON.parse(localStorage.getItem("user")) || {};
let days = JSON.parse(localStorage.getItem("days")) || [];
let tempExercises = [];

/* ========= UTENTE ========= */
document.getElementById("saveUser").onclick = () => {
  const today = new Date().toISOString().split("T")[0];

  user.name = document.getElementById("name").value;
  user.height = document.getElementById("height").value;
  user.weightHistory = user.weightHistory || [];

  user.weightHistory.push({
    date: today,
    weight: document.getElementById("weight").value
  });

  localStorage.setItem("user", JSON.stringify(user));
};

/* ========= SESSIONE ========= */
document.getElementById("addEx").onclick = () => {
  tempExercises.push({
    name: exName.value,
    reps: exReps.value,
    weight: exWeight.value || 0
  });

  renderTemp();
  exName.value = exReps.value = exWeight.value = "";
};

function renderTemp() {
  tempExercises.innerHTML = "";
  document.getElementById("tempExercises").innerHTML =
    tempExercises.map(e => `<li>${e.name} ${e.reps} reps</li>`).join("");
}

document.getElementById("saveSession").onclick = () => {
  const today = new Date().toISOString().split("T")[0];
  let day = days.find(d => d.date === today);

  if (!day) {
    day = { date: today, sessions: [] };
    days.push(day);
  }

  day.sessions.push({
    muscle: muscle.value,
    exercises: tempExercises
  });

  localStorage.setItem("days", JSON.stringify(days));
  tempExercises = [];
  document.getElementById("tempExercises").innerHTML = "";
  renderDiary();
};

/* ========= DIARIO ========= */
function renderDiary() {
  diary.innerHTML = "";

  days.forEach((d, i) => {
    const div = document.createElement("div");
    div.className = "day-block";
    div.innerHTML = `<strong>Giorno ${i + 1}</strong><br>` +
      d.sessions.length + " sessioni";
    diary.appendChild(div);
  });
}

renderDiary();

/* ========= PROGRESSI REALI ========= */
function renderChart() {
  if (!days.length) return;

  const labels = [];
  const volumes = [];

  days.forEach(d => {
    let volume = 0;
    d.sessions.forEach(s => {
      s.exercises.forEach(e => {
        volume += Number(e.reps);
      });
    });
    labels.push(d.date);
    volumes.push(volume);
  });

  const ctx = document.getElementById("volumeChart");
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Volume allenamento",
        data: volumes,
        tension: 0.4
      }]
    }
  });
}
