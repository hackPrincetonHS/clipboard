import { TestBed, async, inject } from '@angular/core/testing';

import { LoginActivateGuard } from './login-activate.guard';

describe('LoginActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginActivateGuard]
    });
  });

  it('should ...', inject([LoginActivateGuard], (guard: LoginActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
