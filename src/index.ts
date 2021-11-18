import { IRun } from "./interfaces/IRun";

export class Polling {
    private cancel = false;
    /**
    * @param {string} [exponential="false"] Sets exponential to true / false. Default is false.
    */
    constructor(private config: { exponential?: boolean } = { exponential: false }) { }

    async run<T>({
        waitForFn,
        validateFn = isValid => !!isValid,
        logFn,
        retryErrorMessage,
        delay, 
        retry, 
        params = [],
        power = 0 }: IRun<T>): Promise<T> {

        this.validateStop();
        this.validateRetry(retry, waitForFn, retryErrorMessage);

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
        return this.run({ waitForFn, validateFn, logFn, delay, retry, params, power, retryErrorMessage });
    }

    stop(): {status: string} {
        this.cancel = true;
        return {status: 'stop'};
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

    private validateRetry(retry: number, waitForFn: Function, retryErrorMessage?: string): never | void {
        if (!retry) throw new Error(retryErrorMessage || `Polling retry cycle is ended. function name ${waitForFn.name}`);
    }
    private validateStop(): never | void {
        if (this.cancel) throw new Error('Polling was manually stopped');
    }
}