import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { ResumeComponent } from './resume/resume.component';
import { ResumeViewComponent } from './resume-view/resume-view.component';
import { ContactComponent } from './contact/contact.component';
import { GameComponent } from './game/game.component';
import { ScoresComponent } from './scores/scores.component';

import { DataService } from "./data.service";
import { AboutComponent } from './about/about.component';


const appRoutes: Routes = [
	{ path: 'home', component: HomeComponent, children: [
		{ path: 'game', component: GameComponent, outlet: 'game-outlet' },
		{ path: 'scores', component: ScoresComponent, outlet: 'game-outlet' },
	] },
	{ path: 'resume', component: ResumeComponent },
	{ path: 'resume-view', component: ResumeViewComponent },
	{ path: 'contact', component: ContactComponent },
	{ path: 'about', component: AboutComponent },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },	
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    ResumeComponent,
    ContactComponent,
    GameComponent,
    ScoresComponent,
    ResumeViewComponent,
    AboutComponent
  ],
  imports: [
	BrowserModule,
	BrowserAnimationsModule,
	HttpModule,
	FormsModule,
	RouterModule.forRoot(appRoutes)
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
