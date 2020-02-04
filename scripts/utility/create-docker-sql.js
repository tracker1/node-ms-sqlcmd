import { Docker } from 'docker-cli-js';
import shell from 'shelljs';
import exec from '../../src/utility/exec';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const isWin = process.platform === 'win32';
const docker = new Docker();

export const clearContainer = async name => {
  const containers = await docker.command('ps --all');
  const container = containers.containerList.filter(c => c.names === name)[0];
  if (container) {
    if (/^up/i.test(container.status)) {
      console.log(`Stopping SQL Server (${name})`);
      await docker.command(`kill "${name}"`);
    }
    console.log(`Removing SQL Server (${name})`);
    await docker.command(`rm "${name}"`);
  }
};

export const waitForSqlAvailability = async (name, sapwd) => {
  let done = false;
  await delay(1000);
  process.stdout.write(`\nWaiting for ${name} to start.`);
  while (!done) {
    await delay(1500);
    process.stdout.write('.');
    const result = shell.exec(
      `docker exec -i "${name}" /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "${sapwd}" -Q "SELECT Name FROM sys.Databases" > ${
        isWin ? 'nul' : '/dev/null'
      } 2>&1`
    );
    done = result.code === 0;
  }
};

export default async function createDockerSql(name, port, sapwd = 'Let_Me_In') {
  await clearContainer(name);

  console.log(`Creating New SQL Server (${name})`);
  shell.exec(
    `
      docker run 
        -m 2GB 
        --restart unless-stopped 
        --name "${name}" 
        -h "${name}" 
        -e "ACCEPT_EULA=Y" 
        -e "MSSQL_SA_PASSWORD=${sapwd}" 
        -p ${port}:1433
        -d "mcr.microsoft.com/mssql/server:2019-latest"
    `
      .replace(/[\s\r\n]+/g, ' ')
      .trim()
  );
  await waitForSqlAvailability(name, sapwd);
  console.log(`\nStarted SQL Server (${name}) on localhost,${port} user:sa, pass:${sapwd}`);
  await delay(100);
}
