import { me } from 'api';
import { FullUser } from 'common';
import { atom, selector } from 'recoil';

const userDefaults = selector({
  key: 'user-defaults',
  get: async () => {
    console.log('getting defaults...');
    const user = await me();
    console.log('got defaults', user);
    return user;
  },
});

export const userState = atom<FullUser | null>({
  key: 'user',
  default: userDefaults,
});
