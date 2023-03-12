import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    coverageDirectory: './coverage/',
    collectCoverage: true,
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
  };
};
