// Formulário de contato em duas etapas, usado na home e nas páginas de serviço.
// Fonte: src/js/form-contato.js, injetado inline pelo build (scripts/inline-css.mjs).
(function () {
    var form = document.getElementById('form-contato');
    var erroGeral = document.getElementById('contato-erro');
    var sucesso = document.getElementById('contato-sucesso');
    var etapa1 = document.getElementById('etapa-1');
    var etapa2 = document.getElementById('etapa-2');
    var botao1 = document.getElementById('botao-etapa-1');
    var botao2 = document.getElementById('botao-etapa-2');
    var botoes2 = document.getElementById('botoes-etapa-2');
    var botaoPular = document.getElementById('botao-pular');
    var etapaAtual = 1;
    // Texto de cada página, restaurado quando o envio falha.
    var textoBotao1 = botao1.textContent.trim();
    var textoBotao2 = botao2.textContent.trim();

    var mensagens = {
        nome: 'Informe seu nome.',
        email: 'Informe um e-mail válido, como voce@empresa.com.',
        telefone: 'Informe seu WhatsApp com DDD.',
        servico: 'Escolha o serviço de interesse.'
    };

    var campos = Object.keys(mensagens).map(function (chave) {
        return {
            chave: chave,
            input: document.getElementById('contato-' + chave),
            erro: document.getElementById('erro-' + chave)
        };
    }).filter(function (c) { return c.input && c.erro; });

    var classesErro = ['border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20'];

    function marcar(campo, invalido) {
        campo.input.setAttribute('aria-invalid', invalido ? 'true' : 'false');
        classesErro.forEach(function (cls) {
            campo.input.classList[invalido ? 'add' : 'remove'](cls);
        });
        if (invalido) {
            // Erro próprio do campo (setCustomValidity) tem prioridade.
            campo.erro.textContent = campo.input.validity.customError
                ? campo.input.validationMessage
                : mensagens[campo.chave];
            campo.erro.classList.remove('hidden');
        } else {
            campo.erro.textContent = '';
            campo.erro.classList.add('hidden');
        }
    }

    function validar(campo) {
        var ok = campo.input.checkValidity();
        marcar(campo, !ok);
        return ok;
    }

    // WhatsApp: máscara (00) 00000-0000 e validação de celular brasileiro.
    // Mesmas regras de api/contato.php.
    var telefone = document.getElementById('contato-telefone');
    var DDDS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28,
        31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74,
        75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94,
        95, 96, 97, 98, 99];

    // Aceita colar com +55 ou 0 na frente (ex.: +55 11 91234-5678).
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

    if (telefone) {
        // Registrado antes dos listeners de validação, para validar o valor já formatado.
        telefone.addEventListener('input', aplicarMascara);
        aplicarMascara();
    }

    // Valida ao sair do campo; limpa o erro enquanto a pessoa corrige.
    campos.forEach(function (campo) {
        campo.input.addEventListener('blur', function () {
            if (campo.input.value !== '') validar(campo);
        });
        campo.input.addEventListener('input', function () {
            if (campo.input.getAttribute('aria-invalid') === 'true') validar(campo);
        });
        campo.input.addEventListener('change', function () { validar(campo); });
    });

    function mostrarErro(texto) {
        erroGeral.textContent = texto;
        erroGeral.classList.remove('hidden');
    }

    // Envia o formulário inteiro para a API. A etapa 2 reenvia os dados
    // da etapa 1, para o segundo e-mail chegar com todas as respostas.
    async function enviar(etapa) {
        var corpo = new FormData(form);
        corpo.set('etapa', String(etapa));
        try {
            var res = await fetch(form.action, { method: 'POST', body: corpo });
            var dados = await res.json().catch(function () { return {}; });
            // Erro devolvido pelo servidor: mostra a mensagem dele, se houver.
            if (!res.ok || !dados.ok) {
                mostrarErro(dados.erro || 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.');
                return null;
            }
            return dados;
        } catch (err) {
            // O fetch só rejeita quando a requisição nem chegou ao servidor.
            mostrarErro('Sem conexão com o servidor. Verifique sua internet ou fale pelo WhatsApp.');
            return null;
        }
    }

    // Eventos para GA4/GTM. Só disparam quando o servidor confirma que o
    // e-mail saiu (registrado !== false), de modo que envio barrado pelo
    // honeypot não conta como lead.
    function eventoGa(nome, extras) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign({
            event: nome,
            form_id: 'form-contato',
            form_nome: 'Diagnóstico técnico',
            servico: form.servico.value,
            origem: 'site'
        }, extras));
    }

    var redirecionou = false;
    function irParaObrigado() {
        if (redirecionou) return;
        redirecionou = true;
        window.location.assign('/obrigado/');
    }

    function irParaEtapa2() {
        etapaAtual = 2;
        etapa1.hidden = true;
        // Sai do DOM para o Enter nos campos da etapa 2 acionar o botão certo.
        botao1.remove();
        etapa2.hidden = false;
        botoes2.hidden = false;
        var titulo = document.getElementById('titulo-etapa-2');
        titulo.focus({ preventScroll: true });
        form.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }

    async function enviarEtapa1() {
        var primeiroInvalido = null;
        campos.forEach(function (campo) {
            if (!validar(campo) && !primeiroInvalido) primeiroInvalido = campo.input;
        });

        if (primeiroInvalido) {
            primeiroInvalido.focus({ preventScroll: true });
            primeiroInvalido.scrollIntoView({ block: 'center', behavior: 'smooth' });
            return;
        }

        botao1.disabled = true;
        botao1.textContent = 'Enviando...';
        var dados = await enviar(1);
        if (!dados) {
            botao1.disabled = false;
            botao1.textContent = textoBotao1;
            return;
        }

        try {
            sessionStorage.setItem('contato_nome', form.nome.value.trim().split(/\s+/)[0]);
        } catch (e) { }

        // Nome mantido do evento de antes das etapas, para o gatilho
        // de conversão já configurado no GTM continuar valendo.
        if (dados.registrado !== false) eventoGa('form_contato_enviado', { etapa: 1 });
        irParaEtapa2();
    }

    async function enviarEtapa2() {
        var preencheu = ['empresa', 'local', 'mensagem'].some(function (nome) {
            return form[nome].value.trim() !== '';
        });
        // Nada preenchido equivale a pular: não manda e-mail repetido.
        if (!preencheu) {
            irParaObrigado();
            return;
        }

        botao2.disabled = true;
        botaoPular.disabled = true;
        botao2.textContent = 'Enviando...';
        var dados = await enviar(2);
        if (!dados) {
            botao2.disabled = false;
            botaoPular.disabled = false;
            botao2.textContent = textoBotao2;
            return;
        }

        sucesso.classList.remove('hidden');
        // O redirecionamento espera o GTM entregar o evento (eventCallback);
        // o setTimeout cobre o caso de o GTM não carregar (bloqueador, rede).
        if (dados.registrado !== false) {
            eventoGa('form_contato_etapa_2', {
                etapa: 2,
                eventCallback: irParaObrigado,
                eventTimeout: 2000
            });
            setTimeout(irParaObrigado, 2500);
        } else {
            irParaObrigado();
        }
    }

    var enviando = false;
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (enviando) return;
        enviando = true;
        erroGeral.classList.add('hidden');
        sucesso.classList.add('hidden');
        try {
            await (etapaAtual === 1 ? enviarEtapa1() : enviarEtapa2());
        } finally {
            enviando = false;
        }
    });

    // Pular: os dados da etapa 1 já chegaram por e-mail, então só redireciona.
    botaoPular.addEventListener('click', irParaObrigado);

    // Barra de CTA no mobile: aparece quando o formulário sai da viewport
    // e some quando ele volta, para nunca cobrir o botão de envio.
    var barra = document.getElementById('barra-cta');
    if (barra && 'IntersectionObserver' in window) {
        var ctaHero = document.querySelector('#inicio a[href="#form-contato"]');
        var estado = { formVisivel: true, passouHero: false };

        function atualizar() {
            var mostrar = estado.passouHero && !estado.formVisivel;
            barra.setAttribute('data-visivel', mostrar ? 'true' : 'false');
        }

        new IntersectionObserver(function (entradas) {
            estado.formVisivel = entradas[0].isIntersecting;
            atualizar();
        }, { rootMargin: '0px 0px -80px 0px' }).observe(form);

        if (ctaHero) {
            new IntersectionObserver(function (entradas) {
                var e = entradas[0];
                estado.passouHero = !e.isIntersecting && e.boundingClientRect.top < 0;
                atualizar();
            }).observe(ctaHero);
        } else {
            estado.passouHero = true;
        }
    }
})();
