/* ===== NAVIGAZIONE ===== */
const pages = document.querySelectorAll(".page");

document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => {
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(btn.dataset.page).classList.add("active");
  });
});

/* ===== STORAGE ===== */
let days = JSON.parse(localStorage.getItem("fitnessDays")) || [];
let tempExercises = [];

/* ===== DOM ===== */
const diaryDiv = document.getElementById("diary");

const muscleInput = document.getElementById("muscle");
const exName = document.getElementById("exName");
const exReps = document.getElementById("exReps");
const exWeight = document.getElementById("exWeight");
const tempList = document.getElementById("tempExercises");

/* ===== AGGIUNGI ESERCIZIO ===== */
document.getElementById("addEx").addEventListener("click", () => {
  if (!exName.value || !exReps.value) return;

  tempExercises.push({
    name: exName.value,
    reps: exReps.value,
    weight: exWeight.value || "—"
  });

  renderTemp();
  exName.value = "";
  exReps.value = "";
  exWeight.value = "";
});

function renderTemp() {
  tempList.innerHTML = "";
  tempExercises.forEach(ex => {
    const li = document.createElement("li");
    li.textContent = `${ex.name} - ${ex.reps} reps - ${ex.weight}`;
    tempList.appendChild(li);
  });
}

/* ===== SALVA SESSIONE ===== */
document.getElementById("saveSession").addEventListener("click", () => {
  if (!muscleInput.value || tempExercises.length === 0) return;

  const today = new Date().toISOString().split("T")[0];

  let day = days.find(d => d.date === today);
  if (!day) {
    day = { date: today, sessions: [] };
    days.push(day);
  }

  day.sessions.push({
    muscle: muscleInput.value,
    exercises: [...tempExercises]
  });

  localStorage.setItem("fitnessDays", JSON.stringify(days));

  tempExercises = [];
  tempList.innerHTML = "";
  muscleInput.value = "";

  renderDiary();
});

/* ===== DIARIO ===== */
function renderDiary() {
  diaryDiv.innerHTML = "";

  days.forEach((day, i) => {
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `<h3>Giorno ${i + 1} – ${day.date}</h3>`;

    day.sessions.forEach(s => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${s.muscle}</strong>`;
      div.appendChild(p);

      const ul = document.createElement("ul");
      s.exercises.forEach(ex => {
        const li = document.createElement("li");
        li.textContent = `${ex.name} - ${ex.reps} - ${ex.weight}`;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    });

    diaryDiv.appendChild(div);
  });
}

renderDiary();
