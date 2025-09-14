import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import * as NzIcon from '@ant-design/icons-angular/icons';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    NzMessageService,
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons([
      NzIcon.CommentOutline,
      NzIcon.DownloadOutline,
      NzIcon.CaretRightOutline,
      NzIcon.CaretRightFill,
      NzIcon.DeleteOutline,
      NzIcon.FileImageOutline,
      NzIcon.MoreOutline,
      NzIcon.InboxOutline,
      NzIcon.FileTwoTone,
      NzIcon.PlusOutline,
      NzIcon.UnorderedListOutline,
      NzIcon.HistoryOutline,
      NzIcon.ToolOutline,
      NzIcon.DashboardOutline,
      NzIcon.SearchOutline,
      NzIcon.BugOutline
    ]),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const ctx = setContext((_, { headers }) => {
        const token = localStorage.getItem('token');
        return {
          headers: {
            ...headers,
            Authorization: token ? 'Bearer ' + token : ''
          }
        };
      });

      return {
        link: ctx.concat(httpLink.create({ uri: 'http://localhost:4000/' })),
        cache: new InMemoryCache(),
        defaultOptions: {
          query: {
            fetchPolicy: 'no-cache'
          }
        }
      };
    })
  ]
};
