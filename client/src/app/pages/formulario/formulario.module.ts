import { QRCodeComponent } from 'angularx-qrcode';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioComponent } from './formulario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { DialogComponent } from '../../components/dialog/dialog.component';

@NgModule({
  declarations: [FormularioComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FormsModule,
    NgSelectModule,
    MatRadioModule,
    RouterModule,
    QRCodeComponent,
    DialogComponent,
  ],
})
export class FormularioModule {}
