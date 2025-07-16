import { Component, input } from '@angular/core';

@Component({
  selector: 'app-img',
  imports: [],
  templateUrl: './img.html',
  styleUrl: './img.scss'
})
export class Img {
  img = input<string>();
  imgUrl = input<string>();
}
