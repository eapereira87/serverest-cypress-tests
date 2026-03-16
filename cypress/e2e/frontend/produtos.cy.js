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
});
