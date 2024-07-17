import { Component, computed, effect, OnInit, signal, viewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BallonComponent } from './components/ballon/ballon.component';
import { IBalloon } from './balloon.interface';
import { Balloon } from './balloon.class';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,BallonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'Balloon-Pop-game';
  balloonsOnScreen = 3;
  ngOnInit(): void {
    this.startGame();
  }
  balloons: IBalloon[] = [];  
  score = 0;
  missed = signal(0);
  gameOver = computed(() => { 
    return this.missed() == 3;
  });

  balloonElement = viewChildren(BallonComponent);
  createBalloonsOnDemand = effect(() => {
    if (!this.gameOver && this.balloonElement().length < this.balloonsOnScreen) {
      this.balloons = [...this.balloons, new Balloon()];
    }
  })


  startGame() {
    this.missed.set(0);
    this.score = 0;
    this.balloons = new Array(this.balloonsOnScreen).fill(0).map(() => new Balloon());

  }
  balloonPopHandler(balloonId: string) {
    this.score++;
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);
    this.balloons = [...this.balloons, new Balloon()];
  }
  missedBalloonHandler(balloonId: string) {
    this.missed.update(val => val + 1);
        this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);

    this.balloons.push(new Balloon());

    
  }
}
