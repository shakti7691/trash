import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatFormFieldModule } from '@angular/material/form-field'
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { DailogComponent } from '../dailog/dailog.component';
@Component({
  selector: 'app-attendence',
  imports: [
    FormsModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './attendence.component.html',
  styleUrl: './attendence.component.scss'
})
export class AttendenceComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = [
    'sr',
    'date',
    'empId',
    'empName',
    'shift',
    'startTime',
    'endTime',
    'totalTime',
    'projectName',
    'taskName',
    'copy',
  ];
  showPopUp = false
  projectName: string = '';
  taskName: string = '';
  empId: string = '';
  startTime: Date | null = null;
  endTime: Date | null = null;
  name: string = ''
  lastStartTime: any
  lastEndTime: any
  attendanceData: any[] = [];

  hourHandStyle: { [key: string]: string } = {}; 
  minuteHandStyle: { [key: string]: string } = {}; 
  secondHandStyle: { [key: string]: string } = {}; 
  isRunning = true;
  timerId: any;
  hour = 0;
  minute = 0;
  second = 0;

  constructor(private dialog: MatDialog, private el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) {}
  @ViewChild('attendanceModal') attendanceModal: ElementRef | undefined;
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (event.ctrlKey ) {
      event.preventDefault(); 
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    console.log('Platform ID:', this.platformId); if (isPlatformBrowser(this.platformId)) { console.log('Running in browser'); this.name = localStorage.getItem('EMP_NAME') as string; this.empId = localStorage.getItem('EMP_ID') as string; } else { console.error('localStorage is not available'); }
    if (!this.name || !this.empId) {
      this.openDialog()
    }
    this.timerId = this.getTime();
  }

  
  animateAnalogClock(): void {
    this.hourHandStyle = {
      transform: `translate3d(-50%, 0, 0) rotate(${(this.hour * 30) + (this.minute * 0.5) + (this.second * (0.5 / 60))}deg)`
    };
    
    this.minuteHandStyle = {
      transform: `translate3d(-50%, 0, 0) rotate(${(this.minute * 6) + (this.second * 0.1)}deg)`
    };
    
    this.secondHandStyle = {
      transform: `translate3d(-50%, 0, 0) rotate(${this.second * 6}deg)`
    };
  }
  
  getTime(): any {
    return setInterval(() => {
      const date = new Date();
      this.hour = date.getHours();
      this.minute = date.getMinutes();
      this.second = date.getSeconds();
      
      this.animateAnalogClock();
    }, 1000);
  }
  
  format(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }
  startAttendance() {
    this.startTime = new Date();
    localStorage.setItem('START_TIME', this.startTime.toString());
  }
  
  endAttendance() {
    this.endTime = new Date();
    console.log('enddate', this.endTime)
  }
 
  showModal() {
    this.showPopUp = true
  }

  // Method to close the modal
  closeModal() {
    this.showPopUp = false
  }
  
  submitAttendance() {
    this.startTime = new Date(localStorage.getItem('START_TIME') as string);
    if ( !this.endTime || !this.projectName || !this.taskName) {
      // alert('Please fill all fields and ensure Start and End are clicked.');
      this.showModal()
      return;
    }

    const totalTimeMs = this.endTime.getTime() - this.startTime.getTime();
    const totalHours = Math.floor(totalTimeMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const totalTime = `${totalHours}: ${totalMinutes}`;
    
    const entry = {
      SR: this.attendanceData.length + 1,
      Date: new Date().toLocaleDateString(),
      'Stellar EMP ID2': this.empId,
      'Stellar EMP Name': this.name,
      'Start Time': this.startTime.toLocaleTimeString(),
      'End Time': this.endTime.toLocaleTimeString(),
      'Total Time': totalTime,
      'Project Name': this.projectName,
      'Task Name': this.taskName
    };
    
    this.attendanceData.push(entry);
      
    this.lastEndTime = this.endTime;
    this.lastStartTime = this.startTime; 
    // Reset form fields
    this.startTime = null;
    this.endTime = null;
    this.projectName = '';
    this.taskName = '';
    this.name = '';  
    localStorage.removeItem('START_TIME');
  }
  
  copyData(record: any) {
    navigator.clipboard.writeText(` \t${record.Date}\t${record['Stellar EMP ID2']}\t${record['Stellar EMP Name']}\t10 AM - 07 PM\t${record['Start Time']}\t${record['End Time']}\t${record['Total Time']}\t${record['Project Name']}\t${record['Task Name']}`)
  }
  
  resetTable() {
    this.attendanceData = []
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(DailogComponent, {
      width: '400px',
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log("===>result")
      this.name = localStorage.getItem('EMP_NAME') as string
      this.empId = localStorage.getItem('EMP_ID') as string
      if (!this.name || !this.empId) {
        this.openDialog()
      }
    });
  }


  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}
