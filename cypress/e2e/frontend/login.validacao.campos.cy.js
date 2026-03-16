describe('Frontend - Validação de campos de login', () => {

  it('não deve permitir login com email e senha vazios', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin')

    cy.visitLogin()
    cy.assertLoginPageVisible()

    cy.submitLogin()

    cy.wait('@postLogin').then(({ response }) => {
      expect(response.statusCode).to.eq(400)
      expect(response.body.email).to.eq('email é obrigatório')
      expect(response.body.password).to.eq('password é obrigatório')
    })

    cy.assertStayedOnLoginPage()
  })

  it('não deve permitir login sem email', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin')

    cy.visitLogin()
    cy.assertLoginPageVisible()

    cy.fillLogin(null, '123456')
    cy.submitLogin()

    cy.wait('@postLogin').then(({ response }) => {
      expect(response.statusCode).to.eq(400)
      expect(response.body.email).to.eq('email é obrigatório')
    })

    cy.assertStayedOnLoginPage()
  })

  it('não deve permitir login sem senha', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin')

    cy.visitLogin()
    cy.assertLoginPageVisible()

    cy.fillLogin('teste@email.com', null)
    cy.submitLogin()

    cy.wait('@postLogin').then(({ response }) => {
      expect(response.statusCode).to.eq(400)
      expect(response.body.password).to.eq('password é obrigatório')
    })

    cy.assertStayedOnLoginPage()
  })

})
