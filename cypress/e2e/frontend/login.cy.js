describe('Frontend - Login', () => {
  it('deve realizar login com sucesso com usuário administrador', () => {
    cy.createAdminUserViaApi().then((user) => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');

      cy.loginUI(user.email, user.password);

      cy.wait('@postLogin').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body.message).to.eq('Login realizado com sucesso');
        expect(response.body.authorization).to.be.a('string').and.not.be.empty;
      });

      cy.assertAdminHome(user.nome);
    });
  });
});
