import docker from '@tracker1/docker-cli';
import spawn from '../../src/utility/spawn';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const isWin = process.platform === 'win32';

const trimCommand = input => input.replace(/[\s\r\n]+/g, ' ').trim();

export const clearContainer = async name => {
  const containers = await docker('ps --all');
  const container = containers.containerList.filter(c => c.names === name)[0];
  if (container) {
    if (/^up/i.test(container.status)) {
      console.log(`Stopping SQL Server (${name})`);
      await docker(`kill "${name}"`);
    }
    console.log(`Removing SQL Server (${name})`);
    await docker(`rm "${name}"`);
  }
};

export const waitForSqlAvailability = async (name, sapwd) => {
  await delay(1000);
  process.stdout.write(`\nWaiting for ${name} to start.`);
  while (true) {
    await delay(1500);
    process.stdout.write('.');
    try {
      const result = await docker(
        trimCommand(`
          exec 
            -i "${name}"
            /opt/mssql-tools/bin/sqlcmd
              -S localhost
              -U sa
              -P "${sapwd}"
              -Q "SELECT Name from sys.Databases"
        `)
      );
      if (result.raw) return;
    } catch (error) {
      // error code 1 is sqlcmd error, expected until ready
      if (error.code !== 1) throw error;
    }
  }
};

export default async function createDockerSql(name, port, sapwd = 'Let_Me_In') {
  await clearContainer(name);

  console.log(`Creating New SQL Server (${name})`);
  await docker(
    trimCommand(`
      run 
        -m 2GB 
        --restart unless-stopped 
        --name "${name}" 
        -h "${name}" 
        -e "ACCEPT_EULA=Y" 
        -e "MSSQL_SA_PASSWORD=${sapwd}" 
        -p ${port}:1433
        -d "mcr.microsoft.com/mssql/server:2019-latest"
    `)
  );
  await waitForSqlAvailability(name, sapwd);
  console.log(`\nStarted SQL Server (${name}) on localhost,${port} user:sa, pass:${sapwd}`);
  await delay(100);
}
