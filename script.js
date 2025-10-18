const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');
const themeBtn = document.getElementById('themeBtn');
const settingsBtn = document.getElementById('settingsBtn');
const backgroundCanvas = document.getElementById('background');

const settingsPopup = document.getElementById('settingsPopup');
const closeSettings = document.getElementById('closeSettings');
const applySettings = document.getElementById('applySettings');
const notifications = document.getElementById('notifications');

// -------------------- 200 Insults --------------------
const insults = [
  "Really? Couldn’t handle that?", "Task yeeted into oblivion.", "Another one bites the dust.",
  "Wow, that’s impressive laziness!", "You deleted that faster than your GPA!",
  "Even a snail could have done better.", "Deleted it? Classic move.", "That task didn’t stand a chance.",
  "Smooth move, deleting that.", "Poof! Gone.", "Your indecisiveness is inspiring.",
  "Another victim of your chaos.", "You’re a deletion master.", "Blink and it’s gone, just like your motivation.",
  "Was that task even trying?", "The delete button is your best friend.", "Task annihilation complete.",
  "The void thanks you.", "You strike fear into tasks everywhere.", "Task obliterated.",
  "Gone in a flash!", "You’re unstoppable!", "Even gravity couldn’t hold that task.",
  "Deleted with elegance.", "That task didn’t see it coming.", "You’re ruthless.",
  "Poof! Another one bites the dust.", "Delete button supremacy!", "Mission accomplished.",
  "Task? What task?", "Deleted like it never existed.", "Your efficiency is terrifying.",
  "Was that task even real?", "You have no mercy.", "Deleted in record time.", "The task quivers in fear.",
  "Another casualty of your brilliance.", "Task terminated.", "Your finger is deadly.",
  "Zero regrets.", "That task is history.", "You’re a legend of deletion.", "The delete chronicles continue.",
  "Another task vanishes.", "A true deletion artist.", "Gone without a trace.", "The task trembles.",
  "Swift and merciless.", "The void welcomes another.", "Task annihilated successfully.", "Deletion extraordinaire.",
  "You have no equal in deletion.", "Task executioner strikes again.", "The delete button bows to you.",
  "That task had no chance.", "You’re a deletion prodigy.", "The task never knew what hit it.", "Another victim down.",
  "Your power is unmatched.", "Task obliteration complete.", "Nothing escapes you.", "A true master of deletion.",
  "Task erased from existence.", "Deleted faster than thought.", "The void applauds your skill.", "Task vanquished.",
  "Your wrath is feared by all tasks.", "The delete legend grows.", "Poof! Another one gone.", "Swift and decisive.",
  "Task elimination level: expert.", "Even shadows flee from your delete button.", "The end of the task saga.", "You leave no task behind.",
  "Deleted in style.", "The task whispers farewell.", "Your finger is justice.", "Task meets its doom.", "A deletion marvel.",
  "The task knew fear.", "Deleted before impact.", "The task crumbles.", "You are the chosen one of deletion.",
  "No task survives.", "Erased with grace.", "Another deletion masterpiece.", "The task dissolves.", "You reign supreme.",
  "Task eliminated like magic.", "Another one bites the dust.", "The task couldn’t keep up.", "Deleted like a pro.",
  "You are unstoppable.", "Task suffers your wrath.", "The delete button salutes you.", "The task vanishes instantly.",
  "Another one obliterated.", "Poof! It’s history.", "The task feels shame.", "Deleted without remorse.", "Your efficiency is legendary.",
  "The task crumbled under your might.", "Another deletion success.", "The void grows stronger.", "Tasks fear you.", "The delete button whispers your name.",
  "Another task bites the dust.", "Vanished into nothingness.", "Deleted with flair.", "You strike swiftly.", "The task disappears.",
  "Another casualty.", "You are a deletion hero.", "Task trembles before you.", "Erased effortlessly.", "Another task obliterated.",
  "Swift deletion achieved.", "The task is gone.", "You’re a deletion machine.", "Poof! Another one gone.", "Another deletion record set.",
  "The delete button bows.", "No task survives you.", "The task quakes.", "Deleted with style.", "The void celebrates.",
  "Another deletion masterpiece.", "The task screams silently.", "You reign supreme.", "Task annihilation complete.", "Erased like magic.",
  "Your skill is unmatched.", "Another victim.", "Deleted with precision.", "Task obliterated flawlessly.", "You are unstoppable.",
  "Another task bites the dust.", "Poof! Another gone.", "Task trembling in fear.", "The delete button rules.", "Deleted in style.",
  "Another casualty of brilliance.", "Task vanquished successfully.", "The task never saw it coming.", "You’re ruthless.", "Task dissolved.",
  "Another deletion triumph.", "Poof! Gone forever.", "The void applauds.", "Your finger is lethal.", "Task eradicated.", "Another victim vanishes.",
  "Deleted before thinking.", "The task fades away.", "You are legendary.", "Task no longer exists.", "Another deletion success.",
  "The task is history.", "Poof! Another gone.", "Swift task removal.", "Another one bites the dust.", "Erased efficiently.",
  "Task crumbled instantly.", "Another deletion feat.", "Your finger strikes true.", "The task vanishes.", "Another casualty of deletion.",
  "Poof! It’s gone.", "Deleted with style.", "Task quivers.", "Another deletion accomplished.", "The void grows.", "Task eliminated gracefully.",
  "Another one obliterated.", "Deleted in record time.", "The task disappears.", "Another victory.", "Erased perfectly.", "The task trembles.",
  "Another casualty.", "Deleted with power.", "Task vanquished.", "Poof! Another gone.", "The void celebrates your might.",
  "Another deletion masterpiece.", "Task dissolved instantly.", "You are unstoppable.", "Another one bites the dust.", "Task obliterated completely."
];

// -------------------- Sound --------------------
function playSound(freq){
  const ctx = new (window.AudioContext||window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.frequency.value = freq;
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime+0.1);
}

// -------------------- Notifications --------------------
function showNotification(text,duration=3000){
  const notif = document.createElement('div');
  notif.classList.add('notification');
  notif.innerHTML = `<span>${text}</span><button>✖</button><div class="notification-progress"></div>`;
  notifications.appendChild(notif);

  const progress = notif.querySelector('.notification-progress');
  let start = Date.now();
  const interval = setInterval(()=>{
    let elapsed = Date.now() - start;
    progress.style.width = `${100 - 100*(elapsed/duration)}%`;
    if(elapsed >= duration){
      clearInterval(interval);
      notif.classList.add('notification-exit');
      notif.addEventListener('animationend', ()=> notif.remove());
    }
  },16);

  notif.querySelector('button').onclick = ()=>{
    clearInterval(interval);
    notif.classList.add('notification-exit');
    notif.addEventListener('animationend', ()=> notif.remove());
  };
}

// -------------------- Tasks --------------------
function saveTasks(){
  localStorage.setItem('tasks', JSON.stringify([...list.children].map(li=>li.querySelector('span').textContent)));
}

function loadTasks(){
  (JSON.parse(localStorage.getItem('tasks'))||[]).forEach(addTask);
}

function addTask(text){
  const li = document.createElement('li');
  const span = document.createElement('span'); span.textContent = text;
  const del = document.createElement('button'); del.textContent = '❌';
  del.onclick = ()=>{
    playSound(100);
    showNotification(insults[Math.floor(Math.random()*insults.length)]);
    li.remove();
    saveTasks();
  };
  li.append(span, del);
  list.append(li);
  saveTasks();
}

addBtn.onclick = ()=>{
  const text = input.value.trim();
  if(text){ playSound(600); addTask(text); input.value=''; }
};

clearBtn.onclick = ()=>{
  if(confirm("💣 Nuke all tasks?")){ list.innerHTML=''; localStorage.removeItem('tasks'); playSound(50); }
};

// -------------------- Theme --------------------
function toggleTheme(){
  if(document.body.classList.contains('dark')){
    document.body.classList.remove('dark');
    localStorage.setItem('theme','light');
  } else {
    document.body.classList.add('dark');
    localStorage.setItem('theme','dark');
  }
}
themeBtn.onclick = toggleTheme;

function loadTheme(){
  const saved = localStorage.getItem('theme');
  if(saved === 'dark') document.body.classList.add('dark');
}
loadTheme();

// -------------------- Settings --------------------
let SETTINGS = {
  MAX_DOTS: 150, MIN_DOTS: 70, MAX_DIST: 150, DOT_SPEED: 1,
  PULSE_INTENSITY: 1.5, LINE_WIDTH: 1, SATURATION: 100, LINE_OPACITY: 1,
  BG_BRIGHTNESS: 0.05, PARALLAX: 0
};

function loadSettings(){ const s = JSON.parse(localStorage.getItem('settings')); if(s) SETTINGS=s; }
function applySettingsFromPopup(){
  SETTINGS.MAX_DOTS = parseInt(document.getElementById('maxDotsInput').value);
  SETTINGS.MIN_DOTS = parseInt(document.getElementById('minDotsInput').value);
  SETTINGS.MAX_DIST = parseInt(document.getElementById('maxDistInput').value);
  SETTINGS.DOT_SPEED = parseFloat(document.getElementById('dotSpeedInput').value);
  SETTINGS.PULSE_INTENSITY = parseFloat(document.getElementById('pulseInput').value);
  SETTINGS.LINE_WIDTH = parseFloat(document.getElementById('lineWidthInput').value);
  SETTINGS.SATURATION = parseInt(document.getElementById('saturationInput').value);
  SETTINGS.LINE_OPACITY = parseFloat(document.getElementById('lineOpacityInput').value);
  SETTINGS.BG_BRIGHTNESS = parseFloat(document.getElementById('bgBrightnessInput').value);
  SETTINGS.PARALLAX = 0;
  localStorage.setItem('settings', JSON.stringify(SETTINGS));
}

settingsBtn.onclick = ()=> settingsPopup.style.display = 'flex';
closeSettings.onclick = ()=> settingsPopup.style.display = 'none';
applySettings.onclick = ()=> { applySettingsFromPopup(); settingsPopup.style.display='none'; updateDots(); };
window.onclick = e=>{ if(e.target===settingsPopup) settingsPopup.style.display='none'; }

// -------------------- Background --------------------
function connectedDots(){
  const ctx = backgroundCanvas.getContext('2d');
  let dots = [];

  function initializeDots(){
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;

    const area = window.innerWidth * window.innerHeight;
    const count = Math.floor(Math.min(SETTINGS.MAX_DOTS, Math.max(SETTINGS.MIN_DOTS, area / 8000)));
    const scale = Math.min(window.innerWidth, window.innerHeight)/1000;

    // Add/remove dots instead of refreshing all
    while(dots.length < count){
      dots.push({
        x: Math.random()*window.innerWidth,
        y: Math.random()*window.innerHeight,
        vx: (Math.random()*SETTINGS.DOT_SPEED*2)-SETTINGS.DOT_SPEED,
        vy: (Math.random()*SETTINGS.DOT_SPEED*2)-SETTINGS.DOT_SPEED,
        hue: Math.random()*360,
        baseR: (Math.random()*2+1.5)*scale,
        pulse: Math.random()*Math.PI*2
      });
    }
    while(dots.length > count){
      dots.splice(Math.floor(Math.random()*dots.length), 1);
    }

    dots.forEach(d=> d.baseR = (Math.random()*2+1.5)*scale);
  }

  initializeDots();
  window.addEventListener('resize', initializeDots);

  function draw(){
    ctx.fillStyle = `rgba(0,0,0,${SETTINGS.BG_BRIGHTNESS})`;
    ctx.fillRect(0,0,backgroundCanvas.width, backgroundCanvas.height);

    dots.forEach(d=>{
      d.x+=d.vx; d.y+=d.vy; d.hue=(d.hue+0.3)%360; d.pulse+=0.03;
      if(d.x<0||d.x>backgroundCanvas.width)d.vx*=-1;
      if(d.y<0||d.y>backgroundCanvas.height)d.vy*=-1;
    });

    for(let i=0;i<dots.length;i++){
      const d1 = dots[i], px1=d1.x, py1=d1.y;
      const r1 = d1.baseR + Math.sin(d1.pulse)*SETTINGS.PULSE_INTENSITY;

      ctx.beginPath(); ctx.arc(px1,py1,r1,0,Math.PI*2);
      ctx.fillStyle = `hsl(${d1.hue},${SETTINGS.SATURATION}%,60%)`;
      ctx.fill();

      for(let j=i+1;j<dots.length;j++){
        const d2 = dots[j], px2=d2.x, py2=d2.y;
        const dx = px1 - px2, dy = py1 - py2;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < SETTINGS.MAX_DIST){
          const r2 = d2.baseR + Math.sin(d2.pulse)*SETTINGS.PULSE_INTENSITY;
          const grad = ctx.createLinearGradient(px1,py1,px2,py2);
          const hueMid = (d1.hue*(r2/(r1+r2)) + d2.hue*(r1/(r1+r2))) % 360;
          grad.addColorStop(0, `hsla(${d1.hue},${SETTINGS.SATURATION}%,60%,${SETTINGS.LINE_OPACITY})`);
          grad.addColorStop(0.5, `hsla(${hueMid},${SETTINGS.SATURATION}%,60%,${SETTINGS.LINE_OPACITY})`);
          grad.addColorStop(1, `hsla(${d2.hue},${SETTINGS.SATURATION}%,60%,${SETTINGS.LINE_OPACITY})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = SETTINGS.LINE_WIDTH;
          ctx.beginPath(); ctx.moveTo(px1,py1); ctx.lineTo(px2,py2); ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// -------------------- Initialize --------------------
loadSettings();
document.getElementById('maxDotsInput').value = SETTINGS.MAX_DOTS;
document.getElementById('minDotsInput').value = SETTINGS.MIN_DOTS;
document.getElementById('maxDistInput').value = SETTINGS.MAX_DIST;
document.getElementById('dotSpeedInput').value = SETTINGS.DOT_SPEED;
document.getElementById('pulseInput').value = SETTINGS.PULSE_INTENSITY;
document.getElementById('lineWidthInput').value = SETTINGS.LINE_WIDTH;
document.getElementById('saturationInput').value = SETTINGS.SATURATION;
document.getElementById('lineOpacityInput').value = SETTINGS.LINE_OPACITY;
document.getElementById('bgBrightnessInput').value = SETTINGS.BG_BRIGHTNESS;

connectedDots();
loadTasks();
