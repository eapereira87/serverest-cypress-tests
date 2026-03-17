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

  it('deve cadastrar um novo produto com sucesso pela interface', () => {
    cy.generateDynamicProduct().then((newProduct) => {
      cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

      cy.assertAdminHome(adminUser.nome);
      cy.goToCreateProduct();
      cy.assertProductFormVisible();

      cy.fillProductForm(newProduct);
      cy.assertProductImageSelected(newProduct);
      cy.submitProduct();

      cy.wait('@postProduto').then(({ response }) => {
        cy.assertSuccessfulProductCreationResponse(response);
      });

      cy.goToProductList();
      cy.assertProductListPageVisible();
      cy.assertProductInList(newProduct);
    });
  });

  it('não deve permitir cadastrar produto com nome já existente', () => {
    cy.generateDynamicProduct().then((existingProduct) => {
      cy.apiLogin(adminUser.email, adminUser.password).then((loginResponse) => {
        const token = loginResponse.body.authorization;

        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/produtos`,
          headers: {
            Authorization: token
          },
          body: {
            nome: existingProduct.nome,
            preco: existingProduct.preco,
            descricao: existingProduct.descricao,
            quantidade: existingProduct.quantidade
          }
        });

        cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProdutoDuplicado');

        cy.assertAdminHome(adminUser.nome);
        cy.goToCreateProduct();
        cy.assertProductFormVisible();

        cy.fillProductForm(existingProduct);
        cy.assertProductImageSelected(existingProduct);
        cy.submitProduct();

        cy.wait('@postProdutoDuplicado').then(({ response }) => {
          cy.assertDuplicateProductResponse(response);
        });

        cy.assertDuplicateProductMessageVisible();
      });
    });
  });

  it('deve excluir um produto com sucesso pela interface', () => {
    cy.generateDynamicProduct().then((productToDelete) => {
      cy.apiLogin(adminUser.email, adminUser.password).then((loginResponse) => {
        const token = loginResponse.body.authorization;

        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/produtos`,
          headers: {
            Authorization: token
          },
          body: {
            nome: productToDelete.nome,
            preco: productToDelete.preco,
            descricao: productToDelete.descricao,
            quantidade: productToDelete.quantidade
          }
        });

        cy.intercept('DELETE', `${Cypress.env('apiUrl')}/produtos/*`).as('deleteProduto');

        cy.assertAdminHome(adminUser.nome);
        cy.goToProductList();
        cy.assertProductListPageVisible();
        cy.getProductRowByName(productToDelete.nome).should('be.visible');

        cy.deleteProductByName(productToDelete.nome);

        cy.wait('@deleteProduto').then(({ response }) => {
          cy.assertSuccessfulProductDeletionResponse(response);
        });

        cy.assertProductNotInList(productToDelete.nome);
      });
    });
  });
});
