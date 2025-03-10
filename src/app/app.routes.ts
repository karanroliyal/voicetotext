import { Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { HomeComponent } from './Components/home/home.component';
import { UserMasterComponent } from './Components/user-master/user-master.component';
import { UserPermissionComponent } from './Components/user-permission/user-permission.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { LanguageMasterComponent } from './Components/language-master/language-master.component';
import { checkLogInGuard } from './Services/auth_guard/check-log-in.guard';
import { checkUserGuard } from './Services/auth_guard/check-user.guard';

export const routes: Routes = [
   {
      path: '',
      redirectTo: 'log-In',
      pathMatch: 'full'
   },
   {
      path: 'log-In',
      title: 'Log In ',
      component: LogInComponent,
      canActivate:[checkLogInGuard]
   },
   {
      path:'layout',
      title:'layout',
      component:LayoutComponent,
      canActivate:[checkUserGuard],
      children:[
         {
            path: 'home',
            title: 'Home',
            component: HomeComponent,
         },
         {
            path: 'user_master',
            title: 'User Master',
            component: UserMasterComponent
         },
         {
            path: 'user_permission',
            title: 'User Permission',
            component: UserPermissionComponent
         },
         {
            path: 'language_master',
            title: 'Language Master',
            component:LanguageMasterComponent
         },
      
      
      ],
   }
  

];
