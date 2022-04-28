const LoopController = {
  _config: {
    maxExecTimePerLoop: 1e4,
    maxLoopCount: 1e6
  },
  loopMap: new Map(),
  initLoop(loopID) {
    this.setLoop(loopID, {
      isInit: true,
      totalExecTime: 0,
      startTime: Date.now(),
      count: 0
    });
  },
  getLoop(loopID) {
    return this.loopMap.get(loopID);
  },
  setLoop(loopID, loop) {
    this.loopMap.set(loopID, loop);
  },
  delLoop(loopID) {
    this.loopMap.delete(loopID);
  },
  clearLoops() {
    this.loopMap.clear();
  },
  exitLoop(loopID) {
    this.delLoop(loopID);
  },
  calcLoop(loopID) {
    if (this.loopMap.has(loopID)) {
      let { isInit, totalExecTime, startTime, count } = this.getLoop(loopID);
      if (isInit) {
        totalExecTime = Date.now() - startTime;
        count++;
        this.setLoop(loopID, {
          isInit,
          totalExecTime,
          startTime,
          count
        });
      } else {
        this.initLoop(loopID);
      }
    } else {
      this.initLoop(loopID);
    }
  },
  loopMonitor(loopID) {
    this.calcLoop(loopID);
    const loop = this.getLoop(loopID);
    const { maxExecTimePerLoop, maxLoopCount } = this._config;
    if (loop.totalExecTime > maxExecTimePerLoop && loop.count > maxLoopCount) {
      this.clearLoops();
      throw new Error(
        'The loop executes so many times that ECharts has to exit the loop in case the page gets stuck'
      );
    }
  }
};
