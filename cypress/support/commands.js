Cypress.Commands.add('generateDynamicUser', (overrides = {}) => {
  const timestamp = Date.now();
  const random = Cypress._.random(1000, 9999);

  return cy.wrap({
    nome: `Erick QA ${timestamp}${random}`,
    email: `erick.qa.${timestamp}${random}@mail.com`,
    password: 'Teste@123',
    administrador: 'true',
    ...overrides
  });
});

Cypress.Commands.add('generateDynamicProduct', (overrides = {}) => {
  const timestamp = Date.now();
  const random = Cypress._.random(1000, 9999);

  return cy.wrap({
    nome: `Produto QA ${timestamp}${random}`,
    preco: 250,
    descricao: 'Produto criado via automação Cypress',
    quantidade: 15,
    ...overrides
  });
});

Cypress.Commands.add('apiCreateUser', (user) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/usuarios`,
    failOnStatusCode: false,
    body: user
  });
});

Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    body: {
      email,
      password
    }
  });
});

Cypress.Commands.add('createAdminUserViaApi', () => {
  return cy.generateDynamicUser({ administrador: 'true' }).then((user) => {
    return cy.apiCreateUser(user).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');

      return cy.wrap(user);
    });
  });
});
// ================================
// COMANDOS DE UI — FRONTEND
// ================================

Cypress.Commands.add('visitLogin', () => {
  cy.visit('/');
});

Cypress.Commands.add('fillLogin', (email, password) => {
  cy.get('[data-testid="email"]').clear().type(email);
  cy.get('[data-testid="senha"]').clear().type(password);
});

Cypress.Commands.add('submitLogin', () => {
  cy.get('[data-testid="entrar"]').click();
});

Cypress.Commands.add('loginUI', (email, password) => {
  cy.visit('/');
  cy.get('[data-testid="email"]').clear().type(email);
  cy.get('[data-testid="senha"]').clear().type(password);
  cy.get('[data-testid="entrar"]').click();
});

Cypress.Commands.add('goToRegisterUser', () => {
  cy.get('[data-testid="cadastrar"]').click();
});

Cypress.Commands.add('goToCreateProduct', () => {
  cy.get('[data-testid="cadastrarProdutos"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout"]').click();
});

Cypress.Commands.add('fillProductForm', (product) => {
  cy.get('[data-testid="nome"]').clear().type(product.nome);
  cy.get('[data-testid="preco"]').clear().type(product.preco);
  cy.get('[data-testid="descricao"]').clear().type(product.descricao);
  cy.get('[data-testid="quantity"]').clear().type(product.quantidade);
});

Cypress.Commands.add('submitProduct', () => {
  cy.get('[data-testid="cadastarProdutos"]').click();
});

