import { Routes } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { WelcomeComponent } from './welcome/welcome.component';

export const routes: Routes = [
    {path: "", component: WelcomeComponent},
    {path: "demo", component: DemoComponent}
];
