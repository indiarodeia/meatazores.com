(function () {
  'use strict';

  var U = (window.MA && window.MA.utils) || {};
  var hasValue = U.hasValue || function (v) { return v != null && v !== ''; };

  var I = (window.MA && window.MA.i18n) || {};
  var t = I.t || function (v) { return typeof v === 'string' ? v : (v && v.pt) || ''; };
  var label = I.label || function (s) { return s; };
  var withLang = I.withLang || function (u) { return u; };

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function resolverRacaNome(peca, todasAsRacas) {
    if (Array.isArray(peca.racas) && peca.racas.length) {
      var nomes = peca.racas
        .map(function (id) {
          var r = todasAsRacas.find(function (x) { return x.id === id; });
          return r ? t(r.nome) : '';
        })
        .filter(Boolean);
      return nomes.join(' × ');
    }
    if (peca.raca && hasValue(peca.raca.nome)) return t(peca.raca.nome);
    return '';
  }

  function resolverRestaurante(peca) {
    if (peca.restaurante && hasValue(peca.restaurante.nome)) return t(peca.restaurante.nome);
    if (hasValue(peca.confeccionado_por)) return t(peca.confeccionado_por);
    return '';
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

  function renderPecaCard(peca, todasAsRacas) {
    var id = peca.id || '';
    var titulo = t(peca.titulo) || id;
    var raca = resolverRacaNome(peca, todasAsRacas);
    var restaurante = resolverRestaurante(peca);
    var thumb = peca.imagem_bg || (peca.raca && peca.raca.imagem) || '';
    var href = withLang('peca.html?id=' + encodeURIComponent(id));
    var aria = label('Ver peça') + ' ' + titulo;

    return (
      '<a class="catalog-card" href="' + href + '" aria-label="' + esc(aria) + '">' +
        '<span class="catalog-card__thumb">' +
          (thumb
            ? '<img class="catalog-card__img" data-src="' + esc(thumb) + '" alt="' + esc(titulo) + '" />'
            : '') +
        '</span>' +
        '<span class="catalog-card__body">' +
          '<span class="catalog-card__title">' + esc(titulo) + '</span>' +
          (raca ? '<span class="catalog-card__meta">' + esc(raca) + '</span>' : '') +
          (restaurante ? '<span class="catalog-card__location">' + esc(restaurante) + '</span>' : '') +
        '</span>' +
        '<span class="catalog-card__arrow" aria-hidden="true">›</span>' +
      '</a>'
    );
  }

  function mostrarErro(container, mensagem) {
    container.innerHTML = '<p class="app-page__text">' + esc(label(mensagem)) + '</p>';
  }

  function aplicarI18nDeCabecalho() {
    var titulo = document.getElementById('pecas-titulo');
    if (titulo) titulo.textContent = label('Peças');
    var intro = document.getElementById('pecas-intro');
    if (intro) intro.textContent = label('Explore a origem, o produtor e o destino gastronómico de cada peça MeatAzores.');
    document.title = label('Peças') + ' | MeatAzores';
  }

  function init() {
    aplicarI18nDeCabecalho();

    var container = document.getElementById('pecas-lista');
    if (!container) return;

    Promise.all([
      fetch('data/pecas.json').then(function (resp) {
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        return resp.json();
      }),
      fetch('data/racas.json')
        .then(function (r) { return r.json(); })
        .catch(function () { return { racas: [] }; })
    ])
      .then(function (resultados) {
        var pecas = (resultados[0].pecas || []).filter(function (p) { return hasValue(p) && hasValue(p.id); });
        var racas = resultados[1].racas || [];
        if (!pecas.length) {
          mostrarErro(container, 'Ainda não existem peças registadas.');
          return;
        }
        container.innerHTML = pecas.map(function (p) { return renderPecaCard(p, racas); }).join('');
        container.querySelectorAll('img[data-src]').forEach(carregarImagem);
      })
      .catch(function () {
        mostrarErro(container, 'Não foi possível carregar as peças.');
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
