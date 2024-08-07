/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  console.log(typeof data);
  postMessage(data);
});
