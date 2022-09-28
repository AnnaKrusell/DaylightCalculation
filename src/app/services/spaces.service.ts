import { Injectable } from '@angular/core';
import { ComunicaService } from 'ngx-comunica';
import { WKTObject, WKTObjectOptions } from 'ngx-ifc-viewer';
import { lastValueFrom } from 'rxjs';
import { Space } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SpacesService {
  constructor(private _comunica: ComunicaService) {}

  async getSpaces(): Promise<Space[]> {
    const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX bot: <https://w3id.org/bot#>
      PREFIX inst: <https://web-bim/resources/>
      SELECT ?space ?name ?spaceArea ?elementName ?elementArea
      WHERE {
          ?space a bot:Space ; 
              <https://example.com/roomNumber> ?name;
              inst:gSABIMArea ?spaceArea;
              bot:adjacentElement ?element.
          ?element rdfs:label ?elementName;
	            inst:perimeterPSetRevitDimensions ?elementArea.
      }`;
    const spaces = await lastValueFrom(this._comunica.selectQuery(query));
    return spaces.map((item: any) => {
      const URI = item.space.value;
      const name = item.name.value;
      const spaceArea = item.spaceArea.value;
      const elementName = item.elementName.value;
      const elementArea = item.elementArea.value;
      return { URI, name, spaceArea, elementName, elementArea };
    });
  }

  async getSpaceBoundaries(spaceURI: string): Promise<WKTObject[]> {
    const query = `PREFIX ex: <https://example.com/> 
  PREFIX kg: <https://w3id.org/kobl/geometry#> 
  PREFIX bot: <https://w3id.org/bot#> 
  PREFIX inst: <https://web-bim/resources/> 
  SELECT DISTINCT ?wkt
  WHERE{
     BIND(<${spaceURI}> AS ?space)
     ?boundary bot:interfaceOf ?space ;
         kg:vertices3D ?ver .
     BIND(CONCAT("POLYGON Z (", STR( ?ver ), ")")   AS ?wkt ).
  }`;

    const spaces = await lastValueFrom(this._comunica.selectQuery(query));
    return spaces.map(
      (item: any) =>
        new WKTObject(item.wkt.value, new WKTObjectOptions('green'))
    );
  }

  async queryGRF(): Promise<Space[]> {
    const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
  PREFIX kga: <https://w3id.org/kobl/geometry-analysis#>
  PREFIX ifc: <http://ifcowl.openbimstandards.org/IFC2X3_Final#>
  PREFIX bot: <https://w3id.org/bot#>
  PREFIX kbt: <https://w3id.org/kobl/building-topology#>
  PREFIX kg: <https://w3id.org/kobl/geometry#>
  SELECT ?space ?spaceName ?spaceLabel ?floorArea ?windowArea 
  WHERE{
      ?space a bot:Space ; <https://example.com/roomNumber> ?spaceName ; rdfs:label ?spaceLabel .
# SUBQUERY TIL AT SUMMERE GULVAREAL 
{ SELECT ?space (SUM(?a) AS ?floorArea) 
WHERE{ ?i a bot:Interface ; 	bot:interfaceOf ?space, ?floor ;     kga:area ?a  . ?floor a ifc:IfcSlab 
}GROUP BY ?space} 
    # SUBQUERY TIL AT SUMMERE VINDUESAREAL 
{ SELECT ?space (SUM(?a) AS ?windowArea) WHERE{ ?i a bot:Interface ; bot:interfaceOf ?space,
 ?window ; kga:area ?a . ?window a ifc:IfcWindow 
}GROUP BY ?space} 
   }
  `;
    const GFR_Element = await lastValueFrom(this._comunica.selectQuery(query));
    return GFR_Element.map((item: any) => {
      const spaceURI = item.space.value;
      const spaceName = item.spaceName.value;
      const spaceLabel = item.spaceLabel.value;
      const floorArea_notRounded = item.floorArea.value;
      const windowArea_notRounded = item.windowArea.value;

      // const pct = windowArea / floorArea * 100 ;
      const pct = Math.round((((windowArea_notRounded / floorArea_notRounded) * 100) + Number.EPSILON) * 100 )/100 ;

      const floorArea = Math.round((((floorArea_notRounded) * 100) + Number.EPSILON)  )/100 ;
      console.log("floor area not rounded")
      console.log(floorArea_notRounded)

      const windowArea = Math.round((((windowArea_notRounded) * 100) + Number.EPSILON)  )/100 ;


      return { spaceURI, spaceName, spaceLabel, floorArea, windowArea, pct };
    });
  }

  async queryWFR(): Promise<Space[]> {
    const query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
  PREFIX kga: <https://w3id.org/kobl/geometry-analysis#>
  PREFIX ifc: <http://ifcowl.openbimstandards.org/IFC2X3_Final#>
  PREFIX bot: <https://w3id.org/bot#>
  PREFIX kbt: <https://w3id.org/kobl/building-topology#>
  PREFIX kg: <https://w3id.org/kobl/geometry#>
  SELECT ?space ?spaceName ?floorArea ?windowArea 
  WHERE{
      ?space a bot:Space ; rdfs:label ?spaceName .
# SUBQUERY TIL AT SUMMERE GULVAREAL 
{ SELECT ?space (SUM(?a) AS ?floorArea) 
WHERE{ ?i a bot:Interface ; 	bot:interfaceOf ?space, ?floor ;     kga:area ?a  . ?floor a ifc:IfcSlab 
}GROUP BY ?space} 
    # SUBQUERY TIL AT SUMMERE VINDUESAREAL 
{ SELECT ?space (SUM(?a) AS ?windowArea) WHERE{ ?i a bot:Interface ; bot:interfaceOf ?space,
 ?window ; kga:area ?a . ?window a ifc:IfcWindow 
}GROUP BY ?space} 
   }
  `;
    const GFR_Element = await lastValueFrom(this._comunica.selectQuery(query));
    return GFR_Element.map((item: any) => {
      const spaceURI = item.space.value;
      const spaceName = item.spaceName.value;
      const floorArea = item.floorArea.value;
      const windowArea = item.windowArea.value;

      // const pct = windowArea / floorArea * 100 ;
      const pct = Math.round((windowArea / floorArea) * 100);

      return { spaceURI, spaceName, floorArea, windowArea, pct };
    });
  }
}
