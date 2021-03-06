import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire } from 'angularfire2';

import { DataService } from '../shared/data.service';

import 'rxjs/add/operator/switchMap';

@Component({
    template: `
    <section>
            <speaker-full [speaker]="speaker | async"></speaker-full>
    </section>
    `
})
export class SpeakersViewComponent {
    speaker;
    speakerId;

    constructor(route: ActivatedRoute, public af: AngularFire, ds: DataService) { 
        
        this.speaker = route.params.switchMap(params => 
            ds.speakers.map(list => list.find(item => item.$key == params['id']))
        );
    }

}