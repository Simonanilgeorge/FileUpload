import { Component, OnInit, Input,Output, EventEmitter,SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  @Input() message
  @Input() classBoolean
  @Output() test=new EventEmitter();
  constructor() { }

  ngOnInit(): void {

  }

}
