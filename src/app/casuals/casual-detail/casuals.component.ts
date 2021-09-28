import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { CasualService } from '../../@core/services/casual.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NbDialogService, NbToastrService, NbComponentStatus } from '@nebular/theme';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Casual } from '../../@core/models/casual';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'ngx-casual-list',
  templateUrl: './casual-list.component.html',
  styleUrls: ['./casuals.component.scss'],
})
export class CasualListComponent implements OnInit, OnDestroy {

  alive = true;
  casuals = [];

  public casualElements = [
    'CASUAL',
    'NAME',
    'ID. NO',
    'CONTACT. NO',
    'DATE ADDED',
    'EDIT',
    'REMOVE',
  ];

  public show = false;
  public searchCasual: any;
  submitted: boolean;

  casualEditForm: FormGroup;
  selectedCasual: any;

  constructor(
    private casualService: CasualService,
    private dialogService: NbDialogService,
    private toastr: NbToastrService,
    private fb: FormBuilder,
    protected location: Location,
  ) { }

  ngOnInit() {
    this.casualService.refresh$.subscribe(
      () => {
        this.getCasuals();
      },
    );
    this.getCasuals();
    this.casualEditForm = this.fb.group({
      name: ['', Validators.required],
      id_number: ['', Validators.required],
      contact_number: ['254', [Validators.required, Validators.pattern('[0-9 ]{12}')]],
    });
  }

  getCasuals() {
    this.casualService.fetchCasuals(100)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.casuals = data.results;
        },
      );
  }

  saveCasual(casualForm) {
    const formData = new FormData;
    const modalCloseBtn = document.getElementById('close-modal');
    this.submitted = true;

    formData.append('name', casualForm.name);
    formData.append('id_number', casualForm.id_number);
    formData.append('contact_number', casualForm.contact_number);


    this.casualService.createCasual(formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a Casual', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to add the Casual. Double check the form and correct the details', 'danger');
        },
      );
  }



  confirmDelete(cas) {
    const x = confirm('Are you sure you want to remove this Casual?');
    if (x) {
      this.removeCasual(cas);
    } else {
      return false;
    }
  }


  removeCasual(cas) {
    this.casualService.deleteCasual(cas.id)
      .subscribe(
        () => {
          this.showToast(`You have successfully Removed the Casual`, 'success');
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Operation unsuccessful', 'danger');
        },
      );
  }


  editCasual() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'name': this.casualEditForm.get('name').value,
      'id_number': this.casualEditForm.get('id_number').value,
      'contact_number': this.casualEditForm.get('contact_number').value,
    };

    this.casualService.editCasual(this.selectedCasual.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Casual', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to edit Casual', 'danger');
        },
      );
  }


  editCasualForm(cas, dialog1: TemplateRef<any>) {
    this.changeCasual(cas);
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
    this.selectedCasual = cas;
  }

  changeCasual(cas: Casual) {
    this.casualEditForm.patchValue({
      name: cas.name,
      id_number: cas.id_number,
      contact_number: cas.contact_number,
    });
  }

  openCasform(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}


@Component({
  selector: 'ngx-casual-report',
  templateUrl: './casual-report.component.html',
  styleUrls: ['./casuals.component.scss'],
})
export class CasualReportComponent implements OnInit, OnDestroy {

  alive = true;
  casualDates = [];
  casualReport = [];


  public casualDateElements = [
    'WEEK OF YEAR',
    'ADDED BY',
    'CASUALS',
    'PAID',
    'UNPAID',
  ];

  public weeks = [];
  public show = false;
  public searchDates: any;
  submitted: boolean;
  public aggregatedReport = [];
  spinnerEnabled = false;
  keys: string[];
  dataSheet = new Subject();
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  isExcelFile: boolean;
  years = [];
  currentYear: any;
  fileName = 'CasualReport.xlsx';
  public weekSelected: number;

  constructor(
    private casualService: CasualService,
    private toastr: NbToastrService,
    private router: Router,
    private dialogService: NbDialogService,
    private datePipe: DatePipe,
    protected location: Location,
  ) { }

  ngOnInit() {
    this.casualService.refresh$.subscribe(
      () => {
        this.getCasualWeeks();
      },
    );
    this.getCasualWeeks();
    this.generateArrayOfYears();
    this.generateWeeks();
  }


  getCasualWeeks() {
    this.casualService.fetchCasualWeeklyReport()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.casualDates = data.results;
        },
      );
  }



  onChange(evt) {
    let data: any;
    // let header: any;
    const excelList = [];

    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);

        data.forEach(d => {

          const excelData = {};

          const contact_number = d['TELEPHONE'];
          const created_at = this.datePipe.transform(d['DATE'], 'yyyy-MM-dd');
          const id = d['NO.'];
          const id_number = d['ID.NO'];
          const name = d['NAME'];
          const amount = d['AMOUNT'];


          const values = {
            'TELEPHONE': contact_number, 'DATE': created_at, 'NO': id,
            'ID.NO': id_number, 'NAME': name, 'AMOUNT': amount,
          };

          for (const [key, value] of Object.entries(values)) {
            excelData[key] = value;
          }

          excelList.push(excelData);
        },
        );

        this.casualService.importCasuals(excelList)
          .subscribe(
            () => {
              this.showToast('You have successfully added the excel file', 'success');
            },
            (error: HttpErrorResponse) => {
              this.showToast('Unable to add the excel file', 'danger');
            },
          );
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data);
      };
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  openAggregatedReport(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
    this.loadAggregatedReport();
  }

  exportexcel(): void {
    /* table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  loadAggregatedReport() {
    return this.casualService.fetchCasualAggregatedReport().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.aggregatedReport = data.results;
      });
  }
  onChangeWeek() {
    this.casualService.fetchCasualAggregatedReportByWeek(this.weekSelected)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.aggregatedReport = data.results;
        },
      );
  }
  onImport() {
    const modalCloseBtn = document.getElementById('selectedFile');
    modalCloseBtn.click();
  }

  filterByDate(date: any) {
    this.show = true;

    this.casualService.fetchCasualReport(100)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.casualReport = data.results.filter(d => {
            return d.report_date.id === date.id;
          });
        },
      );

  }

generateWeeks() {
  for (let i = 1; i <= 52; i++) {
    this.weeks.push(i);
  }
}
  generateArrayOfYears() {
    // get current year from today's date
    this.currentYear = new Date().getFullYear();
    const min = 2020;

    // loop from current year to 2020 and add to list
    for (let i = this.currentYear; i >= min; i--) {
      this.years.push(i);
    }

    return this.years;
  }

  onChangeYear(evt) {
    this.casualService.filterByYear(100, this.currentYear)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.casualDates = data.results;
        },
      );
  }




  viewCasualDetails(date) {
    const week = date.week;
    this.router.navigate([`/casual/weekly-details/${week}`]);
  }

  viewByTechnicians(item, date) {
    const week = date.week;
    this.router.navigate([`/casual/technician-details/${week}/${item}`]);
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}


@Component({
  selector: 'ngx-casual-detail',
  templateUrl: './casual-detail.component.html',
  styleUrls: ['./casuals.component.scss'],
})
export class CasualDetailComponent implements OnInit, OnDestroy {

  alive = true;
  noImage = null;

  public casualDetails = [
    'CASUAL',
    'PHOTO',
    'NAME',
    'NUMBER OF DAYS',
    'TOTAL WEEKLY AMOUNT',
  ];

  public casualDateDetails = [
    'DAY',
    'DATE',
    'TIME IN',
    'TIME OUT',
    'AMOUNT',
    'PAID',
  ];

  casuals = [];
  casualDates = [];
  casualWeek: any;
  casualTechnician: any;


  constructor(
    protected location: Location,
    private casualService: CasualService,
    private dialogService: NbDialogService,
    private route: ActivatedRoute,
  ) {
    this.casualWeek = +this.route.snapshot.paramMap.get('week');
    this.casualTechnician = +this.route.snapshot.paramMap.get('id');
  }


  ngOnInit() {
    this.casualService.refresh$.subscribe(
      () => {
        this.getCasualWeeks();
      },
    );
    this.getCasualWeeks();
  }

  getCasualWeeks() {
    const allCasuals = [];
    if (this.casualTechnician === 0) {
      this.casualService.fetchWeeklyReport(this.casualWeek)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.casuals = data.results;
        },
      );
    } else {
      this.casualService.fetchWeeklyReport(this.casualWeek)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          data.results.filter(c => {
            c.dates_worked.filter(d => {
              if (d.created_by.id === this.casualTechnician) {
                allCasuals.push(c);
              }
            });
          });
          const uniquset = new Set(allCasuals);
          this.casuals = [...uniquset];
        },
      );
    }
  }

  viewDates(dialog: TemplateRef<any>, cas) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    this.casualDates = cas.dates_worked;
  }

  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
