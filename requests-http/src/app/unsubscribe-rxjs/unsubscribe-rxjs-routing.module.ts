import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnsubscribePocComponent } from './unsubscribe-poc/unsubscribe-poc.component';

const routes: Routes = [
	{
		path: '', component: UnsubscribePocComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UnsubscribeRxjsRoutingModule {
}
