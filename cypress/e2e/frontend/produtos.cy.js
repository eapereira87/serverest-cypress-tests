import { createDynamicProduct } from '../../support/factories';

describe('Frontend - Gestão de produtos', () => {

  let adminUser;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;
    });
  });

  beforeEach(() => {
    cy.loginAsAdminSession(adminUser);
  });

  it('deve cadastrar produto com sucesso', () => {
    const product = createDynamicProduct();

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.assertAdminHome(adminUser.nome);
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

  it('não deve permitir cadastrar produto duplicado', () => {
    const product = createDynamicProduct();

    cy.apiLogin(adminUser.email, adminUser.password).then((loginResponse) => {
      const token = loginResponse.body.authorization;

      cy.apiCreateProduct(token, product).then((response) => {
        expect(response.status).to.eq(201);
      });

      cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProdutoDuplicado');

      cy.goToCreateProduct();
      cy.assertProductFormVisible();

      cy.fillProductForm(product);
      cy.submitProduct();

      cy.wait('@postProdutoDuplicado').then(({ response }) => {
        expect(response.statusCode).to.eq(400);
        expect(response.body.message).to.eq('Já existe produto com esse nome');
      });

      cy.assertDuplicateProductMessageVisible();
    });
  });

  it('deve excluir produto com sucesso', () => {
    const product = createDynamicProduct();

    cy.apiLogin(adminUser.email, adminUser.password).then((loginResponse) => {
      const token = loginResponse.body.authorization;

      cy.apiCreateProduct(token, product).then((response) => {
        expect(response.status).to.eq(201);
      });

      cy.intercept('DELETE', `${Cypress.env('apiUrl')}/produtos/*`).as('deleteProduto');

      cy.goToProductList();
      cy.assertProductListPageVisible();

      cy.deleteProductByName(product.nome);

      cy.wait('@deleteProduto').then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });

      cy.assertProductNotInList(product.nome);
    });
  });

});
