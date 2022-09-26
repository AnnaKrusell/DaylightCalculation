import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// 3rd party
import { AngularSplitModule } from 'angular-split';
import { IfcViewerModule } from 'ngx-ifc-viewer';
import { MatButtonModule } from '@angular/material/button';
import { LBDParsersModule } from 'ngx-lbd-parsers';
import { ComunicaModule } from 'ngx-comunica';
import { TableRowComponent } from './components/table-row/table-row.component';
import { GlassFloorRatioComponent } from './components/glass-floor-ratio/glass-floor-ratio.component';


@NgModule({
  declarations: [
    AppComponent,
    TableRowComponent,
    GlassFloorRatioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularSplitModule,
    IfcViewerModule,
    MatButtonModule,
    LBDParsersModule,
    ComunicaModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
