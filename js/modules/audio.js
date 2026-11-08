/**
 * Portfolio Audio System
 * Synthesizes retro 8-bit sound effects using the native Web Audio API.
 * Zero external audio files or dependencies required.
 */

(function () {
  'use strict';

  var audioCtx = null;
  var soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playRetroSound(type) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      var now = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'jump') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'level') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'coin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.09);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'blip') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750 + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'exit') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (err) {
      // Audio context blocked by browser autoplay policy until first user interaction
    }
  }

  function updateSoundBtnUI() {
    var muteImg = document.getElementById('dialogue-mute-img');
    if (!muteImg) return;
    var isLight = document.documentElement.classList.contains('light');
    var activeLang = document.documentElement.lang === 'es' ? 'es' : 'en';

    if (!soundEnabled) {
      muteImg.src = isLight ? './img/icons/sound-off-light.png' : './img/icons/sound-off-dark.png';
      muteImg.alt = activeLang === 'es' ? 'Sonido silenciado' : 'Sound muted';
    } else {
      muteImg.src = isLight ? './img/icons/sound-on-light.png' : './img/icons/sound-on-dark.png';
      muteImg.alt = activeLang === 'es' ? 'Sonido activado' : 'Sound active';
    }
  }

  function toggleSound(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    soundEnabled = !soundEnabled;
    updateSoundBtnUI();
    if (soundEnabled) {
      playRetroSound('blip');
    }
  }

  window.PortfolioAudio = {
    init: initAudio,
    play: playRetroSound,
    toggle: toggleSound,
    updateUI: updateSoundBtnUI,
    isEnabled: function () {
      return soundEnabled;
    },
    setEnabled: function (val) {
      soundEnabled = !!val;
      updateSoundBtnUI();
    }
  };
})();
