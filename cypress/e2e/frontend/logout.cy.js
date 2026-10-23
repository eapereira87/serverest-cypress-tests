describe('Frontend - Logout', () => {
  let adminUser;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;
    });
  });

  beforeEach(() => {
    cy.loginAsAdminSession(adminUser);
  });

  after(() => {
    if (adminUser?._id) {
      cy.apiDeleteUser(adminUser._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    }
  });

  it('deve realizar logout com sucesso e retornar para a tela de login', () => {
    cy.getLogoutButton().should('be.visible').click();

    cy.url().should('eq', `${Cypress.config('baseUrl')}/login`);
    cy.assertLoginPageVisible();
  });
});
