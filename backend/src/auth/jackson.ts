import { JacksonOption } from '@boxyhq/saml-jackson';

const baseUrl = 'http://localhost:3000';
const samlAudience = 'Retrospected';
const product = 'retrospected';
const samlPath = '/api/sso/acs';
const redirectUrl = `${baseUrl}/api/sso/callback`;

// SAML Jackson options
const options: JacksonOption = {
  externalUrl: baseUrl,
  samlAudience,
  samlPath,
  db: {
    engine: 'sql',
    type: 'postgres',
    url: 'postgres://postgres:postgres@localhost:5432/postgres',
  },
};

export default {
  baseUrl,
  product,
  samlPath,
  redirectUrl,
  samlAudience,
  options,
};
