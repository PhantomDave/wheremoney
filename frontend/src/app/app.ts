import { Component, signal } from '@angular/core';
import { MainLayoutComponent } from './components/layout/main-layout-component/main-layout-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('Bank-App');
}
