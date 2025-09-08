import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Amplify } from 'aws-amplify';
import awsConfig from '../amplify_outputs.json';

Amplify.configure(awsConfig);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
