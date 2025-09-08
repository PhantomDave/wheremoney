import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { Flex } from '../../ui/flex/flex';
import { toSignal } from '@angular/core/rxjs-interop';
import { Table } from '../../models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [MatButton, Flex],
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumb implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);
  breadcrumbs: { label: string; url: string }[] = [];

  private data = toSignal(this.activatedRoute.data);

  table = computed<Table | undefined>(() => this.data()?.['table'] as Table | undefined);
  private routerSub?: Subscription;

  ngOnInit() {
    this.buildBreadcrumbs();
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private buildBreadcrumbs() {
    let route = this.activatedRoute.root;
    let url = '';

    this.breadcrumbs = [];

    this.breadcrumbs.push({ label: 'Home', url: '/' });
    console.log(route.snapshot.url);
    while (route) {
      if (route.snapshot.url.length > 0) {
        const segment = route.snapshot.url[0].path;
        url += `/${segment}`;

        // Get breadcrumb label from route data or use segment
        let label = route.snapshot.data?.['breadcrumb'] || this.formatLabel(segment);

        // If this route has table data, use the table name
        if (route.snapshot.data?.['table']) {
          const table = route.snapshot.data['table'] as Table;
          label = table.name;
        }
        this.breadcrumbs.push({ label, url });
      }
      route = route.firstChild!;
    }
  }

  private formatLabel(segment: string): string {
    // Convert URL segment to readable label
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
