import { Observable } from "rxjs";
import { mergeMap, filter, delay } from "rxjs/operators";

export function getArrayChanges<T extends { name: unknown }, K extends { name: unknown }>(next: T[], previous: K[]) {
  const added = next.filter(skill => !previous.find(item => item.name === skill.name))
  const removed = previous.filter(skill => !next.find(item => item.name === skill.name))
  const former = previous.filter(skill => next.find(item => item.name === skill.name))

  return {
    added,
    removed,
    former
  }
}

export const delayRemove = (time: number) => <K, T extends [K, Observable<boolean>]>(source: Observable<T>): Observable<T> => new Observable(observer => {
  return source.subscribe({
    next(value) { observer.next(value); },
    error(err) { observer.error(err); },
    complete() { observer.complete(); }
  }).add(source.pipe(mergeMap(value => value[1]), filter(removed => removed), delay(time)).subscribe({
    next() { observer.complete() }
  }))
})
