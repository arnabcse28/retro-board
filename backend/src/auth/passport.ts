import passport from 'passport';
import { Strategy as LocalStrategy, IVerifyOptions } from 'passport-local';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as SlackStrategy } from 'passport-slack-oauth2';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import passportOkta from 'passport-okta-oauth20';
import {
  MultiSamlStrategy,
  Strategy as SamlStrategy,
} from '@node-saml/passport-saml';
import {
  TWITTER_CONFIG,
  GOOGLE_CONFIG,
  GITHUB_CONFIG,
  MICROSOFT_CONFIG,
  SLACK_CONFIG,
  OKTA_CONFIG,
} from './config.js';
import { AccountType } from '../common/index.js';
import chalk from 'chalk-template';
import loginUser from './logins/password-user.js';
import loginAnonymous from './logins/anonymous-user.js';
import {
  BaseProfile,
  TwitterProfile,
  GoogleProfile,
  GitHubProfile,
  MicrosoftProfile,
  SlackProfile,
  OktaProfile,
} from './types.js';
import { registerUser, UserRegistration } from '../db/actions/users.js';
import { serialiseIds, UserIds, deserialiseIds } from '../utils.js';
import config from '../config.js';
import { Request } from 'express';
import { mergeAnonymous } from '../db/actions/merge.js';
import { noop } from 'lodash-es';

const { Strategy: OktaStrategy } = passportOkta;

export default () => {
  passport.serializeUser<string>((user, cb) => {
    // Typings are wrong
    const actualUser = user as unknown as UserIds;
    cb(null, serialiseIds(actualUser));
  });
  passport.deserializeUser<string>(async (userId: string, cb) => {
    cb(null, deserialiseIds(userId) as unknown as string);
  });

  function callback<TProfile, TCallback>(type: AccountType) {
    return async (
      req: Request,
      _accessToken: string,
      _refreshToken: string,
      anyProfile: TProfile,
      cb: TCallback
    ) => {
      const profile = anyProfile as unknown as BaseProfile;
      let user: UserRegistration | null;
      switch (type) {
        case 'google':
          user = buildFromGoogleProfile(profile as GoogleProfile);
          break;
        case 'github':
          user = buildFromGitHubProfile(profile as GitHubProfile);
          break;
        case 'twitter':
          user = buildFromTwitterProfile(profile as TwitterProfile);
          break;
        case 'slack':
          user = buildFromSlackProfile(profile as SlackProfile);
          break;
        case 'microsoft':
          user = buildFromMicrosoftProfile(profile as MicrosoftProfile);
          break;
        case 'okta':
          user = buildFromOktaProfile(profile as OktaProfile);
          break;
        default:
          throw new Error('Unknown provider: ' + type);
      }

      const callback = cb as unknown as (
        error: string | null,
        user: UserIds | null
      ) => void;

      if (!user) {
        callback('Cannot build a user profile', null);
        return;
      }

      const newUser = await registerUser(user);

      if (newUser) {
        await mergeAnonymous(req, newUser.id);
        callback(null, newUser.toIds());
      } else {
        callback('Cannot register user', null);
      }
    };
  }

  function buildFromTwitterProfile(
    profile: TwitterProfile
  ): UserRegistration | null {
    const email = profile.emails.length ? profile.emails[0].value : null;
    if (!email) {
      return null;
    }
    return {
      name: profile.displayName,
      type: 'twitter',
      photo: profile.photos?.length ? profile.photos[0].value : undefined,
      username: profile.username,
      email,
    };
  }

  function buildFromGitHubProfile(
    profile: GitHubProfile
  ): UserRegistration | null {
    const displayName =
      profile.displayName ||
      profile.username ||
      (profile.emails.length ? profile.emails[0].value : '');
    const email =
      profile.emails && profile.emails.length ? profile.emails[0] : null;

    if (!email) {
      return null;
    }

    return {
      name: displayName,
      type: 'github',
      photo: profile.photos?.length ? profile.photos[0].value : undefined,
      username: profile.username,
      email: email.value,
    };
  }

  function buildFromGoogleProfile(
    profile: GoogleProfile
  ): UserRegistration | null {
    const email = profile.emails.length ? profile.emails[0].value : null;
    if (!email) {
      return null;
    }
    return {
      name: profile.displayName,
      type: 'google',
      photo: profile.photos?.length ? profile.photos[0].value : undefined,
      username: email,
      email,
    };
  }

  function buildFromSlackProfile(
    profile: SlackProfile
  ): UserRegistration | null {
    const email = profile.user.email;

    return {
      name: profile.displayName,
      type: 'slack',
      photo: profile.user.image_192,
      username: email,
      email,
      slackUserId: profile.id,
      slackTeamId: profile.team ? profile.team.id : undefined,
    };
  }

  function buildFromMicrosoftProfile(
    profile: MicrosoftProfile
  ): UserRegistration | null {
    const email = profile.emails[0].value;
    return {
      name: profile.displayName,
      type: 'microsoft',
      username: email,
      email,
    };
  }

  function buildFromOktaProfile(profile: OktaProfile): UserRegistration | null {
    const email = profile.email;

    return {
      name: profile.fullName,
      type: 'okta',
      username: email,
      email,
    };
  }

  function logSuccess(provider: string) {
    console.log(chalk`🔑  {red ${provider}} authentication {blue activated}`);
  }

  // Adding each OAuth provider's strategy to passport
  if (TWITTER_CONFIG) {
    passport.use(new TwitterStrategy(TWITTER_CONFIG, callback('twitter')));
    logSuccess('Twitter');
  }

  if (GOOGLE_CONFIG) {
    passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback('google')));
    logSuccess('Google');
  }

  if (GITHUB_CONFIG) {
    passport.use(new GithubStrategy(GITHUB_CONFIG, callback('github')));
    logSuccess('GitHub');
  }

  if (SLACK_CONFIG) {
    passport.use(new SlackStrategy(SLACK_CONFIG, callback('slack')));
    logSuccess('Slack');
  }

  if (MICROSOFT_CONFIG) {
    passport.use(
      new MicrosoftStrategy(MICROSOFT_CONFIG, callback('microsoft'))
    );
    logSuccess('Microsoft');
  }

  if (OKTA_CONFIG) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.use(new OktaStrategy(OKTA_CONFIG, callback('okta') as any));
    logSuccess('Okta');
  }

  passport.use(
    new SamlStrategy(
      {
        passReqToCallback: true,
        path: '/login/callback',
        entryPoint:
          'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
        issuer: 'passport-saml',
        cert: 'fake cert', // cert must be provided
      },
      function (req, profile, done) {
        return done(null, profile as any);
      },
      noop
    )
  );

  passport.use(
    new MultiSamlStrategy(
      {
        passReqToCallback: true, // makes req available in callback
        getSamlOptions: function (request, done) {
          console.log('Getting options');
          done(null, {
            path: 'http://localhost:3000/api/auth/onelogin/callback',
            audience: 'https://saml.boxyhq.com',
            entryPoint: 'https://mocksaml.com/api/saml/sso',
            cert: `MIIC4jCCAcoCCQC33wnybT5QZDANBgkqhkiG9w0BAQsFADAyMQswCQYDVQQGEwJVSzEPMA0GA1UECgwGQm94eUhRMRIwEAYDVQQDDAlNb2NrIFNBTUwwIBcNMjIwMjI4MjE0NjM4WhgPMzAyMTA3MDEyMTQ2MzhaMDIxCzAJBgNVBAYTAlVLMQ8wDQYDVQQKDAZCb3h5SFExEjAQBgNVBAMMCU1vY2sgU0FNTDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALGfYettMsct1T6tVUwTudNJH5Pnb9GGnkXi9Zw/e6x45DD0RuRONbFlJ2T4RjAE/uG+AjXxXQ8o2SZfb9+GgmCHuTJFNgHoZ1nFVXCmb/Hg8Hpd4vOAGXndixaReOiq3EH5XvpMjMkJ3+8+9VYMzMZOjkgQtAqO36eAFFfNKX7dTj3VpwLkvz6/KFCq8OAwY+AUi4eZm5J57D31GzjHwfjH9WTeX0MyndmnNB1qV75qQR3b2/W5sGHRv+9AarggJkF+ptUkXoLtVA51wcfYm6hILptpde5FQC8RWY1YrswBWAEZNfyrR4JeSweElNHg4NVOs4TwGjOPwWGqzTfgTlECAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAAYRlYflSXAWoZpFfwNiCQVE5d9zZ0DPzNdWhAybXcTyMf0z5mDf6FWBW5Gyoi9u3EMEDnzLcJNkwJAAc39Apa4I2/tml+Jy29dk8bTyX6m93ngmCgdLh5Za4khuU3AM3L63g7VexCuO7kwkjh/+LqdcIXsVGO6XDfu2QOs1Xpe9zIzLpwm/RNYeXUjbSj5ce/jekpAw7qyVVL4xOyh8AtUW1ek3wIw1MJvEgEPt0d16oshWJpoS1OT8Lr/22SvYEo3EmSGdTVGgk3x3s+A0qWAqTcyjr7Q4s/GKYRFfomGwz0TZ4Iw1ZN99Mm0eo2USlSRTVl7QHRTuiuSThHpLKQQ==`,
            callbackUrl: 'http://localhost:3000/api/auth/saml/callback',
            issuer: 'Retrospected',
          });
          // findProvider(request, function (err, provider) {
          //   if (err) {
          //     return done(err);
          //   }
          //   return done(null, provider.configuration);
          // });
        },
      },
      function (req, profile, done) {
        console.log('profile', profile);
        done(null, undefined);
        // for signon
        // findByEmail(profile.email, function (err, user) {
        //   if (err) {
        //     return done(err);
        //   }
        //   return done(null, user);
        // });
      },
      function (req, profile, done) {
        console.log('profile 2', profile);
        done(null, undefined);
        // for logout
        // findByNameID(profile.nameID, function (err, user) {
        //   if (err) {
        //     return done(err);
        //   }
        //   return done(null, user);
        // });
      }
    )
  );
  logSuccess('OneLogin');

  passport.use(
    new LocalStrategy(
      { passwordField: 'password', usernameField: 'username' },
      async (
        username: string,
        password: string,
        done: (
          error: string | null,
          user?: UserIds,
          options?: IVerifyOptions
        ) => void
      ) => {
        if (
          username.startsWith('ANONUSER__') &&
          username.endsWith('__ANONUSER')
        ) {
          // Anonymous login

          // Checking if they are allowed in the first place
          if (config.DISABLE_ANONYMOUS_LOGIN) {
            return done('Anonymous accounts are disabled', undefined);
          }

          const actualUsername = username
            .replace('ANONUSER__', '')
            .replace('__ANONUSER', '');
          const identity = await loginAnonymous(actualUsername, password);
          done(
            identity ? null : 'Anonymous account not valid',
            identity ? identity.toIds() : undefined
          );
        } else {
          // Regular account login

          // Checking if they are allowed in the first place
          if (config.DISABLE_PASSWORD_LOGIN) {
            return done('Password accounts are disabled', undefined);
          }

          const identity = await loginUser(username, password);
          done(
            !identity ? 'User cannot log in' : null,
            identity ? identity.toIds() : undefined
          );
        }
      }
    )
  );
};
