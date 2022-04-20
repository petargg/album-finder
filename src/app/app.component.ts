import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscriber, Subscription, timer } from "rxjs";
import { IBand } from 'src/Infrastructure/band.model';
import { BandService } from 'src/services/band.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private bandService: BandService){}

  searchedBands: IBand[] = [];
  displayedBands: IBand[] = [];

  private myTimer: any;

  sub!: Subscription;

  private _search: string = "";
  get search(): string{
      return this._search;
  }
  set search(value: string) {

    this._search = value;

    if(this.myTimer){
      clearTimeout(this.myTimer);
    }

    this.myTimer = setTimeout(() => {
        this.sub = this.bandService.getBandAlbums(this._search).subscribe({
          next: bands => {
            this.searchedBands = bands; 
          }
      });
    }, 1000);
  }

  ngOnInit(): void {
      timer(1000, 1000).subscribe(val => {

        this.rotate();

        if(this.searchedBands.length > 0){
          this.addSong();
        }
      });

      this.sub = this.bandService.getBandAlbums('').subscribe({
        next: bands => 
        {
            this.displayedBands = bands;
        } 
    });
  }

  rotate(): void{
    const bandModel = this.displayedBands.shift();
    this.displayedBands.push(bandModel as IBand);
  }

  addSong(): void{
    const bandModel = this.searchedBands.shift();
    this.displayedBands.pop();
    this.displayedBands.push(bandModel as IBand);
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
