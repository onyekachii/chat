import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalRService } from '../../services/signal-r';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})

// get groupname to join
export class ChatComponent implements OnInit, OnDestroy{
  sub: Subscription | undefined;
  messages: any[] = [];
  groupName!: string;

  constructor(private _signalService: SignalRService){
  }
  
  async ngOnInit(): Promise<void> {
    await this._signalService.startConnection();
    await this._signalService.addTransferChartDataListener();
    //await this._signalService.join(this.groupName);
    // todo: get older messages
    this.sub = this._signalService.message.subscribe(m => this.messages.push(m));
    //this.send('senior')
  }

  send(text: string) {
    this._signalService.send(this.groupName, text);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this._signalService.leave(this.groupName);
    this._signalService.stop();
  }
}
