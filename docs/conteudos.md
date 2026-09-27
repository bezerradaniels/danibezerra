# Blog (/conteudos/): como criar e atualizar posts

Cada post é um arquivo Markdown em `content/conteudos/`. O `npm run build` transforma esses arquivos em páginas e atualiza tudo o que depende deles. Nunca edite os HTML de `conteudos/` à mão: eles são apagados e gerados de novo a cada build.

## Criar um post

1. Copie `content/conteudos/_modelo.md` para um arquivo novo. **O nome do arquivo vira a URL**: `como-escolher-palavras-chave.md` vira `/conteudos/como-escolher-palavras-chave/`. Use só letras minúsculas, números e hífens, sem acento.
2. Preencha o cabeçalho (entre as linhas `---`). Os campos estão explicados no próprio modelo.
3. Escreva o texto em Markdown abaixo do cabeçalho, começando os tópicos com `##`.
4. Rode `npm run build` (ou deixe `npm run dev` aberto, que regera sozinho ao salvar).
5. Confira a página, faça o commit e publique.

Para guardar um post pela metade sem publicar, coloque `rascunho: true` no cabeçalho.

## Atualizar um post

Edite o arquivo e preencha (ou mude) o campo `atualizado` com a data da revisão, no formato `AAAA-MM-DD`. A página passa a mostrar "Atualizado em" e a data vai para o sitemap e para o schema, o que sinaliza conteúdo fresco para o Google e para as IAs.

Não troque o nome do arquivo de um post já publicado: isso muda a URL e o endereço antigo passa a dar 404. Se precisar mesmo mudar, adicione um redirecionamento 301 no `.htaccess`.

## Remover um post

Apague o arquivo (ou marque `rascunho: true`) e rode o build. A página é removida e sai do sitemap, do feed e do `llms.txt`.

## O que o build gera

| Arquivo | O que é |
|---|---|
| `conteudos/index.html` | Listagem com busca, do mais novo para o mais antigo |
| `conteudos/<slug>/index.html` | A página de cada post |
| `conteudos/feed.xml` | Feed RSS |
| `sitemap.xml` | Bloco entre `<!-- conteudos:inicio -->` e `<!-- conteudos:fim -->` |
| `llms.txt` | Seção `## Blog` |

Cada post sai com: resposta curta no topo, sumário (a partir de 3 tópicos `##`), tempo de leitura, FAQ opcional, caixa do autor com link para o serviço da categoria, três sugestões de leitura e schema `BlogPosting` + `BreadcrumbList` (+ `FAQPage` quando há FAQ).

## Checklist de SEO, AEO, GEO e AXO

- **Título** com a pergunta ou o termo que a pessoa pesquisa. Se ficar longo, use `titulo_seo` para uma versão de até ~45 caracteres (o site acrescenta " | Dani Bezerra").
- **Descrição** de até 160 caracteres, dizendo o que a pessoa vai aprender.
- **Resposta curta** que responde o título sozinha, sem depender do resto do texto. É o trecho mais citado por buscadores e IAs.
- **Fatos, não adjetivos**: números, prazos, preços, nomes de ferramentas e datas.
- **Tópicos como perguntas** (`## Quanto custa...`, `## Como fazer...`) sempre que fizer sentido.
- **Links internos** para a página do serviço e para verbetes da Academy (`/academy/#geo`).
- **FAQ** com 2 a 4 perguntas que o texto não respondeu diretamente.
- **Atualize** os posts mais importantes a cada poucos meses e registre a data em `atualizado`.

## Erros comuns no cabeçalho

O build para e diz qual arquivo e qual campo têm problema. O mais comum: um texto com `: ` no meio (dois-pontos seguido de espaço). Nesse caso, coloque o texto inteiro entre aspas:

```yaml
resposta: "Indexar leva dias: ranquear leva meses."
```
