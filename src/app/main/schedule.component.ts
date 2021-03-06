import { Component } from '@angular/core';

import { AuthService } from '../shared/auth.service';
import { DataService, Session } from '../shared/data.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';

@Component({
    templateUrl: './schedule.component.html',
})
export class ScheduleComponent {

    // Two versions of the same data, one filtered, one not
    allSessions: Observable<any>;
    myAgenda: Observable<any>;

    // Where we store the currently selected data.
    filteredData: Observable<any>;

    constructor(public ds: DataService, public auth: AuthService) {
        this.filteredData = this.allSessions;
        
        /**
         * Session data should look like data[time][room] = session;
         */
        this.allSessions = ds.sessionList
            .map(list => {
                let data = {}
                for (let session of list) {
                    let time = session.startTime;
                    if (typeof data[time] != 'object') {
                        data[time] = {};
                    }
                    
                    // Get height of box
                    if(!session.blocks) {
                        session.blocks = 1;
                    }
                    if(session.track != 'all' && session.track != 'Keynote') {
                        data[time][session.room] = session;
                    } else {
                        data[time]['all'] = session;
                    }

                    
                }


                let pad = n => (n < 10) ? ("0" + n) : n;

                // Look for holes
                for(let time in data) {
                    let slot = data[time];
                    if(!slot.all) {
                        for(let room of ds.ROOMS) {
                            if(!slot[room]) {
                                let previous = time.substr(0,11) + pad(parseInt(time.substr(11,2))-2) + time.substr(13)
                                if(data[previous][room] && data[previous][room].blocks == 1) {
                                    // This room has nothing in it!
                                    data[time][room] = 'placeholder';
                                }
                            }
                        }
                    }
            
                }

                let startTimes = Object.keys(data).sort();
                return { startTimes: startTimes, gridData: data, rooms: ds.ROOMS };
            })
            .shareResults();
        

        this.filteredData = this.allSessions;
        

        this.myAgenda = this.allSessions.combineLatest(this.auth.agenda, (allData, agenda) => {
            let resultSessions = {};
            let data = JSON.parse(JSON.stringify(allData.gridData));
            let rooms = [];
            let myAgendaKeys = [];

            for(let session of agenda) {
                myAgendaKeys.push(session.$key);
            }


            for(let time in data) {
                let slot = data[time];
                if(!slot.all) {
                    for(let room in slot) {
                        let session = slot[room];
                        if(myAgendaKeys.indexOf(session.$key) == -1) {
                            delete slot[room];
                        } else {
                            // Track which rooms we actually need.
                            if(!(room in rooms)) {
                                rooms.push(room);
                            }
                        }
                    }
                } else {
                    // Do nothing with 'all' sessions
                }
            }

            // We do this to maintain the original order of the rooms
            let returnRooms = [];
            for(let room of ds.ROOMS) {
                if(rooms.indexOf(room) != -1) {
                    returnRooms.push(room);
                }
            }
            let result = {startTimes: allData.startTimes, gridData:data, rooms: returnRooms};
            return result;

        });

    }

}
