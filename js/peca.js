(function () {
  'use strict';

  const PECAS_JSON = 'data/pecas.json';

  function getIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
  }

  function mostrarErro(mensagem) {
    const main = document.querySelector('.detail-content');
    if (!main) return;
    main.innerHTML =
      '<div style="padding: 40px 24px; text-align: center;">' +
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
    let html = '';
    for (let i = 0; i < items.length; i += 2) {
      const a = items[i];
      const b = items[i + 1];
      html += '<div class="frame-4">';
      html += renderCaracteristicaItem(a);
      if (b) html += renderCaracteristicaItem(b);
      html += '</div>';
    }
    return html;
  }

  function renderCaracteristicaItem(item) {
    return (
      '<div class="fats">' +
        '<img class="icon" src="' + esc(item.icone) + '" alt="" />' +
        '<div class="frame-5">' +
          '<div class="text-wrapper-6">' + esc(item.label) + '</div>' +
          '<div class="text-wrapper-8">' + esc(item.valor) + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderAlimentacaoItem(item) {
    return (
      '<div class="fats-3">' +
        '<div class="hugeicons-eco-power">' +
          '<img class="img" src="' + esc(item.icone) + '" alt="" />' +
        '</div>' +
        '<div class="bem-estar-animal">' + esc(item.texto) + '</div>' +
      '</div>'
    );
  }

  function renderCriacao(criacao) {
    const regular = criacao.alimentacao_regular.map(renderAlimentacaoItem).join('');
    const acabamento = criacao.fase_acabamento.map(renderAlimentacaoItem).join('');
    return (
      '<div class="group">' +
        '<h2 id="sec-criacao-alimentacao" class="heading-xl">Criação e Alimentação</h2>' +
        '<p class="text-wrapper-12">' + esc(criacao.descricao) + '</p>' +
      '</div>' +
      '<div class="frame-wrapper">' +
        '<div class="frame-10">' +
          '<h3 class="text-wrapper-13">Alimentação Regular</h3>' +
          '<div class="frame-11">' + regular + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="frame-wrapper">' +
        '<div class="frame-10">' +
          '<h3 class="text-wrapper-13">Fase de Acabamento</h3>' +
          '<div class="fats-4">' + acabamento + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderCertificacaoDop(cert) {
    var criteriosHtml = cert.criterios.map(function (c) {
      return (
        '<div class="frame-4">' +
          '<div class="fats">' +
            '<div class="frame-5">' +
              '<div class="text-wrapper-6">' + esc(c.label) + '</div>' +
              '<div class="text-wrapper-8">' + esc(c.valor) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="frame-4" style="margin-bottom: 16px;">' +
        '<div class="text-wrapper-8" style="font-weight: 600;">' + esc(cert.estado) + '</div>' +
      '</div>' +
      '<div class="text-wrapper-8" style="font-size: 1.4em; font-weight: 700; margin-bottom: 12px;">' + esc(cert.codigoAnimal) + '</div>' +
      '<p class="text-wrapper-12" style="margin-bottom: 16px;">' + esc(cert.texto) + '</p>' +
      '<div class="nutritions">' + criteriosHtml + '</div>' +
      (cert.nota ? '<p class="text-wrapper-12" style="margin-top: 16px;">' + esc(cert.nota) + '</p>' : '')
    );
  }

  function renderOQueEsperar(items) {
    return items.map(function (item) { return '• ' + esc(item); }).join('<br />');
  }

  function renderPecaRara(pecaRara) {
    let html = '';
    pecaRara.bullets.forEach(function (b) {
      if (b.label) {
        html += '<span class="text-wrapper-15">• ' + esc(b.label) + ': </span>';
        html += '<span class="text-wrapper-16">' + esc(b.texto) + '<br /></span>';
      } else {
        html += '<span class="text-wrapper-16">• ' + esc(b.texto) + '<br /></span>';
      }
    });
    if (pecaRara.nota_final) {
      const n = pecaRara.nota_final;
      html += '<span class="text-wrapper-16">• ' + esc(n.prefixo) + ' </span>';
      html += '<span class="text-wrapper-15">' + esc(n.destaque) + '</span>';
      html += '<span class="text-wrapper-16"> ' + esc(n.sufixo) + '</span>';
    }
    return html;
  }

  function renderProdutorCard(produtor) {
    const img = produtor.imagem
      ? '<img class="clip-path-group" src="' + esc(produtor.imagem) + '" alt="Fotografia do produtor ' + esc(produtor.nome) + '" />'
      : '';
    return (
      img +
      '<div class="frame-14">' +
        '<div class="text-wrapper-18">' + esc(produtor.nome) + '</div>' +
        '<p class="text-wrapper-21">' + esc(produtor.descricao) + '</p>' +
        '<a href="produtor.html?id=' + esc(produtor.id) + '" class="button-arrow-right" aria-label="Conhecer o produtor ' + esc(produtor.nome) + '">' +
          '<span class="text-wrapper-20">Conhecer o produtor</span>' +
          '<span class="iconly-light-arrow" aria-hidden="true"></span>' +
        '</a>' +
      '</div>'
    );
  }

  function renderRestauranteCard(restaurante) {
    const img = restaurante.imagem
      ? '<div class="image-wrapper"><img class="image-2" src="' + esc(restaurante.imagem) + '" alt="Fotografia de ' + esc(restaurante.nome) + '" onerror="this.parentElement.hidden=true" /></div>'
      : '';
    return (
      img +
      '<div class="frame-16">' +
        '<div class="text-wrapper-18">' + esc(restaurante.nome) + '</div>' +
        '<p class="text-wrapper-21">' + esc(restaurante.descricao) + '</p>' +
        '<a href="restaurante.html?id=' + esc(restaurante.id) + '" class="button-arrow-right" aria-label="Conhecer o destino gastronómico ' + esc(restaurante.nome) + '">' +
          '<span class="text-wrapper-20">Conhecer o restaurante</span>' +
          '<span class="iconly-light-arrow" aria-hidden="true"></span>' +
        '</a>' +
      '</div>'
    );
  }

  function renderRacaCard(raca) {
    const img = raca.imagem
      ? '<div class="image-wrapper"><img class="image-2" src="' + esc(raca.imagem) + '" alt="Imagem representativa da raça ' + esc(raca.nome) + '" /></div>'
      : '';
    return (
      img +
      '<div class="frame-16">' +
        '<div class="text-wrapper-18">' + esc(raca.nome) + '</div>' +
        '<p class="text-wrapper-21">' + esc(raca.descricao) + '</p>' +
        '<a href="raca.html?id=' + esc(raca.id) + '" class="button-arrow-right" aria-label="Conhecer a raça ' + esc(raca.nome) + '">' +
          '<span class="text-wrapper-20">Conhecer a raça</span>' +
          '<span class="iconly-light-arrow" aria-hidden="true"></span>' +
        '</a>' +
      '</div>'
    );
  }

  function preencherPeca(peca) {
    document.title = peca.titulo + (peca.subtitulo ? ' | ' + peca.subtitulo : '') + ' | Meat Azores';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && peca.descricao) metaDesc.setAttribute('content', peca.descricao);

    const imgEl = document.querySelector('.element-product .image');
    if (imgEl && peca.imagem_bg) imgEl.style.backgroundImage = 'url(' + peca.imagem_bg + ')';

    if (peca.secao_titulo) setText('sec-esta-peca', peca.secao_titulo);

    setText('peca-titulo', peca.titulo);

    const subtituloEl = document.getElementById('peca-subtitulo');
    if (subtituloEl) {
      if (peca.subtitulo) subtituloEl.textContent = peca.subtitulo;
      else subtituloEl.hidden = true;
    }

    const selecionadoWrapper = document.getElementById('peca-selecionado-wrapper');
    if (selecionadoWrapper) {
      if (peca.selecionado_por) setText('peca-selecionado-por', peca.selecionado_por);
      else selecionadoWrapper.hidden = true;
    }

    const confeccionadoWrapper = document.getElementById('peca-confeccionado-wrapper');
    if (confeccionadoWrapper) {
      if (peca.confeccionado_por) setText('peca-confeccionado-por', peca.confeccionado_por);
      else confeccionadoWrapper.hidden = true;
    }

    setText('peca-descricao', peca.descricao);

    if (peca.caracteristicas && peca.caracteristicas.length) {
      setHTML('peca-caracteristicas', renderCaracteristicas(peca.caracteristicas));
    } else {
      esconderSecao('sec-caracteristicas-secao');
    }

    if (peca.certificacaoDop) {
      setText('sec-certificacao', peca.certificacaoDop.titulo);
      setHTML('peca-certificacao', renderCertificacaoDop(peca.certificacaoDop));
    } else {
      esconderSecao('sec-certificacao-secao');
    }

    if (peca.criacao) {
      setHTML('peca-criacao', renderCriacao(peca.criacao));
    } else {
      esconderSecao('sec-criacao-secao');
    }

    if (peca.o_que_esperar && peca.o_que_esperar.length) {
      setHTML('peca-o-que-esperar', renderOQueEsperar(peca.o_que_esperar));
    } else {
      esconderSecao('sec-esperar-secao');
    }

    if (peca.terroir) {
      setText('peca-terroir-titulo', peca.terroir.titulo);
      setText('peca-terroir-texto', peca.terroir.texto);
    } else {
      esconderSecao('sec-terroir-secao');
    }

    if (peca.peca_rara) {
      setText('peca-rara-titulo', peca.peca_rara.titulo);
      setHTML('peca-rara-conteudo', renderPecaRara(peca.peca_rara));
    } else {
      esconderSecao('sec-rara-secao');
    }

    if (peca.produtor) {
      setHTML('peca-produtor', renderProdutorCard(peca.produtor));
    } else {
      esconderSecao('sec-produtor-secao');
    }

    if (peca.raca) {
      setHTML('peca-raca', renderRacaCard(peca.raca));
    } else {
      esconderSecao('sec-raca-secao');
    }

    if (peca.restaurante) {
      setHTML('peca-restaurante', renderRestauranteCard(peca.restaurante));
    } else {
      esconderSecao('sec-restaurante-secao');
    }

    if (peca.feedback) {
      if (peca.feedback.titulo) setText('sec-feedback', peca.feedback.titulo);
      setText('peca-feedback-texto', peca.feedback.texto);
      const btnFeedback = document.getElementById('btn-feedback');
      const btnHeaderFeedback = document.getElementById('btn-header-feedback');
      const labelBotao = (peca.feedback.botao || 'Avaliar a experiência') + ' (abre num novo separador)';
      if (btnFeedback) {
        if (peca.feedback.url) {
          btnFeedback.href = peca.feedback.url;
        } else {
          btnFeedback.hidden = true;
        }
        if (peca.feedback.botao) btnFeedback.textContent = peca.feedback.botao;
        btnFeedback.setAttribute('aria-label', labelBotao);
      }
      if (btnHeaderFeedback) {
        if (peca.feedback.url) {
          btnHeaderFeedback.href = peca.feedback.url;
        } else {
          btnHeaderFeedback.hidden = true;
        }
        btnHeaderFeedback.setAttribute('aria-label', labelBotao);
      }
    } else {
      esconderSecao('sec-feedback-secao');
    }
  }

  function init() {
    const id = getIdFromURL();

    if (!id) {
      mostrarErro('Nenhuma peça foi indicada. Por favor, verifique o endereço utilizado.');
      return;
    }

    fetch(PECAS_JSON)
      .then(function (resp) {
        if (!resp.ok) throw new Error('Erro HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (dados) {
        const peca = dados.pecas.find(function (p) { return p.id === id; });
        if (!peca) {
          mostrarErro('A peça solicitada não foi encontrada. Por favor, verifique o endereço utilizado.');
          return;
        }
        preencherPeca(peca);
      })
      .catch(function (err) {
        console.error('[peca.js]', err);
        mostrarErro('Não foi possível carregar os dados desta peça. Tente novamente mais tarde.');
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
