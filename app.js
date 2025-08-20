// --- Hot Minute App Functionality ---
// Store data in LocalStorage for persistent, private use

const form = document.getElementById('hotflashForm');
const entriesDiv = document.getElementById('entries');
const downloadBtn = document.getElementById('downloadBtn');
const chartTypeSelect = document.getElementById('chartType');
const analyzeBySelect = document.getElementById('analyzeBy');
const chartCanvas = document.getElementById('chart');
const activitySelect = document.getElementById('activity');
const activityOther = document.getElementById('activity_other');

let entries = [];

// Helper: Get flame size class from intensity (1-10)
function getFlameSizeClass(intensity) {
  const size = Math.max(1, Math.min(10, Math.round(Number(intensity)||1)));
  return `flame-size-${size}`;
}

// Helper: Get SVG code for flame icon
function getFlameSVG(intensity = 5) {
  return `<img src="flame.svg" alt="flame" class="flame-icon ${getFlameSizeClass(intensity)}" />`;
}

// --- Form controls ---
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const data = {
    date: form.date.value,
    time: form.time.value,
    ampm: form.ampm.value,
    duration: form.duration.value ? Number(form.duration.value) : null,
    intensity: form.intensity.value ? Number(form.intensity.value) : null,
    estradiol: form.estradiol.checked,
    estradiol_dosage: form.estradiol_dosage.value,
    progesterone: form.progesterone.checked,
    progesterone_dosage: form.progesterone_dosage.value,
    activity: form.activity.value !== 'Other' ? form.activity.value : form.activity_other.value,
    stress: form.stress.value ? Number(form.stress.value) : null,
    notes: form.notes.value,
    created: new Date().toISOString()
  };

  entries.push(data);
  saveEntries();
  renderEntries();
  renderChart();
  form.reset();
  activityOther.style.display = 'none';
});

activitySelect.addEventListener('change', function() {
  activityOther.style.display = activitySelect.value === "Other" ? "block" : "none";
});

// --- Data
