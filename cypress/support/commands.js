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