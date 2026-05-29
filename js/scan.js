(function () {
  'use strict';

  var I = (window.MA && window.MA.i18n) || {};
  var label = I.label || function (s) { return s; };

  var scanner = null;
  var ativo = false;

  function el(id) { return document.getElementById(id); }

  function mostrarStatus(mensagem, variante) {
    var status = el('scan-status');
    if (!status) return;
    status.textContent = label(mensagem);
    status.hidden = false;
    status.classList.remove('scan__status--error', 'scan__status--info', 'scan__status--success');
    if (variante) status.classList.add('scan__status--' + variante);
  }

  function limparStatus() {
    var status = el('scan-status');
    if (!status) return;
    status.textContent = '';
    status.hidden = true;
    status.classList.remove('scan__status--error', 'scan__status--info', 'scan__status--success');
  }

  function aplicarTextos() {
    var titulo = el('scan-titulo');
    if (titulo) titulo.textContent = label('Scan');
    var intro = el('scan-intro');
    if (intro) intro.textContent = label('Aponte a câmara ao QR Code da peça para conhecer a sua origem.');
    var btnStart = el('scan-start');
    if (btnStart) btnStart.textContent = label('Iniciar scan');
    var btnStop = el('scan-stop');
    if (btnStop) btnStop.textContent = label('Parar');
    document.title = label('Scan') + ' | MeatAzores';
  }

  function bibliotecaDisponivel() {
    return typeof window.Html5Qrcode !== 'undefined';
  }

  function navegarParaUrlSegura(textoLido) {
    // Aceita só URLs same-origin. QR codes externos mostram aviso, sem redirecionar.
    var origemAtual = window.location.origin;
    var url;
    try {
      // Permite URLs absolutas (http(s)://...) e relativas (path)
      url = new URL(textoLido, window.location.href);
    } catch (e) {
      return false;
    }
    if (url.origin !== origemAtual) {
      mostrarStatus('QR Code não é da MeatAzores.', 'error');
      return false;
    }
    mostrarStatus('A abrir peça...', 'success');
    window.location.href = url.toString();
    return true;
  }

  function pararScanner() {
    if (!scanner || !ativo) {
      ativo = false;
      atualizarUI(false);
      return Promise.resolve();
    }
    return scanner.stop().then(function () {
      ativo = false;
      try { scanner.clear(); } catch (e) {}
      atualizarUI(false);
    }).catch(function () {
      ativo = false;
      atualizarUI(false);
    });
  }

  function atualizarUI(emScan) {
    var reader = el('scan-reader');
    var placeholder = el('scan-placeholder');
    var btnStart = el('scan-start');
    var btnStop = el('scan-stop');
    if (reader) reader.hidden = !emScan;
    if (placeholder) placeholder.hidden = emScan;
    if (btnStart) btnStart.hidden = emScan;
    if (btnStop) btnStop.hidden = !emScan;
  }

  function iniciarScanner() {
    if (!bibliotecaDisponivel()) {
      mostrarStatus('Não foi possível carregar o leitor de QR. Verifique a ligação à internet.', 'error');
      return;
    }
    limparStatus();
    atualizarUI(true);

    if (!scanner) scanner = new window.Html5Qrcode('scan-reader');

    var config = {
      fps: 10,
      qrbox: function (largura, altura) {
        var menor = Math.min(largura, altura);
        var tamanho = Math.floor(menor * 0.7);
        return { width: tamanho, height: tamanho };
      },
      aspectRatio: 1.0
    };

    scanner
      .start({ facingMode: 'environment' }, config, onScanSucesso, onScanErroSilencioso)
      .then(function () { ativo = true; })
      .catch(function (err) {
        ativo = false;
        atualizarUI(false);
        var msg = String(err && err.message ? err.message : err || '');
        if (/Permission|NotAllowed|denied/i.test(msg)) {
          mostrarStatus('Permissão da câmara negada. Ative o acesso nas definições do navegador.', 'error');
        } else if (/NotFound|no camera/i.test(msg)) {
          mostrarStatus('Não foi encontrada nenhuma câmara neste dispositivo.', 'error');
        } else if (/NotReadable|TrackStartError/i.test(msg)) {
          mostrarStatus('A câmara está a ser usada por outra aplicação.', 'error');
        } else {
          mostrarStatus('Não foi possível iniciar a câmara.', 'error');
        }
      });
  }

  function onScanSucesso(textoLido) {
    if (!ativo) return;
    ativo = false;
    if (scanner) {
      scanner.stop().then(function () {
        try { scanner.clear(); } catch (e) {}
      }).catch(function () {});
    }
    atualizarUI(false);
    navegarParaUrlSegura(textoLido);
  }

  function onScanErroSilencioso() {
    // Chamado em cada frame sem QR — não fazer nada
  }

  function init() {
    aplicarTextos();
    var btnStart = el('scan-start');
    var btnStop = el('scan-stop');
    if (btnStart) btnStart.addEventListener('click', iniciarScanner);
    if (btnStop) btnStop.addEventListener('click', function () { pararScanner(); });
    window.addEventListener('pagehide', function () { pararScanner(); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
