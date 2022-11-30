export const throttle = <T extends (...args: unknown[]) => any>(
  fn: T,
  time: number
) => {
  let timer: number | undefined = undefined; //timer在本次声明之前存在，说明之前调用过
  let result: ReturnType<T>;
  return (...args: Parameters<T>) => {
    if (timer) {
      return result;
    } else {
      fn(...args);
      timer = setTimeout(() => {
        timer = undefined;
      }, time);
      return result;
    }
  };
};
