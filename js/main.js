/**
 * Portfolio Main Orchestrator & Application Bootstrap
 * Connects modular subsystem components into unified window.Portfolio namespace.
 * Ensures zero-build deployment compatibility with offline file:/// and GitHub Pages.
 */

(function () {
  'use strict';

  function initPortfolio() {
    // 1. Audio System (retro 8-bit sound synth)
    if (window.PortfolioAudio && typeof window.PortfolioAudio.init === 'function') {
      window.PortfolioAudio.init();
    }

    // 2. Theme System (dark/light mode & icon sync)
    if (window.PortfolioTheme && typeof window.PortfolioTheme.init === 'function') {
      window.PortfolioTheme.init();
    }

    // 3. UI System (dropdowns, mobile menu, copy email)
    if (window.PortfolioUI && typeof window.PortfolioUI.init === 'function') {
      window.PortfolioUI.init();
    }

    // 4. Internationalization & Hero Typewriter (bilingual system)
    if (window.PortfolioI18n && typeof window.PortfolioI18n.init === 'function') {
      window.PortfolioI18n.init();
    }

    // 5. Image Lightbox & Photo Carousel
    if (window.PortfolioLightbox && typeof window.PortfolioLightbox.init === 'function') {
      window.PortfolioLightbox.init();
    }

    // 6. 8-Bit Scrollytelling Adventure & Companion
    if (window.PortfolioAdventure && typeof window.PortfolioAdventure.init === 'function') {
      window.PortfolioAdventure.init();
    }

    // Expose unified public API on window.Portfolio
    window.Portfolio = {
      Audio: window.PortfolioAudio,
      Theme: window.PortfolioTheme,
      UI: window.PortfolioUI,
      I18n: window.PortfolioI18n,
      Lightbox: window.PortfolioLightbox,
      Adventure: window.PortfolioAdventure,
      version: '2.0.0'
    };

    // Global backwards-compatibility aliases
    window.toggleTheme = window.PortfolioTheme ? window.PortfolioTheme.toggle : undefined;
    window.applyLanguage = window.PortfolioI18n ? window.PortfolioI18n.applyLanguage : undefined;
    window.startAdventure = window.PortfolioAdventure ? window.PortfolioAdventure.start : undefined;
    window.closeAdventure = window.PortfolioAdventure ? window.PortfolioAdventure.close : undefined;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }
})();
