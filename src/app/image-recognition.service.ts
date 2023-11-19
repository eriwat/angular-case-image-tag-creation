import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { googlecloudvisionapi } from '../config/googlecloudvisionapi';

interface LabelAnnotation {
  description: string;
}

interface VisionApiResponse {
  responses: Array<{
    labelAnnotations: LabelAnnotation[];
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ImageRecognitionService {
  constructor(private http: HttpClient) {}

  generateImageLabels(file: File): Observable<{ tags: string[] }> {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Observable(observer => {
      reader.onloadend = () => {
        if (reader.result) {
          const base64Image = reader.result.toString().split(',')[1];
          const body = {
            "requests": [
              {
                "image": {
                  "content": base64Image
                },
                "features": [
                  {
                    "type": "LABEL_DETECTION",
                    "maxResults": 3
                  }
                ]
              }
            ]
          };

          this.http.post<VisionApiResponse>('https://vision.googleapis.com/v1/images:annotate?key=' + googlecloudvisionapi.googleCloudVisionAPIKey, body)
            .subscribe(response => {
              const labels = response.responses[0].labelAnnotations.map(label => label.description);
              observer.next({ tags: labels });
            }, error => {
              observer.error(error);
            });
        }
      };
    });
  }
}
