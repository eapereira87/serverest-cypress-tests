describe('Frontend - Login', () => {
  it('deve realizar login com sucesso com usuário administrador', () => {
    cy.createAdminUserViaApi().then((user) => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');

      cy.loginUI(user.email, user.password);

      cy.wait('@postLogin').then(({ response }) => {
        cy.assertSuccessfulLoginResponse(response);
      });

      cy.assertAdminHome(user.nome);
    });
  });
});
