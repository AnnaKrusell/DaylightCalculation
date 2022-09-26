import { Component } from '@angular/core';
import { JsonExportService } from './services/json-export.service';
import { ModelAddService } from './services/model-add.service';
import { SpacesService } from './services/spaces.service';

// Import from other files
import { modelViewerSettings } from './viewer-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Glazing-Area';
  public modelViewerSettings = modelViewerSettings;
  public gfr: any[] = [];
  public spacesClicked:boolean = false;
  public fileUploaded:boolean = false;
  public receivedResults: boolean = false;
  public jsonExport: any;


  constructor(
    private _modelAdd: ModelAddService,
    private _spaceService: SpacesService, 
    private _json_exportService: JsonExportService,
  ){}

async onModelUpload(ev: any){

  if (ev.target.files.length == 0) {
    console.log("No file selected!");
    return;
    }
    this.fileUploaded = true;
    let file: File = ev.target.files[0];
    await this._modelAdd.loadModel(file);
    console.log("Model loaded!");

    this.gfr = await this._spaceService.queryGRF();
    this.receivedResults = true;
    }

    
exportResult(ev: any){
  console.log(this.gfr)
  this.jsonExport = this._json_exportService.downloadFile(this.gfr)
  return this.jsonExport
}
    
}
