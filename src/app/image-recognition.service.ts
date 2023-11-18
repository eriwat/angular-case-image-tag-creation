import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { googlecloudvisionapi } from '../config/googlecloudvisionapi';

@Injectable({
  providedIn: 'root'
})
export class ImageRecognitionService {
  constructor(private http: HttpClient) {}

  generateImageLabels(file: File): Observable<any> {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Observable(observer => {
      reader.onloadend = () => {
        if (reader.result) { // Add null check for reader.result
          const base64Image = reader.result.toString().split(',')[1]; // Remove the data URL part
          const body = {
            "requests": [
              {
                "image": {
                  "content": base64Image
                },
                "features": [
                  {
                    "type": "LABEL_DETECTION",
                    "maxResults": 3 // Adjust number of results as needed
                  }
                ]
              }
            ]
          };

          this.http.post<any>('https://vision.googleapis.com/v1/images:annotate?key=' + googlecloudvisionapi.googleCloudVisionAPIKey, body)
            .subscribe((response: any) => { // Use 'any' type for response temporarily
              // Extract labels from response, define explicit type for 'label'
              const labels = response.responses[0].labelAnnotations.map((label: any) => label.description);
              observer.next({ tags: labels });
            }, error => {
              observer.error(error);
            });
        }
      };
    });
  }
}
