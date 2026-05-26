(function () {
  'use strict';

  var U = (window.MA && window.MA.utils) || {};
  var hasValue = U.hasValue || function (v) { return v != null && v !== ''; };

  function pt(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && typeof value.pt === 'string') return value.pt;
    return '';
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function resolverRaca(peca) {
    if (peca.raca && hasValue(peca.raca.nome)) return pt(peca.raca.nome);
    return '';
  }

  function resolverRestaurante(peca) {
    if (peca.restaurante && hasValue(peca.restaurante.nome)) return pt(peca.restaurante.nome);
    if (hasValue(peca.confeccionado_por)) return pt(peca.confeccionado_por);
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

  function renderPecaCard(peca) {
    var id = peca.id || '';
    var titulo = pt(peca.titulo) || id;
    var raca = resolverRaca(peca);
    var restaurante = resolverRestaurante(peca);
    var thumb = peca.imagem_bg || (peca.raca && peca.raca.imagem) || '';

    return (
      '<a class="catalog-card" href="peca.html?id=' + encodeURIComponent(id) + '" aria-label="Ver peça ' + esc(titulo) + '">' +
        '<span class="catalog-card__thumb">' +
          (thumb
            ? '<img class="catalog-card__img" data-src="' + esc(thumb) + '" alt="Imagem da peça ' + esc(titulo) + '" />'
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
    container.innerHTML = '<p class="app-page__text">' + esc(mensagem) + '</p>';
  }

  function init() {
    var container = document.getElementById('pecas-lista');
    if (!container) return;

    fetch('data/pecas.json')
      .then(function (resp) {
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (data) {
        var pecas = (data.pecas || []).filter(function (p) { return hasValue(p) && hasValue(p.id); });
        if (!pecas.length) {
          mostrarErro(container, 'Ainda não existem peças registadas.');
          return;
        }
        container.innerHTML = pecas.map(renderPecaCard).join('');
        container.querySelectorAll('img[data-src]').forEach(carregarImagem);
      })
      .catch(function () {
        mostrarErro(container, 'Não foi possível carregar as peças.');
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
