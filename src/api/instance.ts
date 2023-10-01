import axios from 'axios';
import { args } from '@/utils';

import { BASE_URL } from '@/constants';
import chalk from 'chalk';

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((req) => {
  const reqDebugLog = `${chalk.bold.yellow(req.method?.toUpperCase())} ${
    req.baseURL
  }${req.url}`;
  if (args.debug) console.log(reqDebugLog, req.data || '');

  return req;
});
api.interceptors.response.use((res) => {
  const resDebugLog = `${chalk.bold(res.status)} ${res.statusText}`;
  if (args.debug)
    console.log(
      res.status >= 400 ? chalk.red(resDebugLog) : chalk.green(resDebugLog),
      res.data || ''
    );

  return res;
});
