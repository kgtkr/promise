class MyPromise<T>{
  constructor(public readonly val: Promise<[T]>) { }

  static fromPromise<T>(promise: Promise<T>): MyPromise<T> {
    return new MyPromise(promise.then<[T]>(x => [x]));
  }

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): MyPromise<TResult1 | TResult2> {
    return MyPromise.fromPromise(this.val.then(onfulfilled !== undefined ? ([x]) => onfulfilled(x) : undefined, onrejected));
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): MyPromise<T | TResult> {
    return MyPromise.fromPromise(this.val.then(([x]) => x).catch(onrejected));
  }

  map<R>(f: (x: T) => R): MyPromise<R> {
    return new MyPromise(this.val.then<[R]>(([x]: [T]) => [f(x)]));
  }

  bind<R>(f: (x: T) => MyPromise<R>): MyPromise<R> {
    return new MyPromise(this.val.then(([x]) => f(x).then<[R]>(x => [x])));
  }
}