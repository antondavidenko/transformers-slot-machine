// Inspired by https://github.com/nehalist/di-ts

import 'reflect-metadata';

interface Type<T> {
  new(...args: any[]): T;
}

type GenericClassDecorator<T> = (target: T) => void;

export const InjectableClass = () : GenericClassDecorator<Type<any>> => {
    return (target: Type<any>) => {
  };
};

export class Injector {

  private dependencies: any[] = [];

  addDependency(dependency:any):void {
    this.dependencies.push(dependency);
  }  

  resolve(target: Type<any>): any {
    let tokens = Reflect.getMetadata('design:paramtypes', target) || []; 
    let injections = tokens.map(token => this.deepResolve(token));
    return new target(...injections);
  }

  private deepResolve(target: Type<any>): any {
    let result;
    for (let i in this.dependencies) {
      if (this.dependencies[i] instanceof target) {
        result = this.dependencies[i];
        break;
      }
    }
    if (!result) {
      console.error(`Dependency "${target.name}" is unresolved!`);
    }
    return result;
  }

};