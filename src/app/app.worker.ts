/// <reference lib="webworker" />

import { setBigInt } from './big-int';

addEventListener('message', ({ data }: Record<'data', number>): void => {
  getData().catch(console.error);

  postMessage(setBigInt(data));
});

const getData = async (): Promise<void> => {
  const url = 'http://localhost:3000/posts';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    console.log(await response.json());
  } catch (error) {
    console.error(error);
  }
};
