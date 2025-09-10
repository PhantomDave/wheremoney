import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import './app/chart.config';

bootstrapApplication(App, appConfig).catch((err) => {
  // Handle bootstrap errors gracefully
  throw new Error(`Failed to bootstrap application: ${err.message || err}`);
});
