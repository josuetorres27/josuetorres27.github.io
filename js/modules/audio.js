/**
 * Portfolio Audio System
 * Synthesizes retro 8-bit sound effects using the native Web Audio API.
 * Zero external audio files or dependencies required.
 * Audio is strictly silenced and deferred during preloader / page boot.
 */

(function () {
  'use strict';

  var audioCtx = null;
  var soundEnabled = true;

  function isPreloaderActive() {
    if (window.__portfolioLoaderActive === true) return true;
    var loader = document.getElementById('portfolio-loader');
    if (!loader) return false;
    return loader.style.display !== 'none' && !loader.classList.contains('loader-hidden');
  }

  function getAudioContext() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }
    return audioCtx;
  }

  function initAudio() {
    // Keep page boot completely silent: never construct or resume AudioContext while preloader is active.
    // Listen for genuine user gestures after preloader dismissal to unlock audio seamlessly.
    var unlockAudio = function () {
      if (isPreloaderActive()) return;
      document.removeEventListener('click', unlockAudio, true);
      document.removeEventListener('keydown', unlockAudio, true);
      document.removeEventListener('touchstart', unlockAudio, true);
      getAudioContext();
    };

    document.addEventListener('click', unlockAudio, true);
    document.addEventListener('keydown', unlockAudio, true);
    document.addEventListener('touchstart', unlockAudio, true);
  }

  function playRetroSound(type) {
    if (!soundEnabled) return;
    // Strictly suppress any audio playback while preloader screen is visible or fading
    if (isPreloaderActive()) return;

    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

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
