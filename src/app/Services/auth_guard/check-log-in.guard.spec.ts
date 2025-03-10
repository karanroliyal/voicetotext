import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkLogInGuard } from './check-log-in.guard';

describe('checkLogInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkLogInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
