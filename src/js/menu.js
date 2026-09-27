// Menu principal: mega menu no desktop e painel no mobile.
// Fonte: src/js/menu.js, injetado pelo build junto com src/partials/menu.html.
(function () {
    var nav = document.getElementById('menu-principal');
    if (!nav) return;

    // Destaca o link da página atual (aria-current também ajuda leitores de tela).
    var caminho = window.location.pathname.replace(/index\.html$/, '');
    [].forEach.call(nav.querySelectorAll('a[href^="/"]'), function (a) {
        if (a.getAttribute('href') === caminho) a.setAttribute('aria-current', 'page');
    });

    // ---------------------------------------------------------------------
    // Desktop: painéis de Serviços e Aprenda

    var botoes = [].slice.call(nav.querySelectorAll('[data-menu-botao]'));
    // Em mouse/trackpad o painel abre ao passar o mouse; no toque, só no clique.
    var temHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function painel(botao) {
        return document.getElementById(botao.getAttribute('aria-controls'));
    }

    function aberto(botao) {
        return botao.getAttribute('aria-expanded') === 'true';
    }

    function fechar(botao) {
        botao.setAttribute('aria-expanded', 'false');
        painel(botao).hidden = true;
    }

    function abrir(botao) {
        botoes.forEach(function (outro) { if (outro !== botao) fechar(outro); });
        botao.setAttribute('aria-expanded', 'true');
        painel(botao).hidden = false;
    }

    function fecharTodos() {
        botoes.forEach(fechar);
    }

    botoes.forEach(function (botao) {
        var item = botao.closest('[data-menu-item]');
        var espera = null;

        botao.addEventListener('click', function () {
            // Com hover, o clique só garante que está aberto (senão o clique
            // logo depois de passar o mouse fecharia o painel).
            if (aberto(botao) && !temHover) fechar(botao);
            else abrir(botao);
        });

        if (temHover) {
            item.addEventListener('mouseenter', function () {
                clearTimeout(espera);
                abrir(botao);
            });
            // Pequena espera para o mouse atravessar o espaço até o painel.
            item.addEventListener('mouseleave', function () {
                espera = setTimeout(function () { fechar(botao); }, 150);
            });
        }

        // Fecha quando o foco do teclado sai do item.
        item.addEventListener('focusout', function (e) {
            if (!item.contains(e.relatedTarget)) fechar(botao);
        });
    });

    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) fecharTodos();
    });

    // ---------------------------------------------------------------------
    // Mobile: painel aberto pelo botão de menu

    var toggle = document.getElementById('menu-toggle');
    var mobile = document.getElementById('menu-mobile');

    function definirMobile(abrirMenu) {
        toggle.setAttribute('aria-expanded', abrirMenu ? 'true' : 'false');
        toggle.setAttribute('aria-label', abrirMenu ? 'Fechar menu' : 'Abrir menu');
        mobile.hidden = !abrirMenu;
        // Trava a rolagem da página atrás do menu.
        document.documentElement.classList.toggle('overflow-hidden', abrirMenu);
    }

    if (toggle && mobile) {
        toggle.addEventListener('click', function () {
            definirMobile(toggle.getAttribute('aria-expanded') !== 'true');
        });

        // Links para âncoras da mesma página (/#portfolio) não recarregam:
        // fecha o menu para a seção aparecer.
        mobile.addEventListener('click', function (e) {
            if (e.target.closest('a')) definirMobile(false);
        });

        // Ao girar o tablet ou aumentar a janela até o desktop, some com o painel.
        var desktop = window.matchMedia('(min-width: 1024px)');
        var aoMudar = function (m) { if (m.matches) definirMobile(false); };
        if (desktop.addEventListener) desktop.addEventListener('change', aoMudar);
        else if (desktop.addListener) desktop.addListener(aoMudar);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var ativo = botoes.filter(aberto)[0];
        if (ativo) {
            fecharTodos();
            ativo.focus();
        }
        if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
            definirMobile(false);
            toggle.focus();
        }
    });
})();
