import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dailog',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dailog.component.html',
  styleUrl: './dailog.component.scss'
})
export class DailogComponent {
  empForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DailogComponent>,
    private fb: FormBuilder
  ) {
    this.empForm = this.fb.group({
      empId: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.empForm.valid) {
      localStorage.setItem('EMP_ID',this.empForm.value.empId)
      localStorage.setItem('EMP_NAME',this.empForm.value.name)
      this.dialogRef.close(this.empForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
