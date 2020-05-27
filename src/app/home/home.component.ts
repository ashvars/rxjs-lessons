import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer, pipe, throwError } from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap, filter, share, finalize } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginners$ : Observable<Course[]>;
  advanced$ : Observable<Course[]>;

    constructor() {

    }

    ngOnInit() {

      // const data$ = Observable.create(observer => {
      //   fetch("/api/courses").then(resp => {
      //     return resp.json();
      //   }).then(obj => {
      //     observer.next(obj);
      //     observer.complete();
      //   }).catch(err => {
      //     observer.error(err);
      //   })
      // })
      const data$ = createHttpObservable('/api/courses');

      const courses$ = data$.pipe(
        catchError(err => {
          //return of([])
          console.log(err);
          return throwError(err);
        }),
        finalize(() => console.log("Finalize")),
        tap((res) => console.log(res)),
        map(data =>
          Object.values(data["payload"])
        ),
        shareReplay(),
        retryWhen(err => {
          return err.pipe(
            delayWhen(() => {
              return timer(1000)
          }))
        })
      );
      this.beginners$ = courses$.pipe(map((courses: Array<Course>) => {
        return courses.filter(course => course.category === "BEGINNER")
      }));

      this.advanced$ = courses$.pipe(map((courses: Array<Course>) => {
        return courses.filter(course => course.category === "ADVANCED")
      }));

    }

}
