import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: `login`,
    loadChildren: () =>
      import('./components/account/login/login.module').then(
        (m) => m.LoginModule
      ),
  },
  {
    path: `register`,
    loadChildren: () =>
      import('./components/account/registration/registration.module').then(
        (m) => m.RegistrationModule
      ),
  },
  {
    path: `error`,
    loadChildren: () =>
      import('./components/error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: ``,
    loadChildren: () =>
      import('./components/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '**',
    redirectTo: `/error`,
  },
];

const routeConfig: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routeConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
