import { Component, TemplateRef } from '@angular/core';

import { ToastService } from './toast-service';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-toasts',
	standalone: true,
	imports: [NgbToastModule, NgIf, NgTemplateOutlet, NgFor],
	template: `
		<ngb-toast
			*ngFor="let toast of toastService.toasts"
			[class]="getToastClass(toast.classname)"
			[autohide]="true"
			[delay]="toast.delay || 5000"
			(hidden)="toastService.remove(toast)"
		>
			<ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
				<ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
			</ng-template>

			<ng-template #text>{{ toast.textOrTpl }}</ng-template>
		</ngb-toast>
	`,
	host: { class: 'toast-container position-fixed top-0 mt-5 end-0 p-3', style: 'z-index: 1200;' },
	styleUrls: ['./toasts.component.css']
})
export class ToastsContainer {
	constructor(public toastService: ToastService) { }

	isTemplate(toast: any) {
		return toast.textOrTpl instanceof TemplateRef;
	}

	getToastClass(classname: any) {
		if (classname === 'bg-success') {
			return ' toast-success';
		} else if (classname === 'bg-danger') {
			return ' toast-danger';
		} else if (classname === 'bg-warning') {
			return ' toast-warning';
		} else (classname === 'bg-standard'); {
			return ' toast-standard';
		}
	}
}
