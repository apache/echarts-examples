/**
 * @param {string} pkgName
 * @param {number} [retryCount=3]
 */
async function sync(pkgName, retryCount = 3) {
  const tag = `[${pkgName}]`;
  const action = 'sync mirror';
  const syncUrl = `https://registry-direct.npmmirror.com/${pkgName}/sync`;
  console.log(tag, `Start to ${action}...`);
  try {
    const data = await (
      await fetch(syncUrl, {
        method: 'PUT',
        query: {
          sync_upstream: true
        }
      })
    ).json();
    console.log(tag, 'Sync request data', data);
    if (!data.ok) {
      throw new Error(tag + ' Sync request error!');
    }
    const timer = setInterval(async () => {
      const logData = await (
        await fetch(syncUrl + '/log/' + data.logId)
      ).json();
      if (!logData.ok) {
        return;
      }
      const log = logData.log || '';
      console.log(tag, 'Sync log:', log);
      if (log.includes('Fail: [')) {
        const failInfo = log.match(/Fail: \[ (.*?) \]/);
        if (failInfo && failInfo[1]) {
          throw new Error(tag + ' Sync failed!');
        }
      }
      if (logData.syncDone) {
        clearInterval(timer);
        console.log(tag, 'Sync successfully!');
        try {
          const fullLog = await (await fetch(logData.logUrl)).text();
          console.log(tag, 'Sync full log:\n', fullLog);
        } catch {}
      }
    }, 2e3);
  } catch (e) {
    console.error(tag, `failed to ${action}`, e);
    if (!retryCount) {
      throw e;
    }
    console.log(tag, `Retry to ${action}...`, retryCount);
    sync(--retryCount);
  }
}

const pkgName = process.argv[2];
if (!pkgName) {
  throw new Error('No package to sync');
}
sync(pkgName);
