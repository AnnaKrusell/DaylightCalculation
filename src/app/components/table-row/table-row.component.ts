import { Component, Input, OnInit } from '@angular/core';
import { ColorService, OverlayService } from 'ngx-ifc-viewer';
import { Space } from 'src/app/models';
import { SpacesService } from 'src/app/services/spaces.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css']
})
export class TableRowComponent implements OnInit {
  @Input() spaceData?: Space;
  public expanded: boolean = false;

  constructor(
    private _colorService: ColorService, 
    private _utils: UtilsService,
    private _overlayService: OverlayService,
    private _spacesService: SpacesService,
  ) { }

  ngOnInit(): void {
  }

  async clickedSpace(URI: string){
    this.expanded = !this.expanded;
    
    this._colorService.dimAll();
    this._overlayService.clearAllOverlays();
    const wktStrings = await this._spacesService.getSpaceBoundaries(URI);
    await this._overlayService.addWKTs(wktStrings);
}


}
