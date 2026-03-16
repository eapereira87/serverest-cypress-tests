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

    cy.get('[data-testid="logout"]').should('be.visible').click()

    cy.url().should('eq', `${Cypress.config('baseUrl')}/login`)

    cy.get('[data-testid="email"]').should('be.visible')
    cy.get('[data-testid="senha"]').should('be.visible')
    cy.get('[data-testid="entrar"]').should('be.visible')

  })

})
