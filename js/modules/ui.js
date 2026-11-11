/**
 * Portfolio UI Components & Interactivity
 * Handles mobile navigation, animated dropdowns, and clipboard copying.
 */

(function () {
  'use strict';

  function setupMobileMenu() {
    var mobileBtn = document.getElementById('mobile-menu-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuIconOpen = document.getElementById('menu-icon-open');
    var menuIconClose = document.getElementById('menu-icon-close');

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', function () {
        var isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
          mobileMenu.classList.add('hidden');
          if (menuIconOpen) menuIconOpen.classList.remove('hidden');
          if (menuIconClose) menuIconClose.classList.add('hidden');
        } else {
          mobileMenu.classList.remove('hidden');
          if (menuIconOpen) menuIconOpen.classList.add('hidden');
          if (menuIconClose) menuIconClose.classList.remove('hidden');
        }
      });

      document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.add('hidden');
          if (menuIconOpen) menuIconOpen.classList.remove('hidden');
          if (menuIconClose) menuIconClose.classList.add('hidden');
        });
      });
    }
  }

  function setupDropdown(btnId, dropdownId, containerId) {
    var btn = document.getElementById(btnId);
    var dropdown = document.getElementById(dropdownId);
    var container = document.getElementById(containerId);

    if (btn && dropdown && container) {
      dropdown.classList.add('dropdown-animated', 'dropdown-closed');
      dropdown.classList.remove('hidden');

      function toggleDropdown(show) {
        var isOpen = dropdown.classList.contains('dropdown-open');
        var willOpen = show !== undefined ? show : !isOpen;
        var arrow = btn.querySelector('#hero-cv-arrow') || btn.querySelector('.dropdown-arrow');
        if (willOpen) {
          dropdown.classList.remove('dropdown-closed');
          dropdown.classList.add('dropdown-open');
          btn.setAttribute('aria-expanded', 'true');
          if (arrow) arrow.classList.add('rotate-180');
        } else {
          dropdown.classList.remove('dropdown-open');
          dropdown.classList.add('dropdown-closed');
          btn.setAttribute('aria-expanded', 'false');
          if (arrow) arrow.classList.remove('rotate-180');
        }
      }

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleDropdown();
      });

      document.addEventListener('click', function (e) {
        if (!container.contains(e.target)) {
          toggleDropdown(false);
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && dropdown.classList.contains('dropdown-open')) {
          toggleDropdown(false);
          btn.focus();
        }
      });
    }
  }

  function setupCopyEmail() {
    var copyBtn = document.getElementById('copy-email-btn');
    var emailText = document.getElementById('email-text');
    var copyIcon = document.getElementById('copy-icon');
    var checkIcon = document.getElementById('check-icon');

    if (copyBtn && emailText && copyIcon && checkIcon) {
      copyBtn.addEventListener('click', function () {
        var textToCopy = emailText.innerText.trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }

        function onSuccess() {
          copyIcon.classList.add('hidden');
          checkIcon.classList.remove('hidden');
          copyBtn.classList.add('text-emerald-400');
          setTimeout(function () {
            checkIcon.classList.add('hidden');
            copyIcon.classList.remove('hidden');
            copyBtn.classList.remove('text-emerald-400');
          }, 2000);
        }

        function fallbackCopy() {
          try {
            var textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            onSuccess();
          } catch (err) {
            // Clipboard failure fallback
          }
        }
      });
    }
  }

  var CHARACTER_SPRITES = [
    './img/character-sprites/idle.png',
    './img/character-sprites/front.png',
    './img/character-sprites/jump.png',
    './img/character-sprites/walk-1.png',
    './img/character-sprites/walk-2.png',
    './img/character-sprites/back.png',
    './img/character-sprites/back-walk-1.png',
    './img/character-sprites/back-walk-2.png'
  ];

  function setupPreloader() {
    var loader = document.getElementById('portfolio-loader');
    if (!loader) {
      window.__portfolioLoaderActive = false;
      return;
    }
    window.__portfolioLoaderActive = true;

    var progressBar = document.getElementById('loader-progress-bar');
    var percentText = document.getElementById('loader-percent');

    // Global persistent sprite cache to prevent garbage collection or texture eviction
    window.__portfolioSpriteCache = window.__portfolioSpriteCache || {};

    // Collect DOM images and prepare sprites
    var domImages = Array.prototype.slice.call(document.querySelectorAll('img[src]'));

    var spriteImages = CHARACTER_SPRITES.map(function (src) {
      if (window.__portfolioSpriteCache[src]) {
        return window.__portfolioSpriteCache[src];
      }
      var img = new Image();
      img.src = src;
      window.__portfolioSpriteCache[src] = img;
      return img;
    });

    var totalItems = domImages.length + spriteImages.length;
    var settledItems = 0;
    var isDone = false;

    function onItemSettled() {
      if (isDone) return;
      settledItems++;
      updateProgress();
      if (settledItems >= totalItems) {
        clearTimeout(fallbackTimeout);
        dismissLoader();
      }
    }

    function updateProgress(force100) {
      if (isDone) return;
      var ratio = force100 ? 1 : (settledItems / Math.max(1, totalItems));
      var percent = Math.min(100, Math.max(15, Math.round(ratio * 100)));
      if (progressBar) {
        progressBar.style.width = percent + '%';
      }
      if (percentText) {
        percentText.textContent = percent + '%';
      }
    }

    function dismissLoader() {
      if (isDone) return;
      isDone = true;
      window.__portfolioLoaderActive = false;
      updateProgress(true);
      if (progressBar) {
        progressBar.style.width = '100%';
      }
      if (percentText) {
        percentText.textContent = '100%';
      }

      setTimeout(function () {
        loader.classList.add('loader-hidden');
        setTimeout(function () {
          loader.style.display = 'none';
          window.__portfolioLoaderActive = false;
        }, 450);
      }, 200);
    }

    // Fallback timeout to guarantee preloader dismissal even on network stall
    var fallbackTimeout = setTimeout(dismissLoader, 2500);

    // Track DOM images
    domImages.forEach(function (img) {
      if (img.complete && img.naturalWidth !== 0) {
        settledItems++;
      } else {
        var onImageSettled = function () {
          img.removeEventListener('load', onImageSettled);
          img.removeEventListener('error', onImageSettled);
          onItemSettled();
        };
        img.addEventListener('load', onImageSettled);
        img.addEventListener('error', onImageSettled);
      }
    });

    // Track and decode character sprites
    spriteImages.forEach(function (spriteImg) {
      if (typeof spriteImg.decode === 'function') {
        spriteImg.decode().then(function () {
          onItemSettled();
        }).catch(function () {
          onItemSettled();
        });
      } else if (spriteImg.complete && spriteImg.naturalWidth !== 0) {
        settledItems++;
      } else {
        var onSpriteSettled = function () {
          spriteImg.removeEventListener('load', onSpriteSettled);
          spriteImg.removeEventListener('error', onSpriteSettled);
          onItemSettled();
        };
        spriteImg.addEventListener('load', onSpriteSettled);
        spriteImg.addEventListener('error', onSpriteSettled);
      }
    });

    updateProgress();

    if (settledItems >= totalItems) {
      clearTimeout(fallbackTimeout);
      dismissLoader();
    } else {
      window.addEventListener('load', function () {
        setTimeout(function () {
          if (!isDone) {
            clearTimeout(fallbackTimeout);
            dismissLoader();
          }
        }, 200);
      }, { once: true });
    }
  }

  function initUI() {
    setupPreloader();
    setupMobileMenu();
    setupDropdown('hero-cv-btn', 'hero-cv-dropdown', 'hero-cv-container');
    setupCopyEmail();
  }

  window.PortfolioUI = {
    init: initUI,
    setupDropdown: setupDropdown,
    setupPreloader: setupPreloader,
    CHARACTER_SPRITES: CHARACTER_SPRITES
  };
})();
