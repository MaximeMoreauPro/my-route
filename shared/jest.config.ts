import { Config } from 'jest';

import rootConfig from '../jest.config';

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config: Config = {
  ...rootConfig,
};

export default config;
