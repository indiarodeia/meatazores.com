(function () {
  'use strict';

  var scrollBloqueadoY = 0;

  function bloquearScrollPagina() {
    if (document.body.classList.contains('is-lightbox-open')) return;

    var scrollY = window.scrollY || window.pageYOffset || 0;
    scrollBloqueadoY = scrollY;
    document.body.dataset.scrollY = String(scrollY);
    document.body.style.top = '-' + scrollY + 'px';
    document.body.classList.add('is-lightbox-open');
  }

  function desbloquearScrollPagina() {
    var scrollY = Number(document.body.dataset.scrollY || scrollBloqueadoY || 0);

    function restaurarScroll() {
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = scrollY;
      }
      window.scrollTo(0, scrollY);
    }

    document.body.classList.remove('is-lightbox-open');
    document.body.style.top = '';
    delete document.body.dataset.scrollY;
    restaurarScroll();
    window.requestAnimationFrame(function () {
      restaurarScroll();
    });
    window.setTimeout(function () {
      restaurarScroll();
    }, 50);
  }

  function abrirLightbox(src, alt) {
    var lb = document.getElementById('lightbox');
    var img = lb && lb.querySelector('.lightbox__img');
    if (!lb || !img) return;
    img.src = src;
    img.alt = alt || '';
    lb.hidden = false;
    bloquearScrollPagina();
    lb.querySelector('.lightbox__close').focus();
  }

  function fecharLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    if (document.activeElement && lb.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    lb.hidden = true;
    desbloquearScrollPagina();
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
