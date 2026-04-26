(function () {
  'use strict';

  const PARCEIROS_JSON = 'data/parceiros.json';
  const PECAS_JSON = 'data/pecas.json';
  const ASSETS_EM_FALTA = new Set([
    'assets/talho-rocha.jpg'
  ]);

  function getIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setText(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor || '';
  }

  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function esconderSecao(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  function mostrarErro(mensagem) {
    esconderSecao('parceiro-hero-wrapper');
    const main = document.querySelector('.frame-19');
    if (!main) return;
    main.innerHTML =
      '<div style="padding: 60px 24px; text-align: center;">' +
        '<p style="font-family: sans-serif; color: #444; margin-bottom: 24px;">' + esc(mensagem) + '</p>' +
        '<a href="index.html" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">Voltar ao início</a>' +
      '</div>';
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
      setImagemSeExistir(img, src, function () {
        var wrapper = img.closest('.group-4');
        if (wrapper) wrapper.hidden = true;
        else img.hidden = true;
      });
    });
  }

  function renderPontos(pontos) {
    return pontos.map(function (ponto) {
      return (
        '<div class="frame-24" role="listitem">' +
          '<div class="text-wrapper-30">• ' + esc(ponto) + '</div>' +
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

  function preencherParceiro(parceiro, todasAsPecas) {
    document.title = parceiro.nome + ' | Parceiro | Meat Azores';

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && parceiro.descricao_curta) metaDesc.setAttribute('content', parceiro.descricao_curta);

    var heroImg = document.getElementById('parceiro-hero');
    setImagemSeExistir(heroImg, parceiro.imagem, function () { esconderSecao('parceiro-hero-wrapper'); });

    var logoImg = document.getElementById('parceiro-logo');
    if (logoImg) {
      logoImg.alt = 'Logótipo de ' + parceiro.nome;
      setImagemSeExistir(logoImg, parceiro.logo, function () { logoImg.hidden = true; });
    }

    setText('parceiro-tipo-papel', [parceiro.tipo, parceiro.papel].filter(Boolean).join(' · '));
    setText('parceiro-nome', parceiro.nome);
    setText('parceiro-localizacao', parceiro.localizacao);
    setText('parceiro-descricao-curta', parceiro.descricao_curta);
    setText('parceiro-texto-principal', parceiro.texto_principal);

    var website = document.getElementById('parceiro-website');
    if (website && parceiro.website) {
      website.href = parceiro.website;
      website.hidden = false;
    }

    if (parceiro.pontos && parceiro.pontos.length) {
      setHTML('parceiro-pontos', renderPontos(parceiro.pontos));
    } else {
      esconderSecao('sec-pontos-secao');
    }

    if (parceiro.pecas_associadas && parceiro.pecas_associadas.length) {
      var pecas = parceiro.pecas_associadas
        .map(function (id) { return todasAsPecas.find(function (p) { return p.id === id; }); })
        .filter(Boolean);
      if (pecas.length) {
        setHTML('parceiro-pecas', pecas.map(renderPecaCard).join(''));
        carregarImagensDiferidas(document.getElementById('parceiro-pecas'));
      } else {
        esconderSecao('sec-pecas-secao');
      }
    } else {
      esconderSecao('sec-pecas-secao');
    }
  }

  function init() {
    var id = getIdFromURL();
    if (!id) {
      mostrarErro('Nenhum parceiro foi indicado. Por favor, verifique o endereço utilizado.');
      return;
    }

    Promise.all([
      fetch(PARCEIROS_JSON).then(function (r) {
        if (!r.ok) throw new Error('Erro HTTP ' + r.status);
        return r.json();
      }),
      fetch(PECAS_JSON)
        .then(function (r) { return r.json(); })
        .catch(function () { return { pecas: [] }; })
    ]).then(function (resultados) {
      var parceiro = resultados[0].parceiros.find(function (p) { return p.id === id; });
      if (!parceiro) {
        mostrarErro('O parceiro solicitado não foi encontrado. Por favor, verifique o endereço utilizado.');
        return;
      }
      preencherParceiro(parceiro, resultados[1].pecas || []);
    }).catch(function (err) {
      console.error('[parceiro.js]', err);
      mostrarErro('Não foi possível carregar os dados deste parceiro. Tente novamente mais tarde.');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
