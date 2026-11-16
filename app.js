(function () {
  var stage = document.getElementById('shStage');
  var video = document.getElementById('shVideo');
  var ruler = document.getElementById('ruler');
  var ringFill = document.getElementById('ringFill');
  var ringHand = document.getElementById('ringHand');
  var ringDot = document.getElementById('ringDot');
  var readout = document.getElementById('readoutTime');
  var readoutChapter = document.getElementById('readoutChapter');
  var chapterChip = document.getElementById('chapterChip');
  var consoleChapter = document.getElementById('consoleChapter');
  var slider = stage.querySelector('.sh-slider');
  var CIRC = 339.292;

  var FALLBACK_CHAPTERS = [
    { start: 0, end: 45, text: 'Into the canopy' },
    { start: 45, end: 75, text: 'Rain and falling water' },
    { start: 75, end: 105, text: 'The harbour' },
    { start: 105, end: 155, text: 'New growth, last light' }
  ];
  var chapters = FALLBACK_CHAPTERS;

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function chapterAt(t) {
    for (var i = 0; i < chapters.length; i++) {
      if (t >= chapters[i].start && t < chapters[i].end) return chapters[i];
    }
    return chapters[chapters.length - 1];
  }

  function buildRuler() {
    var d = video.duration;
    if (!isFinite(d) || d <= 0) return;
    ruler.innerHTML = '';
    for (var t = 0; t <= d; t += 10) {
      var pct = (t / d) * 100;
      var major = Math.round(t) % 60 === 0;
      var tick = document.createElement('div');
      tick.className = 'sh-tick' + (major ? ' major' : '');
      tick.style.left = pct + '%';
      ruler.appendChild(tick);
      if (major && t > 0 && t < d) {
        var lab = document.createElement('div');
        lab.className = 'sh-tick-label';
        lab.style.left = pct + '%';
        lab.textContent = fmt(t);
        ruler.appendChild(lab);
      }
    }
    chapters.forEach(function (c) {
      if (c.start <= 0) return;
      var mark = document.createElement('div');
      mark.className = 'sh-chapter-mark';
      mark.style.left = (c.start / d) * 100 + '%';
      ruler.appendChild(mark);
    });
  }

  function loadChaptersFromTrack() {
    try {
      var tracks = video.textTracks;
      for (var i = 0; i < tracks.length; i++) {
        if (tracks[i].kind === 'chapters') {
          var tr = tracks[i];
          tr.mode = 'hidden';
          var apply = function () {
            if (tr.cues && tr.cues.length) {
              chapters = Array.prototype.map.call(tr.cues, function (cue) {
                return { start: cue.startTime, end: cue.endTime, text: cue.text };
              });
              buildRuler();
              update();
            }
          };
          if (tr.cues && tr.cues.length) apply();
          else tr.addEventListener('load', apply);
          return;
        }
      }
    } catch (e) { /* fallback chapters stay */ }
  }

  function update() {
    var d = video.duration || 0;
    var t = video.currentTime || 0;
    var p = d > 0 ? t / d : 0;
    ringFill.style.strokeDashoffset = String(CIRC * (1 - p));
    var ang = p * Math.PI * 2;
    ringHand.style.transform = 'rotate(' + (p * 360) + 'deg)';
    ringDot.setAttribute('cx', String(60 + 54 * Math.sin(ang)));
    ringDot.setAttribute('cy', String(60 - 54 * Math.cos(ang)));
    readout.textContent = fmt(t);
    var ch = chapterAt(t);
    if (ch) {
      readoutChapter.textContent = ch.text;
      chapterChip.textContent = ch.text;
      consoleChapter.textContent = ch.text;
    }
    if (video.paused || video.ended) {
      stage.setAttribute('data-paused', '');
      stage.removeAttribute('data-playing');
    } else {
      stage.setAttribute('data-playing', '');
      stage.removeAttribute('data-paused');
    }
  }

  video.addEventListener('loadedmetadata', function () { buildRuler(); loadChaptersFromTrack(); update(); });
  video.addEventListener('timeupdate', update);
  video.addEventListener('play', update);
  video.addEventListener('pause', update);
  video.addEventListener('ended', update);
  video.addEventListener('seeked', update);

  slider.addEventListener('pointerdown', function () { stage.classList.add('sh-scrubbing'); });
  window.addEventListener('pointerup', function () { stage.classList.remove('sh-scrubbing'); });
  video.addEventListener('seeking', function () { stage.classList.add('sh-scrubbing'); update(); });
  video.addEventListener('seeked', function () { stage.classList.remove('sh-scrubbing'); });

  var RATES = [1, 1.25, 1.5, 2, 0.5];
  var rateBtn = document.getElementById('rateBtn');
  rateBtn.addEventListener('click', function () {
    var i = RATES.indexOf(video.playbackRate);
    var next = RATES[(i + 1) % RATES.length];
    video.playbackRate = next;
    rateBtn.innerHTML = String(next).replace('0.', '.') + '&times;';
  });

  stage.addEventListener('keydown', function (e) {
    var k = e.key;
    var handled = true;
    if (k === ' ' || k === 'k') { video.paused ? video.play() : video.pause(); }
    else if (k === 'j') video.currentTime = Math.max(0, video.currentTime - 10);
    else if (k === 'l') video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
    else if (k === 'ArrowLeft') video.currentTime = Math.max(0, video.currentTime - 5);
    else if (k === 'ArrowRight') video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
    else if (k === 'm') video.muted = !video.muted;
    else if (k === 'f') { if (document.fullscreenElement) document.exitFullscreen(); else if (stage.requestFullscreen) stage.requestFullscreen(); }
    else if (/^[0-9]$/.test(k) && isFinite(video.duration)) video.currentTime = video.duration * (Number(k) / 10);
    else handled = false;
    if (handled) { e.preventDefault(); e.stopPropagation(); }
  });
})();
