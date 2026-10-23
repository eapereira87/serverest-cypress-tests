describe('Frontend - Validação de login', () => {
  let adminUser;

  beforeEach(() => {
    adminUser = undefined;
  });

  afterEach(() => {
    if (adminUser?._id) {
      cy.apiDeleteUser(adminUser._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    }
  });

  it('não deve permitir login com senha incorreta', () => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;

      cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');

      cy.visitLogin();
      cy.assertLoginPageVisible();

      cy.fillLogin(adminUser.email, 'senhaErrada123');
      cy.submitLogin();

      cy.wait('@postLogin').then(({ response }) => {
        expect(response.statusCode).to.eq(401);
        expect(response.body.message).to.eq('Email e/ou senha inválidos');
      });

      cy.assertInvalidLoginMessageVisible();
    });
  });

  it('não deve permitir login com usuário inexistente', () => {
    const email = `inexistente-${crypto.randomUUID()}@example.com`;

    cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');

    cy.visitLogin();
    cy.assertLoginPageVisible();

    cy.fillLogin(email, '123456');
    cy.submitLogin();

    cy.wait('@postLogin').then(({ response }) => {
      expect(response.statusCode).to.eq(401);
      expect(response.body.message).to.eq('Email e/ou senha inválidos');
    });

    cy.assertInvalidLoginMessageVisible();
  });
});
