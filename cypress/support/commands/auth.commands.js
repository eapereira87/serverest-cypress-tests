Cypress.Commands.add('getLoginEmailInput', () => {
  return cy.get('[data-testid="email"]');
});

Cypress.Commands.add('getLoginPasswordInput', () => {
  return cy.get('[data-testid="senha"]');
});

Cypress.Commands.add('getLoginSubmitButton', () => {
  return cy.get('[data-testid="entrar"]');
});

Cypress.Commands.add('visitLogin', () => {
  cy.visit('/');
});

Cypress.Commands.add('fillLogin', (email, password) => {
  cy.getLoginEmailInput().clear().type(email);
  cy.getLoginPasswordInput().clear().type(password, { log: false });
});

Cypress.Commands.add('submitLogin', () => {
  cy.getLoginSubmitButton().click();
});

Cypress.Commands.add('assertLoginPageVisible', () => {
  cy.getLoginEmailInput().should('be.visible');
  cy.getLoginPasswordInput().should('be.visible');
  cy.getLoginSubmitButton().should('be.visible');
});

Cypress.Commands.add('loginUI', (email, password) => {
  cy.visitLogin();
  cy.fillLogin(email, password);
  cy.submitLogin();
});
