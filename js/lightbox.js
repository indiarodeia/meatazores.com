(function () {
  'use strict';

  function abrirLightbox(src, alt) {
    var lb = document.getElementById('lightbox');
    var img = lb && lb.querySelector('.lightbox__img');
    if (!lb || !img) return;
    img.src = src;
    img.alt = alt || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lightbox__close').focus();
  }

  function fecharLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.hidden = true;
    document.body.style.overflow = '';
    var img = lb.querySelector('.lightbox__img');
    if (img) { img.src = ''; img.alt = ''; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lb = document.getElementById('lightbox');
    if (!lb) return;

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox__close')) {
        fecharLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharLightbox();
    });
  });

  window.MA = window.MA || {};
  window.MA.abrirLightbox = abrirLightbox;
})();
