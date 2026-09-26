# Rastreamento do formulário no GTM e no GA4

Como configurar o Google Tag Manager (contêiner `GTM-K7C2SK6F`) e o GA4 para medir o formulário de diagnóstico, que tem duas etapas.

## Como o formulário se comporta

| Ação do visitante | E-mail | Evento no `dataLayer` |
|---|---|---|
| Envia a etapa 1 (nome, e-mail, WhatsApp, serviço) | 1º e-mail, só com a etapa 1 | `form_contato_enviado` |
| Envia a etapa 2 (empresa, local, mensagem) | 2º e-mail, com todas as respostas | `form_contato_etapa_2` |
| Clica em **Pular** ou envia a etapa 2 vazia | nenhum | nenhum |

Em todos os casos, o visitante termina em `/obrigado/`.

Os eventos só disparam depois que o servidor confirma o envio do e-mail. Envios de robôs (barrados pelo campo oculto) não geram evento.

### Parâmetros enviados

Os dois eventos levam os mesmos parâmetros:

| Parâmetro | Exemplo | Observação |
|---|---|---|
| `etapa` | `1` ou `2` | número |
| `servico` | `Gestão de Google Ads` | opção escolhida no formulário |
| `form_id` | `form-contato` | fixo |
| `form_nome` | `Diagnóstico técnico` | fixo |
| `origem` | `site` | fixo |

Nome, e-mail e telefone **não** vão para o `dataLayer`. O Google proíbe enviar dados pessoais ao GA4, então não os adicione.

O evento da etapa 2 usa `eventCallback`: o site espera o GTM terminar de disparar as tags antes de ir para `/obrigado/`, com limite de 2 segundos.

## 1. GTM: variáveis

Em **Variáveis → Variáveis definidas pelo usuário → Nova → Variável da camada de dados**, crie uma variável para cada parâmetro:

| Nome da variável | Nome da variável da camada de dados |
|---|---|
| `DLV - etapa` | `etapa` |
| `DLV - servico` | `servico` |
| `DLV - form_id` | `form_id` |
| `DLV - form_nome` | `form_nome` |
| `DLV - origem` | `origem` |

Deixe a versão da camada de dados em **Versão 2**.

## 2. GTM: acionadores

Em **Acionadores → Novo → Evento personalizado**:

| Nome do acionador | Nome do evento |
|---|---|
| `CE - form_contato_enviado` | `form_contato_enviado` |
| `CE - form_contato_etapa_2` | `form_contato_etapa_2` |

Nos dois, marque **Todos os eventos personalizados**.

Se o contêiner já tiver um acionador para `form_contato_enviado`, reaproveite-o. O nome do evento da etapa 1 é o mesmo de antes das duas etapas.

## 3. GTM: tags

Em **Tags → Nova → Google Analytics → Evento do GA4**, crie uma tag por evento:

**Tag `GA4 - form_contato_enviado`**
- ID da métrica: o mesmo `G-XXXXXXXXXX` da tag do Google já configurada no contêiner
- Nome do evento: `form_contato_enviado`
- Parâmetros do evento:

  | Nome do parâmetro | Valor |
  |---|---|
  | `etapa` | `{{DLV - etapa}}` |
  | `servico` | `{{DLV - servico}}` |
  | `form_id` | `{{DLV - form_id}}` |
  | `form_nome` | `{{DLV - form_nome}}` |
  | `origem` | `{{DLV - origem}}` |

- Acionamento: `CE - form_contato_enviado`

**Tag `GA4 - form_contato_etapa_2`**
- Mesma configuração, com nome do evento `form_contato_etapa_2`
- Acionamento: `CE - form_contato_etapa_2`

Se já existir uma tag para `form_contato_enviado`, basta conferir se ela envia o parâmetro `etapa`.

## 4. GTM: testar e publicar

1. Clique em **Visualizar** e abra o site no Tag Assistant.
2. Envie a etapa 1 com dados reais. Na linha do tempo deve aparecer `form_contato_enviado`, com a tag `GA4 - form_contato_enviado` em **Tags disparadas**.
3. Preencha pelo menos um campo da etapa 2 e envie. Deve aparecer `form_contato_etapa_2`, com a tag correspondente disparada.
4. Repita a etapa 1 e clique em **Pular**. Não deve aparecer `form_contato_etapa_2`.
5. No GA4, abra **Administrador → DebugView** e confirme que os eventos chegam com os parâmetros.
6. Volte ao GTM e clique em **Enviar → Publicar**, com uma descrição como "Formulário em duas etapas".

Cada teste envia e-mails de verdade para a sua caixa.

## 5. GA4: dimensões personalizadas

Sem este passo, os parâmetros chegam ao GA4 mas não aparecem nos relatórios.

Em **Administrador → Exibição de dados → Definições personalizadas → Criar dimensão personalizada**:

| Nome da dimensão | Escopo | Parâmetro do evento |
|---|---|---|
| Serviço de interesse | Evento | `servico` |
| Etapa do formulário | Evento | `etapa` |

`form_id`, `form_nome` e `origem` são fixos. Só vale registrá-los se outros formulários forem usar os mesmos parâmetros no futuro.

As dimensões só valem para dados coletados depois de criadas.

## 6. GA4: eventos-chave (conversões)

Em **Administrador → Exibição de dados → Eventos**, marque como evento-chave:

- **`form_contato_enviado`**: é o lead. Os dados de contato já chegaram por e-mail nesta etapa.

Deixe `form_contato_etapa_2` como evento comum. Marcá-lo também contaria o mesmo lead duas vezes. Ele serve para medir quantos visitantes completam o formulário.

Pelo mesmo motivo, não use a visualização de `/obrigado/` como conversão: todo mundo chega lá, inclusive quem pulou, e ela se somaria à etapa 1.

Se as campanhas do Google Ads importam conversões do GA4, confira em **Google Ads → Metas → Conversões** se `form_contato_enviado` continua sendo a ação principal.

## 7. GA4: funil das duas etapas

Para ver quantos visitantes passam da etapa 1 para a 2, vá em **Explorar → Exploração de funil** e defina:

1. Etapa 1: evento `form_contato_enviado`
2. Etapa 2: evento `form_contato_etapa_2`

A queda entre as duas etapas mostra quem pulou ou saiu. Use a dimensão **Serviço de interesse** como detalhamento para ver quais serviços trazem leads mais completos.

## 8. Rastreamento dos botões (CTAs)

Todos os botões de call-to-action do site têm um atributo `data-cta` único no HTML, para identificar qual botão foi clicado. Um único evento GA4, `cta_click`, cobre todos eles — o parâmetro `cta_id` diz qual botão foi.

### Botões mapeados

| `data-cta` | Texto do botão | Onde fica |
|---|---|---|
| `header_diagnostico` | Solicitar diagnóstico | Menu do topo |
| `hero_diagnostico_gratuito` | Solicitar diagnóstico gratuito | Topo da página (mobile) |
| `form_whatsapp` | Fale comigo no WhatsApp | Abaixo do formulário |
| `camadas_diagnostico` | Descobrir em que camada meu site está | Seção "quatro camadas" |
| `servico_site` | Avaliar meu site atual | Seção de serviços — Sites |
| `servico_ads` | Auditar minha conta do Google Ads | Seção de serviços — Google Ads |
| `servico_meta` | Revisar minhas campanhas no Meta | Seção de serviços — Meta Ads |
| `servico_dados` | Organizar meus dados | Seção de serviços — Mensuração |
| `caminhos_conversar` | Conversar sobre o meu caso | Seção "três caminhos" |
| `portfolio_projeto` | Ver projeto semelhante ao meu | Seção de portfólio |
| `etapas_diagnostico` | Solicitar meu diagnóstico | Seção "seis etapas" |
| `sobre_conversar` | Conversar sobre o meu projeto | Seção "sobre" |
| `footer_whatsapp` | @bezerradaniels | Rodapé |
| `footer_email` | contato@danibezerra.com | Rodapé |
| `barra_diagnostico` | Quero meu diagnóstico | Barra fixa (mobile) |

### Botões das páginas de serviço

Cada página de serviço tem o mesmo formulário da home no topo (mesmos eventos `form_contato_enviado` e `form_contato_etapa_2`, com o serviço da página já selecionado) e três CTAs, com o prefixo da página no `data-cta`:

| Sufixo | Texto do botão | Onde fica |
|---|---|---|
| `_header` | Solicitar diagnóstico | Menu do topo (rola até o formulário) |
| `_form_whatsapp` | Fale comigo no WhatsApp | Abaixo do formulário |
| `_final_whatsapp` | Falar comigo no WhatsApp | Faixa roxa antes dos serviços relacionados |

| Prefixo | Página |
|---|---|
| `sites` | /criacao-de-sites/ |
| `blog` | /criacao-de-blog/ |
| `catalogo` | /criacao-de-catalogo-de-produtos/ |
| `trafego` | /trafego-pago/ |
| `google_ads` | /google-ads/ |
| `meta_ads` | /meta-ads/ |
| `instagram` | /anuncios-no-instagram/ |
| `seo` | /seo/ |
| `analytics` | /configuracao-google-analytics/ |

Exemplo: `google_ads_form_whatsapp`.

Se um novo botão for adicionado no futuro, basta colocar `data-cta="algum_id"` nele — a configuração abaixo já cobre qualquer elemento com esse atributo, sem precisar mexer no GTM de novo.

### 8.1 GTM: variável do ID do botão

Em **Variáveis → Variáveis definidas pelo usuário → Nova → JavaScript personalizado**, crie:

- Nome: `JS - cta_id`
- Código (cole só o conteúdo de dentro do bloco, sem as linhas com ` ```js ` e ` ``` `):

  ```js
  function () {
    var el = {{Click Element}};
    var alvo = el && el.closest ? el.closest('[data-cta]') : null;
    return alvo ? alvo.getAttribute('data-cta') : undefined;
  }
  ```

Se `{{Click Element}}` não aparecer na lista de variáveis, ative-a em **Variáveis → Variáveis internas → Configurar → Click Element** (dentro do grupo "Clicks").

### 8.2 GTM: acionador

Em **Acionadores → Novo → Clique → Todos os elementos**:

- Nome: `Clique - CTA`
- Este acionador dispara em: **Alguns cliques**
- Condição: `{{JS - cta_id}}` **não é igual a** `undefined`

Use a variável `JS - cta_id` na condição, não `{{Click Element}}` diretamente. Vários botões têm um ícone SVG dentro: se o clique cair no ícone, `{{Click Element}}` é o SVG (que não tem `data-cta`), e uma condição comparando o elemento exato nunca dispara. A variável já resolve isso com `closest()`, subindo até o `<a>` mesmo quando o clique é no ícone.

Não use a regex `.+` nessa condição: o GTM converte `undefined` no texto `"undefined"`, que satisfaz `.+`, e a tag dispararia em qualquer clique do site.

### 8.3 GTM: tag

Em **Tags → Nova → Google Analytics → Evento do GA4**:

- Nome: `GA4 - cta_click`
- ID da métrica: o mesmo `{{Google Analytics}}` das outras tags
- Nome do evento: `cta_click`
- Parâmetros do evento:

  | Nome do parâmetro | Valor |
  |---|---|
  | `cta_id` | `{{JS - cta_id}}` |

- Acionamento: `Clique - CTA`

### 8.4 Testar e publicar

Antes de testar, confirme que a versão do site com os atributos `data-cta` já está no ar. Sem eles, `JS - cta_id` fica sempre `undefined`.

1. **Visualizar**, clique em alguns botões diferentes do site.
2. Na linha do tempo deve aparecer `cta_click` a cada clique, com a tag `GA4 - cta_click` disparada e o parâmetro `cta_id` com o valor certo (confira na aba **Variables** do evento).
3. Publique com uma descrição como "Rastreamento de cliques em CTAs".

### 8.5 GA4: dimensão personalizada e relatório

Em **Administrador → Exibição de dados → Definições personalizadas → Criar dimensão personalizada**:

| Nome da dimensão | Escopo | Parâmetro do evento |
|---|---|---|
| ID do botão | Evento | `cta_id` |

Depois de criada (as dimensões só valem para dados coletados dali em diante), vá em **Relatórios → Engajamento → Eventos**, clique em `cta_click` e adicione **ID do botão** como dimensão secundária para ver o ranking de cliques por botão. Ou crie uma **Exploração de tabela** livre com dimensão "ID do botão" e métrica "Contagem de eventos" para um ranking direto.

Não marque `cta_click` como evento-chave: ele mede intenção (clique), não a conversão em si, que continua sendo `form_contato_enviado`.
