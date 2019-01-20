import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SearchComponent} from './search.component';
import {FlightOfferSearchModule} from '../../components';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: SearchComponent}]),
    CommonModule,
    FlightOfferSearchModule
  ],
  declarations: [SearchComponent],
  exports: [],
  providers: []
})
export class SearchModule {}
