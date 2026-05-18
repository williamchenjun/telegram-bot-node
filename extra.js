/**
 * Represents a scheduled task.
 */
class Schedule {
    constructor(schedule){
        this.schedule = schedule;
    }
    
    /**
     * Returns the schedule ID.
     * @returns {number}
     */
    get id(){
        return this.schedule;
    }

    /**
     * Clear a scheduled task.
     * @returns {boolean}
     */
    delete(){
        clearInterval(this.schedule);
        return true;
    }
}

class Queue {
    constructor (){
        this.queue = [];
        this.standby = [];
        this.running = false;
    }

    /**
     * Get queue length.
     * @returns {number}
     */
    get length() {
        return this.queue.length;
    }

    /**
     * Queue a task to run sequentially.
     * 
     * For example:
     * 
     * ```
     * const queue = new Queue();
     * queue.addTask(async () => {
     *      const response = await fetch(...);
     *      return response.ok ? "ok" : "error";
     * });
     * ```
     * 
     * @param {() => Promise<void>} task
     */
    addTask(task){
        this.queue.push(task);
        return this;
    }

    /**
     * Queue an array of tasks to run sequentially.
     * 
     * @param {(() => Promise<void>)[]} tasks
     */
    addTasks(tasks){
        for (const task of tasks){
            this.queue.push(task);
        }
        return this;
    }

    /**
     * Put a task on standby for later processing.
     * @param {() => Promise<void>} task 
     * @returns 
     */
    addStandby(task){
        this.standby.push(task);
        return this;
    }

    /**
     * Approve one task on standby. This method pushes the standby task to the main queue.
     * @param {number} index 
     * @returns 
     */
    approveTaskById(index = 0){
        if (this.standby.length === 0) return;
        if (index < 0 || index >= this.standby.length) return;

        const task = this.standby.splice(index, 1)[0];
        this.queue.push(task);
        console.log("Standby task pushed to main queue...");
        return this;
    }

    /**
     * Approve all tasks on standby. This method pushes the standby tasks to the main queue.
     * @returns 
     */
    approveAllTasks(){
        if (this.standby.length === 0) return;

        this.queue.push(...this.standby);
        this.standby = [];
        console.log("All standby tasks pushed to main queue...");
        return this;
    }

    /**
     * Remove a standby task by index.
     * @param {number} index 
     * @returns 
     */
    clearStandby(index = 0){
        if (this.standby.length === 0) return;
        if (index < 0 || index >= this.standby.length) return;

        this.standby.splice(index, 1)[0];
        console.log(`Standby task ${index} removed...`);
        return this;
    }
    
    /**
     * Remove all standby tasks.
     * @returns
     */
    clearAllStandby(){
        this.standby = [];
        return this;
    }

    /**
     * Start running tasks sequentially.
     */
    async processQueue() {
        console.log({
            running: this.running,
            queue: this.queue.length,
            standby: this.standby.length
        });
        if (this.running || this.queue.length === 0) return;
        this.running = true;
        try {
            while (this.queue.length > 0) {
                console.log(`Processing task. Remaining: ${this.queue.length}`);
                const task = this.queue.shift();
                try {
                    await this.withTimeout(task(), 30000);
                } catch (error) {
                    console.error("Queue task failed:", error);
                }
            }
        } finally {
            this.running = false;

            if (this.queue.length > 0) {
                this.processQueue();
            }
        }
    }

    async withTimeout(promise, timeout = 30000) {
        let timer;
        const timeoutPromise = new Promise((_, reject) => {
            timer = setTimeout(() => {
                reject(new Error("Task timeout"));
            }, timeout);
        });

        try {
            return await Promise.race([
                promise,
                timeoutPromise
            ]);
        } finally {
            clearTimeout(timer);
        }
    }
}

export {
    Schedule,
    Queue
}