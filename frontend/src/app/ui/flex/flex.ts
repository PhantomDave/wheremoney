import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-flex',
  templateUrl: './flex.html',
  styleUrls: ['./flex.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Flex {
  // direction: the CSS flex-direction
  @Input() direction: 'row' | 'row-reverse' | 'column' | 'column-reverse' = 'row';

  // align-items
  @Input() align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'start';

  // justify-content
  @Input() justify: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly' =
    'start';

  // gap between items; accepts number (px) or string (e.g. '1rem')
  @Input() gap: number | string = 0;

  // wrap behavior
  @Input() wrap: 'nowrap' | 'wrap' | 'wrap-reverse' = 'nowrap';

  // inline or block flex
  @Input() inline = false;

  // additional classes to apply
  @Input() className = '';

  // derived helpers used by the template
  get isNumericGap() {
    return typeof this.gap === 'number';
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
    return this.mapAlign(this.align);
  }

  get justifyContent() {
    return this.mapJustify(this.justify);
  }

  get containerClass() {
    return ['app-flex', this.className].filter(Boolean).join(' ');
  }
}
