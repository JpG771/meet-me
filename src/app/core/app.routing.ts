import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeaturesComponent } from './components/features/features.component';
import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AuthentificationGuard } from './guards/authentification.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'fonctionnalites',
    component: FeaturesComponent
  },
  {
    path: 'messages',
    component: MessagesComponent
  },
  {
    path: 'rencontre',
    loadChildren: () => import('../meet/meet.module').then(m => m.MeetModule),
    canLoad: [AuthentificationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: false }
  )],
  exports: [RouterModule],
})
export class AppRoutingModule {}
