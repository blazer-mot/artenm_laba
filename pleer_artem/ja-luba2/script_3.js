class AudioPlayer {
    constructor(containerId, tracks) {
      this.container = document.getElementById(containerId);
      this.tracks = tracks;
      this.currentTrack = 0;
      this.audio = new Audio();
      this.isReady = false;
  
      this.render();
      this.initEvents();
      this.updateUIForTrack(this.currentTrack);
    }
  
    render() {
      this.container.innerHTML = `
        <div class="track-list active">
          <h2>Выберите трек</h2>
          <ul>
            ${this.tracks
              .map(
                (t, i) =>
                  `<li data-index="${i}"><img src="${t.cover}" alt="cover"> ${t.title}</li>`
              )
              .join("")}
          </ul>
        </div>
  
        <div class="player">
          <img id="cover" class="cover" src="" alt="Обложка">
          <div class="info">
            <h2 id="title">Трек</h2>
            <p id="artist">Исполнитель</p>
          </div>
  
          <div class="progress">
            <span id="current">0:00</span>
            <input type="range" id="progress" value="0" min="0" max="100">
            <span id="duration">-0:00</span>
          </div>
  
          <div class="controls">
            <button id="shuffle" title="Случайный трек"><img src="knop/slych.png" alt="Shuffle"></button>
            <button id="prev" title="Назад"><img src="knop/levo.png" alt="Prev"></button>
            <button id="play" title="Воспроизвести/Пауза"><img src="knop/пауза.png" alt="Play/Pause"></button>
            <button id="next" title="Вперёд"><img src="knop/право.png" alt="Next"></button>
            <div class="volume-control" title="Громкость">
              <img src="knop/звук.png" alt="Volume">
              <input type="range" id="volume" min="0" max="1" step="0.01" value="1">
            </div>
          </div>
  
          <div class="extra-buttons">
            <button id="lyricsBtn" title="Текст песни"><img src="knop/text.png" alt="Lyrics"></button>
            <a id="download" href="#" download title="Скачать"><button><img src="knop/skacka.png" alt="Download"></button></a>
            <button id="back" title="Назад к списку"><img src="knop/nazad.png" alt="Back"></button>
          </div>
  
          <div id="lyrics" style="display:none;"></div>
        </div>
      `;
  
      this.trackListEl = this.container.querySelector(".track-list");
      this.playerEl = this.container.querySelector(".player");
      this.coverEl = this.container.querySelector("#cover");
      this.titleEl = this.container.querySelector("#title");
      this.artistEl = this.container.querySelector("#artist");
      this.progressEl = this.container.querySelector("#progress");
      this.currentEl = this.container.querySelector("#current");
      this.durationEl = this.container.querySelector("#duration");
      this.lyricsEl = this.container.querySelector("#lyrics");
      this.downloadEl = this.container.querySelector("#download");
      this.playBtn = this.container.querySelector("#play");
    }
  
    initEvents() {
      this.trackListEl.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () => this.loadTrack(Number(li.dataset.index), true));
      });
  
      this.container.querySelector("#prev").addEventListener("click", () => this.prevTrack());
      this.container.querySelector("#next").addEventListener("click", () => this.nextTrack());
      this.container.querySelector("#shuffle").addEventListener("click", () => this.shuffleTrack());
      this.container.querySelector("#back").addEventListener("click", () => this.backToList());
      this.container.querySelector("#lyricsBtn").addEventListener("click", () => this.toggleLyrics());
      this.container.querySelector("#volume").addEventListener("input", (e) => this.setVolume(e.target.value));
      this.playBtn.addEventListener("click", () => this.togglePlay());
  
      this.progressEl.addEventListener("input", (e) => this.seek(e.target.value));
  
      this.audio.addEventListener("timeupdate", () => this.onTimeUpdate());
      this.audio.addEventListener("loadedmetadata", () => {
        this.isReady = true;
        this.onTimeUpdate();
      });
      this.audio.addEventListener("ended", () => this.nextTrack());
      this.audio.addEventListener("error", () => {
        this.titleEl.textContent = "Ошибка загрузки трека";
      });
    }
  
    updateUIForTrack(index) {
      const track = this.tracks[index];
      this.titleEl.textContent = track.title;
      this.artistEl.textContent = track.artist;
      this.coverEl.src = track.cover;
      this.downloadEl.href = track.src;
      this.lyricsEl.style.display = "none";
      this.lyricsEl.textContent = "";
    }
  
    loadTrack(index, autoplay = false) {
      this.currentTrack = index;
      const track = this.tracks[index];
  
      this.updateUIForTrack(index);
  
      this.audio.src = track.src;
      this.isReady = false;

      this.trackListEl.classList.remove("active");
      this.playerEl.classList.add("active");
  
      if (autoplay) this.audio.play();
    }
  
    togglePlay() {
      if (!this.playerEl.classList.contains("active")) {
        this.playerEl.classList.add("active");
        this.trackListEl.classList.remove("active");
        this.loadTrack(this.currentTrack, true);
        return;
      }
  
      if (this.audio.paused) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
  
    prevTrack() {
      const nextIndex = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
      this.loadTrack(nextIndex, true);
    }
  
    nextTrack() {
      const nextIndex = (this.currentTrack + 1) % this.tracks.length;
      this.loadTrack(nextIndex, true);
    }
  
    shuffleTrack() {
      const randomIndex = Math.floor(Math.random() * this.tracks.length);
      this.loadTrack(randomIndex, true);
    }
  
    setVolume(value) {
      this.audio.volume = Number(value);
    }
  
    seek(percent) {
      if (!this.audio.duration || isNaN(this.audio.duration)) return;
      const p = Number(percent) / 100;
      this.audio.currentTime = p * this.audio.duration;
    }
  
    backToList() {
      this.audio.pause();
      this.playerEl.classList.remove("active");
      this.trackListEl.classList.add("active");
    }
  
    toggleLyrics() {
      if (this.lyricsEl.style.display === "block") {
        this.lyricsEl.style.display = "none";
        return;
      }
      const track = this.tracks[this.currentTrack];
      fetch(`ttt/${track.lyricsFile}.txt`)
        .then((r) => {
          if (!r.ok) throw new Error("not found");
          return r.text();
        })
        .then((text) => {
          this.lyricsEl.textContent = text;
          this.lyricsEl.style.display = "block";
        })
        .catch(() => {
          this.lyricsEl.textContent = "Текст песни не найден.";
          this.lyricsEl.style.display = "block";
        });
    }
  
    onTimeUpdate() {
      const current = this.audio.currentTime || 0;
      const total = this.audio.duration || 0;
      const percent = total ? (current / total) * 100 : 0;
  
      this.progressEl.value = percent;
      this.currentEl.textContent = this.formatTime(current);
      const remaining = Math.max(total - current, 0);
      this.durationEl.textContent = "-" + this.formatTime(remaining);
    }
  
    formatTime(sec) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? "0" + s : s}`;
    }
  }
  
  const tracks1 = [
    { title: "Где твоя любовь", artist: "Макс Корж", src: "assets/gde_tvoya_lyubov.mp3", cover: "obl/gde_tvoya_lyubov.jpg", lyricsFile: "gde_tvoya_lyubov" },
    { title: "Время", artist: "Макс Корж", src: "assets/vremya.mp3", cover: "obl/vremya.jpg", lyricsFile: "vremya" },
    { title: "Малиновый закат", artist: "Макс Корж", src: "assets/malinovyy_zakat.mp3", cover: "obl/malinovyy_zakat.jpg", lyricsFile: "malinovyy_zakat" }
  ];
  
  const tracks2 = [
    { title: "Небо поможет нам", artist: "Макс Корж", src: "assets/nebo_pomozhet_nam.mp3", cover: "obl/nebo_pomozhet_nam.jpg", lyricsFile: "nebo_pomozhet_nam" },
    { title: "Улицы без фонарей", artist: "Макс Корж", src: "assets/ulitsy_bez_fonarey.mp3", cover: "obl/ulitsy_bez_fonarey.jpg", lyricsFile: "ulitsy_bez_fonarey" },
    { title: "Время", artist: "Макс Корж", src: "assets/vremya.mp3", cover: "obl/vremya.jpg", lyricsFile: "vremya" }
  ];
  
  const player1 = new AudioPlayer("player1", tracks1);
  const player2 = new AudioPlayer("player2", tracks2);
  