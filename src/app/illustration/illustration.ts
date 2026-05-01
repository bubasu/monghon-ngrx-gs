import { Component, input, Input } from '@angular/core';
import { DramaIndicator, StoryEnum } from '../model';

@Component({
  selector: 'app-illustration',
  imports: [],
  templateUrl: './illustration.html',
  styleUrl: './illustration.css',
})
export class Illustration {
  story = input<StoryEnum>();
  drama = input<DramaIndicator>();
}
