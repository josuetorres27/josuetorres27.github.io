/**
 * Portfolio Theme System
 * Handles light and dark mode toggling, localStorage persistence, and UI icon state synchronization.
 */

(function () {
  'use strict';

  function updateThemeUI(theme) {
    var isLight = theme === 'light';
    document.querySelectorAll('.theme-icon-sun').forEach(function (el) {
      el.classList.toggle('hidden', !isLight);
    });
    document.querySelectorAll('.theme-icon-moon').forEach(function (el) {
      el.classList.toggle('hidden', isLight);
    });
    if (window.PortfolioAudio && typeof window.PortfolioAudio.updateUI === 'function') {
      window.PortfolioAudio.updateUI();
    }
  }

  function toggleTheme() {
    var isLight = document.documentElement.classList.contains('light');
    if (isLight) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      updateThemeUI('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      updateThemeUI('light');
    }
  }

  function initTheme() {
    var themeBtnDesktop = document.getElementById('theme-toggle-btn');
    var themeBtnMobile = document.getElementById('theme-toggle-mobile');

    if (themeBtnDesktop) {
      themeBtnDesktop.addEventListener('click', toggleTheme);
    }
    if (themeBtnMobile) {
      themeBtnMobile.addEventListener('click', toggleTheme);
    }

    var currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    updateThemeUI(currentTheme);
  }

  window.PortfolioTheme = {
    init: initTheme,
    toggle: toggleTheme,
    updateUI: updateThemeUI,
    isLight: function () {
      return document.documentElement.classList.contains('light');
    }
  };
})();
