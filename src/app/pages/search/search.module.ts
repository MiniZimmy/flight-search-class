import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SearchComponent} from './search.component';
import {FlightServiceModule} from '../../services/flight';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: SearchComponent}]),
    CommonModule,
    FlightServiceModule
  ],
  declarations: [SearchComponent],
  exports: [],
  providers: []
})
export class SearchModule {}
