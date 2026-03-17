# 🧪 ServeRest Test Automation | Cypress

[![CI](https://github.com/eapereira87/serverest-cypress-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/eapereira87/serverest-cypress-tests/actions/workflows/ci.yml)
![Cypress](https://img.shields.io/badge/Cypress-14.x-17202C?logo=cypress&logoColor=white)
![Node](https://img.shields.io/badge/node-20.x-green)
![Tests](https://img.shields.io/badge/tests-e2e%20%7C%20api-blue)

Projeto de automação de testes desenvolvido com **Cypress** para validar **fluxos End-to-End (Frontend)** e **API REST** da aplicação **ServeRest**.

O objetivo deste projeto é demonstrar **boas práticas de engenharia de testes**, organização de automação e integração com **CI/CD**, mantendo simplicidade e clareza no código.

---

# 📌 Sobre o ServeRest

O **ServeRest** é uma API que simula uma **loja virtual**, criada para estudo de testes de software.

Frontend  
https://front.serverest.dev

API  
https://serverest.dev

---

# 🎯 Objetivo do Projeto

Este projeto demonstra:

✔ Automação End-to-End  
✔ Testes de API  
✔ Validação de contratos  
✔ Dados dinâmicos  
✔ Integração com CI  
✔ Relatórios HTML

---

# 🏗 Arquitetura

serverest-cypress-tests

cypress  
 ├─ e2e  
 │   ├─ frontend  
 │   └─ api  
 │
 ├─ support  
 │   ├─ commands  
 │   ├─ factories  
 │   ├─ schemas  
 │   └─ utils  
 │
 └─ reports  

.github  
 └─ workflows  

cypress.config.js  
package.json  

---

# 🧪 Estratégia de Testes

Frontend (E2E)

- Login
- Cadastro de usuários
- Cadastro de produtos
- Validações de formulário
- Regras de negócio

API

- Login
- CRUD usuários
- CRUD produtos
- Validação de duplicidade

---

# 🧬 Dados Dinâmicos

Os testes utilizam geração dinâmica de dados:

- emails únicos
- produtos únicos
- usuários temporários

Isso garante:

✔ execuções independentes  
✔ testes repetíveis  

---

# ⚙️ Tecnologias

Cypress  
Node.js  
JavaScript  
Chai  
Mochawesome  
GitHub Actions  

---

# 🚀 Executando

Instalar dependências

npm install

Abrir Cypress

npm run cy:open

Executar testes

npm run cy:run

Executar frontend

npm run test:frontend

Executar API

npm run test:api

---

# 📊 Relatório

Gerar execução

npm run test:report

Gerar HTML

npm run report:generate

Abrir relatório

cypress/reports/html/report.html

---

# 🤖 CI

Pipeline no GitHub Actions executa:

1 instalação de dependências  
2 execução dos testes  
3 geração do relatório  
4 publicação como artifact  

---

# 👨‍💻 Autor

Erick Alves Pereira  
Senior QA Automation Engineer
