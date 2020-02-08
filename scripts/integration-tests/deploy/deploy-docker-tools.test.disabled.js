import dns from 'dns';
import os from 'os';
import path from 'path';
import sql from 'mssql';
import findSqlcmd from '../../../src/find-sqlcmd';
import runSqlcmd from '../../../src/index';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getLocalIp = () =>
  new Promise((resolve, reject) => {
    dns.lookup(os.hostname(), (err, add) => (err ? reject(err) : resolve(add)));
  });

describe('scripts/integration-tests/deploy/deploy-docker-tools', () => {
  it('will run a local deployment', async () => {
    const localIpAddress = await getLocalIp();
    if (!localIpAddress) {
      console.log('\n\n\nWARNING: Skipping docker mssql-tools test, no matching IP address.\n\n\n');
    }

    // arrange
    const conn = `mssql+docker://sa:Let_Me_In@${localIpAddress}:51433/`;
    const scripts = [path.join(__dirname, 'deploy.sql')];
    const vars = {
      DatabaseName: 'DeployDockerTools',
    };

    // act
    try {
      await runSqlcmd(conn, scripts, vars, { echo: true });
    } catch (error) {
      // display error and rethrow - this shouldn't happen
      console.log('\n\n', error, '\n\n');
      throw error;
    }
    await delay(2000);

    // assert
    const db = await sql.connect(
      'mssql://sa:Let_Me_In@localhost:51433/DeployDockerTools?enableArithAbort=true'
    );
    try {
      const result = await db.query`
        SELECT [Value]
        FROM [Configuration]
        WHERE [Key] = ${'DbVersion'}
      `;
      expect(result.recordset[0]['Value']).toEqual('1');
      await db.close(); // close connection
    } catch (error) {
      try {
        await db.close();
      } catch (_) {}
      console.log('\n\n', error, '\n\n');
      throw error;
    }
  }, 15000);
});
