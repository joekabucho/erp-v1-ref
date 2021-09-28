import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ResourceService {

  apiUrl = environment.apiURL;

  private refreshNeeded$ = new Subject<void>();

  constructor(private _http: HttpClient) { }

  get refresh$() {
    return this.refreshNeeded$;
  }



  // Permits
  fetchPermits(items: number) {
    return this._http.get<any>(`${this.apiUrl}permits/?limit=${items}`);
  }
  fetchOnepermit(id: number) {
    return this._http.get<any>(`${this.apiUrl}permits/${id}/`);
  }
  createPermit(formData) {
    return this._http.post(`${this.apiUrl}permits/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  searchPermit(name: any) {
    return this._http.get<any>(`${this.apiUrl}permits/?search=${name}`);
  }

  createSite(formData) {
    return this._http.post(`${this.apiUrl}site_names/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editPermit(id: number, formData) {
    return this._http.patch(`${this.apiUrl}permits/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deletePermit(id: number) {
    return this._http.delete<void>(`${this.apiUrl}permits/${id}`);
  }



  // Certificates
  fetchCertificate(items: number) {
    return this._http.get<any>(`${this.apiUrl}certificate_name/?limit=${items}`);
  }
  fetchOneCertificate(id: number) {
    return this._http.get<any>(`${this.apiUrl}certificate_name/${id}/`);
  }
  createCertificate(formData) {
    return this._http.post(`${this.apiUrl}certificate_name/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editCertificate(id: number, formData) {
    return this._http.patch(`${this.apiUrl}certificate_name/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteCertificate(id: number) {
    return this._http.delete<void>(`${this.apiUrl}certificate_name/${id}`);
  }

  // PPEs
  fetchPPE(items: number) {
    return this._http.get<any>(`${this.apiUrl}ppe_names/?limit=${items}`);
  }
  searchPPE(name: any) {
    return this._http.get<any>(`${this.apiUrl}ppe_names/?search=${name}`);
  }
  fetchOnePPE(id: number) {
    return this._http.get<any>(`${this.apiUrl}ppe_names/${id}/`);
  }
  createPPE(formData) {
    return this._http.post(`${this.apiUrl}ppe_names/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editPPE(id: number, formData) {
    return this._http.patch(`${this.apiUrl}ppe_names/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deletePPE(id: number) {
    return this._http.delete<void>(`${this.apiUrl}ppe_names/${id}`);
  }



  // Technician Certificates
  fetchTechnicianCertificate(items: number) {
    return this._http.get<any>(`${this.apiUrl}technician_certificate/?limit=${items}`);
  }
  searchTechnicianCertificate(name: any) {
    return this._http.get<any>(`${this.apiUrl}technician_certificate/?search=${name}`);
  }
  fetchOneTechnicianCertificate(id: number) {
    return this._http.get<any>(`${this.apiUrl}technician_certificate/${id}/`);
  }
  createTechnicianCertificate(formData) {
    return this._http.post(`${this.apiUrl}technician_certificate/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editTechnicianCertificate(id: number, formData) {
    return this._http.patch(`${this.apiUrl}technician_certificate/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteTechnicianCertificate(id: number) {
    return this._http.delete<void>(`${this.apiUrl}technician_certificate/${id}`);
  }


  // fetch tickets
  fetchTickets(items: number) {
    return this._http.get<any>(`${this.apiUrl}tickets/?limit=${items}`);

  }

  // PPEs
  fetchSitePPE(items: number) {
    return this._http.get<any>(`${this.apiUrl}site_ppes/?limit=${items}`);
  }
  fetchSitePPEByTicket(items: number) {
    return this._http.get<any>(`${this.apiUrl}site_ppes/?ticket__id=${items}&?year=today`);
  }
  searchSitePPE(name: any) {
    return this._http.get<any>(`${this.apiUrl}site_ppes/?search=${name}`);
  }
  fetchOneSitePPE(id: number) {
    return this._http.get<any>(`${this.apiUrl}site_ppes/${id}/`);
  }
  createSitePPE(formData) {
    return this._http.post(`${this.apiUrl}site_ppes/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editSitePPE(id: number, formData) {
    return this._http.patch(`${this.apiUrl}site_ppes/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteSitePPE(id: number) {
    return this._http.delete<void>(`${this.apiUrl}site_ppes/${id}`);
  }
  // SSEs
  fetchSiteSSE(items: number) {
    return this._http.get<any>(`${this.apiUrl}sse_names/?limit=${items}`);
  }
  searchSSE(name: any) {
    return this._http.get<any>(`${this.apiUrl}sse_names/?search=${name}`);
  }
  fetchOneSiteSSE(id: number) {
    return this._http.get<any>(`${this.apiUrl}sse_names/${id}/`);
  }
  createSiteSSE(formData) {
    return this._http.post(`${this.apiUrl}sse_names/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editSiteSSE(id: number, formData) {
    return this._http.patch(`${this.apiUrl}sse_names/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  fetchLocations() {
    return this._http.get<any>(`${this.apiUrl}location/?limit=100&offset=0`);
  }
  deleteSiteSSE(id: number) {
    return this._http.delete<void>(`${this.apiUrl}sse_names/${id}`);
  }


  // Permits to work
  fetchPTW(items: number) {
    return this._http.get<any>(`${this.apiUrl}ptws/?limit=${items}`);
  }
  fetchOnePTW(id: number) {
    return this._http.get<any>(`${this.apiUrl}ptws/${id}/`);
  }
  createPTW(formData) {
    return this._http.post(`${this.apiUrl}ptws/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  editPTW(id: number, formData) {
    return this._http.patch(`${this.apiUrl}ptws/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deletePTW(id: number) {
    return this._http.delete<void>(`${this.apiUrl}ptws/${id}`);
  }



  fetchHazardAnalysis(items: number) {
    return this._http.get<any>(`${this.apiUrl}job_hazard_analysis/?limit=${items}`);
  }

  fetchCommunication(items: number) {
    return this._http.get<any>(`${this.apiUrl}communication_plan/?limit=${items}`);
  }

  createPPEFile(formData) {
    return this._http.post(`${this.apiUrl}site_ppes/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchPPEFiles() {
    return this._http.get<any>(`${this.apiUrl}site_ppes/?limit=10000&offset=0`);
  }

  fetchSites() {
    return this._http.get<any>(`${this.apiUrl}site_names/?limit=10000&offset=0`);
  }
  fetchActualSites() {
    return this._http.get<any>(`${this.apiUrl}sites/?limit=10000&offset=0`);
  }
  editPPEFiles(id: number, formData) {
    return this._http.patch(`${this.apiUrl}site_ppes/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchOnePPEFile(id: number) {
    return this._http.get<any>(`${this.apiUrl}site_ppes/${id}/`);
  }
  deletePPEFile(id: number) {
    return this._http.delete<void>(`${this.apiUrl}site_ppes/${id}`);
  }

  createCertificateFile(formData) {
    return this._http.post(`${this.apiUrl}technician_certificate/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchCertificateFiles() {
    return this._http.get<any>(`${this.apiUrl}technician_certificate/?limit=10000&offset=0`);
  }
  fetchCertificateOneFile(id: number) {
    return this._http.get<any>(`${this.apiUrl}technician_certificate/${id}/`);
  }
  editCertificateFiles(id: number, formData) {
    return this._http.patch(`${this.apiUrl}technician_certificate/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteCertificateFile(id: number) {
    return this._http.delete<void>(`${this.apiUrl}technician_certificate/${id}`);
  }

  createSSEFile(formData) {
    return this._http.post(`${this.apiUrl}site_sse/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  fetchSSEFiles(items: number) {
    return this._http.get<any>(`${this.apiUrl}site_sse/?limit=${items}`);
  }
  fetchSSEFilesByTicket(items: number) {
    return this._http.get<any>(`${this.apiUrl}site_sse/?ticket__id=${items}&?year=today`);
  }
  searchSiteSSE(name: any) {
    return this._http.get<any>(`${this.apiUrl}site_sse/?search=${name}`);
  }
  fetchSSEOneFile(id: number) {
    return this._http.get<any>(`${this.apiUrl}site_sse/${id}/`);
  }
  editSSEFiles(id: number, formData) {
    return this._http.patch(`${this.apiUrl}site_sse/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }
  deleteSSEFile(id: number) {
    return this._http.delete<void>(`${this.apiUrl}site_sse/${id}`);
  }



}
