describe('Frontend - Validação de login', () => {

  it('deve permitir login com credenciais válidas', () => {
    cy.createAdminUserViaApi().then((adminUser) => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin')

      cy.visitLogin()
      cy.assertLoginPageVisible()

      cy.fillLogin(adminUser.email, adminUser.password)
      cy.submitLogin()

      cy.wait('@postLogin').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body).to.have.property('authorization')
      })

      cy.assertAdminHome(adminUser.nome)
    })
  })

  it('não deve permitir login com senha incorreta', () => {
    cy.createAdminUserViaApi().then((adminUser) => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin')

      cy.visitLogin()
      cy.assertLoginPageVisible()

      cy.fillLogin(adminUser.email, 'senhaErrada123')
      cy.submitLogin()

      cy.wait('@postLogin').then(({ response }) => {
        expect(response.statusCode).to.eq(401)
        expect(response.body.message).to.eq('Email e/ou senha inválidos')
      })

      cy.assertInvalidLoginMessageVisible()
    })
  })

  it('não deve permitir login com usuário inexistente', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin')

    cy.visitLogin()
    cy.assertLoginPageVisible()

    cy.fillLogin('usuarioinexistente@email.com', '123456')
    cy.submitLogin()

    cy.wait('@postLogin').then(({ response }) => {
      expect(response.statusCode).to.eq(401)
      expect(response.body.message).to.eq('Email e/ou senha inválidos')
    })

    cy.assertInvalidLoginMessageVisible()
  })

})
