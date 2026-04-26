(function () {
  'use strict';

  const RACAS_JSON = 'data/racas.json';
  const PECAS_JSON = 'data/pecas.json';
  const PRODUTORES_JSON = 'data/produtores.json';
  const ASSETS_EM_FALTA = new Set();

  function getIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function mostrarErro(mensagem) {
    esconderSecao('raca-hero-wrapper');
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

  function renderCaracteristicas(items) {
    return items.map(function (item) {
      return '<div class="frame-24" role="listitem"><div class="text-wrapper-30">• ' + esc(item) + '</div></div>';
    }).join('');
  }

  function renderPecaCard(peca) {
    const imgHtml = peca.imagem_bg
      ? '<div class="group-4"><img class="image-5" data-src="' + esc(peca.imagem_bg) + '" alt="' + esc(peca.titulo) + '" /></div>'
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
      ? '<img class="clip-path-group-2" data-src="' + esc(produtor.thumb) + '" alt="Fotografia do produtor ' + esc(produtor.nome) + '" />'
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

  function renderOutraRacaCard(raca) {
    var imgHtml = raca.imagem
      ? '<div class="outras-racas__thumb"><img class="outras-racas__img" data-src="' + esc(raca.imagem) + '" alt="Imagem representativa da raça ' + esc(raca.nome) + '" /></div>'
      : '<div class="outras-racas__thumb" aria-hidden="true"></div>';

    return (
      '<a class="outras-racas__card" href="raca.html?id=' + esc(raca.id) + '" aria-label="Conhecer a raça ' + esc(raca.nome) + '">' +
        imgHtml +
        '<span class="outras-racas__nome">' + esc(raca.nome) + '</span>' +
      '</a>'
    );
  }

  function renderOutrasRacas(racaAtual, todasAsRacas) {
    var secao = document.getElementById('sec-outras-racas-secao');
    var container = document.getElementById('raca-outras-racas');
    if (!secao || !container) return;

    var outras = (todasAsRacas || [])
      .filter(function (r) { return r && r.id !== racaAtual.id; })
      .slice(0, 8);

    if (outras.length < 1) {
      secao.hidden = true;
      container.innerHTML = '';
      return;
    }

    container.innerHTML = outras.map(renderOutraRacaCard).join('');
    secao.hidden = false;

    container.querySelectorAll('img[data-src]').forEach(function (img) {
      var src = img.getAttribute('data-src');
      setImagemSeExistir(img, src, function () { img.hidden = true; });
    });
  }

  function renderSecoesExtra(secoes) {
    return secoes.map(function (s) {
      return (
        '<section class="frame-22">' +
          '<div class="creators-4">' +
            '<h2 class="text-wrapper-31">' + esc(s.titulo) + '</h2>' +
          '</div>' +
          '<p class="text-wrapper-32">' + esc(s.texto) + '</p>' +
        '</section>' +
        '<img class="separator-3" src="assets/separator.svg" alt="" />'
      );
    }).join('');
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
      img.alt = nomeRaca + ', fotografia ' + (i + 1);
      img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';

      wrapper.appendChild(img);
      container.appendChild(wrapper);

      setImagemSeExistir(img, src, function () {
        wrapper.hidden = true;
        falhas++;
        if (falhas === total) esconderSecao('sec-galeria-secao');
      });
    });
  }

  function preencherRaca(raca, todasAsPecas, todosProdutores, todasAsRacas) {
    document.title = raca.nome + ' | Meat Azores';

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && raca.descricao_curta) {
      metaDesc.setAttribute('content', raca.descricao_curta);
    }

    // Hero
    var heroImg = document.getElementById('raca-hero');
    if (heroImg) {
      if (raca.hero) {
        heroImg.alt = 'Imagem de capa da raça ' + raca.nome;
        setImagemSeExistir(heroImg, raca.hero, function () { esconderSecao('raca-hero-wrapper'); });
      } else {
        esconderSecao('raca-hero-wrapper');
      }
    }

    // Imagem
    var imagemEl = document.getElementById('raca-imagem');
    if (imagemEl) {
      if (raca.imagem) {
        imagemEl.alt = 'Imagem representativa da raça ' + raca.nome;
        setImagemSeExistir(imagemEl, raca.imagem, function () { imagemEl.hidden = true; });
      } else {
        imagemEl.hidden = true;
      }
    }

    // Cabeçalho
    setText('raca-tipo', raca.tipo);
    setText('raca-nome', raca.nome);
    setText('raca-localizacao', raca.localizacao);

    // Logotipo oficial (opcional)
    var logoContainer = document.getElementById('raca-logo-container');
    if (logoContainer) {
      if (raca.logo) {
        var logoImg = document.createElement('img');
        logoImg.src = raca.logo;
        logoImg.alt = raca.logoAlt || '';
        logoImg.className = 'raca-logo';
        logoImg.onerror = function () { logoContainer.hidden = true; };
        logoContainer.appendChild(logoImg);
        logoContainer.hidden = false;
      } else {
        logoContainer.hidden = true;
      }
    }

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

    // Secções extra
    if (raca.secoes_extra && raca.secoes_extra.length) {
      setHTML('raca-secoes-extra', renderSecoesExtra(raca.secoes_extra));
    }

    // Peças associadas
    if (raca.pecas_associadas && raca.pecas_associadas.length) {
      var pecas = raca.pecas_associadas
        .map(function (id) { return todasAsPecas.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (pecas.length) {
        setHTML('raca-pecas', pecas.map(renderPecaCard).join(''));
        carregarImagensDiferidas(document.getElementById('raca-pecas'));
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
        carregarImagensDiferidas(document.getElementById('raca-produtores'));
      } else {
        esconderSecao('sec-produtores-secao');
      }
    } else {
      esconderSecao('sec-produtores-secao');
    }

    // Galeria
    renderGaleria(raca.galeria, raca.nome);

    // Outras raças
    renderOutrasRacas(raca, todasAsRacas);
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
      preencherRaca(raca, resultados[1].pecas || [], resultados[2].produtores || [], resultados[0].racas || []);
    }).catch(function (err) {
      console.error('[raca.js]', err);
      mostrarErro('Não foi possível carregar os dados desta raça. Tente novamente mais tarde.');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
