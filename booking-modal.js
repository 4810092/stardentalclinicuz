(function () {
  'use strict';

  var MODAL_ID = 'bookingModal';
  var BOOKING_URL = 'https://feedback.stardentalclinic.uz/';
  var PHONE_URL = 'tel:+998909584154';
  var DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/stardentalclinic.uz';

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

  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'booking-modal-overlay';
    overlay.id = MODAL_ID;
    overlay.setAttribute('aria-hidden', 'true');

    var modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'bookingModalTitle');

    var header = document.createElement('div');
    header.className = 'booking-modal__header';

    var title = document.createElement('div');
    title.className = 'booking-modal__title';
    title.id = 'bookingModalTitle';
    title.textContent = '\u041e\u043d\u043b\u0430\u0439\u043d-\u0437\u0430\u044f\u0432\u043a\u0430';

    var close = document.createElement('button');
    close.className = 'booking-modal__close';
    close.type = 'button';
    close.setAttribute('aria-label', '\u0417\u0430\u043a\u0440\u044b\u0442\u044c');
    close.textContent = '\u2715';

    var iframe = document.createElement('iframe');
    iframe.className = 'booking-modal__iframe';
    iframe.src = BOOKING_URL;
    iframe.title = '\u0424\u043e\u0440\u043c\u0430 \u0437\u0430\u043f\u0438\u0441\u0438 Star Dental Clinic';
    iframe.loading = 'lazy';

    header.appendChild(title);
    header.appendChild(close);
    modal.appendChild(header);
    modal.appendChild(iframe);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    return overlay;
  }

  function getOrCreateModal() {
    return document.getElementById(MODAL_ID) || buildModal();
  }

  function closeModal() {
    var overlay = document.getElementById(MODAL_ID);
    if (!overlay) {
      return;
    }

    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function openModal() {
    var overlay = getOrCreateModal();
    var closeButton = overlay.querySelector('.booking-modal__close');

    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (closeButton) {
      closeButton.focus();
    }
  }

  function bindModalEvents() {
    document.addEventListener('click', function (event) {
      if (event.target.closest('.booking-fab')) {
        openModal();
        return;
      }

      if (event.target.closest('.booking-modal__close')) {
        closeModal();
        return;
      }

      var overlay = document.getElementById(MODAL_ID);
      if (!overlay) {
        return;
      }

      if (event.target === overlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
  }

  function ensureBookingButtons(containers) {
    containers.forEach(function (container) {
      if (container.querySelector('.booking-fab')) {
        return;
      }

      var bookingButton = createFabButton(
        'button',
        {
          type: 'button',
          class: 'booking-fab',
          'aria-label': '\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f'
        },
        '/icons/telegram.png',
        '\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f'
      );

      container.appendChild(bookingButton);
    });
  }

  function initBookingModal() {
    if (!document.body) {
      return;
    }

    var containers = ensureFloatingButtonsContainer();
    var instagramUrl = resolveInstagramUrl();

    containers.forEach(function (container) {
      ensureBaseButtons(container, instagramUrl);
    });

    ensureBookingButtons(containers);
    bindModalEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookingModal);
  } else {
    initBookingModal();
  }
})();
