Cypress.Commands.add('getSignupLink', () => {
  return cy.get('[data-testid="cadastrar"]');
});

Cypress.Commands.add('getCreateUserButton', () => {
  return cy.get('[data-testid="cadastrarUsuarios"]');
});

Cypress.Commands.add('getCreateProductButton', () => {
  return cy.get('[data-testid="cadastrarProdutos"]');
});

Cypress.Commands.add('getLogoutButton', () => {
  return cy.get('[data-testid="logout"]');
});

Cypress.Commands.add('goToRegisterUser', () => {
  cy.getSignupLink().click();
});

Cypress.Commands.add('goToCreateUserFromHome', () => {
  cy.getCreateUserButton().click();
});

Cypress.Commands.add('goToCreateProduct', () => {
  cy.getCreateProductButton().click();
});

Cypress.Commands.add('logout', () => {
  cy.getLogoutButton().click();
});

Cypress.Commands.add('assertAdminHome', (userName) => {
  cy.url().should('include', '/admin/home');
  cy.get('h1').should('contain', 'Bem Vindo');

  if (userName) {
    cy.get('h1').should('contain', userName);
  }

  cy.getCreateUserButton().should('be.visible');
  cy.getCreateProductButton().should('be.visible');
  cy.getLogoutButton().should('be.visible');
});
