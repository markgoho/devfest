import { Component, Input } from '@angular/core';

@Component({
    selector: 'speaker-full',
    template: `
    <div *ngIf="speaker">
        <div class="callout">{{speaker.name}} </div>
        <div style="display: flex;align-items: center;justify-content: center;">
            <div class="" [style.background-image]="'url('+speaker.imageUrl+')'" style="background-size: cover; width: 125px; height: 125px;border-radius: 50%"></div>
        </div>
        <div>{{speaker.company}}</div>
        <div *ngIf="speaker.twitter"><a href="https://twitter.com/{{speaker.twitter}}" target="_new">@{{speaker.twitter}}</a></div>
        <div style="border:1px solid #CCC;margin:32px;padding:32px;" [innerHTML]="speaker.bio" *ngIf="speaker.bio"></div>
    </div>
    `
})
export class SpeakerFullComponent {
    @Input() speaker;
}