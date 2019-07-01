import { TestBed, async, inject } from '@angular/core/testing';

import { FullyLoggedInGuard } from './fully-logged-in.guard';

describe('FullyLoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FullyLoggedInGuard]
    });
  });

  it('should ...', inject([FullyLoggedInGuard], (guard: FullyLoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
