# 🧪 ServeRest Cypress Test Automation

[![CI](https://github.com/eapereira87/serverest-cypress-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/eapereira87/serverest-cypress-tests/actions/workflows/ci.yml)
![Cypress](https://img.shields.io/badge/Cypress-14.x-17202C?logo=cypress&logoColor=white)
![Node](https://img.shields.io/badge/node-22.x-green)

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

As factories utilizam UUID para gerar nomes e e-mails únicos.

Usuários e produtos criados pelos testes são removidos pelos hooks de limpeza. Os produtos são excluídos antes dos administradores.

A limpeza também é executada após falhas de assertivas quando o ID do cadastro já foi recebido. Interrupções da execução ou indisponibilidade do ambiente podem impedir essa remoção.

Os testes de produtos utilizam uma imagem PNG real em `cypress/fixtures/produto.png`.

---

# 🏗 Estrutura do projeto

| Caminho                                             | Descrição                                              |
| ---                                                 | ---                                                    |
| `.github/workflows/ci.yml`                          | Pipeline do GitHub Actions                             |
| `cypress/e2e/frontend/login.cy.js`                  | Login com credenciais válidas                          |
| `cypress/e2e/frontend/login.validacao.cy.js`        | Login com credenciais inválidas                        |
| `cypress/e2e/frontend/login.validacao.campos.cy.js` | Campos obrigatórios do login                           |
| `cypress/e2e/frontend/logout.cy.js`                 | Encerramento da sessão                                 |
| `cypress/e2e/frontend/usuarios.cy.js`               | Cadastro de usuários e e-mail duplicado                |
| `cypress/e2e/frontend/usuarios.validacao.cy.js`     | Validações do cadastro de usuários                     |
| `cypress/e2e/frontend/produtos.cy.js`               | Cadastro, duplicidade e exclusão de produtos           |
| `cypress/e2e/frontend/produtos.limites.cy.js`       | Limites de preço e quantidade                          |
| `cypress/e2e/frontend/produtos.validacao.cy.js`     | Campos obrigatórios e nome duplicado                   |
| `cypress/e2e/api/login.api.cy.js`                   | Autenticação pela API                                  |
| `cypress/e2e/api/usuarios.api.cy.js`                | Cadastro, consulta e duplicidade de usuários           |
| `cypress/e2e/api/produtos.api.cy.js`                | Cadastro, consulta, duplicidade e exclusão de produtos |
| `cypress/fixtures/produto.png`                      | Imagem utilizada nos testes de produtos                |
| `cypress/support/commands/`                         | Comandos reutilizáveis separados por domínio           |
| `cypress/support/commands.js`                       | Importação dos comandos                                |
| `cypress/support/e2e.js`                            | Inicialização do suporte dos testes                    |
| `cypress/support/factories.js`                      | Geração dos dados de teste com UUID                    |
| `cypress/support/schemas/`                          | Estruturas esperadas das respostas da API              |
| `cypress/support/utils/schemaValidator.js`          | Validação das respostas pelos schemas                  |
| `cypress/reports/`                                  | Relatórios JSON gerados durante a execução             |
| `cypress/reports/merged/mochawesome.json`           | Resultado consolidado dos testes                       |
| `cypress/reports/html/report.html`                  | Relatório HTML                                         |
| `cypress/screenshots/`                              | Screenshots de falhas                                  |
| `cypress.config.js`                                 | Configuração do Cypress                                |
| `package.json`                                      | Dependências e comandos de execução                    |
| `package-lock.json`                                 | Versões registradas das dependências                   |

As pastas de relatórios e screenshots são geradas durante a execução e não são versionadas.

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
npm ci
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

Os resultados JSON de todos os testes são consolidados em `cypress/reports/merged/mochawesome.json`.

O relatório HTML é gerado em `cypress/reports/html/report.html`.

---

# 🤖 Integração contínua

O repositório possui pipeline configurado no **GitHub Actions**.

A pipeline executa automaticamente depois de cada commit e também pode ser executada manualmente.

Para executar manualmente:

1. Abra a aba Actions.
2. Selecione o workflow CI.
3. Clique em Run workflow.
4. Escolha a branch e confirme a execução.

A pipeline instala as dependências, verifica o Cypress e executa a suíte. Os passos de geração e upload do relatório também são executados quando os testes falham, desde que a execução não seja cancelada.

Ao finalizar, baixe o artefato `cypress-test-report`. Ele contém os relatórios disponíveis e as screenshots de falhas, quando houver.

---

# 👨‍💻 Autor

Erick Alves Pereira  
Senior QA Automation Engineer
