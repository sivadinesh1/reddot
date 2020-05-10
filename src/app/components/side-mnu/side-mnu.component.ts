import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-side-mnu',
  templateUrl: './side-mnu.component.html',
  styleUrls: ['./side-mnu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMnuComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
