import axios, {
  InternalAxiosRequestConfig,
  isAxiosError,
  type AxiosResponse,
} from 'axios';
import chalk from 'chalk';

import { args } from '@/utils/args';
import { BASE_URL } from '@/constants/api';

export const api = axios.create({ baseURL: BASE_URL });

const reqInterceptor = (req: InternalAxiosRequestConfig) => {
  const reqDebugLog = `${chalk.bold.yellow(req.method?.toUpperCase())} ${
    req.baseURL
  }${req.url}`;
  if (args.debug) console.log(reqDebugLog, req.data || '');

  return req;
};

const resSuccessInterceptor = (res: AxiosResponse) => {
  const resStatusLog = chalk.green(
    `${chalk.bold(res.status)} ${res.statusText}`
  );
  if (args.debug) console.log(resStatusLog, res.data || '');

  return res;
};
const resErrorInterceptor = (err: unknown) => {
  if (!isAxiosError(err) || !err.response) throw err;

  const resStatusLog = chalk.red(
    `${chalk.bold(err.response.status)} ${err.response.statusText}`
  );
  if (args.debug) console.log(resStatusLog, err.response.data || '');

  throw err;
};

api.interceptors.request.use(reqInterceptor);
api.interceptors.response.use(resSuccessInterceptor, resErrorInterceptor);
