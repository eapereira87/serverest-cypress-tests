Cypress.Commands.add('getLoginEmailInput', () => {
  return cy.get('[data-testid="email"]');
});

Cypress.Commands.add('getLoginPasswordInput', () => {
  return cy.get('[data-testid="senha"]');
});

Cypress.Commands.add('getLoginSubmitButton', () => {
  return cy.get('[data-testid="entrar"]');
});

Cypress.Commands.add('getLoginAlerts', () => {
  return cy.get('[role="alert"]');
});

Cypress.Commands.add('getAdminHomeTitle', () => {
  return cy.get('h1');
});

Cypress.Commands.add('getInvalidLoginMessage', () => {
  return cy.contains('Email e/ou senha inválidos');
});

Cypress.Commands.add('visitLogin', () => {
  cy.visit('/');
});

Cypress.Commands.add('fillLogin', (email, password) => {
  if (email !== undefined && email !== null) {
    cy.getLoginEmailInput().clear().type(email);
  }

  if (password !== undefined && password !== null) {
    cy.getLoginPasswordInput().clear().type(password, { log: false });
  }
});

Cypress.Commands.add('submitLogin', () => {
  cy.getLoginSubmitButton().click();
});

Cypress.Commands.add('assertLoginPageVisible', () => {
  cy.getLoginEmailInput().should('be.visible');
  cy.getLoginPasswordInput().should('be.visible');
  cy.getLoginSubmitButton().should('be.visible');
});

Cypress.Commands.add('assertStayedOnLoginPage', () => {
  cy.url().should('include', '/login');
  cy.assertLoginPageVisible();
});

Cypress.Commands.add('assertLoginAlertCount', (count) => {
  cy.getLoginAlerts().should('have.length', count);
});

Cypress.Commands.add('assertLoginAlertContains', (index, expectedText) => {
  cy.getLoginAlerts()
    .eq(index)
    .invoke('text')
    .then((text) => {
      expect(text.toLowerCase()).to.include(expectedText.toLowerCase());
    });
});

Cypress.Commands.add('assertLoginValidationMessages', (messages) => {
  cy.getLoginAlerts().should('have.length', messages.length);

  messages.forEach((message, index) => {
    cy.assertLoginAlertContains(index, message);
  });
});

Cypress.Commands.add('assertInvalidLoginMessageVisible', () => {
  cy.getInvalidLoginMessage().should('be.visible');
});

Cypress.Commands.add('loginUI', (email, password) => {
  cy.visitLogin();
  cy.fillLogin(email, password);
  cy.submitLogin();
});

Cypress.Commands.add('assertAdminHome', (userName) => {
  cy.url().should('include', '/admin/home');
  cy.getAdminHomeTitle().should('contain', 'Bem Vindo');

  if (userName) {
    cy.getAdminHomeTitle().should('contain', userName);
  }

  cy.getCreateUserButton().should('be.visible');
  cy.getCreateProductButton().should('be.visible');
  cy.getLogoutButton().should('be.visible');
});

Cypress.Commands.add('loginAsAdminSession', (adminUser) => {
  expect(adminUser, 'adminUser deve existir').to.exist;
  expect(adminUser.email, 'adminUser.email deve existir').to.be.a('string').and.not.be.empty;
  expect(adminUser.password, 'adminUser.password deve existir').to.be.a('string').and.not.be.empty;

  cy.session(
    ['admin-session', adminUser.email],
    () => {
      cy.visit('/');

      cy.getLoginEmailInput().should('be.visible').clear().type(adminUser.email);
      cy.getLoginPasswordInput().should('be.visible').clear().type(adminUser.password, { log: false });
      cy.getLoginSubmitButton().should('be.visible').click();

      cy.url().should('include', '/admin/home');
      cy.getLogoutButton().should('be.visible');
    },
    {
      validate() {
        cy.visit('/admin/home');
        cy.url().should('include', '/admin/home');
        cy.getLogoutButton().should('be.visible');
      }
    }
  );

  cy.visit('/admin/home');
});
