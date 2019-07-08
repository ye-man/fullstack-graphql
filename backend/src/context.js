const { createContext, EXPECTED_OPTIONS_KEY } = require('dataloader-sequelize');
const { resolver } = require('graphql-sequelize');

const { getUser } = require('./utils/user');
const mongo = require('./db-mongo');
const sequelize = require('./db-sequelize');

// DataLoader for Sequelize
resolver.contextTopOptions = { [EXPECTED_OPTIONS_KEY]: EXPECTED_OPTIONS_KEY };

module.exports = ({ request }) => {
  // Create DataLoader for each request
  const dataloaderContext = createContext(sequelize.sequelize);

  let ctx = {
    [EXPECTED_OPTIONS_KEY]: dataloaderContext,
  };

  // Get Authorization token
  const authorization = request && request.get('Authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    const user = getUser(token);
    ctx = { ...ctx, token, user };
  }

  return {
    ...ctx,
    request,
    models: {
      ...mongo.models,
      ...sequelize.models,
    },
  };
};