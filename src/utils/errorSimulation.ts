
/**
 * Utility for simulating various error scenarios for testing purposes
 */

// Error types that can be simulated
export enum SimulatedErrorType {
  Network = 'network',
  Authentication = 'auth',
  Permission = 'permission',
  DataFetch = 'data',
  Validation = 'input',
  Storage = 'storage',
  Performance = 'performance',
  Unhandled = 'unhandled'
}

// Options for error simulation
export interface ErrorSimulationOptions {
  message?: string;
  code?: string;
  status?: number;
  timeout?: number;
  recoverable?: boolean;
}

/**
 * Simulate a network request that fails
 */
export const simulateNetworkError = (options: ErrorSimulationOptions = {}) => {
  const { message = 'Network request failed', code = 'ERR_NETWORK', timeout = 0 } = options;
  
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message);
      (error as any).code = code;
      reject(error);
    }, timeout);
  });
};

/**
 * Simulate an authentication error
 */
export const simulateAuthError = (options: ErrorSimulationOptions = {}) => {
  const { message = 'Authentication failed', code = 'ERR_AUTH', status = 401 } = options;
  
  const error = new Error(message);
  (error as any).code = code;
  (error as any).status = status;
  return Promise.reject(error);
};

/**
 * Simulate a data fetch error
 */
export const simulateDataError = (options: ErrorSimulationOptions = {}) => {
  const { message = 'Failed to fetch data', code = 'ERR_DATA', status = 404 } = options;
  
  const error = new Error(message);
  (error as any).code = code;
  (error as any).status = status;
  return Promise.reject(error);
};

/**
 * Simulate a validation error
 */
export const simulateValidationError = (options: ErrorSimulationOptions = {}) => {
  const { message = 'Validation failed', code = 'ERR_VALIDATION' } = options;
  const errors = options.recoverable ? { field1: 'Invalid', field2: 'Required' } : null;
  
  const error = new Error(message);
  (error as any).code = code;
  (error as any).errors = errors;
  return Promise.reject(error);
};

/**
 * Simulate an unhandled error that will trigger error boundaries
 */
export const simulateUnhandledError = (options: ErrorSimulationOptions = {}) => {
  const { message = 'Unhandled error occurred' } = options;
  throw new Error(message);
};

/**
 * Create a simulated error based on the specified type
 */
export const simulateError = (type: SimulatedErrorType, options: ErrorSimulationOptions = {}) => {
  switch (type) {
    case SimulatedErrorType.Network:
      return simulateNetworkError(options);
    case SimulatedErrorType.Authentication:
      return simulateAuthError(options);
    case SimulatedErrorType.DataFetch:
      return simulateDataError(options);
    case SimulatedErrorType.Validation:
      return simulateValidationError(options);
    case SimulatedErrorType.Unhandled:
      return simulateUnhandledError(options);
    default:
      const error = new Error(options.message || `Error of type ${type}`);
      (error as any).code = options.code || `ERR_${type.toUpperCase()}`;
      return Promise.reject(error);
  }
};
