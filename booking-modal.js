(function () {
  'use strict';

  var OVERLAY_ID = 'bookingOverlay';
  var DIALOG_ID = 'bookingDialog';
  var BOOKING_URL = 'https://feedback.stardentalclinic.uz/?embed=1';
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

  function buildBookingLayer() {
    var overlay = document.createElement('div');
    overlay.className = 'booking-overlay';
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    var dialog = document.createElement('div');
    dialog.className = 'booking-dialog';
    dialog.id = DIALOG_ID;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', '\u0424\u043e\u0440\u043c\u0430 \u0437\u0430\u043f\u0438\u0441\u0438');

    var iframe = document.createElement('iframe');
    iframe.className = 'booking-dialog__iframe';
    iframe.src = BOOKING_URL;
    iframe.title = '\u0424\u043e\u0440\u043c\u0430 \u0437\u0430\u043f\u0438\u0441\u0438 Star Dental Clinic';
    iframe.loading = 'lazy';

    dialog.appendChild(iframe);
    document.body.appendChild(dialog);
  }

  function ensureBookingLayer() {
    if (!document.getElementById(OVERLAY_ID) || !document.getElementById(DIALOG_ID)) {
      buildBookingLayer();
    }
  }

  function isBookingOpen() {
    var overlay = document.getElementById(OVERLAY_ID);
    var dialog = document.getElementById(DIALOG_ID);
    return !!(overlay && dialog && overlay.classList.contains('is-open') && dialog.classList.contains('is-open'));
  }

  function closeBooking() {
    var overlay = document.getElementById(OVERLAY_ID);
    var dialog = document.getElementById(DIALOG_ID);

    if (!overlay || !dialog) {
      return;
    }

    overlay.classList.remove('is-open');
    dialog.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('booking-open');
  }

  function openBooking() {
    ensureBookingLayer();

    var overlay = document.getElementById(OVERLAY_ID);
    var dialog = document.getElementById(DIALOG_ID);
    if (!overlay || !dialog) {
      return;
    }

    overlay.classList.add('is-open');
    dialog.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('booking-open');
  }

  function toggleBooking() {
    if (isBookingOpen()) {
      closeBooking();
    } else {
      openBooking();
    }
  }

  function bindModalEvents() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      overlay.addEventListener('click', function () {
        closeBooking();
      });
    }

    document.addEventListener('click', function (event) {
      if (event.target.closest('.booking-fab')) {
        toggleBooking();
        return;
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isBookingOpen()) {
        closeBooking();
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
    ensureBookingLayer();
    bindModalEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookingModal);
  } else {
    initBookingModal();
  }
})();
