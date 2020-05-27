import { Observable } from 'rxjs';
import { Course } from '../model/course';

export function createHttpObservable(url: string) {
  return Observable.create(observer => {

    const controller = new AbortController;
    const signal = controller.signal;

    fetch(url, { signal })
    .then(resp => {
      if(resp.ok) {
        return resp.json();
      } else {
        observer.error(`Request failed with status code : ${resp.status}`);
      }
    })
    .then(resp => {
      observer.next(resp);
      observer.complete();
    })
    .catch(err => {
      observer.error(err);
    })

    return () => {
      controller.abort();
    }
  })
}

