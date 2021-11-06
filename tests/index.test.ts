import { Polling } from "../src";
import { TestHelper } from "./helpers/helper";

test('Basic flow test', async () => {
    const poll = new Polling();

    const run = poll.run({
        waitForFn: () => 'Basic command',
        delay:1000,
        retry:5,
    })

    await expect(run).resolves.toEqual('Basic command')
});


test('Check polling with 1 sec response delay', async () => {
    
    const helper = new TestHelper();
    helper.fillWaitingVariable('Hello World', 1000);
    const waitFor = helper.waitFor.bind(helper);
    const timeOut = jest.spyOn(global, 'setTimeout');
    
    const poll = new Polling();
    
    const result = poll.run({
        waitForFn: waitFor,
        delay:100,
        retry:11
    })
    
    await expect(result).resolves.toEqual('Hello World');
    expect(timeOut).toHaveBeenCalledTimes(10);

    
});

test('Exponential flow test with 1 sec', async () => {
       
    const helper = new TestHelper();
    helper.fillWaitingVariable('Hello Poll', 1000);
    const waitFor = helper.waitFor.bind(helper);
    const consoleSpy = jest.spyOn(console, 'log');

    const poll = new Polling({exponential: true});

    const result = poll.run({
        waitForFn: waitFor,
        delay:2,
        retry:11,
        logFn: ({delayTime}) => console.log('delay: '+ delayTime)
    })

    await expect(result).resolves.toEqual('Hello Poll')
    expect(consoleSpy).toHaveBeenCalledTimes(10)
});



test('Check polling with 1 sec response delay and custom validate function', async () => {
    
    const helper = new TestHelper();
    helper.fillWaitingVariable(200, 1000);
    const waitFor = helper.waitFor.bind(helper);
    
    const customValid = (param: null | number) => {
        if(param === 200) return 200;
    }

    const poll = new Polling();

    const result = poll.run({
        waitForFn: waitFor,
        delay:100,
        retry:11,
        validateFn: customValid
    })

    await expect(result).resolves.toEqual(200)
});

test('Check polling with 1 sec response delay and custom validate function that does not match', async () => {
    
    const helper = new TestHelper();
    helper.fillWaitingVariable(200, 1000);
    const waitFor = helper.waitFor.bind(helper);
    
    const customValid = (param: any) => {
        if(param) return param === 500;
    }

    const poll = new Polling();

    const result = poll.run({
        waitForFn: waitFor,
        delay:100,
        retry:11,
        validateFn: customValid
    })
    
    await expect(result).rejects.toThrow()
});

test('Test Log', async () => {
       
    const helper = new TestHelper();
    helper.fillWaitingVariable('Hello Poll', 500);
    const waitFor = helper.waitFor.bind(helper);

    const consoleSpy = jest.spyOn(console, 'log');
    const poll = new Polling();

    const result = poll.run({
        waitForFn: waitFor,
        delay:95,
        retry:11,
        logFn: ({delayTime, result}) => console.log('delay: '+ delayTime, 'result: '+ result)
        
    })

    await expect(result).resolves.toEqual('Hello Poll')
    expect(consoleSpy).toBeCalled();
});


test('Test with params', async () => {
       
    const helper = new TestHelper();
    helper.fillWaitingVariable('My name is:', 1000);
    const waitFor = helper.waitForWithVariable.bind(helper);

    const poll = new Polling();

    const result = poll.run<{name: string, last: string}>({
        waitForFn: waitFor,
        delay:100,
        retry:11,
        params: ['James', 'Bond']
    })

    await expect(result).resolves.toEqual('My name is: James Bond')
});

test('Test with object Types', async () => {
       
    const helper = new TestHelper();
    helper.fillWaitingVariable({name: 'James', last: 'Bond'}, 1000);
    const waitFor = helper.waitFor.bind(helper);

    const poll = new Polling();

    const result = poll.run<{name: string, last: string}>({
        waitForFn: waitFor,
        delay:100,
        retry:11,
        validateFn: (obj) => {if(obj && obj.name && obj.last) return true}
    })

    await expect(result).resolves.toEqual({
        name: 'James',
        last: 'Bond'
    })
});

test('Test waitFor receives error', async () => {

    const poll = new Polling();

    const result = poll.run({
        waitForFn: () => { throw new Error('Wait for failed') },
        delay:100,
        retry:11
    })

    await expect(result).rejects.toThrowError('Wait for failed')
});