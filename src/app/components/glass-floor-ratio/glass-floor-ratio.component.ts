import { Component, Input, OnInit } from '@angular/core';
import { ColorService, OverlayService } from 'ngx-ifc-viewer';
import { GFR_Element, Space } from 'src/app/models';
import { JsonExportService } from 'src/app/services/json-export.service';
import { SpacesService } from 'src/app/services/spaces.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-glass-floor-ratio',
  templateUrl: './glass-floor-ratio.component.html',
  styleUrls: ['./glass-floor-ratio.component.css']
})
export class GlassFloorRatioComponent implements OnInit {
  @Input() spaceData?: Space;
  @Input() gfrData?: GFR_Element;
  public expanded: boolean = false;
  
  public spaces: any[] = [];
  
  constructor(
    private _colorService: ColorService, 
    private _overlayService: OverlayService,
    private _spacesService: SpacesService,
    private _utils: UtilsService,
  ) { }

  ngOnInit(): void {
  }


async getGRF(URI: string, pct: number){
  this.expanded = !this.expanded;
  
  this._colorService.dimAll();
  this._overlayService.clearAllOverlays();  
  const globalIds = [this._utils.uriToGlobalId(URI)];
  
  // colour room based in the procent
  if (pct < 10) 
  {
      console.log('Red');
      this._colorService.colorSubsetGlobalIds(globalIds, "red", "space-hover")
  }
  else {
    console.log('Green');
    this._colorService.colorSubsetGlobalIds(globalIds, "green", "space-hover")
  }

  // this._colorService.colorSubsetGlobalIds(globalIds, "purple", "space-hover")

  
}




}
