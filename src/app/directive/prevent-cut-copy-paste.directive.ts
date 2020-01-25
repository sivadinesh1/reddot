import { Component, Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appPreventCutCopyPaste]'
})
// export class PreventCutCopyPasteDirective {

//   constructor() { }

// }


export class PreventCutCopyPasteDirective {
  constructor(el: ElementRef, renderer: Renderer) {
    var events = 'cut copy paste';
    events.split(' ').forEach(e =>
      renderer.listen(el.nativeElement, e, (event) => {
        event.preventDefault();
      })
    );

  }
}