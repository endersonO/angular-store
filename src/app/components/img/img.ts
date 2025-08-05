import { Component, computed, input, output } from '@angular/core';

interface ImageLoadedEvent {
  imgUrlCharged: string;
}

@Component({
  selector: 'app-img',
  imports: [],
  templateUrl: './img.html',
  styleUrl: './img.scss',
})
export class Img {
  imgUrl = input<string>();
  imgUrlDefault = 'https://picsum.photos/200';
  currentImgUrl = computed(() => this.imgUrl() || this.imgUrlDefault);

  onImageError(event: any) {
    event.target.src = this.imgUrlDefault;
  }
  loaded = output<ImageLoadedEvent>();

  imgLoaded() {
    this.loaded.emit({
      imgUrlCharged: this.currentImgUrl(),
    });
  }
}
