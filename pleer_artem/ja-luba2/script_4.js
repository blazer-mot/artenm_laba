
const player = {
  tracks: [
    { title: "Где твоя любовь", artist: "Макс Корж", src: "assets/gde_tvoya_lyubov.mp3", cover: "obl/gde_tvoya_lyubov.jpg", lyricsFile: "gde_tvoya_lyubov" },
    { title: "Время", artist: "Макс Корж", src: "assets/vremya.mp3", cover: "obl/vremya.jpg", lyricsFile: "vremya" },
    { title: "Малиновый закат", artist: "Макс Корж", src: "assets/malinovyy_zakat.mp3", cover: "obl/malinovyy_zakat.jpg", lyricsFile: "malinovyy_zakat" },
    { title: "Небо поможет нам", artist: "Макс Корж", src: "assets/nebo_pomozhet_nam.mp3", cover: "obl/nebo_pomozhet_nam.jpg", lyricsFile: "nebo_pomozhet_nam" },
    { title: "Улицы без фонарей", artist: "Макс Корж", src: "assets/ulitsy_bez_fonarey.mp3", cover: "obl/ulitsy_bez_fonarey.jpg", lyricsFile: "ulitsy_bez_fonarey" }
  ],
  currentTrack: 0,
  audio: null,
  progressBar: null,
  currentTime: null,
  duration: null,

  init() {
    this.audio = document.getElementById("audioPlayer");
    this.progressBar = document.getElementById("progressBar");
    this.currentTime = document.getElementById("currentTime");
    this.duration = document.getElementById("duration");

    this.audio.addEventListener("timeupdate", () => {
      const current = this.audio.currentTime;
      const total = this.audio.duration || 0;
      this.progressBar.value = total ? (current / total) * 100 : 0;
      this.currentTime.textContent = this.formatTime(current);
      this.duration.textContent = "-" + this.formatTime(total - current);
    });

    this.audio.addEventListener("ended", () => {
      this.nextTrack();
    });

    this.progressBar.addEventListener("input", () => {
      const total = this.audio.duration || 0;
      const percent = this.progressBar.value / 100;
      this.audio.currentTime = percent * total;
    });
  },

  loadTrack(index) {
    this.currentTrack = index;
    const track = this.tracks[index];
    document.getElementById("trackTitle").textContent = track.title;
    document.getElementById("trackArtist").textContent = track.artist;
    document.getElementById("trackCover").src = track.cover;
    this.audio.src = track.src;
    document.getElementById("downloadBtn").href = track.src;

    document.getElementById("trackList").classList.remove("active");
    document.getElementById("playerBlock").classList.add("active");

    const lyricsBox = document.getElementById("lyrics");
    lyricsBox.style.display = "none";
    lyricsBox.textContent = "";

    this.audio.play();
  },

  togglePlay() { this.audio.paused ? this.audio.play() : this.audio.pause(); },
  prevTrack() { this.loadTrack((this.currentTrack - 1 + this.tracks.length) % this.tracks.length); },
  nextTrack() { this.loadTrack((this.currentTrack + 1) % this.tracks.length); },
  setVolume(value) { this.audio.volume = value; },
  shuffleTrack() { this.loadTrack(Math.floor(Math.random() * this.tracks.length)); },
  backToList() {
    this.audio.pause();
    document.getElementById("playerBlock").classList.remove("active");
    document.getElementById("trackList").classList.add("active");
  },

  showLyrics() {
    const track = this.tracks[this.currentTrack];
    const lyricsBox = document.getElementById("lyrics");
    if (lyricsBox.style.display === "block") {
      lyricsBox.style.display = "none";
      return;
    }
    fetch(`ttt/${track.lyricsFile}.txt`)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => { lyricsBox.textContent = text; lyricsBox.style.display = "block"; })
      .catch(() => { lyricsBox.textContent = "Текст песни не найден."; lyricsBox.style.display = "block"; });
  },

  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  }
};

function loadTrack(i){ player.loadTrack(i); }
function togglePlay(){ player.togglePlay(); }
function prevTrack(){ player.prevTrack(); }
function nextTrack(){ player.nextTrack(); }
function setVolume(v){ player.setVolume(v); }
function shuffleTrack(){ player.shuffleTrack(); }
function backToList(){ player.backToList(); }
function showLyrics(){ player.showLyrics(); }

window.addEventListener("DOMContentLoaded", () => player.init());
class CustomPlayer {
  constructor(artist, tracks) {
    this.artist = artist;
    this.tracks = tracks;
    this.currentTrack = 0;
    this.audio = new Audio();
    this.render();
  }

  render() {
    const container = document.createElement("div");

    const list = document.createElement("div");
    list.classList.add("track-list", "active");
    list.innerHTML = `<h2>${this.artist}</h2><ul></ul>`;
    this.tracks.forEach((t, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<img src="${t.cover}"> ${t.title}`;
      li.onclick = () => this.loadTrack(i);
      list.querySelector("ul").appendChild(li);
    });

    const block = document.createElement("div");
    block.classList.add("player");
    block.style.display = "none";
    block.innerHTML = `
      <img class="cover">
      <div class="info"><h2 class="title"></h2><p class="artist"></p></div>
      <div class="progress">
        <span class="currentTime">0:00</span>
        <input type="range" class="progressBar" value="0" min="0" max="100">
        <span class="duration">-0:00</span>
      </div>
      <div class="controls">
        <button class="shuffle"><img src="knop/slych.png"></button>
        <button class="prev"><img src="knop/levo.png"></button>
        <button class="play"><img src="knop/пауза.png"></button>
        <button class="next"><img src="knop/право.png"></button>
        <div class="volume-control">
          <img src="knop/звук.png">
          <input type="range" min="0" max="1" step="0.01" class="volume">
        </div>
      </div>
      <div class="extra-buttons">
        <button class="lyricsBtn"><img src="knop/text.png"></button>
        <a class="downloadBtn" href="#" download><button><img src="knop/skacka.png"></button></a>
        <button class="back"><img src="knop/nazad.png"></button>
        <button class="deletePlayer"><img src="knop/asdasd.png"></button>
      </div>
      <div class="lyrics" style="display:none;"></div>
    `;

    container.appendChild(list);
    container.appendChild(block);
    document.getElementById("playersContainer").appendChild(container);

    this.ui = {
      container, list, block,
      cover: block.querySelector(".cover"),
      title: block.querySelector(".title"),
      artist: block.querySelector(".artist"),
      progressBar: block.querySelector(".progressBar"),
      currentTime: block.querySelector(".currentTime"),
      duration: block.querySelector(".duration"),
      lyrics: block.querySelector(".lyrics"),
      downloadBtn: block.querySelector(".downloadBtn")
    };

    block.querySelector(".play").onclick = () => this.togglePlay();
    block.querySelector(".next").onclick = () => this.nextTrack();
    block.querySelector(".prev").onclick = () => this.prevTrack();
    block.querySelector(".shuffle").onclick = () => this.shuffleTrack();
    block.querySelector(".volume").oninput = e => this.audio.volume = e.target.value;
    block.querySelector(".lyricsBtn").onclick = () => {
      this.ui.lyrics.style.display = this.ui.lyrics.style.display === "block" ? "none" : "block";
    };
    block.querySelector(".back").onclick = () => {
      block.style.display = "none";
      list.style.display = "block";
      this.audio.pause();
    };
    block.querySelector(".deletePlayer").onclick = () => {
      this.audio.pause();
      container.remove();
    };

    this.audio.addEventListener("timeupdate", () => {
      const c = this.audio.currentTime;
      const t = this.audio.duration || 0;
      this.ui.progressBar.value = t ? (c / t) * 100 : 0;
      this.ui.currentTime.textContent = this.formatTime(c);
      this.ui.duration.textContent = "-" + this.formatTime(t - c);
    });
    this.ui.progressBar.oninput = () => {
      const t = this.audio.duration || 0;
      this.audio.currentTime = (this.ui.progressBar.value / 100) * t;
    };
  }

  loadTrack(i) {
    this.currentTrack = i;
    const t = this.tracks[i];
    this.ui.title.textContent = t.title;
    this.ui.artist.textContent = this.artist;
    this.ui.cover.src = t.cover;
    this.audio.src = t.src;
    this.ui.lyrics.textContent = t.lyrics;


    this.ui.downloadBtn.href = t.src;

    this.ui.list.style.display = "none";
    this.ui.block.style.display = "block";

    this.audio.play();
  }

  togglePlay() { this.audio.paused ? this.audio.play() : this.audio.pause(); }
  nextTrack() { this.loadTrack((this.currentTrack + 1) % this.tracks.length); }
  prevTrack() { this.loadTrack((this.currentTrack - 1 + this.tracks.length) % this.tracks.length); }
  shuffleTrack() { this.loadTrack(Math.floor(Math.random() * this.tracks.length)); }

  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  }
}




const modal = document.getElementById("modal");
const createBtn = document.getElementById("createBtn");
const closeModal = document.getElementById("closeModal");
const playerForm = document.getElementById("playerForm");
const addTrackBtn = document.getElementById("addTrackBtn");
const tracksInputs = document.getElementById("tracksInputs");

let tempTracks = []; 

createBtn.onclick = () => modal.style.display = "block";
closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };


addTrackBtn.onclick = () => {
  const div = tracksInputs.querySelector(".track-input");
  const title = div.querySelector(".title").value.trim();
  const file = div.querySelector(".file").files[0];
  const cover = div.querySelector(".cover").files[0];
  const lyrics = div.querySelector(".lyrics").value;

  if (title && file && cover) {
    tempTracks.push({
      title,
      src: URL.createObjectURL(file),
      cover: URL.createObjectURL(cover),
      lyrics
    });

    div.querySelector(".title").value = "";
    div.querySelector(".file").value = "";
    div.querySelector(".cover").value = "";
    div.querySelector(".lyrics").value = "";
    alert("Трек добавлен, можно ввести следующий");
  } else {
    alert("Заполни все поля для трека!");
  }
};


playerForm.onsubmit = e => {
  e.preventDefault();
  const artist = document.getElementById("artistInput").value.trim();


  const div = tracksInputs.querySelector(".track-input");
  const title = div.querySelector(".title").value.trim();
  const file = div.querySelector(".file").files[0];
  const cover = div.querySelector(".cover").files[0];
  const lyrics = div.querySelector(".lyrics").value;

  if (title && file && cover) {
    tempTracks.push({
      title,
      src: URL.createObjectURL(file),
      cover: URL.createObjectURL(cover),
      lyrics
    });
  }

  if (tempTracks.length === 0) {
    alert("Добавь хотя бы один трек!");
    return;
  }

  new CustomPlayer(artist, tempTracks);

  playerForm.reset();
  tempTracks = [];
  modal.style.display = "none";
};
