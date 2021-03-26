import {container} from 'tsyringe';

import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';

import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import IMailProvider from './MailProvider/models/IMailProvider';

container.registerInstance<IStorageProvider>('StorageProvider', new DiskStorageProvider());
container.registerInstance<IMailProvider>('MailProvider', new EtherealMailProvider());
