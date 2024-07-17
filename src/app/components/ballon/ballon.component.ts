import { Component, ElementRef, EventEmitter,inject, input, OnInit, Output } from '@angular/core';
import { IBalloon } from '../../balloon.interface';
import { animate, AnimationBuilder, keyframes, style } from '@angular/animations';


@Component({
  selector: 'app-ballon',
  standalone: true,
  imports: [],
  templateUrl: './ballon.component.html',
  styleUrl: './ballon.component.scss'
})
export class BallonComponent implements OnInit{
  balloon = input.required<IBalloon>()

  animBuilder = inject(AnimationBuilder);
  animRef = inject(ElementRef);
  @Output() balloonPopped = new EventEmitter<string>();
  @Output() missingBalloon = new EventEmitter<string>();
  ngOnInit(): void {
    this.animateBalloon();
  }
  animateBalloon() {
    const buffer = 20;
    const maxWidth = window.innerWidth - this.animRef.nativeElement.firstChild.clientWidth - buffer;
    const leftPosition = Math.floor(Math.random() * maxWidth);
    const minSpeed = 3;
    const speedVar = 3;
    const speed = minSpeed + Math.random() * speedVar;
    const flyAnimation = this.animBuilder.build([style({
      translate: `${leftPosition}px 0`,
      position: 'fixed',
      left: 0,
      bottom: 0,
    }),
    animate(
      `${speed}s ease-in-out`,
      style({
        translate: `${leftPosition}px -100vh`,

      })
    )
    ]); 
    const player = flyAnimation.create(this.animRef.nativeElement.firstChild);
    player.play();
    player.onDone(()=>this.missingBalloon.emit(this.balloon().id));
    
    
  }
  pop() {
    const popAnimation = this.animBuilder.build([animate(
      '2s ease-out', keyframes([
        style({
          scale: '1.2',
          offset: 0.5
        }),
        // style({
        //   scale: '1.2',
        //   offset:0.75
        // })
      ])
    )]);
    const player = popAnimation.create(
      this.animRef.nativeElement.firstChild);
    player.play();
    player.onDone(() => { 
      this.balloonPopped.emit(this.balloon().id);
    });
    
    
    this.balloonPopped.emit(this.balloon().id);
  }
  

}

