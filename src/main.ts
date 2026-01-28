import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { appReducers } from './app/store/po.state';
import { PurchaseOrderEffects } from './app/purchase-orders/po.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore(appReducers),
    provideEffects([PurchaseOrderEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
});
