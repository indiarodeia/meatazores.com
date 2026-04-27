(function () {
  'use strict';

  const PRODUTORES_JSON = 'data/produtores.json';
  const PECAS_JSON = 'data/pecas.json';
  const RACAS_JSON = 'data/racas.json';

  function getIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function mostrarErro(mensagem) {
    esconderSecao('produtor-hero-wrapper');
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

  function setImagemSeExistir(img, src, onMissing) {
    if (!img || !src) {
      if (onMissing) onMissing();
      return;
    }
    img.onerror = function () {
      img.onerror = null;
      if (onMissing) onMissing();
    };
    img.src = src;
  }

  function carregarImagensDiferidas(scope) {
    var imagens = (scope || document).querySelectorAll('img[data-src]');
    imagens.forEach(function (img) {
      var src = img.getAttribute('data-src');
      if (!src) return;
      img.onerror = function () {
        img.onerror = null;
        var wrapper = img.closest('.group-4');
        if (wrapper) wrapper.hidden = true;
        else img.hidden = true;
      };
      img.src = src;
    });
  }

  function renderNumeros(numeros) {
    return numeros.map(function (item) {
      return (
        '<div class="frame-24" role="listitem">' +
          '<div class="text-wrapper-29">' + esc(item.label) + '</div>' +
          '<div class="text-wrapper-30">' + esc(item.valor) + '</div>' +
        '</div>'
      );
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

  function renderRacaCard(raca) {
    const imgHtml = raca.imagem
      ? '<div class="group-4"><img class="image-5" data-src="' + esc(raca.imagem) + '" alt="Imagem representativa da raça ' + esc(raca.nome) + '" /></div>'
      : '';
    return (
      '<div class="frame-27">' +
        imgHtml +
        '<div class="frame-28">' +
          '<div class="text-wrapper-33">' + esc(raca.nome) + '</div>' +
          (raca.descricao_curta ? '<p class="text-wrapper-34">' + esc(raca.descricao_curta) + '</p>' : '') +
          '<a href="raca.html?id=' + esc(raca.id) + '" class="button-arrow-right-2" aria-label="Conhecer a raça ' + esc(raca.nome) + '">' +
            '<span class="text-wrapper-35">Conhecer a raça</span>' +
            '<span class="iconly-light-arrow-2" aria-hidden="true"></span>' +
          '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function renderGaleria(imagens, nomeProdutor) {
    const container = document.getElementById('produtor-galeria');
    if (!imagens || imagens.length === 0) {
      esconderSecao('sec-galeria-secao');
      return;
    }

    var total = imagens.length;
    var falhas = 0;

    imagens.forEach(function (src, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'galeria-thumb';
      btn.setAttribute('aria-label', 'Ver fotografia ' + (i + 1) + ' de ' + nomeProdutor + ' em tamanho maior');

      var img = document.createElement('img');
      img.alt = nomeProdutor + ', fotografia ' + (i + 1);

      btn.appendChild(img);
      container.appendChild(btn);

      btn.addEventListener('click', function () {
        if (window.MA && window.MA.abrirLightbox) {
          window.MA.abrirLightbox(src, img.alt);
        }
      });

      setImagemSeExistir(img, src, function () {
        btn.hidden = true;
        falhas++;
        if (falhas === total) esconderSecao('sec-galeria-secao');
      });
    });
  }

  function preencherProdutor(produtor, todasAsPecas, todasAsRacas) {
    document.title = produtor.nome + ' | ' + produtor.tipo + ' | Meat Azores';

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && produtor.descricao_curta) {
      metaDesc.setAttribute('content', produtor.descricao_curta);
    }

    // Hero
    var heroImg = document.getElementById('produtor-hero');
    if (heroImg) {
      if (produtor.hero) {
        heroImg.alt = 'Imagem de capa do produtor ' + produtor.nome;
        setImagemSeExistir(heroImg, produtor.hero, function () { esconderSecao('produtor-hero-wrapper'); });
      } else {
        esconderSecao('produtor-hero-wrapper');
      }
    }

    // Thumb
    var thumbImg = document.getElementById('produtor-thumb');
    if (thumbImg) {
      if (produtor.thumb) {
        thumbImg.alt = 'Fotografia do produtor ' + produtor.nome;
        setImagemSeExistir(thumbImg, produtor.thumb, function () { thumbImg.hidden = true; });
      } else {
        thumbImg.hidden = true;
      }
    }

    // Cabeçalho
    setText('produtor-tipo', produtor.tipo);
    setText('produtor-nome', produtor.nome);
    setText('produtor-localizacao', produtor.localizacao);

    // Sobre
    setText('produtor-descricao-curta', produtor.descricao_curta);

    // História
    if (produtor.historia) {
      setText('produtor-historia', produtor.historia);
    } else {
      esconderSecao('sec-historia-secao');
    }

    // Exploração em números
    if (produtor.numeros && produtor.numeros.length) {
      setHTML('produtor-numeros', renderNumeros(produtor.numeros));
    } else {
      esconderSecao('sec-numeros-secao');
    }

    // Maneio e alimentação
    if (produtor.maneio_alimentacao) {
      setText('produtor-maneio', produtor.maneio_alimentacao);
    } else {
      esconderSecao('sec-maneio-secao');
    }

    // Ligação à raça
    if (produtor.ligacao_raca) {
      if (produtor.ligacao_raca_titulo) setText('sec-ligacao-titulo', produtor.ligacao_raca_titulo);
      setText('produtor-ligacao-raca', produtor.ligacao_raca);
    } else {
      esconderSecao('sec-ligacao-secao');
    }

    // Nota especial
    if (produtor.nota_especial) {
      setText('produtor-nota-especial', produtor.nota_especial);
    } else {
      esconderSecao('sec-nota-secao');
    }

    // Peças associadas
    if (produtor.pecas_associadas && produtor.pecas_associadas.length) {
      var pecas = produtor.pecas_associadas
        .map(function (id) { return todasAsPecas.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (pecas.length) {
        setHTML('produtor-pecas', pecas.map(renderPecaCard).join(''));
        carregarImagensDiferidas(document.getElementById('produtor-pecas'));
      } else {
        esconderSecao('sec-pecas-secao');
      }
    } else {
      esconderSecao('sec-pecas-secao');
    }

    // Raças associadas
    if (produtor.racas_associadas && produtor.racas_associadas.length) {
      var racas = produtor.racas_associadas
        .map(function (id) { return todasAsRacas.find(function (r) { return r.id === id; }); })
        .filter(Boolean);
      if (racas.length) {
        setHTML('produtor-racas', racas.map(renderRacaCard).join(''));
        carregarImagensDiferidas(document.getElementById('produtor-racas'));
      } else {
        esconderSecao('sec-racas-secao');
      }
    } else {
      esconderSecao('sec-racas-secao');
    }

    // Galeria
    renderGaleria(produtor.galeria, produtor.nome);
  }

  function init() {
    var id = getIdFromURL();

    if (!id) {
      mostrarErro('Nenhum produtor foi indicado. Por favor, verifique o endereço utilizado.');
      return;
    }

    Promise.all([
      fetch(PRODUTORES_JSON).then(function (r) {
        if (!r.ok) throw new Error('Erro HTTP ' + r.status);
        return r.json();
      }),
      fetch(PECAS_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { pecas: [] }; }),
      fetch(RACAS_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { racas: [] }; })
    ]).then(function (resultados) {
      var produtor = resultados[0].produtores.find(function (p) { return p.id === id; });
      if (!produtor) {
        mostrarErro('O produtor solicitado não foi encontrado. Por favor, verifique o endereço utilizado.');
        return;
      }
      preencherProdutor(produtor, resultados[1].pecas || [], resultados[2].racas || []);
    }).catch(function (err) {
      console.error('[produtor.js]', err);
      mostrarErro('Não foi possível carregar os dados deste produtor. Tente novamente mais tarde.');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
