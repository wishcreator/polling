export class TestHelper {

      waitingVariable: null | string = null;

      fillWaitingVariable(waitingVariable: any, time: number) {
        setTimeout(() => {
            this.waitingVariable = waitingVariable
        }, time)
    }

      waitFor() {
        return this.waitingVariable;
    }

      waitForWithVariable(name: string, lastName: string) {
          if(this.waitingVariable) {
            return this.waitingVariable + ' ' + name + ' ' + lastName
          }
          return this.waitingVariable;
      }

}