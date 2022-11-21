import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ImageCompressionComponent } from './image-compression/image-compression.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageCompressionComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
