import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SearchComponent} from './search.component';
import {FlightOfferSearchModule, FlightOffersModule} from '../../components';
import {FlightServiceModule} from '../../services/flight';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: SearchComponent}]),
    CommonModule,
    FlightServiceModule,
    FlightOfferSearchModule,
    FlightOffersModule
  ],
  declarations: [SearchComponent],
  exports: [],
  providers: []
})
export class SearchModule {}
