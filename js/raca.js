(function () {
  'use strict';

  const RACAS_JSON = 'data/racas.json';
  const PECAS_JSON = 'data/pecas.json';
  const PRODUTORES_JSON = 'data/produtores.json';

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

  function renderCaracteristicas(items) {
    return items.map(function (item) {
      return '<div class="frame-24" role="listitem"><div class="text-wrapper-30">• ' + esc(item) + '</div></div>';
    }).join('');
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

  function renderProdutorCard(produtor) {
    const imgHtml = produtor.thumb
      ? '<img class="clip-path-group-2" src="' + esc(produtor.thumb) + '" alt="Fotografia do produtor ' + esc(produtor.nome) + '" onerror="this.hidden=true" />'
      : '';
    return (
      '<div class="frame-27">' +
        imgHtml +
        '<div class="frame-28">' +
          '<div class="text-wrapper-33">' + esc(produtor.nome) + '</div>' +
          (produtor.descricao_curta ? '<p class="text-wrapper-34">' + esc(produtor.descricao_curta) + '</p>' : '') +
          '<a href="produtor.html?id=' + esc(produtor.id) + '" class="button-arrow-right-2" aria-label="Conhecer o produtor ' + esc(produtor.nome) + '">' +
            '<span class="text-wrapper-35">Conhecer o produtor</span>' +
            '<span class="iconly-light-arrow-2" aria-hidden="true"></span>' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderGaleria(imagens, nomeRaca) {
    const container = document.getElementById('raca-galeria');
    if (!imagens || imagens.length === 0) {
      esconderSecao('sec-galeria-secao');
      return;
    }

    var total = imagens.length;
    var falhas = 0;

    imagens.forEach(function (src, i) {
      var wrapper = document.createElement('div');
      wrapper.style.cssText = 'width: calc(50% - 4px); flex-shrink: 0; aspect-ratio: 4/3; overflow: hidden; border-radius: 8px; background: #e8e8e8;';

      var img = document.createElement('img');
      img.src = src;
      img.alt = nomeRaca + ', fotografia ' + (i + 1);
      img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';

      img.onerror = function () {
        wrapper.hidden = true;
        falhas++;
        if (falhas === total) esconderSecao('sec-galeria-secao');
      };

      wrapper.appendChild(img);
      container.appendChild(wrapper);
    });
  }

  function preencherRaca(raca, todasAsPecas, todosProdutores) {
    document.title = raca.nome + ' | Meat Azores';

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && raca.descricao_curta) {
      metaDesc.setAttribute('content', raca.descricao_curta);
    }

    // Hero
    var heroImg = document.getElementById('raca-hero');
    if (heroImg) {
      if (raca.hero) {
        heroImg.src = raca.hero;
        heroImg.alt = 'Imagem de capa da raça ' + raca.nome;
        heroImg.onerror = function () { esconderSecao('raca-hero-wrapper'); };
      } else {
        esconderSecao('raca-hero-wrapper');
      }
    }

    // Imagem
    var imagemEl = document.getElementById('raca-imagem');
    if (imagemEl) {
      if (raca.imagem) {
        imagemEl.src = raca.imagem;
        imagemEl.alt = 'Imagem representativa da raça ' + raca.nome;
        imagemEl.onerror = function () { this.hidden = true; };
      } else {
        imagemEl.hidden = true;
      }
    }

    // Cabeçalho
    setText('raca-tipo', raca.tipo);
    setText('raca-nome', raca.nome);
    setText('raca-localizacao', raca.localizacao);

    // Sobre
    setText('raca-descricao-curta', raca.descricao_curta);

    // Introdução
    if (raca.introducao) {
      setText('raca-introducao', raca.introducao);
    } else {
      esconderSecao('sec-introducao-secao');
    }

    // Origem e ligação ao território
    if (raca.origem_territorio) {
      setText('raca-origem-territorio', raca.origem_territorio);
    } else {
      esconderSecao('sec-origem-secao');
    }

    // Valor patrimonial e cultural
    if (raca.valor_patrimonial) {
      setText('raca-valor-patrimonial', raca.valor_patrimonial);
    } else {
      esconderSecao('sec-valor-secao');
    }

    // Características gerais
    if (raca.caracteristicas && raca.caracteristicas.length) {
      setHTML('raca-caracteristicas', renderCaracteristicas(raca.caracteristicas));
    } else {
      esconderSecao('sec-caracteristicas-secao');
    }

    // Peças associadas
    if (raca.pecas_associadas && raca.pecas_associadas.length) {
      var pecas = raca.pecas_associadas
        .map(function (id) { return todasAsPecas.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (pecas.length) {
        setHTML('raca-pecas', pecas.map(renderPecaCard).join(''));
      } else {
        esconderSecao('sec-pecas-secao');
      }
    } else {
      esconderSecao('sec-pecas-secao');
    }

    // Produtores associados
    if (raca.produtores_associados && raca.produtores_associados.length) {
      var produtores = raca.produtores_associados
        .map(function (id) { return todosProdutores.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (produtores.length) {
        setHTML('raca-produtores', produtores.map(renderProdutorCard).join(''));
      } else {
        esconderSecao('sec-produtores-secao');
      }
    } else {
      esconderSecao('sec-produtores-secao');
    }

    // Galeria
    renderGaleria(raca.galeria, raca.nome);
  }

  function init() {
    var id = getIdFromURL();

    if (!id) {
      mostrarErro('Nenhuma raça foi indicada. Por favor, verifique o endereço utilizado.');
      return;
    }

    Promise.all([
      fetch(RACAS_JSON).then(function (r) {
        if (!r.ok) throw new Error('Erro HTTP ' + r.status);
        return r.json();
      }),
      fetch(PECAS_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { pecas: [] }; }),
      fetch(PRODUTORES_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { produtores: [] }; })
    ]).then(function (resultados) {
      var raca = resultados[0].racas.find(function (r) { return r.id === id; });
      if (!raca) {
        mostrarErro('A raça solicitada não foi encontrada. Por favor, verifique o endereço utilizado.');
        return;
      }
      preencherRaca(raca, resultados[1].pecas || [], resultados[2].produtores || []);
    }).catch(function (err) {
      console.error('[raca.js]', err);
      mostrarErro('Não foi possível carregar os dados desta raça. Tente novamente mais tarde.');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
