describe('Frontend - Cadastro de usuário', () => {
  it('deve cadastrar um novo usuário administrador com sucesso pela interface', () => {
    cy.createAdminUserViaApi().then((adminUser) => {
      cy.generateDynamicUser({ administrador: 'true' }).then((newUser) => {
        cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');
        cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuario');

        cy.loginUI(adminUser.email, adminUser.password);
        cy.wait('@postLogin');

        cy.assertAdminHome(adminUser.nome);
        cy.goToCreateUserFromHome();
        cy.assertUserFormVisible();

        cy.fillUserForm(newUser);
        cy.submitUserForm();

        cy.wait('@postUsuario').then(({ response }) => {
          expect(response.statusCode).to.eq(201);
          expect(response.body.message).to.eq('Cadastro realizado com sucesso');
          expect(response.body._id).to.be.a('string').and.not.be.empty;
        });

        cy.url().should('include', '/admin');
      });
    });
  });
});
