describe('Frontend - Logout', () => {
  let adminUser

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user
    })
  })

  beforeEach(() => {
    cy.loginAsAdminSession(adminUser)
  })

  it('deve realizar logout com sucesso e retornar para a tela de login', () => {
    cy.getLogoutButton().should('be.visible').click()

    cy.url().should('eq', `${Cypress.config('baseUrl')}/login`)
    cy.assertLoginPageVisible()
  })

})
