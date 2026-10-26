// Formulário de acesso ao infográfico (landing /engenharia-de-demanda-2026/): nome, e-mail e WhatsApp num modal.
// Fonte: src/js/form-infografico.js, injetado inline pelo build (scripts/inline-css.mjs).
// O envio vai para api/contato.php (campo `material`); ao confirmar, grava o acesso no localStorage
// e leva ao infográfico, que confere a mesma chave antes de abrir.
(function () {
    var CHAVE = 'acesso-infografico-engenharia-demanda-2026';
    var DESTINO = '/engenharia-de-demanda-2026/infografico/';

    var form = document.getElementById('form-infografico');
    var modal = document.getElementById('modal-infografico');
    var fundo = document.getElementById('modal-infografico-fundo');
    if (!form || !modal || !fundo) return;
    var erroGeral = document.getElementById('infografico-erro');
    var botao = document.getElementById('botao-infografico');
    var textoBotao = botao.textContent.trim();

    function liberado() {
        try { return localStorage.getItem(CHAVE) !== null; } catch (e) { return false; }
    }

    // ---------------- Modal ----------------
    var ultimoFoco = null;

    function aberto() {
        return modal.hasAttribute('data-aberto');
    }

    function abrir() {
        if (aberto()) return;
        ultimoFoco = document.activeElement;
        modal.setAttribute('data-aberto', '');
        fundo.setAttribute('data-aberto', '');
        document.documentElement.classList.add('overflow-hidden');
        // O visibility só passa a "visible" no primeiro quadro da transição; antes disso o foco é ignorado.
        setTimeout(function () { if (aberto()) modal.focus({ preventScroll: true }); }, 50);
    }

    function fechar() {
        if (!aberto()) return;
        modal.removeAttribute('data-aberto');
        fundo.removeAttribute('data-aberto');
        document.documentElement.classList.remove('overflow-hidden');
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
    }

    // Quem já se cadastrou neste navegador vai direto ao infográfico (o link segue normalmente).
    document.addEventListener('click', function (e) {
        var link = e.target.closest && e.target.closest('[data-abrir-infografico]');
        if (link) {
            if (liberado()) return;
            e.preventDefault();
            abrir();
            return;
        }
        if (aberto() && (e.target === fundo || (e.target.closest && e.target.closest('[data-fechar-modal]')))) fechar();
    });

    document.addEventListener('keydown', function (e) {
        if (!aberto()) return;
        if (e.key === 'Escape') {
            fechar();
            return;
        }
        // Mantém o Tab dentro do modal.
        if (e.key === 'Tab') {
            var itens = [].slice.call(modal.querySelectorAll('a[href], button, input'))
                .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
            if (!itens.length) return;
            var primeiro = itens[0];
            var ultimo = itens[itens.length - 1];
            if (e.shiftKey && (document.activeElement === primeiro || document.activeElement === modal)) {
                e.preventDefault();
                ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primeiro.focus();
            }
        }
    });

    // ---------------- Validação ----------------
    var mensagens = {
        nome: 'Informe seu nome.',
        email: 'Informe um e-mail válido, como voce@empresa.com.',
        telefone: 'Informe seu WhatsApp com DDD.'
    };

    var campos = Object.keys(mensagens).map(function (chave) {
        return {
            chave: chave,
            input: document.getElementById('infografico-' + chave),
            erro: document.getElementById('erro-infografico-' + chave)
        };
    });

    var classesErro = ['border-red-500', 'focus:border-red-500'];

    function validar(campo) {
        var ok = campo.input.checkValidity();
        campo.input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        classesErro.forEach(function (cls) { campo.input.classList[ok ? 'remove' : 'add'](cls); });
        campo.erro.textContent = ok ? '' : (campo.input.validity.customError ? campo.input.validationMessage : mensagens[campo.chave]);
        campo.erro.classList[ok ? 'add' : 'remove']('hidden');
        return ok;
    }

    // WhatsApp: máscara (00) 00000-0000 e validação de celular brasileiro.
    // Mesmas regras de src/js/form-contato.js e api/contato.php.
    var telefone = document.getElementById('infografico-telefone');
    var DDDS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28,
        31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74,
        75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94,
        95, 96, 97, 98, 99];

    function digitosTelefone(valor) {
        var d = valor.replace(/\D/g, '');
        if (d.length > 11 && d.slice(0, 2) === '55') d = d.slice(2);
        return d.replace(/^0+/, '').slice(0, 11);
    }

    function formatarTelefone(d) {
        if (d.length === 0) return '';
        if (d.length <= 2) return '(' + d;
        if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
        return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    }

    function motivoTelefone(d) {
        if (d.length === 0) return '';
        if (d.length < 11) return 'Número incompleto. Use DDD + 9 dígitos, como (11) 99876-5432.';
        if (DDDS.indexOf(Number(d.slice(0, 2))) === -1) return 'O DDD ' + d.slice(0, 2) + ' não existe. Confira o número.';
        if (d[2] !== '9') return 'Informe um número de celular: depois do DDD, ele começa com 9.';
        if (/^(\d)\1+$/.test(d.slice(3)) || '12345678'.indexOf(d.slice(3)) !== -1 || '87654321'.indexOf(d.slice(3)) !== -1) {
            return 'Esse número não parece real. Confira os dígitos.';
        }
        return '';
    }

    function aplicarMascara() {
        var valor = telefone.value;
        var cursor = telefone.selectionStart;
        var digitosAntes = cursor === null ? null : valor.slice(0, cursor).replace(/\D/g, '').length;
        var d = digitosTelefone(valor);
        var formatado = formatarTelefone(d);

        if (formatado !== valor) {
            telefone.value = formatado;
            // Mantém o cursor no mesmo dígito ao editar no meio do número.
            if (digitosAntes !== null && document.activeElement === telefone) {
                var pos = 0;
                for (var vistos = 0; pos < formatado.length && vistos < digitosAntes; pos++) {
                    if (/\d/.test(formatado[pos])) vistos++;
                }
                telefone.setSelectionRange(pos, pos);
            }
        }
        telefone.setCustomValidity(motivoTelefone(d));
    }

    telefone.addEventListener('input', aplicarMascara);
    aplicarMascara();

    // Valida ao sair do campo; limpa o erro enquanto a pessoa corrige.
    campos.forEach(function (campo) {
        campo.input.addEventListener('blur', function () {
            if (campo.input.value !== '') validar(campo);
        });
        campo.input.addEventListener('input', function () {
            if (campo.input.getAttribute('aria-invalid') === 'true') validar(campo);
        });
    });

    // ---------------- Envio ----------------
    function mostrarErro(texto) {
        erroGeral.textContent = texto;
        erroGeral.classList.remove('hidden');
    }

    var redirecionou = false;
    function irParaInfografico() {
        if (redirecionou) return;
        redirecionou = true;
        window.location.assign(DESTINO);
    }

    var enviando = false;
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (enviando) return;
        erroGeral.classList.add('hidden');

        var primeiroInvalido = null;
        campos.forEach(function (campo) {
            if (!validar(campo) && !primeiroInvalido) primeiroInvalido = campo.input;
        });
        if (primeiroInvalido) {
            primeiroInvalido.focus();
            return;
        }

        enviando = true;
        botao.disabled = true;
        botao.textContent = 'Liberando acesso...';
        var liberou = false;
        try {
            var res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
            var dados = await res.json().catch(function () { return {}; });
            if (!res.ok || !dados.ok) {
                mostrarErro(dados.erro || 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.');
                return;
            }

            try {
                localStorage.setItem(CHAVE, new Date().toISOString());
            } catch (err) { }
            liberou = true;

            // O redirecionamento espera o GTM entregar o evento (eventCallback);
            // o setTimeout cobre o caso de o GTM não carregar (bloqueador, rede).
            if (dados.registrado !== false) {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'form_infografico_enviado',
                    form_id: 'form-infografico',
                    form_nome: 'Infográfico Engenharia de Demanda 2026',
                    origem: 'site',
                    eventCallback: irParaInfografico,
                    eventTimeout: 2000
                });
                setTimeout(irParaInfografico, 2500);
            } else {
                irParaInfografico();
            }
        } catch (err) {
            // O fetch só rejeita quando a requisição nem chegou ao servidor.
            mostrarErro('Sem conexão com o servidor. Verifique sua internet ou fale pelo WhatsApp.');
        } finally {
            enviando = false;
            if (!liberou) {
                botao.disabled = false;
                botao.textContent = textoBotao;
            }
        }
    });

    // Vindo do infográfico sem cadastro (/#acesso), abre o modal.
    if (location.hash === '#acesso' && !liberado()) window.addEventListener('load', function () { setTimeout(abrir, 250); });
})();
