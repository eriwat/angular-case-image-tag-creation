import { TestBed } from '@angular/core/testing';

import { ImageRecognitionService} from './image-recognition.service';

describe('ImageGenerationService', () => {
  let service: ImageRecognitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageRecognitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
