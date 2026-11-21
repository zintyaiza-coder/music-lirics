(() => {
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

  if (!relayStream || !playBtn || !seekBar || !timeReadout) return;

  const FALLBACK_DURATION = 66;
  let currentSec = 0;
  let isPlaying = false;
  let intervalId = null;
  let audioError = false;

  relayStream.innerHTML = "";
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
    if (!Number.isFinite(sec) || sec < 0) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function hasRealAudio() {
    return Boolean(audio) && !audioError && Number.isFinite(audio.duration) && audio.duration > 0;
  }

  function renderUI(sec, total) {
    let activeIdx = 0;
    for (let i = 0; i < cues.length; i++) {
      if (sec >= cues[i].time) activeIdx = i;
    }

    rowElements.forEach((row, idx) => {
      row.classList.toggle("is-active", idx === activeIdx);
      row.classList.toggle("is-prev", idx === activeIdx - 1);
      row.classList.toggle("is-next", idx === activeIdx + 1);
    });

    if (ambientGlow && cues[activeIdx] && cues[activeIdx].glow) {
      ambientGlow.style.background = `radial-gradient(circle, ${cues[activeIdx].glow}, rgba(81, 91, 212, 0.06) 50%, transparent 72%)`;
    }

    const safeTotal = total > 0 ? total : FALLBACK_DURATION;
    seekBar.value = String(Math.min(100, Math.max(0, (sec / safeTotal) * 100)));
    const suffix = audioError ? " • cek lagu1.mp3" : "";
    timeReadout.textContent = `${formatTime(sec)} / ${formatTime(safeTotal)}${suffix}`;
  }

  function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
  }

  function setPausedState() {
    isPlaying = false;
    playBtn.textContent = "Putar";
    stopTimer();
    if (audio && !audio.paused) {
      audio.pause();
    }
  }

  function startFallbackClock() {
    stopTimer();
    intervalId = setInterval(() => {
      currentSec += 0.25;
      if (currentSec >= FALLBACK_DURATION) {
        currentSec = 0;
        setPausedState();
      }
      renderUI(currentSec, FALLBACK_DURATION);
    }, 250);
  }

  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      setPausedState();
      return;
    }

    isPlaying = true;
    playBtn.textContent = "Jeda";

    if (hasRealAudio()) {
      audio.play().catch(() => {
        startFallbackClock();
      });
    } else {
      startFallbackClock();
    }
  });

  seekBar.addEventListener("input", () => {
    const ratio = Number(seekBar.value) / 100;
    if (hasRealAudio()) {
      audio.currentTime = ratio * audio.duration;
      renderUI(audio.currentTime, audio.duration);
    } else {
      currentSec = ratio * FALLBACK_DURATION;
      renderUI(currentSec, FALLBACK_DURATION);
    }
  });

  if (audio) {
    audio.addEventListener("error", () => {
      audioError = true;
      renderUI(currentSec, FALLBACK_DURATION);
    });

    audio.addEventListener("timeupdate", () => {
      if (hasRealAudio()) {
        currentSec = audio.currentTime;
        renderUI(currentSec, audio.duration);
      }
    });

    audio.addEventListener("loadedmetadata", () => {
      if (hasRealAudio()) {
        audioError = false;
        renderUI(currentSec, audio.duration);
      }
    });

    audio.addEventListener("ended", () => {
      currentSec = 0;
      setPausedState();
      renderUI(0, hasRealAudio() ? audio.duration : FALLBACK_DURATION);
    });
  }

  renderUI(0, FALLBACK_DURATION);
})();
