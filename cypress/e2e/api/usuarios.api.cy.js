import { createDynamicUser } from '../../support/factories';
import { assertSchema } from '../../support/utils/schemaValidator';
import {
  createUserResponseSchema,
  listUsersSchema,
  errorMessageSchema
} from '../../support/schemas/user.schema';

describe('API - Usuários', () => {
  let usuarioId;

  beforeEach(() => {
    usuarioId = undefined;
  });

  afterEach(() => {
    if (usuarioId) {
      cy.apiDeleteUser(usuarioId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    }
  });

  it('deve cadastrar usuário com sucesso e localizar na listagem por email', () => {
    const user = createDynamicUser({ administrador: 'false' });

    cy.apiCreateUser(user).then((response) => {
      usuarioId = response.body._id;

      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(usuarioId).to.be.a('string').and.not.be.empty;

      assertSchema(response.body, createUserResponseSchema);
    });

    cy.apiListUsers({ email: user.email }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.quantidade).to.eq(1);

      assertSchema(response.body, listUsersSchema);

      const foundUser = response.body.usuarios[0];

      expect(foundUser._id).to.eq(usuarioId);
      expect(foundUser.email).to.eq(user.email);
      expect(foundUser.nome).to.eq(user.nome);
      expect(foundUser.administrador).to.eq(user.administrador);
    });
  });

  it('não deve permitir cadastrar usuário com email duplicado', () => {
    const user = createDynamicUser();

    cy.apiCreateUser(user).then((response) => {
      usuarioId = response.body._id;

      expect(response.status).to.eq(201);
      expect(usuarioId).to.be.a('string').and.not.be.empty;
    });

    cy.apiCreateUser(user).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Este email já está sendo usado');

      assertSchema(response.body, errorMessageSchema);
    });
  });
});
