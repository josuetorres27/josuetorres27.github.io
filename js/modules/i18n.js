/**
 * Portfolio Internationalization (i18n) & Typewriter System
 * Handles bilingual switching (EN/ES), DOM text/HTML updates, aria labels,
 * and the responsive typewriter effect in the hero section.
 */

(function () {
  'use strict';

  var typewriterTimeout = null;
  var currentPhraseIndex = 0;
  var currentCharIndex = 0;
  var isDeleting = false;
  var activePhrases = [];

  function escapeTypewriterHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderSingleLine(phrase, charCount, withCursor, cursorHtml) {
    if (!phrase) return withCursor ? cursorHtml : '';

    var words = phrase.split(' ');

    if (charCount <= 0) {
      return words.map(function (w, idx) {
        var escaped = escapeTypewriterHtml(w);
        if (idx === 0 && withCursor) {
          return '<span class="inline-block whitespace-nowrap">' + cursorHtml + '<span style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escaped + '</span></span>';
        }
        return '<span class="inline-block whitespace-nowrap" style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escaped + '</span>';
      }).join(' ');
    }

    if (charCount >= phrase.length) {
      return words.map(function (w, idx) {
        var escaped = escapeTypewriterHtml(w);
        if (idx === words.length - 1 && withCursor) {
          return '<span class="inline-block whitespace-nowrap">' + escaped + cursorHtml + '</span>';
        }
        return '<span class="inline-block whitespace-nowrap">' + escaped + '</span>';
      }).join(' ');
    }

    var tokens = [];
    var regex = /(\s+|[^\s]+)/g;
    var match;
    while ((match = regex.exec(phrase)) !== null) {
      tokens.push({
        text: match[0],
        isSpace: /^\s+$/.test(match[0]),
        start: match.index,
        end: match.index + match[0].length
      });
    }

    var html = '';
    var cursorPlaced = false;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.isSpace) {
        html += token.text;
      } else {
        var wordText = escapeTypewriterHtml(token.text);
        if (charCount >= token.end) {
          var wordHtml = wordText;
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
          var typed = token.text.substring(0, charCount - token.start);
          var untyped = token.text.substring(charCount - token.start);
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

    var cursorHtml = '<span class="typewriter-cursor" aria-hidden="true"></span>';
    var lines = fullPhrase.split('\n');

    if (lines.length === 1) {
      return renderSingleLine(lines[0], charCount, true, cursorHtml);
    }

    var line1 = lines[0];
    var line2 = lines[1];

    if (charCount <= line1.length) {
      return renderSingleLine(line1, charCount, true, cursorHtml) +
             '<br>' +
             renderSingleLine(line2, 0, false, cursorHtml);
    } else {
      var line2CharCount = Math.max(0, charCount - (line1.length + 1));
      return renderSingleLine(line1, line1.length, false, cursorHtml) +
             '<br>' +
             renderSingleLine(line2, line2CharCount, true, cursorHtml);
    }
  }

  function tickTypewriter() {
    var el = document.getElementById('hero-typewriter');
    if (!el || !activePhrases.length) return;

    var fullPhrase = activePhrases[currentPhraseIndex % activePhrases.length];

    if (isDeleting) {
      currentCharIndex--;
    } else {
      currentCharIndex++;
    }

    el.innerHTML = renderTypewriter(fullPhrase, currentCharIndex);

    var delta = isDeleting ? 38 : 82;

    if (!isDeleting && currentCharIndex === fullPhrase.length) {
      delta = 3100;
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % activePhrases.length;
      delta = 500;
    }

    typewriterTimeout = setTimeout(tickTypewriter, delta);
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

    var el = document.getElementById('hero-typewriter');
    var cursor = document.getElementById('hero-typewriter-cursor');
    if (!el) return;

    if (cursor) cursor.style.display = 'none';

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.innerHTML = escapeTypewriterHtml(activePhrases[0]).replace(/\n/g, '<br>');
      return;
    }

    tickTypewriter();
  }

  function applyLanguage(lang) {
    var activeLang = lang === 'es' ? 'es' : 'en';
    if (typeof I18N === 'undefined' || !I18N[activeLang]) return;
    var dict = I18N[activeLang];
    document.documentElement.lang = activeLang;

    if (dict.page_title) {
      document.title = dict.page_title;
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll('.lang-switch-btn').forEach(function (btn) {
      var isMobileBtn = btn.id.endsWith('-m');
      var isEn = btn.id.includes('-en');
      var isSelected = (activeLang === 'en' && isEn) || (activeLang === 'es' && !isEn);
      var sizeClasses = isMobileBtn ? 'w-6 h-full text-[11px]' : 'w-7 h-full text-xs';

      if (isSelected) {
        btn.className = 'lang-switch-btn ' + sizeClasses + ' pixel-corners-btn font-mono font-bold transition-all bg-brand-600 text-white shadow-sm flex items-center justify-center leading-none select-none';
      } else {
        btn.className = 'lang-switch-btn ' + sizeClasses + ' pixel-corners-btn font-mono font-bold transition-all text-slate-400 hover:text-white flex items-center justify-center leading-none select-none';
      }
    });

    localStorage.setItem('portfolio_lang', activeLang);

    if (dict.hero_phrases) {
      initTypewriter(dict.hero_phrases);
    }

    var walker = document.getElementById('rail-character-walker');
    if (walker && dict.adv_click_jump) {
      walker.setAttribute('title', dict.adv_click_jump);
    }
    var avatarBtn = document.getElementById('dialogue-avatar-btn');
    if (avatarBtn && dict.adv_click_jump) {
      avatarBtn.setAttribute('title', dict.adv_click_jump);
    }
    var railExitBtn = document.getElementById('rail-exit-btn');
    if (railExitBtn && dict.adv_close_mode) {
      railExitBtn.setAttribute('title', dict.adv_close_mode);
      railExitBtn.querySelectorAll('img').forEach(function (img) {
        img.alt = dict.adv_close || 'Cerrar';
      });
    }
    var dialogueCloseBtn = document.getElementById('dialogue-close-btn');
    if (dialogueCloseBtn && dict.adv_close_guide) {
      dialogueCloseBtn.setAttribute('title', dict.adv_close_guide);
      dialogueCloseBtn.querySelectorAll('img').forEach(function (img) {
        img.alt = dict.adv_close || 'Cerrar';
      });
    }
    var dialogueMuteBtn = document.getElementById('dialogue-mute-btn');
    if (dialogueMuteBtn && dict.adv_sound_toggle) {
      dialogueMuteBtn.setAttribute('title', dict.adv_sound_toggle);
    }
    var startAdvBtn = document.getElementById('start-adventure-btn');
    if (startAdvBtn) {
      startAdvBtn.setAttribute('aria-label', activeLang === 'es' ? 'Iniciar Aventura / Iniciar Guía' : 'Start Adventure / Press Start');
    }
    var railEl = document.getElementById('adventure-rail');
    if (railEl) {
      railEl.setAttribute('aria-label', activeLang === 'es' ? 'Mapa de aventura y niveles' : 'Adventure map and levels');
    }
    var dialogueBoxEl = document.getElementById('adventure-dialogue-box');
    if (dialogueBoxEl) {
      dialogueBoxEl.setAttribute('aria-label', activeLang === 'es' ? 'Cuadro de diálogo de la guía' : 'Guide dialogue box');
    }
    var exitTooltip = document.getElementById('rail-exit-tooltip');
    if (exitTooltip) {
      exitTooltip.textContent = (dict && dict.adv_exit) ? dict.adv_exit : (activeLang === 'es' ? 'Salir' : 'Exit');
    }

    if (window.PortfolioAudio && typeof window.PortfolioAudio.updateUI === 'function') {
      window.PortfolioAudio.updateUI();
    }

    var railNodes = document.querySelectorAll('.rail-node');
    railNodes.forEach(function (node, idx) {
      if (dict.adv_node_arias && dict.adv_node_arias[idx]) {
        node.setAttribute('aria-label', dict.adv_node_arias[idx]);
      }
      var tooltip = node.querySelector('.rail-tooltip');
      if (tooltip && dict.adv_node_tooltips && dict.adv_node_tooltips[idx]) {
        tooltip.textContent = dict.adv_node_tooltips[idx];
      }
      var icons = node.querySelectorAll('img');
      if (icons.length && dict.adv_node_tooltips && dict.adv_node_tooltips[idx]) {
        var rawLabel = dict.adv_node_tooltips[idx].replace(/^\d+\.\s*/, '');
        icons.forEach(function (img) {
          img.alt = rawLabel;
        });
      }
    });

    if (window.PortfolioAdventure && typeof window.PortfolioAdventure.updateUI === 'function') {
      window.PortfolioAdventure.updateUI();
    }
  }

  function initI18n() {
    var langBtnEn = document.getElementById('lang-btn-en');
    var langBtnEs = document.getElementById('lang-btn-es');
    var langBtnEnM = document.getElementById('lang-btn-en-m');
    var langBtnEsM = document.getElementById('lang-btn-es-m');

    if (langBtnEn) langBtnEn.addEventListener('click', function () { applyLanguage('en'); });
    if (langBtnEs) langBtnEs.addEventListener('click', function () { applyLanguage('es'); });
    if (langBtnEnM) langBtnEnM.addEventListener('click', function () { applyLanguage('en'); });
    if (langBtnEsM) langBtnEsM.addEventListener('click', function () { applyLanguage('es'); });

    var initialLang = localStorage.getItem('portfolio_lang') || 'en';
    applyLanguage(initialLang);
  }

  window.PortfolioI18n = {
    init: initI18n,
    applyLanguage: applyLanguage,
    initTypewriter: initTypewriter,
    escapeHtml: escapeTypewriterHtml
  };
})();
