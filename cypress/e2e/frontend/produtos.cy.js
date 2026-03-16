describe('Frontend - Gestão de produtos', () => {

  it('deve cadastrar um novo produto com sucesso pela interface', () => {
    cy.createAdminUserViaApi().then((adminUser) => {
      cy.generateDynamicProduct().then((newProduct) => {
        cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');
        cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProduto');

        cy.loginUI(adminUser.email, adminUser.password);
        cy.wait('@postLogin');

        cy.assertAdminHome(adminUser.nome);
        cy.goToCreateProduct();
        cy.assertProductFormVisible();

        cy.fillProductForm(newProduct);
        cy.assertProductImageSelected(newProduct);
        cy.submitProduct();

        cy.wait('@postProduto').then(({ response }) => {
          expect(response.statusCode).to.eq(201);
          expect(response.body.message).to.eq('Cadastro realizado com sucesso');
          expect(response.body._id).to.be.a('string').and.not.be.empty;
        });

        cy.goToProductList();
        cy.assertProductListPageVisible();
        cy.assertProductInList(newProduct);
      });
    });
  });

  it('não deve permitir cadastrar produto com nome já existente', () => {
    cy.createAdminUserViaApi().then((adminUser) => {
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
          }).then((createResponse) => {
            expect(createResponse.status).to.eq(201);
          });

          cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');
          cy.intercept('POST', `${Cypress.env('apiUrl')}/produtos`).as('postProdutoDuplicado');

          cy.loginUI(adminUser.email, adminUser.password);
          cy.wait('@postLogin');

          cy.assertAdminHome(adminUser.nome);
          cy.goToCreateProduct();
          cy.assertProductFormVisible();

          cy.fillProductForm(existingProduct);
          cy.assertProductImageSelected(existingProduct);
          cy.submitProduct();

          cy.wait('@postProdutoDuplicado').then(({ response }) => {
            expect(response.statusCode).to.eq(400);
            expect(response.body.message).to.eq('Já existe produto com esse nome');
          });

          cy.contains('Já existe produto com esse nome').should('be.visible');
        });
      });
    });
  });

  it('deve excluir um produto com sucesso pela interface', () => {
    cy.createAdminUserViaApi().then((adminUser) => {
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
          }).then((createResponse) => {
            expect(createResponse.status).to.eq(201);
          });

          cy.intercept('POST', `${Cypress.env('apiUrl')}/login`).as('postLogin');
          cy.intercept('DELETE', `${Cypress.env('apiUrl')}/produtos/*`).as('deleteProduto');

          cy.loginUI(adminUser.email, adminUser.password);
          cy.wait('@postLogin');

          cy.assertAdminHome(adminUser.nome);
          cy.goToProductList();
          cy.assertProductListPageVisible();
          cy.getProductRowByName(productToDelete.nome).should('be.visible');

          cy.deleteProductByName(productToDelete.nome);

          cy.wait('@deleteProduto').then(({ response }) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body.message).to.eq('Registro excluído com sucesso');
          });

          cy.assertProductNotInList(productToDelete.nome);
        });
      });
    });
  });

});
