import { Session, SessionSettings } from 'common';

export function toSessionSettings(session: Session): SessionSettings {
  return {
    name: session.name,
    options: session.options,
    columns: session.columns,
    locked: session.locked,
    moderator: session.moderator,
    timer: session.timer,
  };
}
