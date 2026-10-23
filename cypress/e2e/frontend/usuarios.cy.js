import { createDynamicUser } from '../../support/factories';

describe('Frontend - Gestão de usuários', () => {
  let adminUser;
  let usuarioId;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;
    });
  });

  beforeEach(() => {
    usuarioId = undefined;
    cy.loginAsAdminSession(adminUser);
  });

  afterEach(() => {
    if (usuarioId) {
      cy.apiDeleteUser(usuarioId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    }
  });

  after(() => {
    if (adminUser?._id) {
      cy.apiDeleteUser(adminUser._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    }
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
      usuarioId = response.body._id;

      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(usuarioId).to.be.a('string').and.not.be.empty;
    });

    cy.goToUserList();
    cy.assertUserListPageVisible();
    cy.assertUserInList(newUser);
  });

  it('não deve permitir cadastrar usuário com email duplicado', () => {
    const existingUser = createDynamicUser({ administrador: 'true' });

    cy.apiCreateUser(existingUser).then((response) => {
      usuarioId = response.body._id;

      expect(response.status).to.eq(201);
      expect(usuarioId).to.be.a('string').and.not.be.empty;
    });

    cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`)
      .as('postUsuarioDuplicado');

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
