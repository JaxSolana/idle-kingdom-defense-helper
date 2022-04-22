import { browser } from '$app/env';
import { derived } from 'svelte/store';
import * as zipson from 'zipson';

import { conquest } from './conquest';
import { heroes } from './heroes';
import { stage } from './stage';

const stores = [stage, conquest, heroes];

export const user = derived(stores, (values) => {
  if (!browser) return 'no token';
  // const token = window.btoa(JSON.stringify(values));
  return zipson.stringify(values);
});

export const loadFromBase64 = (token: string) => {
  const loaded = JSON.parse(window.atob(token));
  stores.forEach((store, index) => {
    store.set(loaded[index]);
  });
};

export const loadFromZipson = (token: string) => {
  const loaded = zipson.parse(token);
  stores.forEach((store, index) => {
    store.set(loaded[index]);
  });
};
