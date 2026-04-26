(function () {
  'use strict';

  const RESTAURANTES_JSON = 'data/restaurantes.json';
  const PECAS_JSON = 'data/pecas.json';

  function getIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function mostrarErro(mensagem) {
    const main = document.querySelector('.frame-19');
    if (!main) return;
    main.innerHTML =
      '<div style="padding: 60px 24px; text-align: center;">' +
        '<p style="font-family: sans-serif; color: #444; margin-bottom: 24px;">' + esc(mensagem) + '</p>' +
        '<a href="index.html" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">Voltar ao início</a>' +
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

  function renderPecaCard(peca) {
    const imgHtml = peca.imagem_bg
      ? '<div class="group-4"><img class="image-5" src="' + esc(peca.imagem_bg) + '" alt="' + esc(peca.titulo) + '" onerror="this.parentElement.hidden=true" /></div>'
      : '';
    return (
      '<div class="frame-27">' +
        imgHtml +
        '<div class="frame-28">' +
          '<div class="text-wrapper-33">' + esc(peca.titulo) + '</div>' +
          (peca.subtitulo ? '<p class="text-wrapper-34">' + esc(peca.subtitulo) + '</p>' : '') +
          '<a href="peca.html?id=' + esc(peca.id) + '" class="button-arrow-right-2" aria-label="Ver peça ' + esc(peca.titulo) + '">' +
            '<span class="text-wrapper-35">Ver peça</span>' +
            '<span class="iconly-light-arrow-2" aria-hidden="true"></span>' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function preencherRestaurante(restaurante, todasAsPecas) {
    document.title = restaurante.nome + ' | Meat Azores';

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && restaurante.descricao_curta) {
      metaDesc.setAttribute('content', restaurante.descricao_curta);
    }

    // Hero
    var heroImg = document.getElementById('restaurante-hero');
    if (heroImg) {
      if (restaurante.hero) {
        heroImg.src = restaurante.hero;
        heroImg.alt = 'Imagem de capa de ' + restaurante.nome;
        heroImg.onerror = function () { esconderSecao('restaurante-hero-wrapper'); };
      } else {
        esconderSecao('restaurante-hero-wrapper');
      }
    }

    // Imagem
    var imagemEl = document.getElementById('restaurante-imagem');
    if (imagemEl) {
      if (restaurante.imagem && restaurante.imagem !== restaurante.hero) {
        imagemEl.src = restaurante.imagem;
        imagemEl.alt = 'Fotografia de ' + restaurante.nome;
        imagemEl.onerror = function () { this.hidden = true; };
      } else {
        imagemEl.hidden = true;
      }
    }

    // Cabeçalho
    setText('restaurante-tipo', restaurante.tipo);
    setText('restaurante-nome', restaurante.nome);
    setText('restaurante-localizacao', restaurante.localizacao);

    // Sobre
    setText('restaurante-descricao-curta', restaurante.descricao_curta);

    // Texto principal
    if (restaurante.texto_principal) {
      setText('restaurante-texto-principal', restaurante.texto_principal);
    } else {
      esconderSecao('sec-texto-secao');
    }

    // Peças associadas
    if (restaurante.pecas_associadas && restaurante.pecas_associadas.length) {
      var pecas = restaurante.pecas_associadas
        .map(function (id) { return todasAsPecas.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (pecas.length) {
        setHTML('restaurante-pecas', pecas.map(renderPecaCard).join(''));
      } else {
        esconderSecao('sec-pecas-secao');
      }
    } else {
      esconderSecao('sec-pecas-secao');
    }

    // CTA
    if (restaurante.cta) {
      setText('restaurante-cta', restaurante.cta);
    } else {
      esconderSecao('sec-cta-secao');
    }
  }

  function init() {
    var id = getIdFromURL();

    if (!id) {
      mostrarErro('Nenhum restaurante foi indicado. Por favor, verifique o endereço utilizado.');
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
        mostrarErro('O restaurante solicitado não foi encontrado. Por favor, verifique o endereço utilizado.');
        return;
      }
      preencherRestaurante(restaurante, resultados[1].pecas || []);
    }).catch(function (err) {
      console.error('[restaurante.js]', err);
      mostrarErro('Não foi possível carregar os dados deste restaurante. Tente novamente mais tarde.');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
