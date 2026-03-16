Cypress.Commands.add('generateDynamicUser', (overrides = {}) => {
  const timestamp = Date.now();

  return cy.wrap({
    nome: `Usuario Teste ${timestamp}`,
    email: `usuario${timestamp}@teste.com`,
    password: `Teste@${timestamp}`,
    administrador: 'true',
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
