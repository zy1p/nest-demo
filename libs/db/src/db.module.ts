import { DynamicModule, Module, Provider } from '@nestjs/common';

import { QUERY_CLIENT } from '.';
import { DbService } from './db.service';

@Module({
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {
  static forRoot(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: QUERY_CLIENT,
        useFactory: () => {
          // TODO: implement the query client
        },
      },
    ];

    return {
      module: DbModule,
      global: true,
      providers,
      exports: providers,
    };
  }
}
