import './polyfills';
import { bootstrapApplication } from '@angular/platform-browser';
import { BarcodeScannerComponent } from './app/shared/barcode-scanner/barcode-scanner.component';

bootstrapApplication(BarcodeScannerComponent)
  .catch(err => console.error(err));

