import { Component } from '@angular/core';

import { AngularFire } from 'angularfire2';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../shared/auth.service';

const PATH = 'devfest2017'

@Component({
    templateUrl: './admin.component.html'
})
export class AdminComponent {
   

    schedule;
    speakers;

    editSession = {};
    editSpeaker = {};

    constructor(public af: AngularFire, public auth: AuthService) {

        this.schedule = af.database.list(PATH + '/schedule');
        this.speakers = af.database.list(PATH + '/speakers');
    }

    saveSession(session) {
        event.preventDefault();
        if (session.$key) {
            let key = session.$key;

            delete session.$key;
            delete session.$exists;
            delete session.$value;

            this.schedule.update(key, session);
        } else {
            this.schedule.push(session);
        }
        this.editSession = {};
    }
    saveSpeaker(speaker) {
        event.preventDefault();
        if (speaker.$key) {
            let key = speaker.$key;

            delete speaker.$key;
            delete speaker.$exists;
            delete speaker.$value;

            this.speakers.update(key, speaker);
        } else {
            this.speakers.push(speaker);
        }
        this.editSpeaker = {};
    }
    deleteSpeaker(key){
        this.speakers.remove(key);
    }
    deleteSession(key){
        this.schedule.remove(key);
    }

}