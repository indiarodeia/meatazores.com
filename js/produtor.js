(function () {
  'use strict';

  const PRODUTORES_JSON = 'data/produtores.json';
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

  function renderGaleria(imagens, nomeProdutor) {
    const container = document.getElementById('produtor-galeria');
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
      img.alt = nomeProdutor + ', fotografia ' + (i + 1);
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

  function preencherProdutor(produtor, todasAsPecas) {
    document.title = produtor.nome + ' | ' + produtor.tipo + ' | Meat Azores';

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && produtor.descricao_curta) {
      metaDesc.setAttribute('content', produtor.descricao_curta);
    }

    // Hero
    var heroImg = document.getElementById('produtor-hero');
    if (heroImg) {
      if (produtor.hero) {
        heroImg.src = produtor.hero;
        heroImg.alt = 'Imagem de capa do produtor ' + produtor.nome;
        heroImg.onerror = function () { esconderSecao('produtor-hero-wrapper'); };
      } else {
        esconderSecao('produtor-hero-wrapper');
      }
    }

    // Thumb
    var thumbImg = document.getElementById('produtor-thumb');
    if (thumbImg) {
      if (produtor.thumb) {
        thumbImg.src = produtor.thumb;
        thumbImg.alt = 'Fotografia do produtor ' + produtor.nome;
        thumbImg.onerror = function () { this.hidden = true; };
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
      } else {
        esconderSecao('sec-pecas-secao');
      }
    } else {
      esconderSecao('sec-pecas-secao');
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
        .catch(function () { return { pecas: [] }; })
    ]).then(function (resultados) {
      var produtor = resultados[0].produtores.find(function (p) { return p.id === id; });
      if (!produtor) {
        mostrarErro('O produtor solicitado não foi encontrado. Por favor, verifique o endereço utilizado.');
        return;
      }
      preencherProdutor(produtor, resultados[1].pecas || []);
    }).catch(function (err) {
      console.error('[produtor.js]', err);
      mostrarErro('Não foi possível carregar os dados deste produtor. Tente novamente mais tarde.');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
