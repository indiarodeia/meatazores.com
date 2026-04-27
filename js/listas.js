(function () {
  'use strict';

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
    return (
      '<a class="catalog-card" href="raca.html?id=' + esc(raca.id) + '" aria-label="Conhecer a raça ' + esc(raca.nome) + '">' +
        '<span class="catalog-card__thumb">' +
          (raca.imagem
            ? '<img class="catalog-card__img" data-src="' + esc(raca.imagem) + '" alt="Imagem representativa da raça ' + esc(raca.nome) + '" />'
            : '') +
        '</span>' +
        '<span class="catalog-card__body">' +
          '<span class="catalog-card__title">' + esc(raca.nome) + '</span>' +
          (raca.tipo ? '<span class="catalog-card__meta">' + esc(raca.tipo) + '</span>' : '') +
        '</span>' +
        '<span class="catalog-card__arrow" aria-hidden="true">›</span>' +
      '</a>'
    );
  }

  function renderProdutorCard(produtor) {
    return (
      '<a class="catalog-card" href="produtor.html?id=' + esc(produtor.id) + '" aria-label="Conhecer o produtor ' + esc(produtor.nome) + '">' +
        '<span class="catalog-card__thumb catalog-card__thumb--round">' +
          (produtor.thumb
            ? '<img class="catalog-card__img" data-src="' + esc(produtor.thumb) + '" alt="Fotografia do produtor ' + esc(produtor.nome) + '" />'
            : '') +
        '</span>' +
        '<span class="catalog-card__body">' +
          '<span class="catalog-card__title">' + esc(produtor.nome) + '</span>' +
          (produtor.tipo ? '<span class="catalog-card__meta">' + esc(produtor.tipo) + '</span>' : '') +
          (produtor.localizacao ? '<span class="catalog-card__location">' + esc(produtor.localizacao) + '</span>' : '') +
        '</span>' +
        '<span class="catalog-card__arrow" aria-hidden="true">›</span>' +
      '</a>'
    );
  }

  function mostrarErro(container, mensagem) {
    container.innerHTML = '<p class="app-page__text">' + esc(mensagem) + '</p>';
  }

  function initRacas() {
    var container = document.getElementById('racas-lista');
    if (!container) return;

    fetch('data/racas.json')
      .then(function (resp) {
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (data) {
        var racas = data.racas || [];
        if (!racas.length) {
          mostrarErro(container, 'Ainda não existem raças disponíveis.');
          return;
        }
        container.innerHTML = racas.map(renderRacaCard).join('');
        container.querySelectorAll('img[data-src]').forEach(carregarImagem);
      })
      .catch(function () {
        mostrarErro(container, 'Não foi possível carregar as raças.');
      });
  }

  function initProdutores() {
    var container = document.getElementById('produtores-lista');
    if (!container) return;

    fetch('data/produtores.json')
      .then(function (resp) {
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (data) {
        var produtores = data.produtores || [];
        if (!produtores.length) {
          mostrarErro(container, 'Ainda não existem produtores disponíveis.');
          return;
        }
        container.innerHTML = produtores.map(renderProdutorCard).join('');
        container.querySelectorAll('img[data-src]').forEach(carregarImagem);
      })
      .catch(function () {
        mostrarErro(container, 'Não foi possível carregar os produtores.');
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initRacas();
    initProdutores();
  });
})();
