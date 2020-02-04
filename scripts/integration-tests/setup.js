import createDockerSql from '../utility/create-docker-sql';

export default async () => {
  // start docker sql instance
  await createDockerSql('nodemssqlcmdtest', 51433, 'Let_Me_In');
};
