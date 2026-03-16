Cypress.Commands.add('generateDynamicUser', (options = {}) => {
  const timestamp = Date.now()

  const user = {
    nome: `Usuario Teste ${timestamp}`,
    email: `usuario${timestamp}@teste.com`,
    password: `Teste@${timestamp}`,
    administrador: options.administrador || 'false'
  }

  return cy.wrap(user)
})

Cypress.Commands.add('createAdminUserViaApi', () => {
  return cy.generateDynamicUser({ administrador: 'true' }).then((admin) => {
    return cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/usuarios`,
      body: admin,
      failOnStatusCode: false
    }).then(() => {
      return cy.wrap(admin)
    })
  })
})
