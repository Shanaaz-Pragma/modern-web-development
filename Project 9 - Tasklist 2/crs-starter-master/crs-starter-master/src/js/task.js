/**
 * Construct a Task instance. Manage it's complete state.
 */
export class Task{
    /**
     * @constructor
     * @param {string} title 
     * @param {date} date 
     * @param {boolean} complete 
     */

    constructor(title, date, complete=false) {
        this.title = title;
        this.date = date;
        this.isComplete = complete;
    }

    /**
     * Dispose memory
     */
    dispose() {
        this.title = null;
        this.date = null;
        this.isComplete = null;
    }

    /**
     * Handle complete state
     * @param {*} allow 
     */
    complete(value) {       
        this.isComplete = value;
    }
}