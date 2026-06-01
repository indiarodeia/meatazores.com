(function () {
  'use strict';

  const RESTAURANTES_JSON = 'data/restaurantes.json';
  const PECAS_JSON = 'data/pecas.json';
  const ASSETS_EM_FALTA = new Set();

  const U = (window.MA && window.MA.utils) || {};
  const hasValue = U.hasValue || function (v) { return v != null && v !== ''; };
  const hasArrayItems = U.hasArrayItems || function (v) { return Array.isArray(v) && v.length > 0; };

  const I = (window.MA && window.MA.i18n) || {};
  const t = I.t || function (v) { return typeof v === 'string' ? v : (v && v.pt) || ''; };
  const tValue = I.tValue || function (v) { return typeof v === 'string' ? v : t(v); };
  const label = I.label || function (s) { return s; };
  const withLang = I.withLang || function (u) { return u; };

  function getIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function mostrarErro(mensagem) {
    esconderSecao('restaurante-hero-wrapper');
    const main = document.querySelector('.frame-19');
    if (!main) return;
    main.innerHTML =
      '<div style="padding: 60px 24px; text-align: center;">' +
        '<p style="font-family: sans-serif; color: #444; margin-bottom: 24px;">' + esc(label(mensagem)) + '</p>' +
        '<a href="' + esc(withLang('index.html')) + '" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">' + esc(label('Voltar ao início')) + '</a>' +
      '</div>';
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setText(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  }

  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function esconderSecao(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  function assetExiste(src) {
    if (!src) return Promise.resolve(false);
    if (ASSETS_EM_FALTA.has(src)) return Promise.resolve(false);
    return fetch(src, { method: 'HEAD' })
      .then(function (resp) { return resp.ok; })
      .catch(function () { return false; });
  }

  function setImagemSeExistir(img, src, onMissing) {
    if (!img || !src) {
      if (onMissing) onMissing();
      return;
    }
    assetExiste(src).then(function (existe) {
      if (existe) img.src = src;
      else if (onMissing) onMissing();
    });
  }

  function carregarImagensDiferidas(scope) {
    var imagens = (scope || document).querySelectorAll('img[data-src]');
    imagens.forEach(function (img) {
      var src = img.getAttribute('data-src');
      assetExiste(src).then(function (existe) {
        if (existe) {
          img.src = src;
        } else {
          var wrapper = img.closest('.group-4');
          if (wrapper) wrapper.hidden = true;
          else img.hidden = true;
        }
      });
    });
  }

  function renderPecaCard(peca) {
    var titulo = t(peca.titulo);
    var subtitulo = t(peca.subtitulo);
    const imgHtml = peca.imagem_bg
      ? '<div class="group-4"><img class="image-5" loading="lazy" data-src="' + esc(peca.imagem_bg) + '" alt="' + esc(titulo) + '" /></div>'
      : '';
    return (
      '<div class="frame-27">' +
        imgHtml +
        '<div class="frame-28">' +
          '<div class="text-wrapper-33">' + esc(titulo) + '</div>' +
          (subtitulo ? '<p class="text-wrapper-34">' + esc(subtitulo) + '</p>' : '') +
          '<a href="' + esc(withLang('peca.html?id=' + esc(peca.id))) + '" class="button-arrow-right-2" aria-label="' + esc(label('Ver peça') + ' ' + titulo) + '">' +
            '<span class="text-wrapper-35">' + esc(label('Ver peça')) + '</span>' +
            '<span class="iconly-light-arrow-2" aria-hidden="true"></span>' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function preencherRestaurante(restaurante, todasAsPecas) {
    var nome = t(restaurante.nome);
    var descricao = restaurante.descricao_curta ? t(restaurante.descricao_curta) : '';

    var seo = window.MA && window.MA.seo;
    if (seo && seo.applySeo) {
      var ogImage = restaurante.imagem_bg || restaurante.imagem || null;
      if (ogImage && ogImage.indexOf('http') !== 0) ogImage = seo.SITE_ORIGIN + '/' + ogImage.replace(/^\/+/, '');
      seo.applySeo({
        title: nome + ' | MeatAzores',
        description: descricao,
        ogTitle: nome,
        ogDescription: descricao,
        ogImage: ogImage,
        ogType: 'restaurant'
      });
    } else {
      document.title = nome + ' | MeatAzores';
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && descricao) metaDesc.setAttribute('content', descricao);
    }

    // Traduzir headings fixos
    var headings = {
      'sec-sobre': 'Sobre o restaurante',
      'sec-texto': 'Destino gastronómico',
      'sec-pecas': 'Peças associadas',
      'sec-cta': 'Rastreabilidade'
    };
    for (var key in headings) {
      var hEl = document.getElementById(key);
      if (hEl) hEl.textContent = label(headings[key]);
    }
    // Botão "Visitar website"
    var websiteBtnText = document.querySelector('#restaurante-website .text-wrapper-20');
    if (websiteBtnText) websiteBtnText.textContent = label('Visitar website');

    // Hero
    var heroImg = document.getElementById('restaurante-hero');
    if (heroImg) {
      if (restaurante.hero) {
        heroImg.alt = 'Imagem de capa de ' + restaurante.nome;
        setImagemSeExistir(heroImg, restaurante.hero, function () { esconderSecao('restaurante-hero-wrapper'); });
      } else {
        esconderSecao('restaurante-hero-wrapper');
      }
    }

    // Imagem
    var imagemEl = document.getElementById('restaurante-imagem');
    if (imagemEl) {
      if (restaurante.imagem && restaurante.imagem !== restaurante.hero) {
        imagemEl.alt = 'Fotografia de ' + restaurante.nome;
        setImagemSeExistir(imagemEl, restaurante.imagem, function () { imagemEl.hidden = true; });
      } else {
        imagemEl.hidden = true;
      }
    }

    // Cabeçalho (esconder campos vazios)
    if (hasValue(restaurante.tipo)) setText('restaurante-tipo', t(restaurante.tipo));
    else esconderSecao('restaurante-tipo');
    setText('restaurante-nome', nome);
    if (hasValue(restaurante.localizacao)) setText('restaurante-localizacao', tValue(t(restaurante.localizacao)));
    else esconderSecao('restaurante-localizacao');

    // Sobre
    if (hasValue(restaurante.descricao_curta)) {
      setText('restaurante-descricao-curta', t(restaurante.descricao_curta));
    } else {
      esconderSecao('restaurante-descricao-curta');
    }

    // Botão website
    var websiteBtn = document.getElementById('restaurante-website');
    if (websiteBtn) {
      if (hasValue(restaurante.website)) {
        websiteBtn.href = restaurante.website;
        websiteBtn.hidden = false;
      } else {
        websiteBtn.hidden = true;
      }
    }

    // Texto principal
    if (hasValue(restaurante.texto_principal)) {
      setText('restaurante-texto-principal', t(restaurante.texto_principal));
    } else {
      esconderSecao('sec-texto-secao');
    }

    // Peças associadas
    if (hasArrayItems(restaurante.pecas_associadas)) {
      var pecas = restaurante.pecas_associadas
        .map(function (id) { return todasAsPecas.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (pecas.length) {
        setHTML('restaurante-pecas', pecas.map(renderPecaCard).join(''));
        carregarImagensDiferidas(document.getElementById('restaurante-pecas'));
      } else {
        esconderSecao('sec-pecas-secao');
      }
    } else {
      esconderSecao('sec-pecas-secao');
    }

    // CTA
    if (hasValue(restaurante.cta)) {
      setText('restaurante-cta', t(restaurante.cta));
    } else {
      esconderSecao('sec-cta-secao');
    }
  }

  function init() {
    var id = getIdFromURL();

    if (!id) {
      mostrarErro(label('O restaurante solicitado não foi encontrado. Por favor, verifique o endereço utilizado.'));
      return;
    }

    Promise.all([
      fetch(RESTAURANTES_JSON).then(function (r) {
        if (!r.ok) throw new Error('Erro HTTP ' + r.status);
        return r.json();
      }),
      fetch(PECAS_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { pecas: [] }; })
    ]).then(function (resultados) {
      var restaurante = resultados[0].restaurantes.find(function (r) { return r.id === id; });
      if (!restaurante) {
        mostrarErro(label('O restaurante solicitado não foi encontrado. Por favor, verifique o endereço utilizado.'));
        return;
      }
      preencherRestaurante(restaurante, resultados[1].pecas || []);
    }).catch(function (err) {
      console.error('[restaurante.js]', err);
      mostrarErro(label('Não foi possível carregar os dados deste restaurante. Tente novamente mais tarde.'));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
