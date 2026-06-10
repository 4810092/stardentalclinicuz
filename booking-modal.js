(function () {
  'use strict';

  var METRIKA_COUNTER_ID = 106803946;
  var PHONE_URL = 'tel:+998909584154';
  var DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/stardentalclinic.uz';
  var TELEGRAM_BOT_URL = 'https://t.me/BelgiApp_bot?start=book_dae70b36-3944-4fc8-a824-f36fcfdc13a3';

  function trackAnalyticsEvent(eventName, eventParams) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams || {});
    }

    if (typeof window.ym === 'function') {
      window.ym(METRIKA_COUNTER_ID, 'reachGoal', eventName);
    }
  }

  function createFabButton(tagName, attrs, iconSrc, iconAlt) {
    var button = document.createElement(tagName);

    Object.keys(attrs).forEach(function (key) {
      if (key === 'text') {
        button.textContent = attrs[key];
      } else {
        button.setAttribute(key, attrs[key]);
      }
    });

    if (iconSrc) {
      var img = document.createElement('img');
      img.src = iconSrc;
      img.alt = iconAlt || '';
      button.appendChild(img);
    }

    return button;
  }

  function ensureFloatingButtonsContainer() {
    var containers = document.querySelectorAll('.floating-buttons');

    if (!containers.length) {
      var created = document.createElement('div');
      created.className = 'floating-buttons';
      document.body.appendChild(created);
      return [created];
    }

    return Array.prototype.slice.call(containers);
  }

  function resolveInstagramUrl() {
    var instagramLink = document.querySelector('a[href*="instagram.com"]');
    if (instagramLink && instagramLink.getAttribute('href')) {
      return instagramLink.getAttribute('href');
    }

    return DEFAULT_INSTAGRAM_URL;
  }

  function ensureBaseButtons(container, instagramUrl) {
    var phoneLink = container.querySelector('a[href^="tel:"]');
    if (!phoneLink) {
      var phoneButton = createFabButton(
        'a',
        {
          href: PHONE_URL,
          'aria-label': '\u041f\u043e\u0437\u0432\u043e\u043d\u0438\u0442\u044c'
        },
        '/icons/phone.png',
        'Phone'
      );
      container.appendChild(phoneButton);
    }

    var instagramLink = container.querySelector('a[href*="instagram.com"]');
    if (!instagramLink) {
      var instagramButton = createFabButton(
        'a',
        {
          href: instagramUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          'aria-label': 'Instagram'
        },
        '/icons/instagram.png',
        'Instagram'
      );
      container.appendChild(instagramButton);
    }
  }

  function bindContactEvents() {
    document.addEventListener('click', function (event) {
      if (event.target.closest('.telegram-bot-fab')) {
        trackAnalyticsEvent('click_telegram_bot', {
          event_category: 'contact',
          event_label: window.location.pathname
        });
        return;
      }

      if (event.target.closest('.floating-buttons a[href^="tel:"]')) {
        trackAnalyticsEvent('click_call', { event_category: 'contact' });
        return;
      }

      if (event.target.closest('.floating-buttons a[href*="instagram.com"]')) {
        trackAnalyticsEvent('click_instagram', { event_category: 'contact' });
      }
    });
  }

  function ensureTelegramBotButtons(containers) {
    containers.forEach(function (container) {
      if (container.querySelector('.telegram-bot-fab')) {
        return;
      }

      var telegramBotButton = createFabButton(
        'a',
        {
          href: TELEGRAM_BOT_URL,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'telegram-bot-fab',
          'aria-label': '\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f \u0447\u0435\u0440\u0435\u0437 Telegram'
        },
        '/icons/telegram.png',
        '\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f \u0447\u0435\u0440\u0435\u0437 Telegram'
      );

      container.appendChild(telegramBotButton);
    });
  }

  function initFloatingButtons() {
    if (!document.body) {
      return;
    }

    var containers = ensureFloatingButtonsContainer();
    var instagramUrl = resolveInstagramUrl();

    containers.forEach(function (container) {
      ensureBaseButtons(container, instagramUrl);
    });

    ensureTelegramBotButtons(containers);
    bindContactEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingButtons);
  } else {
    initFloatingButtons();
  }
})();
