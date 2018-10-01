import { TestBed } from '@angular/core/testing';

import { VerificaEmailService } from './verifica-email.service';

describe('VerificaEmailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VerificaEmailService = TestBed.get(VerificaEmailService);
    expect(service).toBeTruthy();
  });
});
