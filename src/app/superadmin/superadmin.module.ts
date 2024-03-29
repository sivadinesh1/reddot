import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuperadminPageRoutingModule } from './superadmin-routing.module';

import { SuperadminPage } from './superadmin.page';
import { SharedModule } from '../shared.module';

@NgModule({
	imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, IonicModule, SuperadminPageRoutingModule],
	declarations: [SuperadminPage],
})
export class SuperadminPageModule {}
