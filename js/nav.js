(function () {
  'use strict';

  const DEFAULT_PECA_ID = 'ramo-grande-dop-peter-cafe-sport';

  function getHomePecaId() {
    try {
      return localStorage.getItem('ma_peca_ativa') || DEFAULT_PECA_ID;
    } catch (e) {
      return DEFAULT_PECA_ID;
    }
  }

  const ITEMS = [
    {
      key: 'home',
      label: 'Home',
      href: null,
      paths: ['/', '/index.html', '/peca.html', '/restaurante.html', '/parceiro.html'],
      icon: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z" />'
    },
    {
      key: 'racas',
      label: 'Raças',
      href: 'racas.html',
      paths: ['/racas.html', '/raca.html'],
      icon: '<path d="M5 7.5c2.8-2.4 6.2-2.9 10-1.6 2.6.9 4.2 2.9 4.8 6.1.2 1.2-.7 2.3-1.9 2.3h-1.2l-1.1 3.2h-2.1l.5-3.2H9.9l.5 3.2H8.3l-1.1-3.2H5.8c-1.2 0-2.1-1-1.9-2.2.2-1.8.6-3.3 1.1-4.6Z" /><path d="M15.4 6.2c.5-1.8 1.7-2.9 3.6-3.2" />'
    },
    {
      key: 'scan',
      label: 'Scan',
      href: 'scan.html',
      paths: ['/scan.html'],
      icon: '<path d="M6 8V6h2" /><path d="M16 6h2v2" /><path d="M18 16v2h-2" /><path d="M8 18H6v-2" /><path d="M8 12h8" /><path d="M12 8v8" />'
    },
    {
      key: 'produtores',
      label: 'Produtores',
      href: 'produtores.html',
      paths: ['/produtores.html', '/produtor.html'],
      icon: '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" />'
    },
    {
      key: 'about',
      label: 'About',
      href: 'about.html',
      paths: ['/about.html'],
      icon: '<path d="M12 17v-6" /><path d="M12 7h.01" /><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />'
    }
  ];

  function normalizarPath(pathname) {
    return pathname.replace(/\/+$/, '') || '/';
  }

  function isActive(item, pathname) {
    return item.paths.indexOf(pathname) !== -1;
  }

  function renderItem(item, pathname) {
    var active = isActive(item, pathname);
    var className = 'ma-bottom-nav__item ma-bottom-nav__item--' + item.key + (active ? ' is-active' : '');
    var aria = active ? ' aria-current="page"' : '';

    return (
      '<a class="' + className + '" href="' + item.href + '"' + aria + '>' +
        '<span class="ma-bottom-nav__icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" focusable="false">' + item.icon + '</svg>' +
        '</span>' +
        '<span class="ma-bottom-nav__label">' + item.label + '</span>' +
      '</a>'
    );
  }

  function init() {
    if (document.querySelector('.ma-bottom-nav')) return;

    var pathname = normalizarPath(window.location.pathname);
    if (pathname === '/' || pathname === '/index.html') return;

    var homeItem = ITEMS.find(function (i) { return i.key === 'home'; });
    if (homeItem) homeItem.href = 'peca.html?id=' + getHomePecaId();

    var nav = document.createElement('nav');
    nav.className = 'ma-bottom-nav';
    nav.setAttribute('aria-label', 'Navegação principal');
    nav.innerHTML = ITEMS.map(function (item) {
      return renderItem(item, pathname);
    }).join('');
    document.body.appendChild(nav);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
