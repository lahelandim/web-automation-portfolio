# Como testar localmente e publicar a demonstração

> A Brightside Home Cleaning é uma empresa **fictícia**. O formulário de contato **não envia mensagens**; ele só valida os campos e avisa que nada foi enviado.

## 1. Testar localmente

Requisito: [Node.js](https://nodejs.org) 18 ou mais novo.

```bash
npm install
npx playwright install chromium   # uma vez só, necessário para os testes
npm start                         # abre o site em http://localhost:8080
```

Dica: também dá para abrir o arquivo `index.html` direto no navegador.

### Testar no celular (mesma rede Wi-Fi)
1. Descubra o IP do computador (Windows: `ipconfig`; Mac/Linux: `ifconfig` ou `ip addr`).
2. Com `npm start` rodando, abra `http://SEU-IP:8080` no celular.

### Rodar todas as verificações

```bash
npm run check
```

Isso executa, em ordem:

| Comando | O que verifica |
| --- | --- |
| `npm run lint` | HTML (html-validate) e CSS (stylelint) |
| `npm test` | Seções, um só `h1`, alt nas imagens, sem rolagem horizontal (375/768/1280 px), menu mobile, formulário, links internos, arquivos referenciados e acessibilidade (axe, WCAG 2.1 AA) |
| `npm run check:secrets` | Procura chaves, tokens e senhas nos arquivos do projeto |
| `npm run check:audit` | `npm audit` das dependências de produção (o site não tem nenhuma) |

Se o Playwright não achar o navegador, rode `npx playwright install chromium` ou defina `CHROMIUM_PATH` com o caminho de um Chrome/Chromium instalado.

Os testes automáticos **não substituem** uma revisão manual: navegue só com o teclado (Tab/Enter/Esc), teste em um celular real e, se possível, rode o Lighthouse do Chrome.

## 2. Publicar uma demonstração (gratuito)

O site é estático, então qualquer hospedagem estática serve.

### Opção A: GitHub Pages
1. No repositório: **Settings > Pages > Source: GitHub Actions**.
2. O workflow `.github/workflows/pages.yml` publica a cada push na branch `main` (ou manualmente em **Actions > Deploy to GitHub Pages > Run workflow**, escolhendo a branch).
3. O endereço será parecido com `https://SEU-USUARIO.github.io/web-automation-portfolio/`.

Observação: o deploy automático só roda depois que o código chegar na `main`. Isso exige a sua aprovação do pull request.

### Opção B: Netlify Drop (mais rápido, sem configuração)
1. Rode `npm run check` e gere uma pasta só com os arquivos públicos: `index.html`, `assets/`, `robots.txt`, `sitemap.xml`.
2. Arraste essa pasta em https://app.netlify.com/drop.

### Opção C: Cloudflare Pages ou Netlify conectados ao GitHub
Conecte o repositório, deixe o comando de build vazio e use a raiz do repositório como pasta de publicação.

## 3. Antes de mostrar a clientes
- A demo está com `noindex` e `Disallow: /` de propósito, para não aparecer no Google. Se quiser que ela seja encontrada, remova os dois.
- Atualize `sitemap.xml` e as URLs em `index.html` com o seu domínio real.
- Mantenha os avisos de "fictício" visíveis: não apresente os depoimentos como reais.
- Para um cliente real, conecte o formulário a um serviço (veja o README, seção "Making the form work in production").
