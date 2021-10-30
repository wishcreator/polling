interface IRun {
    fn: (...params: any[]) => any,
    validateFn?: (result: any) => boolean,
    delay: number,
    retry: number,
    params?: any[],
    logFn?:({result, delay, retry, exp}: {result: any, delay: number, retry: number, exp: number}) => any,
    exp?: number 
}
 
export class Polling {
    constructor(private config: {exponential?: boolean}) {}

    async run<T>({fn, validateFn = isValid => !!isValid, delay, retry, params = [], logFn, exp = 1}: IRun): Promise<T> {
        
        this.validateRetry(retry);

        const result = await fn(...params);
        
        if(logFn) {
            logFn({result, delay, retry, exp})
        }

        if(validateFn(result)) {
            return result;
        }

        await this.setSleep(delay, exp);

        exp++
        retry--
        return await this.run({fn, validateFn, delay, retry, params, logFn, exp});
    }

    private async setSleep(delay: number, exp: number) {
        if(this.config.exponential && exp) {
            await this.sleep(delay ** exp);
        } else {
            await this.sleep(delay);
        }
    }

    private sleep(ms: number) {
       return new Promise(resolve => setTimeout(resolve, ms));
    }

    private validateRetry(retry: number) {
        if(!retry) {
            throw new Error('Polling retry cycle is ended.')
        }
    }
}