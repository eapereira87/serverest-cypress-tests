describe('Frontend - Validação de campos de login', () => {

  it('não deve permitir login com email e senha vazios', () => {
    cy.visitLogin();
    cy.assertLoginPageVisible();

    cy.submitLogin();

    cy.assertLoginValidationMessages(['email', 'password']);
    cy.assertStayedOnLoginPage();
  });

  it('não deve permitir login sem email', () => {
    cy.visitLogin();
    cy.assertLoginPageVisible();

    cy.fillLogin(null, '123456');
    cy.submitLogin();

    cy.assertLoginValidationMessages(['email']);
    cy.assertStayedOnLoginPage();
  });

  it('não deve permitir login sem senha', () => {
    cy.visitLogin();
    cy.assertLoginPageVisible();

    cy.fillLogin('teste@email.com', null);
    cy.submitLogin();

    cy.assertLoginValidationMessages(['password']);
    cy.assertStayedOnLoginPage();
  });

});
