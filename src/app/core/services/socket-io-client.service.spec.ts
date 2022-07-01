import { TestBed } from '@angular/core/testing';

import { SocketIoClientService } from './socket-io-client.service';

describe('SocketIoClientService', () => {
  let service: SocketIoClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketIoClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
