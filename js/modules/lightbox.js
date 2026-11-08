/**
 * Portfolio Image Lightbox & Photo Carousel System
 * Controls responsive photography carousel with swipe support and high-fidelity modal viewer.
 */

(function () {
  'use strict';

  function initPhotoCarousel() {
    var track = document.getElementById('photo-carousel-track');
    var prevBtn = document.getElementById('photo-prev-btn');
    var nextBtn = document.getElementById('photo-next-btn');
    var container = document.getElementById('photo-carousel-container');
    var dotsContainer = document.getElementById('photo-dots-container');
    if (!track || !container) return;

    var totalItems = track.children.length;
    var currentIndex = 0;

    function getVisibleCards() {
      if (window.innerWidth >= 640) return 3;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, totalItems - getVisibleCards());
    }

    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      var max = getMaxIndex();
      for (var i = 0; i <= max; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
          dot.className = 'h-2 rounded-full transition-all ' +
            (idx === currentIndex ? 'bg-cyan-400 w-5' : 'bg-slate-700 hover:bg-slate-500 w-2');
          dot.addEventListener('click', function () {
            goToSlide(idx);
          });
          dotsContainer.appendChild(dot);
        })(i);
      }
    }

    function updateCarousel() {
      var visible = getVisibleCards();
      var max = getMaxIndex();
      if (currentIndex > max) currentIndex = max;
      var firstSlide = track.children[0];
      var slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width : 0;
      track.style.transform = slideWidth > 0 ? 'translateX(-' + (currentIndex * slideWidth) + 'px)' : 'translateX(0)';

      if (dotsContainer) {
        var dots = dotsContainer.children;
        for (var i = 0; i < dots.length; i++) {
          if (i === currentIndex) {
            dots[i].className = 'w-5 h-2 rounded-full bg-cyan-400 transition-all';
          } else {
            dots[i].className = 'w-2 h-2 rounded-full bg-slate-700 hover:bg-slate-500 transition-all';
          }
        }
      }
    }

    function nextSlide() {
      var max = getMaxIndex();
      if (currentIndex >= max) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel();
    }

    function prevSlide() {
      var max = getMaxIndex();
      if (currentIndex <= 0) {
        currentIndex = max;
      } else {
        currentIndex--;
      }
      updateCarousel();
    }

    function goToSlide(idx) {
      currentIndex = idx;
      updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    var touchStartX = 0;
    var touchEndX = 0;
    container.addEventListener('touchstart', function (e) {
      if (e.changedTouches && e.changedTouches[0]) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    container.addEventListener('touchend', function (e) {
      if (e.changedTouches && e.changedTouches[0]) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }
      }
    }, { passive: true });

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        renderDots();
        updateCarousel();
      }, 100);
    });

    renderDots();
    updateCarousel();
  }

  function initImageLightbox() {
    var modal = document.getElementById('image-lightbox-modal');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var closeBtn = document.getElementById('lightbox-close-btn');
    var contentBox = document.getElementById('lightbox-content-box');
    var headerBar = document.getElementById('lightbox-header-bar');
    var locContainer = document.getElementById('lightbox-location-container');
    var locLink = document.getElementById('lightbox-location-link');
    var locText = document.getElementById('lightbox-location-text');

    if (!modal || !lightboxImg || !lightboxCaption) return;

    function openModal(src, captionKey, captionEl, img, locUrl, locKey, locFallback) {
      var isMobile = window.innerWidth < 640;
      var currentLang = document.documentElement.lang || 'en';
      var dict = (typeof I18N !== 'undefined' && I18N[currentLang]) ? I18N[currentLang] : {};

      var finalCaptionKey = captionKey;
      if (isMobile && captionKey && dict[captionKey + '_mobile']) {
        finalCaptionKey = captionKey + '_mobile';
      }

      var caption = '';
      if (finalCaptionKey && dict[finalCaptionKey]) {
        caption = dict[finalCaptionKey];
        lightboxCaption.setAttribute('data-i18n', finalCaptionKey);
      } else if (captionEl) {
        caption = captionEl.textContent.trim();
        if (captionKey) lightboxCaption.setAttribute('data-i18n', captionKey);
        else lightboxCaption.removeAttribute('data-i18n');
      } else {
        caption = img ? (img.getAttribute('alt') || '') : '';
        lightboxCaption.removeAttribute('data-i18n');
      }

      lightboxImg.src = src;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;

      if (locUrl && locContainer && locLink && locText) {
        var finalLocKey = locKey;
        if (isMobile && locKey && dict[locKey + '_mobile']) {
          finalLocKey = locKey + '_mobile';
        }

        var locName = locFallback || '';
        if (finalLocKey && dict[finalLocKey]) {
          locName = dict[finalLocKey];
          locText.setAttribute('data-i18n', finalLocKey);
        } else {
          if (locKey) locText.setAttribute('data-i18n', locKey);
          else locText.removeAttribute('data-i18n');
        }

        locText.textContent = locName;
        locLink.href = locUrl;
        locContainer.classList.remove('hidden');
      } else if (locContainer) {
        locContainer.classList.add('hidden');
        if (locLink) locLink.href = '#';
        if (locText) {
          locText.removeAttribute('data-i18n');
          locText.textContent = '';
        }
      }

      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      setTimeout(function () {
        if (modal.classList.contains('hidden')) {
          lightboxImg.src = '';
          lightboxImg.alt = '';
          lightboxCaption.textContent = '';
          lightboxCaption.removeAttribute('data-i18n');
          if (locContainer) locContainer.classList.add('hidden');
          if (locLink) locLink.href = '#';
          if (locText) {
            locText.removeAttribute('data-i18n');
            locText.textContent = '';
          }
        }
      }, 250);
    }

    var triggers = document.querySelectorAll('.lightbox-trigger');
    triggers.forEach(function (trigger) {
      function handleTrigger() {
        var img = trigger.querySelector('img');
        if (!img) return;
        var src = img.getAttribute('src');
        var captionEl = trigger.querySelector('span[data-i18n]');
        var captionKey = captionEl ? captionEl.getAttribute('data-i18n') : null;
        var locUrl = trigger.getAttribute('data-location-url');
        var locKey = trigger.getAttribute('data-location-key');
        var locFallback = trigger.getAttribute('data-location-name');
        openModal(src, captionKey, captionEl, img, locUrl, locKey, locFallback);
      }

      trigger.addEventListener('click', handleTrigger);
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTrigger();
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeModal();
      });
    }

    if (locLink) {
      locLink.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal || (!e.target.closest('#lightbox-content-box') && !e.target.closest('#lightbox-header-bar') && !e.target.closest('#lightbox-close-btn'))) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    return {
      open: openModal,
      close: closeModal
    };
  }

  function initLightbox() {
    initPhotoCarousel();
    return initImageLightbox();
  }

  window.PortfolioLightbox = {
    init: initLightbox
  };
})();
