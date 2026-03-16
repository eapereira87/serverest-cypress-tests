describe('Frontend - Gestão de usuários', () => {

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
        });

        cy.goToUserList();
        cy.assertUserListPageVisible();
        cy.assertUserInList(newUser);
      });
    });
  });

  it('deve cadastrar um novo usuário comum com sucesso pela interface', () => {
    cy.createAdminUserViaApi().then((adminUser) => {
      cy.generateDynamicUser({ administrador: 'false' }).then((newUser) => {

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
        });

        cy.goToUserList();
        cy.assertUserListPageVisible();
        cy.assertUserInList(newUser);
      });
    });
  });

  it('não deve permitir cadastrar usuário com email já existente', () => {
    cy.generateDynamicUser({ administrador: 'true' }).then((existingUser) => {

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/usuarios`,
        body: existingUser
      });

      cy.createAdminUserViaApi().then((adminUser) => {

        cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');
        cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuario');

        cy.loginUI(adminUser.email, adminUser.password);
        cy.wait('@postLogin');

        cy.goToCreateUserFromHome();
        cy.assertUserFormVisible();

        cy.fillUserForm(existingUser);
        cy.submitUserForm();

        cy.wait('@postUsuario').then(({ response }) => {
          expect(response.statusCode).to.eq(400);
          expect(response.body.message).to.eq('Este email já está sendo usado');
        });

        cy.contains('Este email já está sendo usado').should('be.visible');
      });
    });
  });

});
