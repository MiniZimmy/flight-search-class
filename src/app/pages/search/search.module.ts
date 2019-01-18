import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SearchComponent} from './search.component';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: SearchComponent}])
  ],
  declarations: [SearchComponent],
  exports: [],
  providers: []
})
export class SearchModule {}
