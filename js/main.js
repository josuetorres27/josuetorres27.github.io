// ================= PORTFOLIO INTERACTIVITY & SYSTEMS =================
    // Adventure Mode Global State
    var isAdventureActive = false;
    var isDialogueDismissed = false;
    var isAfkActive = false;
    var currentAdvLevel = 0;
    var previousAdvLevel = 0;
    var soundEnabled = true;
    var advDialogueTimer = null;
    var audioCtx = null;

    // Toggle Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconOpen = document.getElementById('menu-icon-open');
    const menuIconClose = document.getElementById('menu-icon-close');

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
          mobileMenu.classList.add('hidden');
          menuIconOpen.classList.remove('hidden');
          menuIconClose.classList.add('hidden');
        } else {
          mobileMenu.classList.remove('hidden');
          menuIconOpen.classList.add('hidden');
          menuIconClose.classList.remove('hidden');
        }
      });

      // Close menu on link click
      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          menuIconOpen.classList.remove('hidden');
          menuIconClose.classList.add('hidden');
        });
      });
    }

    // Dropdown Handlers (Desktop Navbar & Hero)
    function setupDropdown(btnId, dropdownId, containerId) {
      const btn = document.getElementById(btnId);
      const dropdown = document.getElementById(dropdownId);
      const container = document.getElementById(containerId);

      if (btn && dropdown && container) {
        dropdown.classList.add('dropdown-animated', 'dropdown-closed');
        dropdown.classList.remove('hidden');

        function toggleDropdown(show) {
          const isOpen = dropdown.classList.contains('dropdown-open');
          const willOpen = show !== undefined ? show : !isOpen;
          const arrow = btn.querySelector('#hero-cv-arrow') || btn.querySelector('.dropdown-arrow');
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

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleDropdown();
        });

        document.addEventListener('click', (e) => {
          if (!container.contains(e.target)) {
            toggleDropdown(false);
          }
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && dropdown.classList.contains('dropdown-open')) {
            toggleDropdown(false);
            btn.focus();
          }
        });
      }
    }

    setupDropdown('hero-cv-btn', 'hero-cv-dropdown', 'hero-cv-container');

    // Copy Email to Clipboard (Swaps icon cleanly without resizing button)
    const copyBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    const copyIcon = document.getElementById('copy-icon');
    const checkIcon = document.getElementById('check-icon');

    if (copyBtn && emailText && copyIcon && checkIcon) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(emailText.innerText.trim());
          copyIcon.classList.add('hidden');
          checkIcon.classList.remove('hidden');
          copyBtn.classList.add('text-emerald-400');
          setTimeout(() => {
            checkIcon.classList.add('hidden');
            copyIcon.classList.remove('hidden');
            copyBtn.classList.remove('text-emerald-400');
          }, 2000);
        } catch (err) {
          console.error('Error al copiar correo:', err);
        }
      });
    }

    // Theme Toggle Functionality
    function updateSoundBtnUI() {
      const muteImg = document.getElementById("dialogue-mute-img");
      if (!muteImg) return;
      const isLight = document.documentElement.classList.contains("light");
      const activeLang = document.documentElement.lang === "es" ? "es" : "en";
      if (!soundEnabled) {
        muteImg.src = isLight ? "./img/icons/sound-off-light.png" : "./img/icons/sound-off-dark.png";
        muteImg.alt = activeLang === "es" ? "Sonido silenciado" : "Sound muted";
      } else {
        muteImg.src = isLight ? "./img/icons/sound-on-light.png" : "./img/icons/sound-on-dark.png";
        muteImg.alt = activeLang === "es" ? "Sonido activado" : "Sound active";
      }
    }

    function updateThemeUI(theme) {
      const isLight = theme === 'light';
      document.querySelectorAll('.theme-icon-sun').forEach(el => el.classList.toggle('hidden', !isLight));
      document.querySelectorAll('.theme-icon-moon').forEach(el => el.classList.toggle('hidden', isLight));
      if (typeof updateSoundBtnUI === 'function') {
        updateSoundBtnUI();
      }
    }

    function toggleTheme() {
      const isLight = document.documentElement.classList.contains('light');
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

    // Attach listeners
    const themeBtnDesktop = document.getElementById('theme-toggle-btn');
    const themeBtnMobile = document.getElementById('theme-toggle-mobile');
    if (themeBtnDesktop) themeBtnDesktop.addEventListener('click', toggleTheme);
    if (themeBtnMobile) themeBtnMobile.addEventListener('click', toggleTheme);

    // Initial theme sync for icons
    updateThemeUI(document.documentElement.classList.contains('light') ? 'light' : 'dark');

// ================= I18N HANDLERS & LOGIC =================
    function applyLanguage(lang) {
      const activeLang = lang === 'es' ? 'es' : 'en';
      const dict = I18N[activeLang];
      document.documentElement.lang = activeLang;

      // Update page title
      if (dict.page_title) {
        document.title = dict.page_title;
      }

      // Update text nodes
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
          el.textContent = dict[key];
        }
      });

      // Update html nodes
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) {
          el.innerHTML = dict[key];
        }
      });

      // Update toggle button styles
      document.querySelectorAll('.lang-switch-btn').forEach(btn => {
        const isMobileBtn = btn.id.endsWith('-m');
        const isEn = btn.id.includes('-en');
        const isSelected = (activeLang === 'en' && isEn) || (activeLang === 'es' && !isEn);
        const sizeClasses = isMobileBtn ? 'w-6 h-full text-[11px]' : 'w-7 h-full text-xs';

        if (isSelected) {
          btn.className = `lang-switch-btn ${sizeClasses} pixel-corners-btn font-mono font-bold transition-all bg-brand-600 text-white shadow-sm flex items-center justify-center leading-none select-none`;
        } else {
          btn.className = `lang-switch-btn ${sizeClasses} pixel-corners-btn font-mono font-bold transition-all text-slate-400 hover:text-white flex items-center justify-center leading-none select-none`;
        }
      });

      localStorage.setItem('portfolio_lang', activeLang);

      // Re-trigger typewriter with active language phrases
      if (dict.hero_phrases) {
        initTypewriter(dict.hero_phrases);
      }

// Update Adventure Mode titles, aria-labels, tooltips, and alts
      const walker = document.getElementById('rail-character-walker');
      if (walker && dict.adv_click_jump) {
        walker.setAttribute('title', dict.adv_click_jump);
      }
      const avatarBtn = document.getElementById('dialogue-avatar-btn');
      if (avatarBtn && dict.adv_click_jump) {
        avatarBtn.setAttribute('title', dict.adv_click_jump);
      }
      const railExitBtn = document.getElementById('rail-exit-btn');
      if (railExitBtn && dict.adv_close_mode) {
        railExitBtn.setAttribute('title', dict.adv_close_mode);
        railExitBtn.querySelectorAll('img').forEach(img => img.alt = dict.adv_close || 'Cerrar');
      }
      const dialogueCloseBtn = document.getElementById('dialogue-close-btn');
      if (dialogueCloseBtn && dict.adv_close_guide) {
        dialogueCloseBtn.setAttribute('title', dict.adv_close_guide);
        dialogueCloseBtn.querySelectorAll('img').forEach(img => img.alt = dict.adv_close || 'Cerrar');
      }
      const dialogueMuteBtn = document.getElementById('dialogue-mute-btn');
      if (dialogueMuteBtn && dict.adv_sound_toggle) {
        dialogueMuteBtn.setAttribute('title', dict.adv_sound_toggle);
      }
      const startAdvBtn = document.getElementById('start-adventure-btn');
      if (startAdvBtn) {
        startAdvBtn.setAttribute('aria-label', activeLang === 'es' ? 'Iniciar Aventura / Iniciar Guía' : 'Start Adventure / Press Start');
      }
      const railEl = document.getElementById('adventure-rail');
      if (railEl) {
        railEl.setAttribute('aria-label', activeLang === 'es' ? 'Mapa de aventura y niveles' : 'Adventure map and levels');
      }
      const dialogueBoxEl = document.getElementById('adventure-dialogue-box');
      if (dialogueBoxEl) {
        dialogueBoxEl.setAttribute('aria-label', activeLang === 'es' ? 'Cuadro de diálogo de la guía' : 'Guide dialogue box');
      }
      if (typeof updateSoundBtnUI === 'function') {
        updateSoundBtnUI();
      }

      // Update rail node tooltips and aria-labels
      const railNodes = document.querySelectorAll('.rail-node');
      railNodes.forEach((node, idx) => {
        if (dict.adv_node_arias && dict.adv_node_arias[idx]) {
          node.setAttribute('aria-label', dict.adv_node_arias[idx]);
        }
        const tooltip = node.querySelector('.rail-tooltip');
        if (tooltip && dict.adv_node_tooltips && dict.adv_node_tooltips[idx]) {
          tooltip.textContent = dict.adv_node_tooltips[idx];
        }
        const icons = node.querySelectorAll('img');
        if (icons.length && dict.adv_node_tooltips && dict.adv_node_tooltips[idx]) {
          const rawLabel = dict.adv_node_tooltips[idx].replace(/^\d+\.\s*/, '');
          icons.forEach(img => img.alt = rawLabel);
        }
      });

      // Sync Adventure Mode if active
      if (typeof isAdventureActive !== 'undefined' && isAdventureActive && typeof updateAdventureUI === 'function') {
        updateAdventureUI();
      }
    }

    // Language toggle event listeners
    const langBtnEn = document.getElementById('lang-btn-en');
    const langBtnEs = document.getElementById('lang-btn-es');
    const langBtnEnM = document.getElementById('lang-btn-en-m');
    const langBtnEsM = document.getElementById('lang-btn-es-m');

    if (langBtnEn) langBtnEn.addEventListener('click', () => applyLanguage('en'));
    if (langBtnEs) langBtnEs.addEventListener('click', () => applyLanguage('es'));
    if (langBtnEnM) langBtnEnM.addEventListener('click', () => applyLanguage('en'));
    if (langBtnEsM) langBtnEsM.addEventListener('click', () => applyLanguage('es'));

    // ================= DYNAMIC TYPEWRITER EFFECT (HERO) =================
    let typewriterTimeout = null;
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let activePhrases = [];

    function escapeTypewriterHtml(str) {
      return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function renderSingleLine(phrase, charCount, withCursor, cursorHtml) {
      if (!phrase) return withCursor ? cursorHtml : '';

      const words = phrase.split(' ');

      if (charCount <= 0) {
        const hidden = words.map((w, idx) => {
          const escaped = escapeTypewriterHtml(w);
          if (idx === 0 && withCursor) {
            return '<span class="inline-block whitespace-nowrap">' + cursorHtml + '<span style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escaped + '</span></span>';
          }
          return '<span class="inline-block whitespace-nowrap" style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escaped + '</span>';
        }).join(' ');
        return hidden;
      }

      if (charCount >= phrase.length) {
        const visible = words.map((w, idx) => {
          const escaped = escapeTypewriterHtml(w);
          if (idx === words.length - 1 && withCursor) {
            return '<span class="inline-block whitespace-nowrap">' + escaped + cursorHtml + '</span>';
          }
          return '<span class="inline-block whitespace-nowrap">' + escaped + '</span>';
        }).join(' ');
        return visible;
      }

      const tokens = [];
      const regex = /(\s+|[^\s]+)/g;
      let match;
      while ((match = regex.exec(phrase)) !== null) {
        tokens.push({
          text: match[0],
          isSpace: /^\s+$/.test(match[0]),
          start: match.index,
          end: match.index + match[0].length
        });
      }

      let html = '';
      let cursorPlaced = false;

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.isSpace) {
          html += token.text;
        } else {
          const wordText = escapeTypewriterHtml(token.text);
          if (charCount >= token.end) {
            let wordHtml = wordText;
            if (withCursor && !cursorPlaced && charCount === token.end) {
              wordHtml += cursorHtml;
              cursorPlaced = true;
            }
            html += '<span class="inline-block whitespace-nowrap">' + wordHtml + '</span>';
          } else if (charCount <= token.start) {
            if (withCursor && !cursorPlaced && charCount <= token.start) {
              html += '<span class="inline-block whitespace-nowrap">' +
                cursorHtml +
                '<span style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + wordText + '</span>' +
              '</span>';
              cursorPlaced = true;
            } else {
              html += '<span class="inline-block whitespace-nowrap" style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + wordText + '</span>';
            }
          } else {
            const typed = token.text.substring(0, charCount - token.start);
            const untyped = token.text.substring(charCount - token.start);
            html += '<span class="inline-block whitespace-nowrap">' +
              '<span>' + escapeTypewriterHtml(typed) + '</span>' +
              (withCursor ? cursorHtml : '') +
              '<span style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escapeTypewriterHtml(untyped) + '</span>' +
            '</span>';
            if (withCursor) cursorPlaced = true;
          }
        }
      }

      if (withCursor && !cursorPlaced) {
        html += cursorHtml;
      }

      return html;
    }

    function renderTypewriter(fullPhrase, charCount) {
      if (!fullPhrase) return '<span class="typewriter-cursor" aria-hidden="true"></span>';
      
      const cursorHtml = '<span class="typewriter-cursor" aria-hidden="true"></span>';
      const lines = fullPhrase.split('\n');

      if (lines.length === 1) {
        return renderSingleLine(lines[0], charCount, true, cursorHtml);
      }

      const line1 = lines[0];
      const line2 = lines[1];

      if (charCount <= line1.length) {
        return renderSingleLine(line1, charCount, true, cursorHtml) + 
               '<br>' + 
               renderSingleLine(line2, 0, false, cursorHtml);
      } else {
        const line2CharCount = Math.max(0, charCount - (line1.length + 1));
        return renderSingleLine(line1, line1.length, false, cursorHtml) + 
               '<br>' + 
               renderSingleLine(line2, line2CharCount, true, cursorHtml);
      }
    }

    function initTypewriter(phrases) {
      if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
        typewriterTimeout = null;
      }
      activePhrases = Array.isArray(phrases) && phrases.length ? phrases : [
        "CS & Software\nEngineering Student"
      ];
      currentPhraseIndex = 0;
      currentCharIndex = 0;
      isDeleting = false;

      const el = document.getElementById('hero-typewriter');
      const cursor = document.getElementById('hero-typewriter-cursor');
      if (!el) return;

      // Standalone cursor hidden because renderTypewriter manages its own smart inline cursor
      if (cursor) cursor.style.display = 'none';

      // Accessibility: respect user preference for reduced motion
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.innerHTML = escapeTypewriterHtml(activePhrases[0]).replace(/\n/g, '<br>');
        return;
      }

      tickTypewriter();
    }

    function tickTypewriter() {
      const el = document.getElementById('hero-typewriter');
      if (!el || !activePhrases.length) return;

      const fullPhrase = activePhrases[currentPhraseIndex % activePhrases.length];

      if (isDeleting) {
        currentCharIndex--;
      } else {
        currentCharIndex++;
      }

      el.innerHTML = renderTypewriter(fullPhrase, currentCharIndex);

      let delta = isDeleting ? 38 : 82;

      if (!isDeleting && currentCharIndex === fullPhrase.length) {
        // Phrase completed: hold for reader (relaxed 3.1s)
        delta = 3100;
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        // Phrase cleared: slight pause before next phrase begins
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % activePhrases.length;
        delta = 500;
      }

      typewriterTimeout = setTimeout(tickTypewriter, delta);
    }

    // Initialize Language (Default to 'en' as requested)
    const initialLang = localStorage.getItem('portfolio_lang') || 'en';
    applyLanguage(initialLang);

    // ================= PHOTOGRAPHY RESPONSIVE CAROUSEL (MANUAL) =================
    function initPhotoCarousel() {
      const track = document.getElementById('photo-carousel-track');
      const prevBtn = document.getElementById('photo-prev-btn');
      const nextBtn = document.getElementById('photo-next-btn');
      const container = document.getElementById('photo-carousel-container');
      const dotsContainer = document.getElementById('photo-dots-container');
      if (!track || !container) return;

      const totalItems = track.children.length; // 4
      let currentIndex = 0;

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
        const max = getMaxIndex();
        for (let i = 0; i <= max; i++) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.className = `h-2 rounded-full transition-all ${
            i === currentIndex ? 'bg-cyan-400 w-5' : 'bg-slate-700 hover:bg-slate-500 w-2'
          }`;
          dot.addEventListener('click', () => {
            goToSlide(i);
          });
          dotsContainer.appendChild(dot);
        }
      }

      function updateCarousel() {
        const visible = getVisibleCards();
        const max = getMaxIndex();
        if (currentIndex > max) currentIndex = max;
        const firstSlide = track.children[0];
        const slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width : 0;
        track.style.transform = slideWidth > 0 ? `translateX(-${currentIndex * slideWidth}px)` : 'translateX(0)';

        if (dotsContainer) {
          const dots = dotsContainer.children;
          for (let i = 0; i < dots.length; i++) {
            if (i === currentIndex) {
              dots[i].className = 'w-5 h-2 rounded-full bg-cyan-400 transition-all';
            } else {
              dots[i].className = 'w-2 h-2 rounded-full bg-slate-700 hover:bg-slate-500 transition-all';
            }
          }
        }
      }

      function nextSlide() {
        const max = getMaxIndex();
        if (currentIndex >= max) {
          currentIndex = 0;
        } else {
          currentIndex++;
        }
        updateCarousel();
      }

      function prevSlide() {
        const max = getMaxIndex();
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

      // Mobile Touch Swipe Support
      let touchStartX = 0;
      let touchEndX = 0;
      container.addEventListener('touchstart', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].screenX;
        }
      }, { passive: true });
      container.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchEndX = e.changedTouches[0].screenX;
          const diff = touchStartX - touchEndX;
          if (Math.abs(diff) > 40) {
            if (diff > 0) nextSlide();
            else prevSlide();
          }
        }
      }, { passive: true });

      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          renderDots();
          updateCarousel();
        }, 100);
      });

      renderDots();
      updateCarousel();
    }

    initPhotoCarousel();

    // ================= IMAGE LIGHTBOX CONTROLLER =================
    function initImageLightbox() {
      const modal = document.getElementById('image-lightbox-modal');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxCaption = document.getElementById('lightbox-caption');
      const closeBtn = document.getElementById('lightbox-close-btn');
      const contentBox = document.getElementById('lightbox-content-box');
      const headerBar = document.getElementById('lightbox-header-bar');
      const locContainer = document.getElementById('lightbox-location-container');
      const locLink = document.getElementById('lightbox-location-link');
      const locText = document.getElementById('lightbox-location-text');

      if (!modal || !lightboxImg || !lightboxCaption) return;

      function openModal(src, captionKey, captionEl, img, locUrl, locKey, locFallback) {
        const isMobile = window.innerWidth < 640;
        const currentLang = document.documentElement.lang || 'en';
        const dict = (typeof I18N !== 'undefined' && I18N[currentLang]) ? I18N[currentLang] : {};

        // Resolve caption: prioritize mobile override if on mobile
        let finalCaptionKey = captionKey;
        if (isMobile && captionKey && dict[captionKey + '_mobile']) {
          finalCaptionKey = captionKey + '_mobile';
        }

        let caption = '';
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

        // Resolve location: prioritize mobile override if on mobile
        if (locUrl && locContainer && locLink && locText) {
          let finalLocKey = locKey;
          if (isMobile && locKey && dict[locKey + '_mobile']) {
            finalLocKey = locKey + '_mobile';
          }

          let locName = locFallback || '';
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
        setTimeout(() => {
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

      const triggers = document.querySelectorAll('.lightbox-trigger');
      triggers.forEach(trigger => {
        function handleTrigger() {
          const img = trigger.querySelector('img');
          if (!img) return;
          const src = img.getAttribute('src');
          const captionEl = trigger.querySelector('span[data-i18n]');
          const captionKey = captionEl ? captionEl.getAttribute('data-i18n') : null;
          const locUrl = trigger.getAttribute('data-location-url');
          const locKey = trigger.getAttribute('data-location-key');
          const locFallback = trigger.getAttribute('data-location-name');
          openModal(src, captionKey, captionEl, img, locUrl, locKey, locFallback);
        }

        trigger.addEventListener('click', handleTrigger);
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTrigger();
          }
        });
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal();
        });
      }

      if (locLink) {
        locLink.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      // Close when clicking outside image & top bar (on the darkened backdrop)
      modal.addEventListener('click', (e) => {
        if (e.target === modal || (!e.target.closest('#lightbox-content-box') && !e.target.closest('#lightbox-header-bar') && !e.target.closest('#lightbox-close-btn'))) {
          closeModal();
        }
      });

      // Close with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          closeModal();
        }
      });
    }

    initImageLightbox();

    // ================= ADVENTURE MODE SYSTEM (SCROLLYTELLING & COMPANION) =================

    function initAudio() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
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
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
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
        // Fallback silently if audio context is blocked
      }
    }

    function renderDialogueTypewriter(fullText, charCount) {
      if (!fullText) return '';
      const words = fullText.split(' ');

      if (charCount <= 0) {
        return words.map(w => 
          '<span class="inline-block whitespace-nowrap" style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escapeTypewriterHtml(w) + '</span>'
        ).join(' ');
      }

      if (charCount >= fullText.length) {
        return escapeTypewriterHtml(fullText);
      }

      const tokens = [];
      const regex = /(\s+|[^\s]+)/g;
      let match;
      while ((match = regex.exec(fullText)) !== null) {
        tokens.push({
          text: match[0],
          isSpace: /^\s+$/.test(match[0]),
          start: match.index,
          end: match.index + match[0].length
        });
      }

      let html = '';
      for (const token of tokens) {
        if (token.isSpace) {
          html += token.text;
        } else {
          if (charCount >= token.end) {
            html += '<span class="inline-block whitespace-nowrap">' + escapeTypewriterHtml(token.text) + '</span>';
          } else if (charCount <= token.start) {
            html += '<span class="inline-block whitespace-nowrap" style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escapeTypewriterHtml(token.text) + '</span>';
          } else {
            const typed = token.text.substring(0, charCount - token.start);
            const untyped = token.text.substring(charCount - token.start);
            html += '<span class="inline-block whitespace-nowrap">' +
              '<span>' + escapeTypewriterHtml(typed) + '</span>' +
              '<span style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escapeTypewriterHtml(untyped) + '</span>' +
            '</span>';
          }
        }
      }
      return html;
    }

    function typeAdventureDialogue(text, onComplete) {
      const dialogueTextEl = document.getElementById('dialogue-text');
      const avatarSprite = document.getElementById('dialogue-avatar-sprite');
      if (!dialogueTextEl) return;
      if (advDialogueTimer) {
        clearTimeout(advDialogueTimer);
        advDialogueTimer = null;
      }
      if (avatarSprite) {
        avatarSprite.src = './img/character-sprites/front.png';
      }
      dialogueTextEl.innerHTML = '';
      let idx = 0;
      function tick() {
        if (idx < text.length) {
          let step = 1;
          const code = text.charCodeAt(idx);
          if (code >= 0xD800 && code <= 0xDBFF) {
            step = 2;
          }
          idx += step;
          dialogueTextEl.innerHTML = renderDialogueTypewriter(text, idx);
          if (idx % 3 === 0 && text[idx - 1] !== ' ') {
            playRetroSound('blip');
          }
          advDialogueTimer = setTimeout(tick, 22);
        } else {
          dialogueTextEl.innerHTML = escapeTypewriterHtml(text);
          advDialogueTimer = null;
          if (onComplete) onComplete();
        }
      }
      tick();
    }

        let walkerAnimInterval = null;

    function updateAdventureContentShift(enable) {
      const stageWrapper = document.getElementById('adventure-stage-wrapper');
      if (!stageWrapper) return;

      if (!enable || window.innerWidth < 640) {
        document.body.classList.remove('adventure-stage-shifted');
        stageWrapper.style.left = '0px';
        return;
      }

      // Calculate free space on the left of main content container
      const container = document.querySelector('#hero .max-w-6xl') || document.querySelector('section .max-w-6xl');
      let freeLeft = 0;
      if (container) {
        const currentLeft = parseFloat(stageWrapper.style.left) || 0;
        const rect = container.getBoundingClientRect();
        freeLeft = rect.left - currentLeft;
      } else {
        freeLeft = Math.max(0, (window.innerWidth - 1152) / 2);
      }

      // Generous left shift giving the enlarged rail and companion ample breathing room on the right
      let shift = 50;
      if (freeLeft > 140) {
        // Wide desktop screens (1440px - 1920px+): shift 85px to 140px smoothly
        shift = Math.min(Math.max(85, Math.floor(freeLeft * 0.65)), 140);
      } else if (freeLeft > 70) {
        // Medium desktop screens (1280px - 1440px): shift 50px to 85px
        shift = Math.min(Math.max(50, Math.floor(freeLeft * 0.65)), 85);
      } else if (freeLeft > 35) {
        // Smaller laptop / tablet screens: safe shift without clipping container
        shift = Math.max(24, Math.floor(freeLeft * 0.55));
      } else {
        shift = 0;
      }

      document.documentElement.style.setProperty('--adv-content-shift', shift + 'px');
      stageWrapper.style.left = '-' + shift + 'px';
      document.body.classList.add('adventure-stage-shifted');
    }

    let walkerIdleTimeout = null;
    let isProgrammaticScroll = false;
    let programmaticScrollTimeout = null;

    function updateAdventureUI(skipWalkerAnim = false) {
      if (isDialogueDismissed) {
        showDialogueBox();
      }
      const activeLang = document.documentElement.lang === 'es' ? 'es' : 'en';
      const dict = I18N[activeLang];
      const stageLabels = dict.adv_stage_labels || [];
      const stageLabelEl = document.getElementById('dialogue-stage-label');
      if (stageLabelEl && stageLabels[currentAdvLevel]) {
        stageLabelEl.textContent = stageLabels[currentAdvLevel];
      }

      if (isAfkActive) {
        typeAdventureDialogue(dict.adv_afk || '');
      } else {
        const textKey = 'adv_lvl_' + currentAdvLevel;
        const text = dict[textKey] || '';
        typeAdventureDialogue(text);
      }

      // Update level nodes on rail
      const railNodes = document.querySelectorAll('.rail-node');
      railNodes.forEach((node, idx) => {
        const isCurrent = idx === currentAdvLevel;
        if (isCurrent) {
          node.className = 'rail-node group relative z-10 w-8 h-8 sm:w-9 sm:h-9 pixel-corners-sm flex items-center justify-center text-xs sm:text-sm font-mono font-bold transition-all bg-brand-600 text-white border-2 border-brand-400 shadow-lg shadow-brand-500/40 scale-110';
        } else {
          node.className = 'rail-node group relative z-10 w-8 h-8 sm:w-9 sm:h-9 pixel-corners-sm flex items-center justify-center text-xs sm:text-sm font-mono font-bold transition-all bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-brand-500 active:scale-95';
        }
      });

      // Move walker and cyan indicator on rail
      const targetNode = railNodes[currentAdvLevel];
      const walker = document.getElementById('rail-character-walker');
      const walkerSprite = document.getElementById('rail-character-sprite');
      const indicator = document.getElementById('rail-active-indicator');
      const railWrapper = document.getElementById('adventure-rail-wrapper');

      if (targetNode && railWrapper) {
        const targetRect = targetNode.getBoundingClientRect();
        const wrapperRect = railWrapper.getBoundingClientRect();
        const nodeCenterY = (targetRect.top - wrapperRect.top) + (targetRect.height / 2);

        // Center walker vertically with target node
        if (walker) {
          const walkerH = walker.offsetHeight || 80;
          walker.style.top = Math.round(nodeCenterY - walkerH / 2) + 'px';
        }

        // Center cyan indicator right on the container line vertically with the target node
        if (indicator) {
          const indH = indicator.offsetHeight || 10;
          indicator.style.top = Math.round(nodeCenterY - indH / 2) + 'px';
        }

        if (walkerSprite && !skipWalkerAnim) {
          if (walkerAnimInterval) {
            clearInterval(walkerAnimInterval);
            walkerAnimInterval = null;
          }
          if (walkerIdleTimeout) {
            clearTimeout(walkerIdleTimeout);
            walkerIdleTimeout = null;
          }
        
          const isMovingUp = currentAdvLevel < previousAdvLevel;
          const walkFrame1 = isMovingUp ? './img/character-sprites/back-walk-1.png' : './img/character-sprites/walk-1.png';
          const walkFrame2 = isMovingUp ? './img/character-sprites/back-walk-2.png' : './img/character-sprites/walk-2.png';
          const idleFrame = isMovingUp ? './img/character-sprites/back.png' : './img/character-sprites/idle.png';

          let step = 0;
          walkerAnimInterval = setInterval(() => {
            step++;
            walkerSprite.src = (step % 2 === 1) ? walkFrame1 : walkFrame2;
          }, 110);

          walkerIdleTimeout = setTimeout(() => {
            if (walkerAnimInterval) {
              clearInterval(walkerAnimInterval);
              walkerAnimInterval = null;
            }
            if (walkerSprite) {
              walkerSprite.src = idleFrame;
              if (isMovingUp) {
                walkerIdleTimeout = setTimeout(() => {
                  if (!walkerAnimInterval && walkerSprite) {
                    walkerSprite.src = './img/character-sprites/idle.png';
                  }
                }, 220);
              }
            }
          }, 460);
        }
      }
      previousAdvLevel = currentAdvLevel;
    }

    function initAdventureMode() {
      const startBtn = document.getElementById('start-adventure-btn');
      const rail = document.getElementById('adventure-rail');
      const dialogueBox = document.getElementById('adventure-dialogue-box');
      const flyingSprite = document.getElementById('flying-pixel-sprite');
      const photoCard = document.getElementById('hero-photo-card');
      const avatarBtn = document.getElementById('dialogue-avatar-btn');
      const avatarSprite = document.getElementById('dialogue-avatar-sprite');
      const muteBtns = [document.getElementById('dialogue-mute-btn')].filter(Boolean);
      const railExitBtn = document.getElementById('rail-exit-btn');
      const dialogueCloseBtn = document.getElementById('dialogue-close-btn');
      const railNodes = document.querySelectorAll('.rail-node');
      const sectionIds = ['#hero', '#about', '#experience', '#education', '#skills', '#projects', '#ai', '#interests', '#contact'];

      if (!startBtn || !rail || !dialogueBox || !photoCard) return;

      function showDialogueBox() {
        if (!dialogueBox) return;
        isDialogueDismissed = false;
        dialogueBox.classList.remove('hidden', 'pointer-events-none');
        dialogueBox.classList.add('flex');
        dialogueBox.classList.add('opacity-0', 'translate-x-full');
        dialogueBox.classList.remove('opacity-100', 'translate-x-0');

        // Force browser layout reflow so the transition is guaranteed to animate!
        void dialogueBox.offsetHeight;

        requestAnimationFrame(() => {
          dialogueBox.classList.remove('opacity-0', 'translate-x-full');
          dialogueBox.classList.add('opacity-100', 'translate-x-0');
        });
      }

      function hideDialogueBox() {
        if (!dialogueBox) return;
        isDialogueDismissed = true;
        dialogueBox.classList.remove('opacity-100', 'translate-x-0');
        dialogueBox.classList.add('opacity-0', 'translate-x-full', 'pointer-events-none');
        if (advDialogueTimer) {
          clearTimeout(advDialogueTimer);
          advDialogueTimer = null;
        }
        setTimeout(() => {
          if (isDialogueDismissed) {
            dialogueBox.classList.add('hidden');
            dialogueBox.classList.remove('flex');
          }
        }, 450);
      }

      let afkTimer = null;
      function resetAfkTimer() {
        if (afkTimer) clearTimeout(afkTimer);
        isAfkActive = false;
        if (!isAdventureActive) return;
        afkTimer = setTimeout(() => {
          if (!isAdventureActive) return;
          isAfkActive = true;
          if (isDialogueDismissed) {
            showDialogueBox();
          }
          const activeLang = document.documentElement.lang === 'es' ? 'es' : 'en';
          const dict = I18N[activeLang];
          const afkText = dict.adv_afk || '';
          if (avatarSprite) {
            avatarSprite.src = './img/character-sprites/front.png';
            avatarSprite.classList.add('-translate-y-2');
            setTimeout(() => avatarSprite.classList.remove('-translate-y-2'), 400);
          }
          playRetroSound('blip');
          typeAdventureDialogue(afkText);
        }, 90000);
      }

      function startAdventure(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        // Focus and center the hero photo card so the portal animation is fully visible across all formats
        const photoTarget = document.getElementById('hero-photo-wrapper') || document.getElementById('hero-photo-card') || document.querySelector('#hero');
        if (photoTarget) {
          const rect = photoTarget.getBoundingClientRect();
          const targetY = Math.max(0, Math.round(window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2)));
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }

        if (isAdventureActive) {
          playRetroSound('coin');
          return;
        }

        isAdventureActive = true;
        isDialogueDismissed = false;
        isAfkActive = false;
        currentAdvLevel = 0;
        previousAdvLevel = 0;

        const walker = document.getElementById('rail-character-walker');
        const indicator = document.getElementById('rail-active-indicator');
        const walkerSprite = document.getElementById('rail-character-sprite');
        const heroImg = document.getElementById('hero-profile-img');
        const portalOverlay = document.getElementById('hero-portal-overlay');
        const portalSpriteWrap = document.getElementById('hero-portal-sprite-wrap');
        const portalSprite = document.getElementById('hero-portal-sprite');

        if (walker) {
          walker.classList.add('opacity-0');
        }
        if (indicator) {
          indicator.style.top = '0px';
          indicator.classList.add('opacity-0');
        }
        if (walkerSprite) {
          walkerSprite.src = './img/character-sprites/walk-1.png';
        }

        // 1. Photo portal blur & Big character spawn
        if (heroImg) {
          heroImg.classList.remove('blur-0', 'scale-100', 'opacity-100');
          heroImg.classList.add('blur-md', 'scale-95', 'opacity-25');
        }
        if (portalOverlay) {
          portalOverlay.classList.remove('hidden');
          portalOverlay.classList.add('opacity-0');
          void portalOverlay.offsetHeight;
          requestAnimationFrame(() => {
            portalOverlay.classList.remove('opacity-0');
            portalOverlay.classList.add('opacity-100');
          });
        }

        if (portalSpriteWrap && portalSprite) {
          // STEP 1: Appear standing with front sprite at center
          portalSprite.src = './img/character-sprites/front.png';
          portalSprite.style.transition = 'none';
          portalSprite.style.transform = 'translateY(0px) scale(1, 1)';
          portalSpriteWrap.classList.remove('opacity-0', 'hidden');
          portalSpriteWrap.classList.add('opacity-100');

          // Phase A: Stand briefly (350ms), then jump!
          setTimeout(() => {
            playRetroSound('jump');
            portalSprite.src = './img/character-sprites/jump.png';
            portalSprite.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2)';
            portalSprite.style.transform = 'translateY(-48px)';

            // Phase B: Jump apex -> Land back in center (0.45s)
            setTimeout(() => {
              portalSprite.style.transition = 'transform 0.35s ease-in';
              portalSprite.style.transform = 'translateY(0px)';

              // Phase C: Landing impact (0.35s)
              setTimeout(() => {
                portalSprite.src = './img/character-sprites/front.png';
                playRetroSound('coin');
                portalSprite.style.transition = 'transform 0.18s ease-out';
                portalSprite.style.transform = 'scale(1.08, 0.92)';

                setTimeout(() => {
                  portalSprite.style.transform = 'scale(1, 1)';
                }, 180);

                // Phase D: Short proud pause, then begin walking towards bottom of photo frame (450ms)
                setTimeout(() => {
                  portalSprite.style.transition = 'transform 1.25s linear';
                  portalSprite.style.transform = 'translateY(280px)';

                  let portalStep = 0;
                  const portalWalkInterval = setInterval(() => {
                    portalStep++;
                    portalSprite.src = (portalStep % 2 === 1) ? './img/character-sprites/walk-1.png' : './img/character-sprites/walk-2.png';
                  }, 120);

                  // Phase E: Fully crossed bottom border into portal (1.25s)
                  setTimeout(() => {
                    clearInterval(portalWalkInterval);

                    // Completely fade and hide the portal overlay & big sprite
                    portalSpriteWrap.classList.remove('opacity-100');
                    portalSpriteWrap.classList.add('opacity-0');
                    if (portalOverlay) {
                      portalOverlay.classList.remove('opacity-100');
                      portalOverlay.classList.add('opacity-0');
                    }

                    // Restore photo to 100% normal crisp clarity!
                    if (heroImg) {
                      heroImg.classList.remove('blur-md', 'blur-sm', 'scale-95', 'opacity-25', 'opacity-35');
                      heroImg.classList.add('blur-0', 'scale-100', 'opacity-100');
                    }

                    // Clean up sprite transform after fadeout finishes
                    setTimeout(() => {
                      portalSpriteWrap.classList.add('hidden');
                      if (portalOverlay) portalOverlay.classList.add('hidden');
                      portalSprite.style.transition = '';
                      portalSprite.style.transform = 'translateY(0px)';
                    }, 300);

                    // 2. Open map & emerge from below header walking down to Level 0
                    updateAdventureContentShift(true);
                    const isMobile = window.innerWidth < 640;
                    if (!isMobile) {
                      rail.classList.remove('hidden', 'pointer-events-none');
                      rail.classList.add('flex');
                      requestAnimationFrame(() => {
                        rail.classList.remove('opacity-0', 'translate-x-48');
                        rail.classList.add('opacity-100', 'translate-x-0');
                      });
                    }

                    if (walker && walkerSprite) {
                      // Calculate starting position just below header navbar & target Level 0 checkpoint
                      let startTop = -180;
                      let targetLevel0Top = 12;
                      const headerEl = document.querySelector('header');
                      const wrapperEl = document.getElementById('adventure-rail-wrapper');
                      const node0 = document.querySelector('.rail-node[data-level="0"]');

                      if (wrapperEl) {
                        const wrapperRect = wrapperEl.getBoundingClientRect();
                        if (headerEl) {
                          const headerBottom = headerEl.getBoundingClientRect().bottom;
                          startTop = Math.round((headerBottom + 8) - wrapperRect.top);
                          if (startTop > -120) startTop = -180;
                        }
                        if (node0) {
                          const node0Rect = node0.getBoundingClientRect();
                          const nodeCenterY = (node0Rect.top - wrapperRect.top) + (node0Rect.height / 2);
                          const walkerH = walker.offsetHeight || 80;
                          targetLevel0Top = Math.round(nodeCenterY - walkerH / 2);
                        }
                      }

                      walker.style.transition = 'none';
                      walker.style.top = startTop + 'px';
                      walkerSprite.src = './img/character-sprites/walk-1.png';
                      walker.classList.remove('opacity-0');

                      // Force reflow before starting smooth downward walk
                      void walker.offsetHeight;

                      // Walk downwards from under header straight to Level 0 checkpoint
                      const walkDurationMs = 850;
                      walker.style.transition = `top ${walkDurationMs}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
                      walker.style.top = targetLevel0Top + 'px';

                      let railStep = 0;
                      const railWalkInterval = setInterval(() => {
                        railStep++;
                        walkerSprite.src = (railStep % 2 === 1) ? './img/character-sprites/walk-1.png' : './img/character-sprites/walk-2.png';
                      }, 110);

                      setTimeout(() => {
                        clearInterval(railWalkInterval);
                        walker.style.transition = '';
                        walkerSprite.src = './img/character-sprites/jump.png';
                        walker.classList.add('-translate-y-2');
                        playRetroSound('coin');

                        setTimeout(() => {
                          walker.classList.remove('-translate-y-2');
                          walkerSprite.src = './img/character-sprites/idle.png';
                        }, 250);

                        if (indicator) indicator.classList.remove('opacity-0');

                        showDialogueBox();
                        if (avatarSprite) {
                          avatarSprite.classList.add('-translate-y-3');
                          avatarSprite.src = './img/character-sprites/jump.png';
                          setTimeout(() => {
                            avatarSprite.classList.remove('-translate-y-3');
                            avatarSprite.src = './img/character-sprites/front.png';
                          }, 450);
                        }

                        currentAdvLevel = 0;
                        previousAdvLevel = 0;
                        updateAdventureUI(true);
                        resetAfkTimer();
                      }, walkDurationMs);
                    }
                  }, 1250);
                }, 450);
              }, 350);
            }, 450);
          }, 350);
        } else {
          // Fallback
          updateAdventureContentShift(true);
          const isMobile = window.innerWidth < 640;
          if (!isMobile) {
            rail.classList.remove('hidden', 'pointer-events-none');
            rail.classList.add('flex');
            rail.classList.remove('opacity-0', 'translate-x-48');
            rail.classList.add('opacity-100', 'translate-x-0');
          }
          if (walker) walker.classList.remove('opacity-0');
          if (indicator) indicator.classList.remove('opacity-0');
          showDialogueBox();
          currentAdvLevel = 0;
          updateAdventureUI();
          resetAfkTimer();
        }
      }

      function closeAdventure(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (!isAdventureActive) return;
        isAdventureActive = false;
        isDialogueDismissed = false;
        isAfkActive = false;
        playRetroSound('exit');

        // Reset level state back to 0 completely
        currentAdvLevel = 0;
        previousAdvLevel = 0;

        // Reset photo portal states completely
        const heroImg = document.getElementById('hero-profile-img');
        const portalOverlay = document.getElementById('hero-portal-overlay');
        const portalSpriteWrap = document.getElementById('hero-portal-sprite-wrap');
        const portalSprite = document.getElementById('hero-portal-sprite');
        if (heroImg) {
          heroImg.classList.remove('blur-md', 'blur-sm', 'scale-95', 'opacity-25', 'opacity-35');
          heroImg.classList.add('blur-0', 'scale-100', 'opacity-100');
        }
        if (portalOverlay) {
          portalOverlay.classList.remove('opacity-100');
          portalOverlay.classList.add('opacity-0', 'hidden');
        }
        if (portalSpriteWrap) {
          portalSpriteWrap.classList.remove('opacity-100');
          portalSpriteWrap.classList.add('opacity-0', 'hidden');
        }
        if (portalSprite) {
          portalSprite.style.transition = '';
          portalSprite.style.transform = 'translateY(0px)';
        }

        // Return page content smoothly back to center
        updateAdventureContentShift(false);

        if (afkTimer) {
          clearTimeout(afkTimer);
          afkTimer = null;
        }

        rail.classList.remove('opacity-100', 'translate-x-0');
        rail.classList.add('opacity-0', 'translate-x-48', 'pointer-events-none');
        hideDialogueBox();

        // Reset walker & indicator positions and hide walker so reopening starts clean from 0
        const walker = document.getElementById('rail-character-walker');
        const indicator = document.getElementById('rail-active-indicator');
        const walkerSprite = document.getElementById('rail-character-sprite');
        if (walker) {
          walker.style.top = '0px';
          walker.classList.add('opacity-0');
        }
        if (indicator) {
          indicator.style.top = '0px';
        }
        if (walkerSprite) {
          walkerSprite.src = './img/character-sprites/idle.png';
        }

        // Reset rail nodes to level 0 active
        railNodes.forEach((node, idx) => {
          if (idx === 0) {
            node.className = 'rail-node group relative z-10 w-8 h-8 sm:w-9 sm:h-9 pixel-corners-sm flex items-center justify-center text-xs sm:text-sm font-mono font-bold transition-all bg-brand-600 text-white border-2 border-brand-400 shadow-lg shadow-brand-500/40 scale-110';
          } else {
            node.className = 'rail-node group relative z-10 w-8 h-8 sm:w-9 sm:h-9 pixel-corners-sm flex items-center justify-center text-xs sm:text-sm font-mono font-bold transition-all bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-brand-500 active:scale-95';
          }
        });

        setTimeout(() => {
          rail.classList.add('hidden');
          rail.classList.remove('flex');
          if (advDialogueTimer) {
            clearTimeout(advDialogueTimer);
            advDialogueTimer = null;
          }
        }, 450);
      }

      startBtn.addEventListener('click', startAdventure);
      startBtn.addEventListener('touchend', startAdventure);

      function dismissDialogue(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (window.innerWidth < 640) {
          closeAdventure(e);
          return;
        }
        playRetroSound('exit');
        hideDialogueBox();
      }

      if (railExitBtn) {
        railExitBtn.addEventListener('click', closeAdventure);
        railExitBtn.addEventListener('touchend', closeAdventure);
      }

      if (dialogueCloseBtn) {
        dialogueCloseBtn.addEventListener('click', dismissDialogue);
        dialogueCloseBtn.addEventListener('touchend', dismissDialogue);
      }

      // Sound toggle
      function toggleSound(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        soundEnabled = !soundEnabled;
        updateSoundBtnUI();
        if (soundEnabled) playRetroSound("blip");
      }

      muteBtns.forEach(btn => {
        if (btn) {
          btn.addEventListener('click', toggleSound);
          btn.addEventListener('touchend', toggleSound);
        }
      });

      // Interactive avatar click (Jump & Emote)
      if (avatarBtn) {
        avatarBtn.addEventListener('click', (e) => {
          if (e) e.stopPropagation();
          resetAfkTimer();
          playRetroSound('jump');
          if (avatarSprite) {
            avatarSprite.classList.add('-translate-y-3');
            avatarSprite.src = './img/character-sprites/jump.png';
            setTimeout(() => {
              avatarSprite.classList.remove('-translate-y-3');
              avatarSprite.src = './img/character-sprites/front.png';
            }, 450);
          }
        });
      }

      // Rail nodes click
      railNodes.forEach((node, idx) => {
        node.addEventListener('click', () => {
          resetAfkTimer();
          if (isDialogueDismissed) {
            showDialogueBox();
          }
          const targetId = sectionIds[idx];
          const targetEl = targetId ? document.querySelector(targetId) : null;
          
          if (currentAdvLevel !== idx) {
            isProgrammaticScroll = true;
            if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);
            // Safety timeout in case the page is already at target and no scroll event fires
            programmaticScrollTimeout = setTimeout(() => {
              isProgrammaticScroll = false;
            }, 600);
            currentAdvLevel = idx;
            playRetroSound('jump');
            updateAdventureUI();
          }

          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

      // User manual scroll interrupts programmatic lock
      const releaseProgrammaticScroll = () => {
        if (isProgrammaticScroll) {
          isProgrammaticScroll = false;
          if (programmaticScrollTimeout) {
            clearTimeout(programmaticScrollTimeout);
            programmaticScrollTimeout = null;
          }
        }
      };
      window.addEventListener('wheel', releaseProgrammaticScroll, { passive: true });
      window.addEventListener('touchmove', releaseProgrammaticScroll, { passive: true });

      // Scroll listener to update active stage
      let isScrollingThrottle = false;
      window.addEventListener('scroll', () => {
        if (!isAdventureActive) return;
        resetAfkTimer();

        // While programmatic travel is active, continually postpone release until smooth scroll has completely stopped!
        if (isProgrammaticScroll) {
          if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);
          programmaticScrollTimeout = setTimeout(() => {
            isProgrammaticScroll = false;
          }, 200);
          return;
        }

        if (isScrollingThrottle) return;
        isScrollingThrottle = true;

        requestAnimationFrame(() => {
          const sections = sectionIds.map(id => document.querySelector(id));
          const viewportCheck = window.innerHeight * 0.38;
          let bestIdx = 0;
          let minDiff = Infinity;

          const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
          if (isAtBottom) {
            bestIdx = sections.length - 1;
          } else if (window.scrollY <= 80) {
            bestIdx = 0;
          } else {
            sections.forEach((sec, idx) => {
              if (!sec) return;
              const rect = sec.getBoundingClientRect();
              const diff = Math.abs(rect.top - viewportCheck);
              if (rect.top <= viewportCheck + 80 && diff < minDiff) {
                minDiff = diff;
                bestIdx = idx;
              }
            });
          }

          if (bestIdx !== currentAdvLevel) {
            currentAdvLevel = bestIdx;
            playRetroSound('level');
            if (isDialogueDismissed) {
              showDialogueBox();
            }
            updateAdventureUI();
          }

          isScrollingThrottle = false;
        });
      }, { passive: true });

      window.addEventListener('scrollend', () => {
        if (programmaticScrollTimeout) {
          clearTimeout(programmaticScrollTimeout);
          programmaticScrollTimeout = null;
        }
        isProgrammaticScroll = false;
      });

      // Interactive walker on rail click (Jump & Sound)
      const railWalker = document.getElementById('rail-character-walker');
      if (railWalker) {
        railWalker.addEventListener('click', (e) => {
          if (e) e.stopPropagation();
          resetAfkTimer();
          playRetroSound('jump');
          if (isDialogueDismissed) {
            showDialogueBox();
            updateAdventureUI();
          }
          const walkerSprite = document.getElementById('rail-character-sprite');
          if (walkerSprite) {
            walkerSprite.src = './img/character-sprites/jump.png';
            railWalker.classList.add('-translate-y-3');
            setTimeout(() => {
              railWalker.classList.remove('-translate-y-3');
              walkerSprite.src = './img/character-sprites/idle.png';
            }, 400);
          }
        });
      }

      // Responsive rail toggle on window resize
      window.addEventListener('resize', () => {
        if (!isAdventureActive) return;
        const mobileNow = window.innerWidth < 640;
        if (mobileNow) {
          rail.classList.add('hidden', 'pointer-events-none');
          rail.classList.remove('flex');
        } else {
          rail.classList.remove('hidden', 'pointer-events-none');
          rail.classList.add('flex', 'opacity-100', 'translate-x-0');
        }
      });
    }
    initAdventureMode();
