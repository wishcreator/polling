import { IlogFn } from "./IlogFn";

export interface IRun<T> {
  /** WaitFor Function is the function you want to run poll on. The default validation process checks if the WaitFor has a truthy response. For custom validation please use "validateFn".
  * @param callbackfn A function that accepts array argument. The waitForFn method calls the callbackfn function and waits for its result.
  */
  waitForFn: (...params: any[]) => T,
  /**
  * Validate Function accepts waitForFunction's result. The default validation checks if the response is truthy or not. You can use this function to write your own custom logic.
  * @param callbackfn A function that accepts any argument. The validateFn method calls the callbackfn function and waits for its result.
  */
  validateFn?: (result: T | null) => unknown,
  /**
   * logger accepts callback function that returns some logging information.
   * @param callbackfn A function that accepts - result, retry, delayTime argument.
   * @param {string} options.result - Show waitForFn result.
   * @param {string} options.retry - Show how many retries left.
   * @param {string} options.delayTime - Show current delay time.
   */
  logFn?: ({ result, retry, delayTime }: IlogFn) => void,
  /**
  * @param delay Sets a delay in ms.
  */
  delay: number;
  /**
  * @param retry Sets the number of maximum polling runs.
  */
  retry: number;
  /**
  * @param params Sets a parameters that will be called by the waitForFn method.
  */
  params?: any[];
  /**
  * @param power Sets the power X^Y. It is possible to change the initial default power.
  */
  power?: number;
    /**
  * @param retryErrorMessage Sets custom retry error message.
  */
     retryErrorMessage?: string;
}