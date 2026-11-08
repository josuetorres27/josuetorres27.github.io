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

  function initUI() {
    setupMobileMenu();
    setupDropdown('hero-cv-btn', 'hero-cv-dropdown', 'hero-cv-container');
    setupCopyEmail();
  }

  window.PortfolioUI = {
    init: initUI,
    setupDropdown: setupDropdown
  };
})();
