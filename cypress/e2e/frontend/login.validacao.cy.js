describe('Frontend - Validação de login', () => {

  it('deve permitir login com credenciais válidas', () => {
    cy.createAdminUserViaApi().then((adminUser) => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin')

      cy.visit('/')

      cy.get('[data-testid="email"]').type(adminUser.email)
      cy.get('[data-testid="senha"]').type(adminUser.password)

      cy.get('[data-testid="entrar"]').click()

      cy.wait('@postLogin').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        expect(response.body).to.have.property('authorization')
      })

      cy.url().should('include', '/admin/home')
      cy.get('h1').should('contain', 'Bem Vindo')
      cy.get('[data-testid="cadastrarUsuarios"]').should('be.visible')
      cy.get('[data-testid="cadastrarProdutos"]').should('be.visible')
      cy.get('[data-testid="logout"]').should('be.visible')
    })
  })

  it('não deve permitir login com senha incorreta', () => {
    cy.createAdminUserViaApi().then((adminUser) => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin')

      cy.visit('/')

      cy.get('[data-testid="email"]').type(adminUser.email)
      cy.get('[data-testid="senha"]').type('senhaErrada123')

      cy.get('[data-testid="entrar"]').click()

      cy.wait('@postLogin').then(({ response }) => {
        expect(response.statusCode).to.eq(401)
        expect(response.body.message).to.eq('Email e/ou senha inválidos')
      })

      cy.contains('Email e/ou senha inválidos').should('be.visible')
    })
  })

  it('não deve permitir login com usuário inexistente', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin')

    cy.visit('/')

    cy.get('[data-testid="email"]').type('usuarioinexistente@email.com')
    cy.get('[data-testid="senha"]').type('123456')

    cy.get('[data-testid="entrar"]').click()

    cy.wait('@postLogin').then(({ response }) => {
      expect(response.statusCode).to.eq(401)
      expect(response.body.message).to.eq('Email e/ou senha inválidos')
    })

    cy.contains('Email e/ou senha inválidos').should('be.visible')
  })

})
