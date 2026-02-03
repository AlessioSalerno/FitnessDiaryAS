/* =====================
   NAVIGAZIONE
===================== */
document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(btn.dataset.page).classList.add("active");

    if (btn.dataset.page === "progressi") {
      renderChart();
    }
  });
});

/* =====================
   STORAGE
===================== */
let user = JSON.parse(localStorage.getItem("fitnessUser")) || {};
let days = JSON.parse(localStorage.getItem("fitnessDays")) || [];
let tempExercises = [];

/* =====================
   PROFILO UTENTE
===================== */
document.getElementById("saveUser").addEventListener("click", () => {
  const today = new Date().toISOString().split("T")[0];

  user.name = document.getElementById("name").value;
  user.height = document.getElementById("height").value;
  user.weightHistory = user.weightHistory || [];

  user.weightHistory.push({
    date: today,
    weight: document.getElementById("weight").value
  });

  localStorage.setItem("fitnessUser", JSON.stringify(user));
});

/* =====================
   SESSIONE
===================== */
document.getElementById("addEx").addEventListener("click", () => {
  const name = exName.value;
  const reps = exReps.value;
  const weight = exWeight.value || "—";

  if (!name || !reps) return;

  tempExercises.push({ name, reps, weight });
  renderTempExercises();

  exName.value = "";
  exReps.value = "";
  exWeight.value = "";
});

function renderTempExercises() {
  tempExercises.innerHTML = "";
  document.getElementById("tempExercises").innerHTML =
    tempExercises.map(e =>
      `<li>${e.name} – ${e.reps} reps – ${e.weight}</li>`
    ).join("");
}

document.getElementById("saveSession").addEventListener("click", () => {
  if (!muscle.value || tempExercises.length === 0) return;

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

  localStorage.setItem("fitnessDays", JSON.stringify(days));

  tempExercises = [];
  document.getElementById("tempExercises").innerHTML = "";
  muscle.value = "";

  renderDiary();
});

/* =====================
   DIARIO (FIX COMPLETO)
===================== */
function renderDiary() {
  diary.innerHTML = "";

  const orderedDays = [...days].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  orderedDays.forEach((day, index) => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day-block";

    dayDiv.innerHTML = `<h3>Giorno ${index + 1} – ${day.date}</h3>`;

    day.sessions.forEach((session, sIndex) => {
      const sessionDiv = document.createElement("div");
      sessionDiv.className = "session-block";

      sessionDiv.innerHTML = `<strong>Sessione ${sIndex + 1} – ${session.muscle}</strong>`;

      const ul = document.createElement("ul");
      session.exercises.forEach(ex => {
        const li = document.createElement("li");
        li.textContent = `${ex.name} | ${ex.reps} reps | ${ex.weight}`;
        ul.appendChild(li);
      });

      sessionDiv.appendChild(ul);
      dayDiv.appendChild(sessionDiv);
    });

    diary.appendChild(dayDiv);
  });
}

renderDiary();

/* =====================
   PROGRESSI REALI
===================== */
let chart;

function renderChart() {
  if (!days.length) return;

  const labels = [];
  const volumes = [];

  days.forEach(day => {
    let volume = 0;
    day.sessions.forEach(s =>
      s.exercises.forEach(e => volume += Number(e.reps))
    );
    labels.push(day.date);
    volumes.push(volume);
  });

  const ctx = document.getElementById("volumeChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Volume Allenamento",
        data: volumes,
        tension: 0.4,
        borderWidth: 3
      }]
    }
  });
}
