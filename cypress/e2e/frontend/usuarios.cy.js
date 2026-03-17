describe('Frontend - Gestão de usuários', () => {
  let adminUser;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;
    });
  });

  beforeEach(() => {
    cy.loginAsAdminSession(adminUser);
  });

  it('deve cadastrar um novo usuário administrador com sucesso pela interface', () => {
    cy.generateDynamicUser({ administrador: 'true' }).then((newUser) => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuario');

      cy.assertAdminHome(adminUser.nome);
      cy.goToCreateUserFromHome();
      cy.assertUserFormVisible();

      cy.fillUserForm(newUser);
      cy.submitUserForm();

      cy.wait('@postUsuario').then(({ response }) => {
        cy.assertSuccessfulUserCreationResponse(response);
      });

      cy.goToUserList();
      cy.assertUserListPageVisible();
      cy.assertUserInList(newUser);
    });
  });

  it('deve cadastrar um novo usuário comum com sucesso pela interface', () => {
    cy.generateDynamicUser({ administrador: 'false' }).then((newUser) => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuario');

      cy.assertAdminHome(adminUser.nome);
      cy.goToCreateUserFromHome();
      cy.assertUserFormVisible();

      cy.fillUserForm(newUser);
      cy.submitUserForm();

      cy.wait('@postUsuario').then(({ response }) => {
        cy.assertSuccessfulUserCreationResponse(response);
      });

      cy.goToUserList();
      cy.assertUserListPageVisible();
      cy.assertUserInList(newUser);
    });
  });

  it('não deve permitir cadastrar usuário com email já existente', () => {
    cy.generateDynamicUser({ administrador: 'true' }).then((existingUser) => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/usuarios`,
        body: existingUser
      });

      cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuarioDuplicado');

      cy.assertAdminHome(adminUser.nome);
      cy.goToCreateUserFromHome();
      cy.assertUserFormVisible();

      cy.fillUserForm(existingUser);
      cy.submitUserForm();

      cy.wait('@postUsuarioDuplicado').then(({ response }) => {
        cy.assertDuplicateUserResponse(response);
      });

      cy.assertDuplicateUserMessageVisible();
    });
  });
});
