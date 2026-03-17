export const createProductResponseSchema = {
  type: 'object',
  required: ['message', '_id'],
  properties: {
    message: { type: 'string' },
    _id: { type: 'string' }
  }
};

export const productSchema = {
  type: 'object',
  required: ['nome', 'preco', 'descricao', 'quantidade', '_id'],
  properties: {
    nome: { type: 'string' },
    preco: { type: 'integer' },
    descricao: { type: 'string' },
    quantidade: { type: 'integer' },
    _id: { type: 'string' }
  }
};

export const listProductsSchema = {
  type: 'object',
  required: ['quantidade', 'produtos'],
  properties: {
    quantidade: { type: 'number' },
    produtos: {
      type: 'array',
      items: productSchema
    }
  }
};

export const deleteProductResponseSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' }
  }
};

export const errorMessageSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' }
  }
};
