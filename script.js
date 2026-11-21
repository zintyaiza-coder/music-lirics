// Daftar estafet lirik: tinggal sesuaikan 'time' (detik), 'avatar', atau 'text'
const cues = [
  { time: 6, singer: "Maroon5", initials: "M5", avatar: "maroon5.jpg", glow: "rgba(245, 133, 41, 0.18)", text: "Now i've at a payphone" },
  { time: 8, singer: "Onedirection", initials: "1D", avatar: "onedirection.jpg", glow: "rgba(221, 42, 123, 0.18)", text: "We're looking back, we messed around" },
  { time: 12, singer: "Onedirection", initials: "1D", avatar: "onedirection.jpg", glow: "rgba(221, 42, 123, 0.18)", text: "But that was then and this is now" },
  { time: 16, singer: "Onedirection", initials: "1D", avatar: "onedirection.jpg", glow: "rgba(221, 42, 123, 0.18)", text: "All we need's enough" },
  { time: 20, singer: "Onedirection", initials: "1D", avatar: "onedirection.jpg", glow: "rgba(221, 42, 123, 0.18)", text: "love to hold us Where we are" },
  { time: 26, singer: "Bleachers", initials: "BL", avatar: "bleachers.jpg", glow: "rgba(129, 52, 175, 0.2)", text: "But you should know that i die slow" },
  { time: 30, singer: "Bleachers", initials: "BL", avatar: "bleachers.jpg", glow: "rgba(129, 52, 175, 0.2)", text: "Running through the halls" },
  { time: 32, singer: "Bleachers", initials: "BL", avatar: "bleachers.jpg", glow: "rgba(129, 52, 175, 0.2)", text: "Of your haunted home" },
  { time: 34, singer: "Bleachers", initials: "BL", avatar: "bleachers.jpg", glow: "rgba(129, 52, 175, 0.2)", text: "and the toughest part" },
  { time: 36, singer: "Bleachers", initials: "BL", avatar: "bleachers.jpg", glow: "rgba(129, 52, 175, 0.2)", text: "is that we both know" },
  { time: 38, singer: "Bleachers", initials: "BL", avatar: "bleachers.jpg", glow: "rgba(129, 52, 175, 0.2)", text: "what happened to you" },
  { time: 40, singer: "Bleachers", initials: "BL", avatar: "bleachers.jpg", glow: "rgba(129, 52, 175, 0.2)", text: "why you're out on your own" },
  { time: 44, singer: "Bleachers", initials: "BL", avatar: "bleachers.jpg", glow: "rgba(129, 52, 175, 0.2)", text: "Merry Christmas please don't call" },
  { time: 50, singer: "Alexcrichton", initials: "AC", avatar: "alexcrichton.jpg", glow: "rgba(81, 91, 212, 0.22)", text: "So what if i call?" },
  { time: 54, singer: "Alexcrichton", initials: "AC", avatar: "alexcrichton.jpg", glow: "rgba(81, 91, 212, 0.22)", text: "Andy you pick up the phone" },
  { time: 58, singer: "Alexcrichton", initials: "AC", avatar: "alexcrichton.jpg", glow: "rgba(81, 91, 212, 0.22)", text: "and i use this holiday" },
  { time: 62, singer: "Alexcrichton", initials: "AC", avatar: "alexcrichton.jpg", glow: "rgba(81, 91, 212, 0.22)", text: "To make my way to your ghost" }
];

const relayStream = document.getElementById("relayStream");
const ambientGlow = document.getElementById("ambientGlow");
const audio = document.getElementById("songAudio");
const playBtn = document.getElementById("playBtn");
const seekBar = document.getElementById("seekBar");
const timeReadout = document.getElementById("timeReadout");

const rowElements = cues.map((cue) => {
  const row = document.createElement("article");
  row.className = "singer-row";

  row.innerHTML = `
    <div class="avatar-ring">
      <div class="avatar-inner">
        <img src="${cue.avatar}" alt="${cue.singer}" onerror="this.remove(); this.parentElement.textContent='${cue.initials}';" />
      </div>
    </div>
    <div class="lyric-body">
      <div class="singer-meta">
        <span>${cue.singer}</span>
        <span class="verified-dot" aria-hidden="true">✓</span>
      </div>
      <div class="lyric-line">${cue.text}</div>
    </div>
  `;

  relayStream.appendChild(row);
  return row;
});

function formatTime(sec) {
  if (!Number.isFinite(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function updateActiveLyric() {
  const current = audio.currentTime;
  let activeIndex = 0;

  cues.forEach((cue, idx) => {
    if (current >= cue.time) activeIndex = idx;
  });

  rowElements.forEach((row, idx) => {
    row.classList.toggle("is-active", idx === activeIndex);
    row.classList.toggle("is-prev", idx === activeIndex - 1);
    row.classList.toggle("is-next", idx === activeIndex + 1);
  });

  const activeCue = cues[activeIndex];
  if (activeCue && activeCue.glow) {
    ambientGlow.style.background = `radial-gradient(circle, ${activeCue.glow}, rgba(81, 91, 212, 0.06) 50%, transparent 72%)`;
  }

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    seekBar.value = String((current / audio.duration) * 100);
  }
  timeReadout.textContent = `${formatTime(current)} / ${formatTime(audio.duration)}`;
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "Jeda";
  } else {
    audio.pause();
    playBtn.textContent = "Putar";
  }
});

seekBar.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(seekBar.value) / 100) * audio.duration;
    updateActiveLyric();
  }
});

audio.addEventListener("timeupdate", updateActiveLyric);
audio.addEventListener("loadedmetadata", updateActiveLyric);
audio.addEventListener("ended", () => {
  playBtn.textContent = "Putar";
});

// Tampilkan baris pertama secara default sebelum audio diputar
updateActiveLyric();
