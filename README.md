# 🧪 ServeRest Cypress Test Automation

[![CI](https://github.com/eapereira87/serverest-cypress-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/eapereira87/serverest-cypress-tests/actions/workflows/ci.yml)
![Cypress](https://img.shields.io/badge/Cypress-14.x-17202C?logo=cypress&logoColor=white)
![Node](https://img.shields.io/badge/node-20.x-green)

Este repositório contém uma suíte de **automação de testes utilizando Cypress** para validar funcionalidades da aplicação **ServeRest**.

O projeto cobre dois níveis de testes:

- **Frontend (End-to-End)** – interação com a interface web
- **API** – validação direta dos endpoints REST

A intenção deste projeto é demonstrar uma automação **simples, organizada e executável em CI**, focada em clareza e manutenção.

---

# 📌 Aplicação testada

Este projeto utiliza a aplicação de demonstração **ServeRest**, que simula uma pequena loja virtual.

Frontend  
https://front.serverest.dev

API  
https://serverest.dev

---

# 🎯 Escopo dos testes

Os testes implementados cobrem fluxos principais da aplicação.

## Frontend (E2E)

Fluxos automatizados pela interface:

Login
- login com sucesso
- login com credenciais inválidas
- validação de campos obrigatórios

Usuários
- cadastro de usuário
- validação de email duplicado
- validação de email inválido

Produtos
- cadastro de produto
- exclusão de produto
- validação de campos obrigatórios
- validação de nome duplicado
- validação de quantidade inválida

---

## API

Testes diretos nos endpoints REST.

Login
- autenticação válida
- autenticação inválida

Usuários
- criação de usuário
- consulta por email
- validação de duplicidade

Produtos
- criação de produto
- consulta de produto
- exclusão de produto
- validação de duplicidade

---

# 📜 Validação de contratos

Alguns testes de API também validam a **estrutura das respostas** utilizando schemas simples.

Isso garante:

- presença de propriedades esperadas
- tipos de dados corretos
- estrutura consistente da API

---

# 🧬 Dados dinâmicos

Os testes utilizam geração dinâmica de dados para evitar dependência entre execuções.

Exemplos:

- emails únicos
- nomes de produtos únicos
- usuários temporários

Isso permite que a suíte seja executada várias vezes sem conflito de dados.

---

# 🏗 Estrutura do projeto

Estrutura simplificada da automação:

```
cypress
│
├─ e2e
│  │
│  ├─ frontend
│  │   ├─ login.cy.js
│  │   ├─ login.validacao.cy.js
│  │   ├─ usuarios.cy.js
│  │   ├─ produtos.cy.js
│  │   └─ produtos.validacao.cy.js
│  │
│  └─ api
│      ├─ login.api.cy.js
│      ├─ usuarios.api.cy.js
│      └─ produtos.api.cy.js
│
├─ support
│  │
│  ├─ commands
│  │   comandos reutilizáveis utilizados nos testes
│  │
│  ├─ factories
│  │   geração de dados dinâmicos
│  │
│  ├─ schemas
│  │   schemas utilizados na validação de contratos da API
│  │
│  └─ utils
│      utilidades compartilhadas
│
└─ reports
   relatórios gerados após execução dos testes
```

---

# ⚙️ Tecnologias utilizadas

- Cypress
- Node.js
- JavaScript
- Chai (assertions)
- Mochawesome (relatório HTML)
- GitHub Actions (CI)

---

# 🚀 Como executar o projeto

## 1. Instalar dependências

```bash
npm install
```

---

## 2. Executar todos os testes

```bash
npm run cy:run
```

---

## 3. Abrir Cypress em modo interativo

```bash
npm run cy:open
```

---

## 4. Executar apenas testes de frontend

```bash
npm run test:frontend
```

---

## 5. Executar apenas testes de API

```bash
npm run test:api
```

---

## 6. Executar apenas testes de smoke

```bash
npm run test:smoke
```

---

# 📊 Relatório de execução

O projeto gera relatório HTML utilizando **Mochawesome**.

Executar testes gerando relatório:

```bash
npm run test:report
```

Gerar o relatório HTML:

```bash
npm run report:generate
```

O relatório será gerado em:

```
cypress/reports/html/report.html
```

---

# 🤖 Integração contínua

O repositório possui pipeline configurado no **GitHub Actions**.

A pipeline executa automaticamente:

1. instalação das dependências
2. execução da suíte de testes
3. geração do relatório
4. publicação do relatório como artifact

O relatório pode ser baixado diretamente na execução da pipeline.

---

# 👨‍💻 Autor

Erick Alves Pereira  
Senior QA Automation Engineer