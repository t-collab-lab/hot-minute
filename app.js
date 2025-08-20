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
const DEFAULT_ESTRADIOL_DOSAGE = 'Gel 0.06% (37.5gm pump)';
const DEFAULT_PROGESTERONE_DOSAGE = 'Micro 100mg capsule (2)';
// Get checkboxes and input fields for meds
const estradiolCheckbox = document.getElementById('estradiol');
const estradiolDosage = document.getElementById('estradiol_dosage');
const progesteroneCheckbox = document.getElementById('progesterone');
const progesteroneDosage = document.getElementById('progesterone_dosage');

// Estradiol check logic
estradiolCheckbox.addEventListener('change', function() {
  if (this.checked) {
    estradiolDosage.value = DEFAULT_ESTRADIOL_DOSAGE;
    estradiolDosage.disabled = false;
  } else {
    estradiolDosage.value = '';
    estradiolDosage.disabled = true;
  }
});

// Progesterone check logic
progesteroneCheckbox.addEventListener('change', function() {
  if (this.checked) {
    progesteroneDosage.value = DEFAULT_PROGESTERONE_DOSAGE;
    progesteroneDosage.disabled = false;
  } else {
    progesteroneDosage.value = '';
    progesteroneDosage.disabled = true;
  }
});

let entries = [];
function sendToGoogleSheet(data) {
  fetch('https://script.google.com/macros/s/AKfycbxSyO9xgIxgE_Ni-BwK6_D89BUn8ki1tXV4qPnKoiiHAV_2iduFAC9ALXfjgmfgIvTi/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

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
  sendToGoogleSheet(data);
  renderEntries();
  renderChart();
  form.reset();
  activityOther.style.display = 'none';
  estradiolDosage.disabled = true;
progesteroneDosage.disabled = true;

});

activitySelect.addEventListener('change', function() {
  activityOther.style.display = activitySelect.value === "Other" ? "block" : "none";
});

// --- Data
