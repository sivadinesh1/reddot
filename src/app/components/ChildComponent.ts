import { Component, ViewChild } from '@angular/core';

import { MatMenu } from '@angular/material';

@Component({
    selector: 'child-component',
    template: `
      <mat-menu>
        <button mat-menu-item>Item 1 (inside other component)</button>
        <button mat-menu-item>Item 2 (inside other component)</button>
      </mat-menu>
    `,
})
export class ChildComponent {
    @ViewChild(MatMenu, { static: true }) menu: MatMenu;
}