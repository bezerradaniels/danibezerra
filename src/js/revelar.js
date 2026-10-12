// Entrada suave ao rolar: os elementos com data-revelar surgem quando entram na tela.
// Fonte: src/js/revelar.js, injetado inline pelo build (scripts/inline-css.mjs).
// O estilo fica em src/styles/input.css (.revelar / .revelado).
// Sem JS, sem IntersectionObserver ou com prefers-reduced-motion, nada é escondido.
(function () {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var alvos = [].slice.call(document.querySelectorAll('[data-revelar]'));
    if (!alvos.length) return;

    // Devolve o elemento ao estado normal, para o hover dele voltar a mandar na transição.
    function limpar(el) {
        el.classList.remove('revelar', 'revelado');
        el.style.transitionDelay = '';
    }

    var observador = new IntersectionObserver(function (entradas) {
        // Quem entra junto (uma linha de cards, por exemplo) aparece em sequência.
        var ordem = 0;
        entradas.forEach(function (entrada) {
            if (!entrada.isIntersecting) return;
            var el = entrada.target;
            observador.unobserve(el);
            el.style.transitionDelay = Math.min(ordem++, 5) * 80 + 'ms';
            el.classList.add('revelado');
            el.addEventListener('transitionend', function fim(e) {
                if (e.target !== el || e.propertyName !== 'opacity') return;
                el.removeEventListener('transitionend', fim);
                limpar(el);
            });
            // Rede de segurança: aba em segundo plano pode não disparar transitionend.
            setTimeout(function () { limpar(el); }, 2000);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    // Só esconde o que está abaixo da dobra: o que já aparece na tela fica como está.
    var altura = window.innerHeight;
    alvos.forEach(function (el) {
        if (el.getBoundingClientRect().top < altura * 0.92) return;
        el.classList.add('revelar');
        observador.observe(el);
    });
})();
