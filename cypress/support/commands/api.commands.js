import { createDynamicUser } from '../factories';

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

Cypress.Commands.add('apiCreateProduct', (token, product) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/produtos`,
    headers: {
      Authorization: token
    },
    body: {
      nome: product.nome,
      preco: product.preco,
      descricao: product.descricao,
      quantidade: product.quantidade
    }
  });
});

Cypress.Commands.add('createAdminUserViaApi', () => {
  const user = createDynamicUser({ administrador: 'true' });

  return cy.apiCreateUser(user).then((response) => {
    expect(response.status).to.eq(201);
    expect(response.body.message).to.eq('Cadastro realizado com sucesso');
    expect(response.body._id).to.be.a('string').and.not.be.empty;
    return cy.wrap(user);
  });
});
