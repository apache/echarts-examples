function runTasks(
    taskParamsLists, createTask, concurrency
) {
    concurrency = Math.min(taskParamsLists.length, concurrency);
    return new Promise((resolve, reject) => {
        let runningTaskCount = 0;
        let cursor = 0;
        let rets = [];

        function finishTask(res, idx) {
            rets[idx] = res;
            processNext();
        }

        function failTask(e) {
            console.error(e);
            processNext();
        }

        function processNext() {
            runningTaskCount--;
            addTask();

            if (runningTaskCount === 0) {
                resolve(rets);
            }
        }

        function addTask() {
            const param = taskParamsLists[cursor];
            if (param) {
                const currentTaskIdx = cursor;
                runningTaskCount++;
                createTask(param)
                    .then((res) => finishTask(res, currentTaskIdx))
                    .catch(failTask);
                cursor++;
            }
        }

        for (let i = 0; i < concurrency; i++) {
            addTask();
        }
    });
}

module.exports.runTasks = runTasks;