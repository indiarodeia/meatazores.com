(function () {
  'use strict';

  var U = (window.MA && window.MA.utils) || {};
  var hasValue = U.hasValue || function (v) { return v != null && v !== ''; };

  var I = (window.MA && window.MA.i18n) || {};
  var t = I.t || function (v) { return typeof v === 'string' ? v : (v && v.pt) || ''; };
  var tValue = I.tValue || function (v) { return typeof v === 'string' ? v : t(v); };
  var label = I.label || function (s) { return s; };
  var withLang = I.withLang || function (u) { return u; };

  // Traduções específicas para os títulos das páginas de listagem
  var PAGE_HEADINGS = {
    racas: {
      eyebrow: { pt: 'Explorar', en: 'Explore' },
      title: { pt: 'Raças', en: 'Breeds' },
      text: { pt: 'Conheça as raças bovinas associadas às peças MeatAzores.', en: 'Discover the cattle breeds associated with MeatAzores pieces.' }
    },
    produtores: {
      eyebrow: { pt: 'Explorar', en: 'Explore' },
      title: { pt: 'Produtores', en: 'Producers' },
      text: { pt: 'Conheça quem cria, preserva e dá origem às peças MeatAzores.', en: 'Meet the people who raise, preserve and give origin to MeatAzores pieces.' }
    }
  };

  function aplicarHeaderListagem(tipo) {
    var conf = PAGE_HEADINGS[tipo];
    if (!conf) return;
    var page = document.querySelector('.app-page');
    if (!page) return;
    var eyebrow = page.querySelector('.app-page__eyebrow');
    var title = page.querySelector('.app-page__title');
    var textEl = page.querySelector('.app-page__text');
    if (eyebrow) eyebrow.textContent = t(conf.eyebrow);
    if (title) title.textContent = t(conf.title);
    if (textEl) textEl.textContent = t(conf.text);
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function carregarImagem(img) {
    var src = img.getAttribute('data-src');
    if (!src) return;
    img.onerror = function () {
      img.hidden = true;
      img.onerror = null;
    };
    img.src = src;
  }

  function renderRacaCard(raca) {
    var nome = t(raca.nome);
    var tipo = t(raca.tipo);
    return (
      '<a class="catalog-card" href="' + esc(withLang('raca.html?id=' + esc(raca.id))) + '" aria-label="' + esc(label('Conhecer a raça') + ' ' + nome) + '">' +
        '<span class="catalog-card__thumb">' +
          (raca.imagem
            ? '<img class="catalog-card__img" loading="lazy" data-src="' + esc(raca.imagem) + '" alt="Imagem representativa da raça ' + esc(nome) + '" />'
            : '') +
        '</span>' +
        '<span class="catalog-card__body">' +
          '<span class="catalog-card__title">' + esc(nome) + '</span>' +
          (tipo ? '<span class="catalog-card__meta">' + esc(tipo) + '</span>' : '') +
        '</span>' +
        '<span class="catalog-card__arrow" aria-hidden="true">›</span>' +
      '</a>'
    );
  }

  function renderProdutorCard(produtor) {
    var nome = t(produtor.nome);
    var tipo = t(produtor.tipo);
    var loc = tValue(t(produtor.localizacao));
    return (
      '<a class="catalog-card" href="' + esc(withLang('produtor.html?id=' + esc(produtor.id))) + '" aria-label="' + esc(label('Conhecer o produtor') + ' ' + nome) + '">' +
        '<span class="catalog-card__thumb catalog-card__thumb--round">' +
          (produtor.thumb
            ? '<img class="catalog-card__img" loading="lazy" data-src="' + esc(produtor.thumb) + '" alt="Fotografia do produtor ' + esc(nome) + '" />'
            : '') +
        '</span>' +
        '<span class="catalog-card__body">' +
          '<span class="catalog-card__title">' + esc(nome) + '</span>' +
          (tipo ? '<span class="catalog-card__meta">' + esc(tipo) + '</span>' : '') +
          (loc ? '<span class="catalog-card__location">' + esc(loc) + '</span>' : '') +
        '</span>' +
        '<span class="catalog-card__arrow" aria-hidden="true">›</span>' +
      '</a>'
    );
  }

  function mostrarErro(container, mensagem) {
    container.innerHTML = '<p class="app-page__text">' + esc(label(mensagem)) + '</p>';
  }

  function initRacas() {
    var container = document.getElementById('racas-lista');
    if (!container) return;

    aplicarHeaderListagem('racas');

    fetch('data/racas.json')
      .then(function (resp) {
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (data) {
        var racas = (data.racas || []).filter(function (r) { return hasValue(r) && hasValue(r.id) && hasValue(r.nome); });
        if (!racas.length) {
          mostrarErro(container, label('Ainda não existem raças disponíveis.'));
          return;
        }
        container.innerHTML = racas.map(renderRacaCard).join('');
        container.querySelectorAll('img[data-src]').forEach(carregarImagem);
      })
      .catch(function () {
        mostrarErro(container, label('Não foi possível carregar as raças.'));
      });
  }

  function initProdutores() {
    var container = document.getElementById('produtores-lista');
    if (!container) return;

    aplicarHeaderListagem('produtores');

    fetch('data/produtores.json')
      .then(function (resp) {
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (data) {
        var produtores = (data.produtores || []).filter(function (p) { return hasValue(p) && hasValue(p.id) && hasValue(p.nome); });
        if (!produtores.length) {
          mostrarErro(container, label('Ainda não existem produtores disponíveis.'));
          return;
        }
        container.innerHTML = produtores.map(renderProdutorCard).join('');
        container.querySelectorAll('img[data-src]').forEach(carregarImagem);
      })
      .catch(function () {
        mostrarErro(container, label('Não foi possível carregar os produtores.'));
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initRacas();
    initProdutores();
  });
})();
