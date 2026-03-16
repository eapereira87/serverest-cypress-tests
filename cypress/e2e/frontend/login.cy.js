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

      cy.url().should('include', '/admin/home');
      cy.get('h1').should('contain', 'Bem Vindo');
      cy.get('h1').should('contain', user.nome);
      cy.get('[data-testid="cadastrarUsuarios"]').should('be.visible');
      cy.get('[data-testid="cadastrarProdutos"]').should('be.visible');
      cy.get('[data-testid="logout"]').should('be.visible');
    });
  });
});
