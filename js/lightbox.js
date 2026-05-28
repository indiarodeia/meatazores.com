(function () {
  'use strict';

  var scrollBloqueadoY = 0;
  var galeria = [];   // [{src, alt}, ...]
  var indice = 0;

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
      if (document.scrollingElement) document.scrollingElement.scrollTop = scrollY;
      window.scrollTo(0, scrollY);
    }
    document.body.classList.remove('is-lightbox-open');
    document.body.style.top = '';
    delete document.body.dataset.scrollY;
    restaurarScroll();
    window.requestAnimationFrame(restaurarScroll);
    window.setTimeout(restaurarScroll, 50);
  }

  function atualizarImagem() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var img = lb.querySelector('.lightbox__img');
    var item = galeria[indice];
    if (!img || !item) return;
    img.src = item.src;
    img.alt = item.alt || '';
    var contador = lb.querySelector('.lightbox__counter');
    if (contador) {
      if (galeria.length > 1) {
        contador.textContent = (indice + 1) + ' / ' + galeria.length;
        contador.hidden = false;
      } else {
        contador.hidden = true;
      }
    }
    var prev = lb.querySelector('.lightbox__prev');
    var next = lb.querySelector('.lightbox__next');
    var multi = galeria.length > 1;
    if (prev) prev.hidden = !multi;
    if (next) next.hidden = !multi;
  }

  function abrir(items, indiceInicial) {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    galeria = items.filter(function (it) { return it && it.src; });
    if (!galeria.length) return;
    indice = Math.max(0, Math.min(indiceInicial || 0, galeria.length - 1));
    atualizarImagem();
    lb.hidden = false;
    bloquearScrollPagina();
    var btnFocus = lb.querySelector('.lightbox__close');
    if (btnFocus) btnFocus.focus();
  }

  function abrirLightbox(src, alt) {
    abrir([{ src: src, alt: alt }], 0);
  }

  function abrirLightboxGaleria(items, indiceInicial) {
    abrir(items, indiceInicial);
  }

  function proximo() {
    if (galeria.length <= 1) return;
    indice = (indice + 1) % galeria.length;
    atualizarImagem();
  }

  function anterior() {
    if (galeria.length <= 1) return;
    indice = (indice - 1 + galeria.length) % galeria.length;
    atualizarImagem();
  }

  function fechar() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    if (document.activeElement && lb.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    lb.hidden = true;
    desbloquearScrollPagina();
    var img = lb.querySelector('.lightbox__img');
    if (img) { img.src = ''; img.alt = ''; }
    galeria = [];
    indice = 0;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lb = document.getElementById('lightbox');
    if (!lb) return;

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox__close')) {
        fechar();
      } else if (e.target.classList.contains('lightbox__prev')) {
        anterior();
      } else if (e.target.classList.contains('lightbox__next')) {
        proximo();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') fechar();
      else if (e.key === 'ArrowLeft') anterior();
      else if (e.key === 'ArrowRight') proximo();
    });

    // Swipe horizontal em ecrãs táteis
    var touchStartX = null;
    lb.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches.length === 1) touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (touchStartX == null) return;
      var endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : touchStartX;
      var dx = endX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) proximo(); else anterior();
    });
  });

  window.MA = window.MA || {};
  window.MA.abrirLightbox = abrirLightbox;
  window.MA.abrirLightboxGaleria = abrirLightboxGaleria;
})();
