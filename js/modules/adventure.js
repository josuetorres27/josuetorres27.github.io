/**
 * Portfolio 8-Bit Adventure System & Scrollytelling Companion
 * Implements interactive pixel rail map, character animations, dialogue box,
 * photo portal transitions, and real-time level progress tracking.
 */

(function () {
  'use strict';

  var isAdventureActive = false;
  var isDialogueDismissed = false;
  var isAfkActive = false;
  var currentAdvLevel = 0;
  var previousAdvLevel = 0;
  var advDialogueTimer = null;
  var walkerAnimInterval = null;
  var walkerIdleTimeout = null;
  var isProgrammaticScroll = false;
  var programmaticScrollTimeout = null;
  var isWalkerJumping = false;
  var isAvatarJumping = false;
  var afkTimer = null;

  function playSound(type) {
    if (window.PortfolioAudio && typeof window.PortfolioAudio.play === 'function') {
      window.PortfolioAudio.play(type);
    }
  }

  function escapeHtml(str) {
    if (window.PortfolioI18n && typeof window.PortfolioI18n.escapeHtml === 'function') {
      return window.PortfolioI18n.escapeHtml(str);
    }
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderDialogueTypewriter(fullText, charCount) {
    if (!fullText) return '';
    var words = fullText.split(' ');

    if (charCount <= 0) {
      return words.map(function (w) {
        return '<span class="inline-block whitespace-nowrap" style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escapeHtml(w) + '</span>';
      }).join(' ');
    }

    if (charCount >= fullText.length) {
      return escapeHtml(fullText);
    }

    var tokens = [];
    var regex = /(\s+|[^\s]+)/g;
    var match;
    while ((match = regex.exec(fullText)) !== null) {
      tokens.push({
        text: match[0],
        isSpace: /^\s+$/.test(match[0]),
        start: match.index,
        end: match.index + match[0].length
      });
    }

    var html = '';
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.isSpace) {
        html += token.text;
      } else {
        if (charCount >= token.end) {
          html += '<span class="inline-block whitespace-nowrap">' + escapeHtml(token.text) + '</span>';
        } else if (charCount <= token.start) {
          html += '<span class="inline-block whitespace-nowrap" style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escapeHtml(token.text) + '</span>';
        } else {
          var typed = token.text.substring(0, charCount - token.start);
          var untyped = token.text.substring(charCount - token.start);
          html += '<span class="inline-block whitespace-nowrap">' +
            '<span>' + escapeHtml(typed) + '</span>' +
            '<span style="visibility:hidden; user-select:none; pointer-events:none;" aria-hidden="true">' + escapeHtml(untyped) + '</span>' +
          '</span>';
        }
      }
    }
    return html;
  }

  function typeAdventureDialogue(text, onComplete) {
    if (!isAdventureActive) return;
    var dialogueTextEl = document.getElementById('dialogue-text');
    var avatarSprite = document.getElementById('dialogue-avatar-sprite');
    if (!dialogueTextEl) return;
    if (advDialogueTimer) {
      clearTimeout(advDialogueTimer);
      advDialogueTimer = null;
    }
    if (avatarSprite) {
      avatarSprite.src = './img/character-sprites/front.png';
    }
    dialogueTextEl.innerHTML = '';
    var idx = 0;
    function tick() {
      if (idx < text.length) {
        var step = 1;
        var code = text.charCodeAt(idx);
        if (code >= 0xD800 && code <= 0xDBFF) {
          step = 2;
        }
        idx += step;
        dialogueTextEl.innerHTML = renderDialogueTypewriter(text, idx);
        if (idx % 3 === 0 && text[idx - 1] !== ' ') {
          playSound('blip');
        }
        advDialogueTimer = setTimeout(tick, 22);
      } else {
        dialogueTextEl.innerHTML = escapeHtml(text);
        advDialogueTimer = null;
        if (onComplete) onComplete();
      }
    }
    tick();
  }

  function updateAdventureContentShift(enable) {
    var stageWrapper = document.getElementById('adventure-stage-wrapper');
    if (!stageWrapper) return;

    if (!enable || window.innerWidth < 640) {
      document.body.classList.remove('adventure-stage-shifted');
      stageWrapper.style.left = '0px';
      return;
    }

    var container = document.querySelector('#hero .max-w-6xl') || document.querySelector('section .max-w-6xl');
    var freeLeft = 0;
    if (container) {
      var currentLeft = parseFloat(stageWrapper.style.left) || 0;
      var rect = container.getBoundingClientRect();
      freeLeft = rect.left - currentLeft;
    } else {
      freeLeft = Math.max(0, (window.innerWidth - 1152) / 2);
    }

    var shift = 50;
    if (freeLeft > 140) {
      shift = Math.min(Math.max(85, Math.floor(freeLeft * 0.65)), 140);
    } else if (freeLeft > 70) {
      shift = Math.min(Math.max(50, Math.floor(freeLeft * 0.65)), 85);
    } else if (freeLeft > 35) {
      shift = Math.max(24, Math.floor(freeLeft * 0.55));
    } else {
      shift = 0;
    }

    document.documentElement.style.setProperty('--adv-content-shift', shift + 'px');
    stageWrapper.style.left = '-' + shift + 'px';
    document.body.classList.add('adventure-stage-shifted');
  }

  function showDialogueBox() {
    var dialogueBox = document.getElementById('adventure-dialogue-box');
    if (!dialogueBox) return;
    isDialogueDismissed = false;
    dialogueBox.classList.remove('hidden', 'pointer-events-none');
    dialogueBox.classList.add('flex');
    dialogueBox.classList.add('opacity-0', 'translate-x-full');
    dialogueBox.classList.remove('opacity-100', 'translate-x-0');

    void dialogueBox.offsetHeight;

    requestAnimationFrame(function () {
      dialogueBox.classList.remove('opacity-0', 'translate-x-full');
      dialogueBox.classList.add('opacity-100', 'translate-x-0');
    });
  }

  function hideDialogueBox() {
    var dialogueBox = document.getElementById('adventure-dialogue-box');
    if (!dialogueBox) return;
    isDialogueDismissed = true;
    dialogueBox.classList.remove('opacity-100', 'translate-x-0');
    dialogueBox.classList.add('opacity-0', 'translate-x-full', 'pointer-events-none');
    if (advDialogueTimer) {
      clearTimeout(advDialogueTimer);
      advDialogueTimer = null;
    }
    setTimeout(function () {
      if (isDialogueDismissed) {
        dialogueBox.classList.add('hidden');
        dialogueBox.classList.remove('flex');
      }
    }, 450);
  }

  function resetAfkTimer() {
    if (afkTimer) clearTimeout(afkTimer);
    isAfkActive = false;
    if (!isAdventureActive) return;
    afkTimer = setTimeout(function () {
      if (!isAdventureActive) return;
      isAfkActive = true;
      if (isDialogueDismissed) {
        showDialogueBox();
      }
      var activeLang = document.documentElement.lang === 'es' ? 'es' : 'en';
      var dict = (typeof I18N !== 'undefined' && I18N[activeLang]) ? I18N[activeLang] : {};
      var afkText = dict.adv_afk || '';
      var avatarSprite = document.getElementById('dialogue-avatar-sprite');
      if (avatarSprite) {
        avatarSprite.src = './img/character-sprites/front.png';
        avatarSprite.classList.add('-translate-y-2');
        setTimeout(function () {
          avatarSprite.classList.remove('-translate-y-2');
        }, 400);
      }
      playSound('blip');
      typeAdventureDialogue(afkText);
    }, 90000);
  }

  function updateAdventureUI(skipWalkerAnim) {
    if (!isAdventureActive) return;
    if (isDialogueDismissed) {
      showDialogueBox();
    }
    var activeLang = document.documentElement.lang === 'es' ? 'es' : 'en';
    var dict = (typeof I18N !== 'undefined' && I18N[activeLang]) ? I18N[activeLang] : {};
    var stageLabels = dict.adv_stage_labels || [];
    var stageLabelEl = document.getElementById('dialogue-stage-label');
    if (stageLabelEl && stageLabels[currentAdvLevel]) {
      stageLabelEl.textContent = stageLabels[currentAdvLevel];
    }

    if (isAfkActive) {
      typeAdventureDialogue(dict.adv_afk || '');
    } else {
      var textKey = 'adv_lvl_' + currentAdvLevel;
      var text = dict[textKey] || '';
      typeAdventureDialogue(text);
    }

    var railNodes = document.querySelectorAll('.rail-node');
    railNodes.forEach(function (node, idx) {
      var isCurrent = idx === currentAdvLevel;
      if (isCurrent) {
        node.className = 'rail-node group relative z-10 w-8 h-8 sm:w-9 sm:h-9 pixel-corners-sm flex items-center justify-center text-xs sm:text-sm font-mono font-bold transition-all bg-brand-600 text-white border-2 border-brand-400 shadow-lg shadow-brand-500/40 scale-110';
      } else {
        node.className = 'rail-node group relative z-10 w-8 h-8 sm:w-9 sm:h-9 pixel-corners-sm flex items-center justify-center text-xs sm:text-sm font-mono font-bold transition-all bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-brand-500 active:scale-95';
      }
    });

    var targetNode = railNodes[currentAdvLevel];
    var walker = document.getElementById('rail-character-walker');
    var walkerSprite = document.getElementById('rail-character-sprite');
    var indicator = document.getElementById('rail-active-indicator');
    var railWrapper = document.getElementById('adventure-rail-wrapper');

    if (targetNode && railWrapper) {
      var targetRect = targetNode.getBoundingClientRect();
      var wrapperRect = railWrapper.getBoundingClientRect();
      var nodeCenterY = (targetRect.top - wrapperRect.top) + (targetRect.height / 2);

      if (walker) {
        var walkerH = walker.offsetHeight || 80;
        walker.style.top = Math.round(nodeCenterY - walkerH / 2) + 'px';
      }

      if (indicator) {
        var indH = indicator.offsetHeight || 10;
        indicator.style.top = Math.round(nodeCenterY - indH / 2) + 'px';
      }

      if (walkerSprite && !skipWalkerAnim && !isWalkerJumping) {
        if (walkerAnimInterval) {
          clearInterval(walkerAnimInterval);
          walkerAnimInterval = null;
        }
        if (walkerIdleTimeout) {
          clearTimeout(walkerIdleTimeout);
          walkerIdleTimeout = null;
        }

        var isMovingUp = currentAdvLevel < previousAdvLevel;
        var walkFrame1 = isMovingUp ? './img/character-sprites/back-walk-1.png' : './img/character-sprites/walk-1.png';
        var walkFrame2 = isMovingUp ? './img/character-sprites/back-walk-2.png' : './img/character-sprites/walk-2.png';
        var idleFrame = isMovingUp ? './img/character-sprites/back.png' : './img/character-sprites/idle.png';

        var step = 0;
        walkerAnimInterval = setInterval(function () {
          step++;
          walkerSprite.src = (step % 2 === 1) ? walkFrame1 : walkFrame2;
        }, 110);

        walkerIdleTimeout = setTimeout(function () {
          if (walkerAnimInterval) {
            clearInterval(walkerAnimInterval);
            walkerAnimInterval = null;
          }
          if (walkerSprite) {
            walkerSprite.src = idleFrame;
            if (isMovingUp) {
              walkerIdleTimeout = setTimeout(function () {
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

  function startAdventure(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    var photoTarget = document.getElementById('hero-photo-wrapper') || document.getElementById('hero-photo-card') || document.querySelector('#hero');
    if (photoTarget) {
      var rect = photoTarget.getBoundingClientRect();
      var targetY = Math.max(0, Math.round(window.scrollY + rect.top - (window.innerHeight / 2) + (rect.height / 2)));
      isProgrammaticScroll = true;
      if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);
      programmaticScrollTimeout = setTimeout(function () {
        isProgrammaticScroll = false;
      }, 1000);
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }

    if (isAdventureActive) {
      playSound('coin');
      return;
    }

    isAdventureActive = true;
    isDialogueDismissed = false;
    isAfkActive = false;
    currentAdvLevel = 0;
    previousAdvLevel = 0;

    var rail = document.getElementById('adventure-rail');
    var walker = document.getElementById('rail-character-walker');
    var indicator = document.getElementById('rail-active-indicator');
    var walkerSprite = document.getElementById('rail-character-sprite');
    var heroImg = document.getElementById('hero-profile-img');
    var portalOverlay = document.getElementById('hero-portal-overlay');
    var portalSpriteWrap = document.getElementById('hero-portal-sprite-wrap');
    var portalSprite = document.getElementById('hero-portal-sprite');
    var avatarSprite = document.getElementById('dialogue-avatar-sprite');

    if (walker) walker.classList.add('opacity-0');
    if (indicator) {
      indicator.style.top = '0px';
      indicator.classList.add('opacity-0');
    }
    if (walkerSprite) walkerSprite.src = './img/character-sprites/walk-1.png';

    if (heroImg) {
      heroImg.classList.remove('blur-0', 'scale-100', 'opacity-100');
      heroImg.classList.add('blur-md', 'scale-95', 'opacity-25');
    }
    if (portalOverlay) {
      portalOverlay.classList.remove('hidden');
      portalOverlay.classList.add('opacity-0');
      void portalOverlay.offsetHeight;
      requestAnimationFrame(function () {
        portalOverlay.classList.remove('opacity-0');
        portalOverlay.classList.add('opacity-100');
      });
    }

    if (portalSpriteWrap && portalSprite) {
      portalSprite.src = './img/character-sprites/front.png';
      portalSprite.style.transition = 'none';
      portalSprite.style.transform = 'translateY(0px) scale(1, 1)';
      portalSpriteWrap.classList.remove('opacity-0', 'hidden');
      portalSpriteWrap.classList.add('opacity-100');

      setTimeout(function () {
        playSound('jump');
        portalSprite.src = './img/character-sprites/jump.png';
        portalSprite.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2)';
        portalSprite.style.transform = 'translateY(-48px)';

        setTimeout(function () {
          portalSprite.style.transition = 'transform 0.35s ease-in';
          portalSprite.style.transform = 'translateY(0px)';

          setTimeout(function () {
            portalSprite.src = './img/character-sprites/front.png';
            playSound('coin');
            portalSprite.style.transition = 'transform 0.18s ease-out';
            portalSprite.style.transform = 'scale(1.08, 0.92)';

            setTimeout(function () {
              portalSprite.style.transform = 'scale(1, 1)';
            }, 180);

            setTimeout(function () {
              portalSprite.style.transition = 'transform 1.25s linear';
              portalSprite.style.transform = 'translateY(280px)';

              var portalStep = 0;
              var portalWalkInterval = setInterval(function () {
                portalStep++;
                portalSprite.src = (portalStep % 2 === 1) ? './img/character-sprites/walk-1.png' : './img/character-sprites/walk-2.png';
              }, 120);

              setTimeout(function () {
                clearInterval(portalWalkInterval);
                portalSpriteWrap.classList.remove('opacity-100');
                portalSpriteWrap.classList.add('opacity-0');
                if (portalOverlay) {
                  portalOverlay.classList.remove('opacity-100');
                  portalOverlay.classList.add('opacity-0');
                }

                if (heroImg) {
                  heroImg.classList.remove('blur-md', 'blur-sm', 'scale-95', 'opacity-25', 'opacity-35');
                  heroImg.classList.add('blur-0', 'scale-100', 'opacity-100');
                }

                setTimeout(function () {
                  portalSpriteWrap.classList.add('hidden');
                  if (portalOverlay) portalOverlay.classList.add('hidden');
                  portalSprite.style.transition = '';
                  portalSprite.style.transform = 'translateY(0px)';
                }, 300);

                updateAdventureContentShift(true);
                var isMobile = window.innerWidth < 640;
                if (!isMobile && rail) {
                  rail.classList.remove('hidden', 'pointer-events-none');
                  rail.classList.add('flex');
                  requestAnimationFrame(function () {
                    rail.classList.remove('opacity-0', 'translate-x-48');
                    rail.classList.add('opacity-100', 'translate-x-0');
                  });
                }

                if (walker && walkerSprite) {
                  var startTop = -180;
                  var targetLevel0Top = 12;
                  var headerEl = document.querySelector('header');
                  var wrapperEl = document.getElementById('adventure-rail-wrapper');
                  var node0 = document.querySelector('.rail-node[data-level="0"]');

                  if (wrapperEl) {
                    var wrapperRect = wrapperEl.getBoundingClientRect();
                    if (headerEl) {
                      var headerBottom = headerEl.getBoundingClientRect().bottom;
                      startTop = Math.round((headerBottom + 8) - wrapperRect.top);
                      if (startTop > -120) startTop = -180;
                    }
                    if (node0) {
                      var node0Rect = node0.getBoundingClientRect();
                      var nodeCenterY = (node0Rect.top - wrapperRect.top) + (node0Rect.height / 2);
                      var walkerH = walker.offsetHeight || 80;
                      targetLevel0Top = Math.round(nodeCenterY - walkerH / 2);
                    }
                  }

                  walker.style.transition = 'none';
                  walker.style.top = startTop + 'px';
                  walkerSprite.src = './img/character-sprites/walk-1.png';
                  walker.classList.remove('opacity-0');

                  void walker.offsetHeight;

                  var walkDurationMs = 850;
                  walker.style.transition = 'top ' + walkDurationMs + 'ms cubic-bezier(0.25, 0.1, 0.25, 1)';
                  walker.style.top = targetLevel0Top + 'px';

                  var railStep = 0;
                  var railWalkInterval = setInterval(function () {
                    railStep++;
                    walkerSprite.src = (railStep % 2 === 1) ? './img/character-sprites/walk-1.png' : './img/character-sprites/walk-2.png';
                  }, 110);

                  setTimeout(function () {
                    clearInterval(railWalkInterval);
                    walker.style.transition = '';
                    walkerSprite.src = './img/character-sprites/jump.png';
                    walker.classList.add('-translate-y-2');
                    playSound('coin');

                    setTimeout(function () {
                      walker.classList.remove('-translate-y-2');
                      walkerSprite.src = './img/character-sprites/idle.png';
                    }, 250);

                    if (indicator) indicator.classList.remove('opacity-0');

                    showDialogueBox();
                    if (avatarSprite) {
                      avatarSprite.classList.add('-translate-y-3');
                      avatarSprite.src = './img/character-sprites/jump.png';
                      setTimeout(function () {
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
      updateAdventureContentShift(true);
      var isMobileFallback = window.innerWidth < 640;
      if (!isMobileFallback && rail) {
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
    playSound('exit');

    currentAdvLevel = 0;
    previousAdvLevel = 0;

    var heroImg = document.getElementById('hero-profile-img');
    var portalOverlay = document.getElementById('hero-portal-overlay');
    var portalSpriteWrap = document.getElementById('hero-portal-sprite-wrap');
    var portalSprite = document.getElementById('hero-portal-sprite');
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

    updateAdventureContentShift(false);

    if (afkTimer) {
      clearTimeout(afkTimer);
      afkTimer = null;
    }

    var rail = document.getElementById('adventure-rail');
    if (rail) {
      rail.classList.remove('opacity-100', 'translate-x-0');
      rail.classList.add('opacity-0', 'translate-x-48', 'pointer-events-none');
    }
    hideDialogueBox();

    var walker = document.getElementById('rail-character-walker');
    var indicator = document.getElementById('rail-active-indicator');
    var walkerSprite = document.getElementById('rail-character-sprite');
    var avatarSprite = document.getElementById('dialogue-avatar-sprite');
    var avatarBtn = document.getElementById('dialogue-avatar-btn');

    if (walker) {
      walker.style.top = '0px';
      walker.classList.add('opacity-0');
      walker.classList.remove('is-jumping');
      walker.style.pointerEvents = '';
    }
    if (indicator) {
      indicator.style.top = '0px';
    }
    isWalkerJumping = false;
    isAvatarJumping = false;
    if (avatarBtn) {
      avatarBtn.style.pointerEvents = '';
    }
    if (walkerSprite) {
      walkerSprite.classList.remove('animate-pixel-jump');
      walkerSprite.src = './img/character-sprites/idle.png';
    }
    if (avatarSprite) {
      avatarSprite.classList.remove('animate-pixel-jump');
      avatarSprite.src = './img/character-sprites/front.png';
    }

    var railNodes = document.querySelectorAll('.rail-node');
    railNodes.forEach(function (node, idx) {
      if (idx === 0) {
        node.className = 'rail-node group relative z-10 w-8 h-8 sm:w-9 sm:h-9 pixel-corners-sm flex items-center justify-center text-xs sm:text-sm font-mono font-bold transition-all bg-brand-600 text-white border-2 border-brand-400 shadow-lg shadow-brand-500/40 scale-110';
      } else {
        node.className = 'rail-node group relative z-10 w-8 h-8 sm:w-9 sm:h-9 pixel-corners-sm flex items-center justify-center text-xs sm:text-sm font-mono font-bold transition-all bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-brand-500 active:scale-95';
      }
    });

    setTimeout(function () {
      if (rail) {
        rail.classList.add('hidden');
        rail.classList.remove('flex');
      }
      if (advDialogueTimer) {
        clearTimeout(advDialogueTimer);
        advDialogueTimer = null;
      }
    }, 450);
  }

  function initAdventureMode() {
    var startBtn = document.getElementById('start-adventure-btn');
    var rail = document.getElementById('adventure-rail');
    var dialogueBox = document.getElementById('adventure-dialogue-box');
    var photoCard = document.getElementById('hero-photo-card');
    var avatarBtn = document.getElementById('dialogue-avatar-btn');
    var avatarSprite = document.getElementById('dialogue-avatar-sprite');
    var muteBtns = [document.getElementById('dialogue-mute-btn')].filter(Boolean);
    var railExitBtn = document.getElementById('rail-exit-btn');
    var dialogueCloseBtn = document.getElementById('dialogue-close-btn');
    var railNodes = document.querySelectorAll('.rail-node');
    var sectionIds = ['#hero', '#about', '#experience', '#education', '#skills', '#projects', '#ai', '#interests', '#contact'];

    if (!startBtn || !rail || !dialogueBox || !photoCard) return;

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
      playSound('exit');
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

    muteBtns.forEach(function (btn) {
      if (btn) {
        btn.addEventListener('click', function (e) {
          if (window.PortfolioAudio && typeof window.PortfolioAudio.toggle === 'function') {
            window.PortfolioAudio.toggle(e);
          }
        });
        btn.addEventListener('touchend', function (e) {
          if (window.PortfolioAudio && typeof window.PortfolioAudio.toggle === 'function') {
            window.PortfolioAudio.toggle(e);
          }
        });
      }
    });

    if (avatarBtn) {
      avatarBtn.addEventListener('click', function (e) {
        if (e) e.stopPropagation();
        if (isAvatarJumping) return;
        isAvatarJumping = true;
        resetAfkTimer();
        playSound('jump');
        if (avatarSprite) {
          avatarSprite.classList.add('animate-pixel-jump');
          avatarSprite.src = './img/character-sprites/jump.png';
          setTimeout(function () {
            avatarSprite.classList.remove('animate-pixel-jump');
            avatarSprite.src = './img/character-sprites/front.png';
            isAvatarJumping = false;
          }, 500);
        } else {
          isAvatarJumping = false;
        }
      });
    }

    railNodes.forEach(function (node, idx) {
      node.addEventListener('click', function () {
        resetAfkTimer();
        if (isDialogueDismissed) {
          showDialogueBox();
        }
        var targetId = sectionIds[idx];
        var targetEl = targetId ? document.querySelector(targetId) : null;

        if (currentAdvLevel !== idx) {
          isProgrammaticScroll = true;
          if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);
          programmaticScrollTimeout = setTimeout(function () {
            isProgrammaticScroll = false;
          }, 600);
          currentAdvLevel = idx;
          playSound('level');
          updateAdventureUI();
        }

        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    var releaseProgrammaticScroll = function () {
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

    var isScrollingThrottle = false;
    window.addEventListener('scroll', function () {
      if (!isAdventureActive) return;
      resetAfkTimer();

      if (isProgrammaticScroll) {
        if (programmaticScrollTimeout) clearTimeout(programmaticScrollTimeout);
        programmaticScrollTimeout = setTimeout(function () {
          isProgrammaticScroll = false;
        }, 200);
        return;
      }

      if (isScrollingThrottle) return;
      isScrollingThrottle = true;

      requestAnimationFrame(function () {
        var sections = sectionIds.map(function (id) {
          return document.querySelector(id);
        });
        var viewportCheck = window.innerHeight * 0.38;
        var bestIdx = 0;
        var minDiff = Infinity;

        var isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
        if (isAtBottom) {
          bestIdx = sections.length - 1;
        } else if (window.scrollY <= 80) {
          bestIdx = 0;
        } else {
          sections.forEach(function (sec, idx) {
            if (!sec) return;
            var rect = sec.getBoundingClientRect();
            var diff = Math.abs(rect.top - viewportCheck);
            if (rect.top <= viewportCheck + 80 && diff < minDiff) {
              minDiff = diff;
              bestIdx = idx;
            }
          });
        }

        if (bestIdx !== currentAdvLevel) {
          currentAdvLevel = bestIdx;
          playSound('level');
          if (isDialogueDismissed) {
            showDialogueBox();
          }
          updateAdventureUI();
        }

        isScrollingThrottle = false;
      });
    }, { passive: true });

    window.addEventListener('scrollend', function () {
      if (programmaticScrollTimeout) {
        clearTimeout(programmaticScrollTimeout);
        programmaticScrollTimeout = null;
      }
      isProgrammaticScroll = false;
    });

    var railWalker = document.getElementById('rail-character-walker');
    if (railWalker) {
      railWalker.addEventListener('click', function (e) {
        if (e) e.stopPropagation();
        if (isWalkerJumping) return;
        isWalkerJumping = true;
        railWalker.classList.add('is-jumping');
        resetAfkTimer();
        playSound('jump');
        if (isDialogueDismissed) {
          showDialogueBox();
          updateAdventureUI();
        }
        var walkerSprite = document.getElementById('rail-character-sprite');
        if (walkerSprite) {
          walkerSprite.classList.add('animate-pixel-jump');
          walkerSprite.src = './img/character-sprites/jump.png';
          setTimeout(function () {
            walkerSprite.classList.remove('animate-pixel-jump');
            walkerSprite.src = './img/character-sprites/idle.png';
            isWalkerJumping = false;
            railWalker.classList.remove('is-jumping');
          }, 500);
        } else {
          isWalkerJumping = false;
          railWalker.classList.remove('is-jumping');
        }
      });
    }

    window.addEventListener('resize', function () {
      if (!isAdventureActive) return;
      var mobileNow = window.innerWidth < 640;
      if (mobileNow) {
        rail.classList.add('hidden', 'pointer-events-none');
        rail.classList.remove('flex');
      } else {
        rail.classList.remove('hidden', 'pointer-events-none');
        rail.classList.add('flex', 'opacity-100', 'translate-x-0');
      }
    });
  }

  window.PortfolioAdventure = {
    init: initAdventureMode,
    start: startAdventure,
    close: closeAdventure,
    updateUI: updateAdventureUI,
    isActive: function () {
      return isAdventureActive;
    }
  };
})();
