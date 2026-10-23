describe('Frontend - Login', () => {
  let adminUser;

  beforeEach(() => {
    adminUser = undefined;

    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;
    });
  });

  afterEach(() => {
    if (adminUser?._id) {
      cy.apiDeleteUser(adminUser._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    }
  });

  it('deve realizar login com sucesso com usuário administrador', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');

    cy.loginUI(adminUser.email, adminUser.password);

    cy.wait('@postLogin').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message).to.eq('Login realizado com sucesso');
      expect(response.body.authorization).to.be.a('string').and.not.be.empty;
    });

    cy.assertAdminHome(adminUser.nome);
  });
});
