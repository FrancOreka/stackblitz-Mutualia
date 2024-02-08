import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, FormsModule],
  templateUrl: './barcode-scanner.component.html',
})
export class BarcodeScannerComponent {
  @ViewChild('scanner') scanner!: ZXingScannerComponent;
  @Output() scanOutput = new EventEmitter<string>();
  allowedFormats = [BarcodeFormat.CODE_128]; // Añade otros formatos según sea necesario
  barcode = '';
  availableCameras: MediaDeviceInfo[] = [];
  selectedCamera = '';
  currentCamera?: MediaDeviceInfo;
  torch = false; // Estado del flash/torch, si es que se utiliza

  scanSuccessHandler($event: string): void {
    this.barcode = $event;
    this.scanOutput.emit($event);
  }

  scanErrorHandler($event: Error): void {
    console.error('Error en el escaneo:', $event);
  }

  close(): void {
    this.scanner.reset(); // Reiniciar el lector de códigos
  }

  onDeviceSelectChange(selected: Event): void {
    const selectedDeviceId = (selected.target as HTMLSelectElement).value;
    this.currentCamera = this.availableCameras.find(camera => camera.deviceId === selectedDeviceId);
  }

  onDeviceChange(device: MediaDeviceInfo): void {
    this.currentCamera = device;
  }

  async camerasFoundHandler($event: MediaDeviceInfo[]): Promise<void> {
    this.availableCameras = $event;
  
    // Intenta seleccionar la cámara trasera por defecto
    const rearCamera = this.availableCameras.find(
      (camera) => /back|rear|environment/i.test(camera.label)
    );
  
    // Si se encuentra una cámara trasera, utilízala; si no, utiliza la primera cámara disponible
    const selectedCamera = rearCamera || this.availableCameras[0];
  
    if (selectedCamera) {
      this.currentCamera = selectedCamera;
      this.selectedCamera = this.currentCamera.deviceId;
      this.scanner.device = selectedCamera; // Asigna el dispositivo al componente escáner
      // No es necesario llamar a startScan; debería comenzar automáticamente al establecer el dispositivo
    }
  }
  
  
  torchCompatibleHandler($event: boolean): void {
    this.torch = $event;
  }
}
