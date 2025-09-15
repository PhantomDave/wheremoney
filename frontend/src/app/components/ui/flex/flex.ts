import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-flex',
  templateUrl: './flex.html',
  styleUrls: ['./flex.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Flex {
  // direction: the CSS flex-direction
  direction = input<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');

  // align-items
  align = input<'start' | 'center' | 'end' | 'stretch' | 'baseline'>('start');

  // justify-content
  justify = input<'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'>('start');

  // gap between items; accepts number (px) or string (e.g. '1rem')
  gap = input<number | string>(0);

  // wrap behavior
  wrap = input<'nowrap' | 'wrap' | 'wrap-reverse'>('nowrap');

  // inline or block flex
  inline = input(false);

  // additional classes to apply
  className = input('');

  // derived helpers used by the template
  get isNumericGap() {
    return typeof this.gap() === 'number';
  }

  private mapAlign(value: string) {
    switch (value) {
      case 'start':
        return 'flex-start';
      case 'end':
        return 'flex-end';
      default:
        return value;
    }
  }

  private mapJustify(value: string) {
    switch (value) {
      case 'start':
        return 'flex-start';
      case 'end':
        return 'flex-end';
      default:
        return value;
    }
  }

  // Exposed properties for template binding (camelCased for style bindings)
  get alignItems() {
    return this.mapAlign(this.align());
  }

  get justifyContent() {
    return this.mapJustify(this.justify());
  }

  get containerClass() {
    return ['app-flex', this.className()].filter(Boolean).join(' ');
  }
}
