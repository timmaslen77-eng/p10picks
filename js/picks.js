// frontend/js/picks.js
import { supabase, getUser } from './main.js';

const eventSelect = document.getElementById('eventSelect');
const driversList = document.getElementById('driversList');
const saveBtn = document.getElementById('savePicksBtn');
const msg = document.getElementById('msg');

let drivers = [];
let currentEvent = null;

async function loadEventAndDrivers() {
  // get upcoming event
  let { data: events } = await supabase.from('race_events').select('*').eq('finished', false).order('round', { ascending: true }).limit(1);
  currentEvent = events?.[0];
  eventSelect.innerText = currentEvent ? `${currentEvent.name} (round ${currentEvent.round})` : 'No upcoming event';

  const { data } = await supabase.from('drivers').select('*').order('full_name');
  drivers = data || [];
  renderDrivers();
}

function renderDrivers() {
  driversList.innerHTML = '';
  drivers.forEach(d => {
    const row = document.createElement('div');
    row.innerHTML = `<label><input type="checkbox" data-id="${d.id}" /> ${d.full_name} (${d.driver_code})</label>`;
    driversList.appendChild(row);
  });
}

saveBtn.onclick = async () => {
  const user = await getUser();
  if (!user) return alert("Log in first");

  // For simplicity, collect picks as an array of selected driver ids in order of appearance
  const selected = Array.from(driversList.querySelectorAll('input[type=checkbox]:checked')).map(cb => Number(cb.dataset.id));
  if (!selected.length) return alert("Select your picks");

  const body = { user_id: user.id, event_id: currentEvent.id, picks: selected };
  const res = await fetch('/.netlify/functions/submitPicks', { // if Netlify functions; change path to Supabase Edge URL if using Supabase functions
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const j = await res.json();
  if (j.error) msg.innerText = j.error; else msg.innerText = "Picks saved!";
};

loadEventAndDrivers();
