import express from 'express';
import { controllers } from '@boxyhq/saml-jackson';
import options from './jackson.js';

const tenant = 'retrospected'; // The user's tenant

export async function sso() {
  const router = express.Router();
  const jackson = await controllers(options.options);
  const { oauthController } = jackson;

  router.get('/', async (req, res, _next) => {
    const { redirect_url } = await oauthController.authorize({
      tenant,
      product: options.product,
      state: 'a-random-state-value',
      redirect_uri: options.redirectUrl,
    } as any);

    if (redirect_url) res.redirect(redirect_url);
  });

  router.post('/acs', async (req, res, _next) => {
    const { RelayState, SAMLResponse } = req.body;

    const { redirect_url } = await oauthController.samlResponse({
      RelayState,
      SAMLResponse,
    });

    if (redirect_url) res.redirect(redirect_url);
  });

  router.get('/callback', async (req, _res, _next) => {
    const { code } = req.query;

    const product = options.product;

    const clientId = `tenant=${tenant}&product=${product}`;
    const clientSecret = 'dummy';

    // Exchange the `code` for `access_token`
    const { access_token } = await oauthController.token({
      code: code as string,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: options.redirectUrl,
      grant_type: 'authorization_code',
    });

    const user = await oauthController.userInfo(access_token);

    console.log('User: ', user);
  });

  return router;
}
