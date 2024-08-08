/// <reference lib="webworker" />

import { setBigInt } from './big-int';

addEventListener(
  'message',
  async ({ data }: Record<'data', number>): Promise<void> => {
    const result = await getData().catch(console.error);
    const id: number = setBigInt(data);

    postMessage({ id, result });
  },
);

const getData = async (): Promise<unknown> => {
  const url = 'http://localhost:3000/posts';

  try {
    const response: Response = await fetch(url);

    if (!response.ok) {
      return Promise.reject(new Error(`Response status: ${response.status}`));
    }

    return await response.json();
  } catch (error: unknown) {
    console.error(error);

    return error;
  }
};
