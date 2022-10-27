import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class IFCProcessingService {

    constructor(
        private _http: HttpClient
    ) { }
    
    async testService(file: File): Promise<any>{
        const url = `${environment.ifcAPI}/hello-ifc`;

        const formData = new FormData();
        formData.append('file', file);  

        const res = await firstValueFrom(this._http.post(url, formData));
        console.log(res);
    }

}