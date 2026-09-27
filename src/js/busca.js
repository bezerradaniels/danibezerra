// Busca da FAQ e da Academy: filtra na hora os itens da página.
// Fonte: src/js/busca.js, injetado inline pelo build (scripts/inline-css.mjs).
// Sem JS, todo o conteúdo continua visível e a caixa de busca fica escondida.
(function () {
    var formBusca = document.getElementById('busca-form');
    var campo = document.getElementById('busca');
    if (!formBusca || !campo) return;

    var itens = [].slice.call(document.querySelectorAll('[data-busca-item]'));
    var grupos = [].slice.call(document.querySelectorAll('[data-busca-grupo]'));
    var contador = document.getElementById('busca-contador');
    var vazio = document.getElementById('busca-vazio');

    // Ignora maiúsculas e acentos: "seo local" encontra "SEO Local", "analise" encontra "análise".
    function normalizar(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    var textos = itens.map(function (el) { return normalizar(el.textContent); });

    function termosDe(valor) {
        return normalizar(valor.trim()).split(/\s+/).filter(Boolean);
    }

    function filtrar() {
        var termos = termosDe(campo.value);
        var total = 0;

        itens.forEach(function (el, i) {
            var ok = termos.every(function (t) { return textos[i].indexOf(t) !== -1; });
            el.hidden = !ok;
            if (ok) total++;
            // Na FAQ, abre as respostas encontradas para a pessoa ler direto.
            if (el.tagName === 'DETAILS') el.open = termos.length > 0 && ok;
        });

        grupos.forEach(function (grupo) {
            grupo.hidden = !grupo.querySelector('[data-busca-item]:not([hidden])');
        });

        contador.textContent = termos.length
            ? total + (total === 1 ? ' resultado' : ' resultados')
            : '';
        vazio.hidden = total !== 0;

        // URL compartilhável: /faq/?q=prazo
        try {
            var url = new URL(window.location.href);
            if (campo.value.trim()) url.searchParams.set('q', campo.value.trim());
            else url.searchParams.delete('q');
            history.replaceState(null, '', url);
        } catch (e) { }

        return total;
    }

    // Evento de busca do GA4 (search / search_term), só depois que a pessoa
    // para de digitar, para não registrar cada letra.
    var ultimoEnviado = '';
    var esperaGa = null;
    function registrarBusca(total) {
        clearTimeout(esperaGa);
        esperaGa = setTimeout(function () {
            var termo = campo.value.trim();
            if (termo.length < 3 || termo === ultimoEnviado) return;
            ultimoEnviado = termo;
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'search', search_term: termo, resultados: total });
        }, 1200);
    }

    var espera = null;
    campo.addEventListener('input', function () {
        clearTimeout(espera);
        espera = setTimeout(function () { registrarBusca(filtrar()); }, 120);
    });

    formBusca.addEventListener('submit', function (e) {
        e.preventDefault();
        registrarBusca(filtrar());
    });

    // Atalho "/" para focar a busca, como em sites de documentação.
    document.addEventListener('keydown', function (e) {
        var alvo = e.target;
        var digitando = alvo && (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable);
        if (e.key === '/' && !digitando) {
            e.preventDefault();
            campo.focus();
        }
    });

    // Link direto para uma pergunta (/faq/#id) abre a resposta.
    function abrirAncora() {
        if (!window.location.hash) return;
        var alvo = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (alvo && alvo.tagName === 'DETAILS') alvo.open = true;
    }
    window.addEventListener('hashchange', abrirAncora);

    formBusca.hidden = false;
    try {
        var inicial = new URL(window.location.href).searchParams.get('q');
        if (inicial) {
            campo.value = inicial;
            filtrar();
        }
    } catch (e) { }
    abrirAncora();
})();
