import { OPENAI_API_KEY } from '../config.js';

// 1. Mental Health Toolkit
const toolkitIcons = [
    "fa-wind",
    "fa-eye",
    "fa-dumbbell",
    "fa-om",
    "fa-pen-fancy"
];

const toolkitItems = [
  {name: "4-7-8 Breathing", description: "A breathing technique to reduce anxiety"},
  {name: "5-4-3-2-1 Grounding", description: "Identify 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste"},
  {name: "Progressive Muscle Relaxation", description: "Tense and relax each muscle group for deep relaxation"},
  {name: "Short Guided Meditation", description: "Focus your mind for 5 minutes on calming thoughts"},
  {name: "Journaling Prompt", description: "Write about how the news made you feel and what you can control"}
];

function renderToolkit() {
  const ul = document.getElementById("toolkit-list");
  ul.innerHTML = ''; // clear existing items
  
  toolkitItems.forEach((item, index) => {
    // card container
    const card = document.createElement('div');
    card.className = 'toolkit-item';
    
    // icon wrapper
    const iconDiv = document.createElement('div');
    iconDiv.className = 'toolkit-icon';
    const icon = document.createElement('i');
    icon.className = `fas ${toolkitIcons[index]}`;
    iconDiv.appendChild(icon);
    
    // content wrapper
    const content = document.createElement('div');
    content.className = 'toolkit-content';
    const title = document.createElement('h3');
    title.textContent = item.name;
    const desc = document.createElement('p');
    desc.className = 'toolkit-description';
    desc.textContent = item.description;
    content.appendChild(title);
    content.appendChild(desc);
    
    // assemble
    card.appendChild(iconDiv);
    card.appendChild(content);
    
    ul.appendChild(card);
  });
}

// call toolkit render when DOM is ready & detect Android
document.addEventListener('DOMContentLoaded', () => {
  renderToolkit();
  // if on Android, show download button
  if (/Android/i.test(navigator.userAgent)) {
    const btn = document.getElementById('download-app');
    if (btn) btn.style.display = 'inline-block';
  }
});

// allow expanding/collapsing toolkit items on tap/click
document.querySelectorAll('.toolkit-item').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

// 2. Affirmation Generator (OpenAI)
document
  .getElementById("generate-affirmation")
  .addEventListener("click", async () => {

    const emotion =
      document.getElementById("emotion-input").value.trim() || "this moment";
    const output = document.getElementById("affirmation-output");
    output.textContent = "Generating affirmation…";

    // build messages just as before
    const messages = [
      {
        role: "system",
        content:
          "You provide uplifting, personalized affirmations. Never reveal that you are an AI. Only print the affirmation.",
      },
      {
        role: "user",
        content: `I am feeling ${emotion} after reading the news. Give me one unique affirmation to help.`,
      },
    ];

    try {
      const res = await fetch("https://headlinesbackend-mwo3.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      

      const json = await res.json();
      output.textContent =
        json.choices?.[0]?.message?.content.trim() ||
        "Take a deep breath. You are okay.";
    } catch (err) {
      console.error(err);
      output.textContent = "Sorry, could not generate an affirmation.";
    }
  });

// Pause & Reflect → 4-7-8 breathing with fade + music
const btn = document.getElementById('start-breathing');
const overlay = document.getElementById('breathing-overlay');
const circle = document.getElementById('breathing-circle');
const label = document.getElementById('breathing-text');
const audio = document.getElementById('calm-audio');

// helper to fade out audio over given ms
function fadeOutAudio(audio, duration) {
  const step = 50;
  const initial = audio.volume;
  const delta = initial / (duration / step);
  const fadeInt = setInterval(() => {
    if (audio.volume > delta) {
      audio.volume = Math.max(0, audio.volume - delta);
    } else {
      audio.volume = 0;
      clearInterval(fadeInt);
      audio.pause();
      audio.volume = initial;
    }
  }, step);
}

btn.addEventListener('click', async () => {
  btn.disabled = true;
  overlay.classList.add('active');

  audio.currentTime = 0;
  audio.load();                // ensure track is loaded
  audio.volume = 1;            // start at full volume
  audio.play().catch(console.error);

  // one cycle of inhale(4s), hold(7s), exhale(8s)
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  for (let i = 0; i < 3; i++) {
    label.textContent = 'Inhale';
    circle.classList.remove('shrink');
    circle.classList.add('grow');
    await sleep(4000);

    label.textContent = 'Hold';
    // <-- do NOT remove 'grow' here so it stays enlarged
    await sleep(7000);

    label.textContent = 'Exhale';
    circle.classList.remove('grow');
    circle.classList.add('shrink');
    await sleep(8000);
  }

  overlay.classList.remove('active');
  fadeOutAudio(audio, 2000);   // fade out over 2s
  btn.disabled = false;
});

// mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// close mobile menu after clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});