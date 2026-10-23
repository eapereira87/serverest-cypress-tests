import { createDynamicProduct } from '../../support/factories';

describe('Frontend - Gestão de produtos', () => {
  let adminUser;
  let authToken;
  let produtoId;

  before(() => {
    cy.createAdminUserViaApi().then((user) => {
      adminUser = user;

      cy.apiLogin(user.email, user.password).then((response) => {
        expect(response.status).to.eq(200);
        authToken = response.body.authorization;
      });
    });
  });

  beforeEach(() => {
    produtoId = undefined;
    cy.loginAsAdminSession(adminUser);
  });

  afterEach(() => {
    if (produtoId) {
      cy.apiDeleteProduct(authToken, produtoId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');

        produtoId = undefined;
      });
    }
  });

  after(() => {
    if (adminUser?._id) {
      cy.apiDeleteUser(adminUser._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    }
  });

  it('deve cadastrar produto com sucesso', () => {
    const product = createDynamicProduct();

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

    cy.assertAdminHome(adminUser.nome);
    cy.goToCreateProduct();
    cy.assertProductFormVisible();

    cy.fillProductForm(product);
    cy.assertProductImageSelected();
    cy.submitProduct();

    cy.wait('@postProduto').then(({ response }) => {
      produtoId = response.body._id;

      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(produtoId).to.be.a('string').and.not.be.empty;
    });

    cy.goToProductList();
    cy.assertProductListPageVisible();
    cy.assertProductInList(product);
  });

  it('não deve permitir cadastrar produto duplicado', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((response) => {
      produtoId = response.body._id;

      expect(response.status).to.eq(201);
      expect(produtoId).to.be.a('string').and.not.be.empty;
    });

    cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`)
      .as('postProdutoDuplicado');

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

  it('deve excluir produto com sucesso', () => {
    const product = createDynamicProduct();

    cy.apiCreateProduct(authToken, product).then((response) => {
      produtoId = response.body._id;

      expect(response.status).to.eq(201);
      expect(produtoId).to.be.a('string').and.not.be.empty;
    });

    cy.intercept('DELETE', `${Cypress.env('apiUrl')}/produtos/*`)
      .as('deleteProduto');

    cy.goToProductList();
    cy.assertProductListPageVisible();

    cy.deleteProductByName(product.nome);

    cy.wait('@deleteProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message).to.eq('Registro excluído com sucesso');

      produtoId = undefined;
    });

    cy.assertProductNotInList(product.nome);
  });
});
