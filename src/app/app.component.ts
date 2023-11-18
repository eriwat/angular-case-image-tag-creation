import { Component } from '@angular/core';
import { ImageRecognitionService } from './image-recognition.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'image-tag-case';

  selectedImageUrl: string | ArrayBuffer | null = null;
  generatedTags: string[] = [];

  constructor(private imageRecService: ImageRecognitionService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.generateImageLabels (file);
      const reader = new FileReader();
      reader.onload = e => this.selectedImageUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }
  
  generateImageLabels(file: File): void {
    this.imageRecService.generateImageLabels(file).subscribe(response => {
      console.log('Response from service:', response);
      this.generatedTags = response.tags;
    });
  }
}
