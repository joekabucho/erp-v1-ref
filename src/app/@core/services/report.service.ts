import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ReportService {

    apiUrl = environment.apiURL;

    constructor(private _http: HttpClient) { }



    fetchProjectReports() {
        return this._http.get<any>(`${this.apiUrl}projectsreport`);
    }
    fetchPoReports() {
        return this._http.get<any>(`${this.apiUrl}purchaseorderreport`);
    }

    fetchInvoiceReports() {
        return this._http.get<any>(`${this.apiUrl}invoicereport`);
    }

    // fetchIncomeReports() {
    //     return this._http.get<any>(`${this.apiUrl}incomereport/`);
    // }




}
