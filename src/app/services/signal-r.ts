import { Injectable, NgZone } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private conn!: signalR.HubConnection;
  public message = new Subject<any>();

  constructor(private zone: NgZone) { }

  public startConnection = () => {
    this.conn = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiRootUrl + environment.hubChatEndpoint)
      .withAutomaticReconnect()
      .build();

    this.conn.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }
  
  public addTransferChartDataListener = () => {
    this.conn.on(environment.hubReceiveMethodName, (data) => {
      // ensuring that angular detects the message via zone
      this.zone.run(() => this.message.next(data))
    });
  }

  join(group: string) {
    return this.conn.invoke('JoinGroup', group);
  }

  leave(group: string) {
    return this.conn.invoke('LeaveGroup', group);
  }

  send(group: string, text: string) {
    return this.conn.invoke('SendMessageToGroup', group, text);
  }

  stop() {
    return this.conn.stop();
  }
}