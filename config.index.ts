import { writeFile } from 'fs';

import { env } from './secret_env';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
    production: true,
    apiURL: '${env.env.API_URL}',
    socketURL: '${env.env.SOCKET_URL}',
    WEATHER_URL: '${env.env.WEATHER_URL}',
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
