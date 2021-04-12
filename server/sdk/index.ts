import { AsyncLocalStorage } from 'async_hooks';

import { proxifyWithWait } from './lib/proxify';
import { IAuthorization } from './types/IAuthorization';
import { IServiceContext } from './types/ServiceClass';
import { ILicense } from './types/ILicense';

// TODO think in a way to not have to pass the service name to proxify here as well
export const Authorization = proxifyWithWait<IAuthorization>('authorization');
export const License = proxifyWithWait<ILicense>('license');

export const asyncLocalStorage = new AsyncLocalStorage<IServiceContext>();
