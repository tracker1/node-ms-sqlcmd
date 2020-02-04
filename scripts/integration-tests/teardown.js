import { clearContainer } from '../utility/create-docker-sql';

export default async () => {
  await clearContainer('nodemssqlcmdtest');
};
