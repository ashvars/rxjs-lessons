import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay, debounce, throttle, throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, interval} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId: string;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

      this.courseId = this.route.snapshot.params['id'];

      this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);

    }

    ngAfterViewInit() {

      this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith([]),
        //debounceTime(500),
        //throttle(() => interval(1000)),
        throttleTime(1000),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      );

    }

    loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=10&filter=${search}`)
      .pipe(
        map(resp => Object.values(resp["payload"]))
      )
    }


}
