/**
 * Easing function from https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
 */
export const Ease = {
  backout(amount: number): (x: number) => number {
    return (t: number): number => {
      return --t * t * ((amount + 1) * t + amount) + 1;
    };
  },
  getPowIn(pow: number): (x: number) => number {
    return function(t) {
      return Math.pow(t, pow);
    };
  },
  getPowOut(pow): (x: number) => number {
    return function(t) {
      return 1 - Math.pow(1 - t, pow);
    };
  },
  noEasing(): (x: number) => number {
    return function(t) {
      return t;
    };
  }  
};
