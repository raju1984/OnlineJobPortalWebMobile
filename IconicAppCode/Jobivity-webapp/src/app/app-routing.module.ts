import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './modules/auth/auth.module#AuthModule'
  },
  {
    path: 'home', canActivate: [AuthGuard],
    loadChildren: './modules/home/home.module#HomeModule'
  },
  {
    path: 'admin', canActivate: [AuthGuard],
    loadChildren: './modules/adminpanel/adminpanel.module#AdminpanelModule'
  },
  {
    path: 'public', canActivate: [AuthGuard], 
    loadChildren: './modules/userpanel/userpanel.module#UserpanelModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routing = RouterModule.forRoot(routes);
