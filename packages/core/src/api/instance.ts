import axios, {
  isAxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import chalk from 'chalk';

import { BASE_URL } from '../constants/api';

const debug = process.argv.includes('--debug');

export const api = axios.create({ baseURL: BASE_URL });

const reqInterceptor = (req: InternalAxiosRequestConfig) => {
  const reqDebugLog = `${chalk.bold.yellow(req.method?.toUpperCase())} ${
    req.baseURL
  }${req.url}`;
  if (debug) console.debug(reqDebugLog, req.data || '');

  return req;
};

const resSuccessInterceptor = (res: AxiosResponse) => {
  const resStatusLog = chalk.green(
    `${chalk.bold(res.status)} ${res.statusText}`
  );
  if (debug) console.debug(resStatusLog, res.data || '');

  return res;
};
const resErrorInterceptor = (err: unknown) => {
  if (!isAxiosError(err) || !err.response) throw err;

  const resStatusLog = chalk.red(
    `${chalk.bold(err.response.status)} ${err.response.statusText}`
  );
  if (debug) console.debug(resStatusLog, err.response.data || '');

  throw err;
};

api.interceptors.request.use(reqInterceptor);
api.interceptors.response.use(resSuccessInterceptor, resErrorInterceptor);
