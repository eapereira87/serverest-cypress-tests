describe('Frontend - Validação de cadastro de produtos', () => {
  let adminUser

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user
    })
  })

  beforeEach(() => {
    cy.loginAsAdminSession(adminUser)
  })

  it('não deve permitir cadastrar produto sem nome', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto')

    cy.assertAdminHome(adminUser.nome)
    cy.goToCreateProduct()
    cy.assertProductFormVisible()

    cy.getProductPriceInput().type('100')
    cy.getProductDescriptionInput().type('Produto sem nome')
    cy.getProductQuantityInput().type('10')

    cy.submitProduct()

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400)
      expect(response.body.nome).to.eq('nome é obrigatório')
    })
  })

  it('não deve permitir cadastrar produto sem preço', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto')

    cy.assertAdminHome(adminUser.nome)
    cy.goToCreateProduct()
    cy.assertProductFormVisible()

    cy.getProductNameInput().type('Produto Teste')
    cy.getProductDescriptionInput().type('Produto sem preço')
    cy.getProductQuantityInput().type('10')

    cy.submitProduct()

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400)
      expect(response.body.preco).to.eq('preco é obrigatório')
    })
  })

  it('não deve permitir cadastrar produto sem quantidade', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto')

    cy.assertAdminHome(adminUser.nome)
    cy.goToCreateProduct()
    cy.assertProductFormVisible()

    cy.getProductNameInput().type('Produto Teste')
    cy.getProductPriceInput().type('100')
    cy.getProductDescriptionInput().type('Produto sem quantidade')

    cy.submitProduct()

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400)
      expect(response.body.quantidade).to.eq('quantidade é obrigatório')
    })
  })

  it('não deve permitir cadastrar produto sem descrição', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto')

    cy.assertAdminHome(adminUser.nome)
    cy.goToCreateProduct()
    cy.assertProductFormVisible()

    cy.getProductNameInput().type('Produto Teste')
    cy.getProductPriceInput().type('100')
    cy.getProductQuantityInput().type('10')

    cy.submitProduct()

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400)
      expect(response.body.descricao).to.eq('descricao é obrigatório')
    })
  })
})
