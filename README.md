# generic-polling-pulse

Promise based generic polling (Does not support IE).

## Table of Contents

	- [Installing](#installing)
	- [Usage](#usage)
	- [Dictionary](#dictionary)


## Installing

Using npm:

    $ npm install generic-polling-pulse

## Usage

**Basic usage:**
```typescript
const { Polling } =  require('generic-polling-pulse'); 
Or
import { Polling } from  "generic-polling-pulse"; //ES6

const poll = new  Polling();

const run = poll.run({
waitForFn: () => 'Basic command', 
delay:1000,
retry:5,
})
		
// Basic poll is waiting for truthy response from waitForFn callback.
// poll.run will return the wanted result from the waitfor function.
```


**Basic usage with exponential backoff:**
```typescript
import { Polling } from  "generic-polling-pulse";
  
const poll = new  Polling({exponential:  true});

const waitFor = () => {
	Waiting for answer...
}
  
const run = poll.run({
	waitForFn: waitFor, 
	delay: 2, // Delay in ms
	retry: 10,
	// We have added log function if we want to debug and more info.
	logFn: ({delayTime}) =>  console.log('delay: '+ delayTime)
})
```
**Advanced examples:**

A. The use of custom validations:
```typescript
import { Polling } from  "generic-polling-pulse";

const poll = new  Polling();

const waitFor = () => {
	// Waiting for answer... can return 200 | 201 | 404 | 500
	// first return 404
	// second return 404
	// third return 200;
}
  
// We can use custom validate callback function to validate our waitForFn response.
// We are looking for status 200;
// The param - is actuall response response from waitForFn callback.
const customValid = (param: null | number) => {
	// We are looking for 200 response from waitFor callback.
   if(param === 200) return  200;
}

const result = poll.run({
    waitForFn: waitFor,
    delay:100,
    retry:11,
    validateFn: customValid
})
```
**B. Usage of types**
```typescript
import { Polling } from  "generic-polling-pulse";
    
const  poll = new  Polling();
 
const result = poll.run<{name: string, last: string}>({
	waitForFn:  waitFor,
	delay:100,
	retry:11,
	// We can use custom validate callback function to validate our waitForFn response.
	validateFn: (obj) => {if(obj && obj.name && obj.last) return  true}
})
```
**C. WaitFor usage of parameters:**
```typescript
import { Polling } from  "generic-polling-pulse";
 
const  poll = new  Polling();

const waitForWithParams = async (token: string) => {
	... fetch(url) logic waits untill data recived;
	return  'My name is: ' + ' ' + name + ' ' + lastName;
}

const  result = poll.run<{name: string, last: string}>({
	waitForFn: waitForWithParams,
	delay:100, // delay in ms
	retry:11, // Number of retries
	params: ['12345678a'] // Params used for waitForFn
})
```


## Dictionary
```typescript
run<T>({waitForFn, validateFn, logFn, delay, retry, params, power}): Promise<T>
```
| CallBacks| explanation |
|--|--|
| waitForFn| WaitFor Function is the function you want to run poll on. The default validation process checks if the WaitFor has a truthy response. For custom validation please use "validateFn". |
| validateFn| Validate Function accepts waitForFunction's result. The default validation checks if the response is truthy or not. You can use this function to write your own custom logic. |
| logFn| logger accepts callback function that returns some logging information. {result, retry, delayTime}. |


| Parameters | explanation |
|--|--|
| delay: number | Sets a delay in ms. |
| retry: number| Sets the number of maximum polling runs. |
| params: any[]| Sets a parameters that will be called by the waitForFn method. |
| power: number| Sets the power $X^{Y}$. It is possible to change the initial default power |
