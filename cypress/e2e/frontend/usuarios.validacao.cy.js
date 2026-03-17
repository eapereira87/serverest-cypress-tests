import { createDynamicUser } from '../../support/factories';

describe('Frontend - Validação de cadastro de usuários', () => {

  let adminUser;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;
    });
  });

  beforeEach(() => {
    cy.loginAsAdminSession(adminUser);
  });

  it('não deve permitir cadastrar usuário sem nome', () => {
    const user = createDynamicUser();

    cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuario');

    cy.goToCreateUserFromHome();
    cy.assertUserFormVisible();

    cy.getUserEmailInput().type(user.email);
    cy.getUserPasswordInput().type(user.password, { log: false });
    cy.getUserAdminCheckbox().check({ force: true });

    cy.submitUserForm();

    cy.wait('@postUsuario').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body.nome).to.include('é obrigatório');
    });
  });

  it('não deve permitir cadastrar usuário sem email', () => {
    const user = createDynamicUser();

    cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuario');

    cy.goToCreateUserFromHome();
    cy.assertUserFormVisible();

    cy.getUserNameInput().type(user.nome);
    cy.getUserPasswordInput().type(user.password, { log: false });
    cy.getUserAdminCheckbox().check({ force: true });

    cy.submitUserForm();

    cy.wait('@postUsuario').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body.email).to.include('é obrigatório');
    });
  });

  it('não deve permitir cadastrar usuário sem senha', () => {
    const user = createDynamicUser();

    cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuario');

    cy.goToCreateUserFromHome();
    cy.assertUserFormVisible();

    cy.getUserNameInput().type(user.nome);
    cy.getUserEmailInput().type(user.email);
    cy.getUserAdminCheckbox().check({ force: true });

    cy.submitUserForm();

    cy.wait('@postUsuario').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body.password).to.include('é obrigatório');
    });
  });

  it('não deve permitir cadastrar usuário com email inválido', () => {
    const user = createDynamicUser({ email: 'email-invalido' });

    cy.intercept('POST', `${Cypress.env('apiUrl')}/usuarios`).as('postUsuario');

    cy.goToCreateUserFromHome();
    cy.assertUserFormVisible();

    cy.fillUserForm(user);
    cy.submitUserForm();

    cy.get('@postUsuario.all').should('have.length', 0);

    cy.getUserEmailInput().then(($input) => {
      const input = $input[0];
      expect(input.checkValidity()).to.eq(false);
      expect(input.validationMessage).to.not.equal('');
    });

    cy.assertUserFormVisible();
  });

});
