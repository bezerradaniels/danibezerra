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
