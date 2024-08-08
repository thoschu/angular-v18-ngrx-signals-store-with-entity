export function setBigInt(range: number): number {
  let firstValue = Math.floor(Math.random() * range);
  let is_prime = false;

  while (!is_prime) {
    is_prime = calcInt(firstValue);
    firstValue++;
  }

  return firstValue;
}

const calcInt: (num: number) => boolean = (num: number): boolean => {
  if (num === 1) {
    return false;
  } else if (num === 2) {
    return true;
  } else {
    for (let i = 2; i < num; i++) {
      if (num % i === 0) {
        return false;
      }
    }

    return true;
  }
};
