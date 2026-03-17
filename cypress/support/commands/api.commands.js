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
      cy.assertSuccessfulUserCreationResponse(response);
      return cy.wrap(user);
    });
  });
});

Cypress.Commands.add('assertSuccessfulLoginResponse', (response) => {
  expect(response.statusCode || response.status).to.eq(200);
  expect(response.body).to.have.property('authorization');
});

Cypress.Commands.add('assertSuccessfulUserCreationResponse', (response) => {
  expect(response.statusCode || response.status).to.eq(201);
  expect(response.body.message).to.eq('Cadastro realizado com sucesso');
  expect(response.body._id).to.be.a('string').and.not.be.empty;
});

Cypress.Commands.add('assertDuplicateUserResponse', (response) => {
  expect(response.statusCode || response.status).to.eq(400);
  expect(response.body.message).to.eq('Este email já está sendo usado');
});

Cypress.Commands.add('assertSuccessfulProductCreationResponse', (response) => {
  expect(response.statusCode || response.status).to.eq(201);
  expect(response.body.message).to.eq('Cadastro realizado com sucesso');
  expect(response.body._id).to.be.a('string').and.not.be.empty;
});

Cypress.Commands.add('assertDuplicateProductResponse', (response) => {
  expect(response.statusCode || response.status).to.eq(400);
  expect(response.body.message).to.eq('Já existe produto com esse nome');
});

Cypress.Commands.add('assertSuccessfulProductDeletionResponse', (response) => {
  expect(response.statusCode || response.status).to.eq(200);
  expect(response.body.message).to.eq('Registro excluído com sucesso');
});

Cypress.Commands.add('assertRequiredLoginFieldsResponse', (response, expectedFields = []) => {
  expect(response.statusCode || response.status).to.eq(400);

  expectedFields.forEach((field) => {
    expect(response.body[field]).to.include('é obrigatório');
  });
});

Cypress.Commands.add('assertRequiredProductFieldResponse', (response, field) => {
  expect(response.statusCode || response.status).to.eq(400);
  expect(response.body[field]).to.include('é obrigatório');
});
