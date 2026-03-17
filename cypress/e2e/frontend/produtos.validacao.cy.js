import { createDynamicProduct } from '../../support/factories';

describe('Frontend - Validação de cadastro de produtos', () => {

  let adminUser;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;
    });
  });

  beforeEach(() => {
    cy.loginAsAdminSession(adminUser);
  });

  it('não deve permitir produto sem nome', () => {

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.goToCreateProduct();
    cy.assertProductFormVisible();

    cy.getProductPriceInput().type('100');
    cy.getProductDescriptionInput().type('Produto sem nome');
    cy.getProductQuantityInput().type('10');

    cy.submitProduct();

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body.nome).to.include('é obrigatório');
    });

  });

  it('não deve permitir produto sem preço', () => {

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.goToCreateProduct();
    cy.assertProductFormVisible();

    cy.getProductNameInput().type('Produto teste');
    cy.getProductDescriptionInput().type('Produto sem preço');
    cy.getProductQuantityInput().type('10');

    cy.submitProduct();

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body.preco).to.include('é obrigatório');
    });

  });

  it('não deve permitir produto sem quantidade', () => {

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.goToCreateProduct();
    cy.assertProductFormVisible();

    cy.getProductNameInput().type('Produto teste');
    cy.getProductPriceInput().type('100');
    cy.getProductDescriptionInput().type('Produto sem quantidade');

    cy.submitProduct();

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body.quantidade).to.include('é obrigatório');
    });

  });

  it('não deve permitir produto sem descrição', () => {

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.goToCreateProduct();
    cy.assertProductFormVisible();

    cy.getProductNameInput().type('Produto teste');
    cy.getProductPriceInput().type('100');
    cy.getProductQuantityInput().type('10');

    cy.submitProduct();

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body.descricao).to.include('é obrigatório');
    });

  });

  it('não deve permitir cadastrar produto com nome duplicado', () => {
    const product = createDynamicProduct();

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.goToCreateProduct();
    cy.assertProductFormVisible();

    cy.fillProductForm(product);
    cy.assertProductImageSelected(product);
    cy.submitProduct();

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
    });

    cy.visit('/admin/cadastrarprodutos');
    cy.assertProductFormVisible();

    cy.fillProductForm(product);
    cy.assertProductImageSelected(product);
    cy.submitProduct();

    cy.contains('Já existe produto com esse nome').should('be.visible');

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body.message).to.eq('Já existe produto com esse nome');
    });

  });

});
