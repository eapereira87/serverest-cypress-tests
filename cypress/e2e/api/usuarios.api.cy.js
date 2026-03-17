import { createDynamicUser } from '../../support/factories';
import { assertSchema } from '../../support/utils/schemaValidator';
import { createUserResponseSchema, listUsersSchema, errorMessageSchema } from '../../support/schemas/user.schema';

describe('API - Usuários', () => {

  it('deve cadastrar usuário com sucesso e localizar na listagem por email', () => {
    const user = createDynamicUser({ administrador: 'false' });

    cy.apiCreateUser(user).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body._id).to.be.a('string').and.not.be.empty;

      assertSchema(response.body, createUserResponseSchema);
    });

    cy.apiListUsers({ email: user.email }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.quantidade).to.be.greaterThan(0);

      assertSchema(response.body, listUsersSchema);

      const foundUser = response.body.usuarios.find((item) => item.email === user.email);
      expect(foundUser, 'usuário deve existir na listagem').to.exist;
      expect(foundUser.nome).to.eq(user.nome);
      expect(foundUser.administrador).to.eq(user.administrador);
    });
  });

  it('não deve permitir cadastrar usuário com email duplicado', () => {
    const user = createDynamicUser();

    cy.apiCreateUser(user).then((firstResponse) => {
      expect(firstResponse.status).to.eq(201);
    });

    cy.apiCreateUser(user).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Este email já está sendo usado');

      assertSchema(response.body, errorMessageSchema);
    });
  });

});
