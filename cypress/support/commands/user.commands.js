Cypress.Commands.add('getUserNameInput', () => {
  return cy.get('[data-testid="nome"]');
});

Cypress.Commands.add('getUserEmailInput', () => {
  return cy.get('[data-testid="email"]');
});

Cypress.Commands.add('getUserPasswordInput', () => {
  return cy.get('[data-testid="password"]');
});

Cypress.Commands.add('getUserAdminCheckbox', () => {
  return cy.get('[data-testid="checkbox"]');
});

Cypress.Commands.add('getUserSubmitButton', () => {
  return cy.get('[data-testid="cadastrarUsuario"]');
});

Cypress.Commands.add('getUsersTable', () => {
  return cy.get('table');
});

Cypress.Commands.add('getUserRowByEmail', (email) => {
  return cy.contains('td', email).parent('tr');
});

Cypress.Commands.add('getDuplicateUserMessage', () => {
  return cy.contains('Este email já está sendo usado');
});

Cypress.Commands.add('fillUserForm', (user) => {
  cy.getUserNameInput().clear().type(user.nome);
  cy.getUserEmailInput().clear().type(user.email);
  cy.getUserPasswordInput().clear().type(user.password, { log: false });

  if (user.administrador === 'true') {
    cy.getUserAdminCheckbox().check({ force: true });
  } else {
    cy.getUserAdminCheckbox().uncheck({ force: true });
  }
});

Cypress.Commands.add('submitUserForm', () => {
  cy.getUserSubmitButton().click();
});

Cypress.Commands.add('assertUserFormVisible', () => {
  cy.getUserSubmitButton().should('be.visible');
});

Cypress.Commands.add('assertDuplicateUserMessageVisible', () => {
  cy.getDuplicateUserMessage().should('be.visible');
});

Cypress.Commands.add('assertUserListPageVisible', () => {
  cy.get('h1').should('contain', 'Lista dos usuários');
  cy.getUsersTable().should('be.visible');
});

Cypress.Commands.add('assertUserInList', (user) => {
  cy.getUserRowByEmail(user.email)
    .should('contain', user.nome)
    .and('contain', user.email)
    .and('contain', user.password)
    .and('contain', user.administrador);
});
