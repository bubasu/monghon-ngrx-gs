import { TestBed } from '@angular/core/testing';

import { RandomWordService } from './random-word.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('RandomWordService', () => {
  let service: RandomWordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RandomWordService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RandomWordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch random word', () => {
    const mockWord= ['testword'];
    service.fetchWord().subscribe(word => {
      expect(word).toEqual(mockWord[0]);
    });
    const req = httpMock.expectOne('https://random-word-api.herokuapp.com/word?number=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockWord);
  });
});
