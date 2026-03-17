import { createDynamicProduct } from '../../support/factories';

describe('Frontend - Limites de cadastro de produtos', () => {

  let adminUser;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;
    });
  });

  beforeEach(() => {
    cy.loginAsAdminSession(adminUser);
  });

  it('deve permitir cadastrar produto com quantidade zero', () => {
    const product = {
      ...createDynamicProduct(),
      quantidade: 0
    };

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

    cy.goToProductList();
    cy.assertProductListPageVisible();
    cy.assertProductInList(product);
  });

  it('não deve permitir cadastrar produto com preço zero', () => {
    const product = {
      ...createDynamicProduct(),
      preco: 0
    };

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.goToCreateProduct();
    cy.assertProductFormVisible();

    cy.fillProductForm(product);
    cy.assertProductImageSelected(product);

    cy.submitProduct();

    cy.contains('Preco deve ser um número positivo').should('be.visible');

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
    });
  });

  it('não deve permitir cadastrar produto com preço negativo', () => {
    const product = {
      ...createDynamicProduct(),
      preco: -1
    };

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.goToCreateProduct();
    cy.assertProductFormVisible();

    cy.fillProductForm(product);
    cy.assertProductImageSelected(product);

    cy.submitProduct();

    cy.contains('Preco deve ser um número positivo').should('be.visible');

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
    });
  });

  it('não deve permitir cadastrar produto com quantidade negativa', () => {
    const product = {
      ...createDynamicProduct(),
      quantidade: -1
    };

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.goToCreateProduct();
    cy.assertProductFormVisible();

    cy.fillProductForm(product);
    cy.assertProductImageSelected(product);

    cy.submitProduct();

    cy.contains('Quantidade deve ser maior ou igual a 0').should('be.visible');

    cy.wait('@postProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
    });
  });

});
