function expectType(value, type, path) {
  switch (type) {
    case 'string':
      expect(value, `${path} should be string`).to.be.a('string');
      break;
    case 'number':
      expect(value, `${path} should be number`).to.be.a('number');
      break;
    case 'integer':
      expect(value, `${path} should be integer`).to.be.a('number');
      expect(Number.isInteger(value), `${path} should be integer`).to.eq(true);
      break;
    case 'boolean':
      expect(value, `${path} should be boolean`).to.be.a('boolean');
      break;
    case 'array':
      expect(value, `${path} should be array`).to.be.an('array');
      break;
    case 'object':
      expect(value, `${path} should be object`).to.be.an('object');
      expect(value, `${path} should not be array`).to.not.be.an('array');
      break;
    default:
      throw new Error(`Unsupported schema type "${type}" at ${path}`);
  }
}

function validateNode(value, schema, path) {
  expect(schema, `schema for ${path}`).to.be.an('object');
  expect(schema.type, `schema.type for ${path}`).to.be.a('string');

  expectType(value, schema.type, path);

  if (schema.enum) {
    expect(schema.enum, `schema.enum for ${path}`).to.be.an('array');
    expect(schema.enum.includes(value), `${path} should be one of enum values`).to.eq(true);
  }

  if (schema.pattern) {
    expect(value, `${path} should match pattern`).to.match(schema.pattern);
  }

  if (schema.type === 'object') {
    const required = schema.required || [];
    required.forEach((key) => {
      expect(value, `${path} should have key ${key}`).to.have.property(key);
    });

    const properties = schema.properties || {};
    Object.entries(properties).forEach(([key, childSchema]) => {
      if (value[key] !== undefined) {
        validateNode(value[key], childSchema, `${path}.${key}`);
      }
    });
  }

  if (schema.type === 'array' && schema.items) {
    value.forEach((item, index) => {
      validateNode(item, schema.items, `${path}[${index}]`);
    });
  }
}

export function assertSchema(body, schema) {
  validateNode(body, schema, 'response.body');
}
