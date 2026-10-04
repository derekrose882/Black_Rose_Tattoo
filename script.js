/* Black Rose Tattoo — site interactions (no dependencies) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: glass effect once the page scrolls */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    function setMenu(open) {
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    document.querySelectorAll('.mobile-menu a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Count-up numbers */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }
    var start = null;
    var duration = 1800;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal, .step, [data-count]');
  if ('IntersectionObserver' in window) {
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = '0'; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.hasAttribute('data-count')) countUp(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
      if (el.hasAttribute('data-count')) el.textContent = el.getAttribute('data-count');
    });
  }

  /* Testimonials slider */
  var slider = document.querySelector('.testimonial-slider');
  if (slider) {
    var slides = slider.querySelectorAll('.testimonial');
    var dotsWrap = document.querySelector('.testimonial-dots');
    var current = 0;
    var timer;
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show review ' + (i + 1));
      dot.addEventListener('click', function () { show(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('button');
    function show(i) {
      slides[current].classList.remove('is-active');
      dots[current].setAttribute('aria-current', 'false');
      current = i;
      slides[current].classList.add('is-active');
      dots[current].setAttribute('aria-current', 'true');
    }
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) {
        timer = setInterval(function () { show((current + 1) % slides.length); }, 6500);
      }
    }
    show(0);
    restart();
  }

  /* Gallery filter */
  var filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    var items = document.querySelectorAll('.gallery-grid .work-item');
    filterBtns.forEach(function (btn) {
      var f = btn.getAttribute('data-filter');
      var count = f === 'all' ? items.length
        : document.querySelectorAll('.gallery-grid [data-category~="' + f + '"]').length;
      btn.insertAdjacentHTML('beforeend', '<sup>' + count + '</sup>');

      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        items.forEach(function (item) {
          var match = f === 'all' || item.getAttribute('data-category').split(' ').indexOf(f) > -1;
          if (match) {
            item.classList.remove('is-hidden');
            item.classList.add('is-filtering');
            requestAnimationFrame(function () {
              requestAnimationFrame(function () { item.classList.remove('is-filtering'); });
            });
          } else {
            item.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* Lightbox */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbTitle = lightbox.querySelector('h3');
    var lbMeta = lightbox.querySelector('figcaption p');
    var lbCount = lightbox.querySelector('.lightbox__count');
    var tiles = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    var index = 0;
    var lastFocus = null;

    function visibleTiles() {
      return tiles.filter(function (t) { return !t.classList.contains('is-hidden'); });
    }
    function render() {
      var list = visibleTiles();
      var tile = list[index];
      var img = tile.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbTitle.textContent = tile.querySelector('h3').textContent;
      lbMeta.textContent = tile.querySelector('.work-item__caption p').textContent;
      lbCount.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
    }
    function open(tile) {
      lastFocus = document.activeElement;
      index = visibleTiles().indexOf(tile);
      render();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lightbox__close').focus();
    }
    function close() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    function step(dir) {
      var n = visibleTiles().length;
      index = (index + dir + n) % n;
      render();
    }

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () { open(tile); });
      tile.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(tile); }
      });
    });
    lightbox.querySelector('.lightbox__close').addEventListener('click', close);
    lightbox.querySelector('.lightbox__prev').addEventListener('click', function () { step(-1); });
    lightbox.querySelector('.lightbox__next').addEventListener('click', function () { step(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    var touchX = null;
    lightbox.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      touchX = null;
    });
  }

  /* Live "Open now" status, computed in the studio's timezone (Portland) */
  var hoursTable = document.querySelector('.hours');
  if (hoursTable) {
    // 0 = Sunday … 6 = Saturday; [open, close] in 24h, null = closed
    var schedule = [null, null, [11, 19], [11, 19], [11, 19], [11, 19], [11, 19]];
    var now;
    try {
      now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    } catch (err) {
      now = new Date();
    }
    var day = now.getDay();
    var hour = now.getHours() + now.getMinutes() / 60;
    var todays = schedule[day];
    var isOpen = !!todays && hour >= todays[0] && hour < todays[1];

    var row = hoursTable.querySelector('[data-day="' + day + '"]');
    if (row) row.classList.add('is-today');

    var status = document.querySelector('.status');
    if (status) {
      status.classList.add(isOpen ? 'is-open' : 'is-closed');
      if (isOpen) {
        status.textContent = 'Open now · until ' + (todays[1] - 12) + 'pm';
      } else {
        var next = day;
        if (!(todays && hour < todays[0])) {
          for (var i = 1; i <= 7; i++) {
            if (schedule[(day + i) % 7]) { next = (day + i) % 7; break; }
          }
        }
        var names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        status.textContent = 'Closed · opens ' + (next === day ? 'today' : names[next]) + ' 11am';
      }
    }
  }

  /* Booking form */
  var form = document.getElementById('bookingForm');
  if (form) {
    var booking = form.closest('.booking');

    // Pre-select an artist from ?artist=alex
    var artistParam = new URLSearchParams(window.location.search).get('artist');
    if (artistParam) {
      var select = form.querySelector('#artist');
      if (select.querySelector('option[value="' + artistParam + '"]')) select.value = artistParam;
    }

    // Reference upload (front-end only)
    var dropzone = form.querySelector('.dropzone');
    var fileInput = form.querySelector('#references');
    var fileList = form.querySelector('.file-list');
    function listFiles() {
      fileList.innerHTML = '';
      Array.prototype.forEach.call(fileInput.files, function (file) {
        var li = document.createElement('li');
        li.textContent = file.name;
        fileList.appendChild(li);
      });
    }
    fileInput.addEventListener('change', listFiles);
    ['dragenter', 'dragover'].forEach(function (evt) {
      dropzone.addEventListener(evt, function () { dropzone.classList.add('is-dragover'); });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      dropzone.addEventListener(evt, function () { dropzone.classList.remove('is-dragover'); });
    });

    function validate(field) {
      var input = field.querySelector('input, select, textarea');
      var ok = input.checkValidity();
      field.classList.toggle('has-error', !ok);
      return ok;
    }

    form.querySelectorAll('.field').forEach(function (field) {
      var input = field.querySelector('input, select, textarea');
      if (!input || !input.required) return;
      input.addEventListener('blur', function () { if (field.classList.contains('touched')) validate(field); });
      input.addEventListener('input', function () {
        field.classList.add('touched');
        if (field.classList.contains('has-error')) validate(field);
      });
      input.addEventListener('change', function () { validate(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll('.field').forEach(function (field) {
        var input = field.querySelector('input, select, textarea');
        if (!input || !input.required) return;
        if (!validate(field) && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      var name = form.querySelector('#name').value.trim().split(' ')[0];
      booking.querySelector('[data-first-name]').textContent = name;
      booking.classList.add('is-sent');
      booking.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }
})();
