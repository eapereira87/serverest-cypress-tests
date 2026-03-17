import { createDynamicUser } from '../../support/factories';

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

  it('deve cadastrar um novo usuário administrador', () => {
    const newUser = createDynamicUser({ administrador: 'true' });

    cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuario');

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

    cy.goToUserList();
    cy.assertUserListPageVisible();
    cy.assertUserInList(newUser);
  });

  it('não deve permitir cadastrar usuário com email duplicado', () => {
    const existingUser = createDynamicUser({ administrador: 'true' });

    cy.apiCreateUser(existingUser).then((response) => {
      expect(response.status).to.eq(201);
    });

    cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuarioDuplicado');

    cy.assertAdminHome(adminUser.nome);
    cy.goToCreateUserFromHome();
    cy.assertUserFormVisible();

    cy.fillUserForm(existingUser);
    cy.submitUserForm();

    cy.wait('@postUsuarioDuplicado').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body.message).to.eq('Este email já está sendo usado');
    });

    cy.assertDuplicateUserMessageVisible();
  });

});
