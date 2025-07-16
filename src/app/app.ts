import { Component, Directive, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Img } from './components/img/img';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [Img, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('ecommerce-study-project');
  imgParent = "my-store";
  imgParentInputControl = new FormControl("", {
    nonNullable: true 
  });
  imgParentInputUrlControl = new FormControl(
    "https://www.w3schools.com/howto/img_avatar.png", {
    nonNullable: true,
  });
  imgValue = toSignal(
    this.imgParentInputControl.valueChanges, 
    {
      initialValue: ""
    }
  );
  imgUrl = toSignal(this.imgParentInputUrlControl.valueChanges, 
    {
      initialValue: "https://www.w3schools.com/howto/img_avatar.png"
    }
  )
}
