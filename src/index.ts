import { IRun } from "./interfaces/IRun";

export class Polling {
    /**
    * @param {string} [exponential="false"] Sets exponential to true / false. Default is false.
    */
    constructor(private config: { exponential?: boolean } = { exponential: false }) { }

    async run<T>({
        waitForFn,
        validateFn = isValid => !!isValid,
        delay, 
        retry, 
        params = [],
        logFn,
        power = 0 }: IRun<T>): Promise<T> {

        this.validateRetry(retry, waitForFn);

        const delayTime = await this.setSleep(delay, power);
        const result = await waitForFn(...params);

        if (logFn) {
            logFn({ result, retry, delayTime });
        }

        if (validateFn(result)) {
            return result;
        }

        power++
        retry--
        return this.run({ waitForFn, validateFn, delay, retry, params, logFn, power });
    }

    private async setSleep(delay: number, power: number): Promise<number> {
        let delayTime = 0;
        if (power <= 0) return delayTime;
        if (this.config.exponential) {
            delayTime = delay ** power;
            await this.sleep(delayTime);
        } else {
            delayTime = delay;
            await this.sleep(delayTime);
        }
        return delayTime;
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private validateRetry(retry: number, waitForFn: Function): never | void {
        if (!retry) throw new Error(`Polling retry cycle is ended. function name ${waitForFn.name}`);
    }
}