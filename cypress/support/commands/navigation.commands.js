Cypress.Commands.add('getCreateUserButton', () => {
  return cy.get('[data-testid="cadastrarUsuarios"]');
});

Cypress.Commands.add('getCreateProductButton', () => {
  return cy.get('[data-testid="cadastrarProdutos"]');
});

Cypress.Commands.add('getLogoutButton', () => {
  return cy.get('[data-testid="logout"]');
});

Cypress.Commands.add('getNavbarUserListLink', () => {
  return cy.contains('a', 'Listar Usuários');
});

Cypress.Commands.add('getNavbarProductListLink', () => {
  return cy.contains('a', 'Listar Produtos');
});

Cypress.Commands.add('goToCreateUserFromHome', () => {
  cy.getCreateUserButton().click();
});

Cypress.Commands.add('goToUserList', () => {
  cy.getNavbarUserListLink().click();
});

Cypress.Commands.add('goToCreateProduct', () => {
  cy.getCreateProductButton().click();
});

Cypress.Commands.add('goToProductList', () => {
  cy.getNavbarProductListLink().click();
});
