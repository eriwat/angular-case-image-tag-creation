import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ImageRecognitionService } from './image-recognition.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(300)
      ])
    ])
  ]
})

export class AppComponent {
  title = 'image-tag-case';
  isLoading = false;
  selectedImageUrl: string | ArrayBuffer | null = null;
  generatedTags: string[] = [];

  constructor(private imageRecService: ImageRecognitionService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      // Clear the current image and tags
      this.selectedImageUrl = null;
      this.generatedTags = [];
  
      // Initialize FileReader
      const reader = new FileReader();
  
      // When the file is successfully read, update the selectedImageUrl
      reader.onload = () => {
        this.selectedImageUrl = reader.result;
        // Do not set isLoading to false here
      };
  
      // Start the spinner right before reading the file
      this.isLoading = true;
      reader.readAsDataURL(file);
  
      // Generate image tags
      this.generateImageLabels(file);
    }
  }
  

  imageLoaded(): void {
    this.isLoading = false;
  }
  
  generateImageLabels(file: File): void {
    this.imageRecService.generateImageLabels(file).subscribe(response => {
      console.log('Response from service:', response);
      this.generatedTags = response.tags;
      this.isLoading = false; // Image tags are ready, hide spinner
    });
  }
}
