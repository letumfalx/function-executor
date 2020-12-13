import FunctionExecutor from '../src/FunctionExecutor';

describe('FunctionExecutor', () => {
  describe('options', () => {
    describe('stopOnError', () => {
      it('should default to true if options is not given', () => {
        const instance = new FunctionExecutor();
        instance.add(() => { throw new Error(); });

        // throwing error means stopOnError is true
        expect(() => instance.execute()).toThrowError();
      });

      it('should default to true if it is not in the options', () => {
        const instance = new FunctionExecutor({});
        instance.add(() => { throw new Error(); });

        // throwing error means stopOnError is true
        expect(() => instance.execute()).toThrowError();
      });

      it('should default to true if options is falsy', () => {
        const instance = new FunctionExecutor(null);
        instance.add(() => { throw new Error(); });

        // throwing error means stopOnError is true
        expect(() => instance.execute()).toThrowError();
      });
    });
  });

  describe('method testing', () => {
    /**
     * @type {FunctionExecutor}
     */
    let instance;

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe('add', () => {
      beforeEach(() => {
        instance = FunctionExecutor.create();
      });

      describe('no index passed', () => {
        const addFunc = fn => {
          instance.add(fn);
        };

        it('should throw TypeError if func is not a function', () => {
          const fn = 'not a function';
          expect(() => addFunc(fn)).toThrowError(TypeError);
        });

        it('should not throw TypeError if func is a function', () => {
          const fn = () => {};
          expect(() => addFunc(fn)).not.toThrowError(TypeError);
        });

        it('should add to the list if func is a function', () => {
          const fn = () => {};
          addFunc(fn);
          expect(instance.contains(fn)).toBeTruthy();
        });

        it('should add duplicates function', () => {
          const fn = () => {};
          addFunc(fn);
          addFunc(fn);
          expect(instance.count()).toBe(2);
        });
      });

      describe('index is null', () => {
        const addFunc = fn => {
          instance.add(fn, null);
        };

        it('should throw TypeError if func is not a function', () => {
          const fn = 'not a function';
          expect(() => addFunc(fn)).toThrowError(TypeError);
        });

        it('should not throw TypeError if func is a function', () => {
          const fn = () => {};
          expect(() => addFunc(fn)).not.toThrowError(TypeError);
        });

        it('should add to the list if func is a function', () => {
          const fn = () => {};
          addFunc(fn);
          expect(instance.contains(fn)).toBeTruthy();
        });

        it('should add duplicates function', () => {
          const fn = () => {};
          addFunc(fn);
          addFunc(fn);
          expect(instance.count()).toBe(2);
        });
      });

      describe('index is positive', () => {
        const seedSize = 5;

        beforeEach(() => {
          for (let i = 0; i < seedSize; ++i) {
            instance.add(() => {});
          }
        });

        it('should be added on the index if the index exists', () => {
          const index = seedSize - 1;
          const fn = () => {};
          instance.add(fn, index);
          expect(instance.get(index)).toBe(fn);
        });

        it('should be added to the end of the list if index is greater than the count', () => {
          const index = seedSize + 5;
          const fn = () => {};
          instance.add(fn, index);
          expect(instance.get(instance.count() - 1)).toBe(fn);
        });
      });

      describe('index is negative', () => {
        const seedSize = 5;

        beforeEach(() => {
          for (let i = 0; i < seedSize; ++i) {
            instance.add(() => {});
          }
        });

        it('should be added on the index starting at the end if the absolute value of the index is less than the size of the list', () => {
          const index = -(seedSize - 2);
          const fn = () => {};
          instance.add(fn, index);
          expect(instance.get(seedSize - (seedSize - 2))).toBe(fn);
        });

        it('should be added at the beginning of the list if absolute value of the index given is greater than the size of the list', () => {
          const index = -(seedSize + 5);
          const fn = () => {};
          instance.add(fn, index);
          expect(instance.get(0)).toBe(fn);
        });
      });
    });

    describe('clear', () => {
      beforeEach(() => {
        instance = FunctionExecutor.create();
      });

      it('should empty the list', () => {
        instance.add(() => {});
        expect(instance.count()).toBeGreaterThan(0);
        instance.clear();
        expect(instance.count()).toBe(0);
      });
    });

    describe('contains', () => {
      beforeEach(() => {
        instance = FunctionExecutor.create();
      });

      it('should return false if it is not yet added', () => {
        const fn = () => {};
        expect(instance.contains(fn)).toBeFalsy();
      });

      it('should return true if it added', () => {
        const fn = () => {};
        instance.add(fn);
        expect(instance.contains(fn)).toBeTruthy();
      });

      it('should return false if it added then removed', () => {
        const fn = () => {};
        instance.add(fn);
        instance.remove(fn);
        expect(instance.contains(fn)).toBeFalsy();
      });
    });

    describe('count', () => {
      beforeEach(() => {
        instance = FunctionExecutor.create();
      });

      it('should return the total number of functions on the list', () => {
        const seedSize = 5;
        for (let i = 0; i < seedSize; ++i) {
          instance.add(() => {});
        }
        expect(instance.count()).toBe(seedSize);
      });
    });

    describe('execute', () => {
      describe('stopOnError is true', () => {
        beforeEach(() => {
          instance = FunctionExecutor.create({ stopOnError: true });
        });

        it('should throw the first exception', () => {
          const fn1 = () => {};
          const fn2 = () => { throw new TypeError(); };
          const fn3 = () => { throw new ReferenceError(); };

          instance.add(fn1);
          instance.add(fn2);
          instance.add(fn3);

          expect(() => instance.execute()).toThrowError(TypeError);
        });

        it('should call the functions before the error', () => {
          const fn1 = jest.fn();
          const fn2 = jest.fn(() => { throw new TypeError(); });
          const fn3 = jest.fn(() => { throw new ReferenceError(); });

          instance.add(fn1);
          instance.add(fn2);
          instance.add(fn3);

          expect(() => instance.execute()).toThrow();
          expect(fn1).toBeCalled();
          expect(fn2).toBeCalled(); // fn2 is called but not finished because of the error
          expect(fn3).not.toBeCalled();
        });

        it('should return empty array if no error is thrown', () => {
          const fn = () => {};
          instance.add(fn);
          let result;
          expect(() => {
            result = instance.execute();
          }).not.toThrowError();
          expect(Array.isArray(result)).toBeTruthy();
          expect(result).toHaveLength(0);
        });

        it('should call the function with the following arguments', () => {
          const fn1 = jest.fn();
          const fn2 = jest.fn();

          const args = [Symbol('a'), Symbol('b')];

          instance.add(fn1);
          instance.add(fn2);

          instance.execute(...args);

          expect(fn1).toBeCalledWith(...args);
          expect(fn2).toBeCalledWith(...args);
        });
      });

      describe('stopOnError is false', () => {
        beforeEach(() => {
          instance = FunctionExecutor.create({ stopOnError: false });
        });

        it('should not throw', () => {
          const fn1 = () => {};
          const fn2 = () => { throw new TypeError(); };
          const fn3 = () => { throw new ReferenceError(); };

          instance.add(fn1);
          instance.add(fn2);
          instance.add(fn3);

          expect(() => instance.execute()).not.toThrowError();
        });

        it('call all the function', () => {
          const fn1 = jest.fn(() => {});
          const fn2 = jest.fn(() => { throw new TypeError(); });
          const fn3 = jest.fn(() => { throw new ReferenceError(); });

          instance.add(fn1);
          instance.add(fn2);
          instance.add(fn3);

          instance.execute();

          expect(fn1).toBeCalled();
          expect(fn2).toBeCalled();
          expect(fn3).toBeCalled();
        });

        it('should return the array of errors thrown', () => {
          const fn1 = jest.fn(() => {});
          const fn2 = jest.fn(() => { throw new TypeError('type_error'); });
          const fn3 = jest.fn(() => { throw new ReferenceError('reference_error'); });

          instance.add(fn1);
          instance.add(fn2);
          instance.add(fn3);

          const result = instance.execute();
          expect(Array.isArray(result)).toBeTruthy();
          expect(result).toHaveLength(2);
          expect(result[0]).toBeInstanceOf(TypeError);
          expect(result[0].message).toBe('type_error');
          expect(result[1]).toBeInstanceOf(ReferenceError);
          expect(result[1].message).toBe('reference_error');
        });

        it('should call the function with the following arguments', () => {
          const fn1 = jest.fn();
          const fn2 = jest.fn(() => { throw new Error(); });

          const args = [Symbol('a'), Symbol('b')];

          instance.add(fn1);
          instance.add(fn2);

          instance.execute(...args);

          expect(fn1).toBeCalledWith(...args);
          expect(fn2).toBeCalledWith(...args);
        });
      });
    });

    describe('get', () => {
      const seedSize = 5;

      beforeEach(() => {
        instance = FunctionExecutor.create();
      });

      describe('using positive index', () => {
        it('should return the function on the index if it exists', () => {
          let fn;
          const index = 3;

          for (let i = 0; i < seedSize; ++i) {
            const _fn = () => {};
            if (i === index) {
              fn = _fn;
            }
            instance.add(_fn);
          }

          expect(instance.get(index)).not.toBeNull();
          expect(instance.get(index)).toBe(fn);
        });

        it('should return  null if index does not exists', () => {
          const index = seedSize + 5;

          for (let i = 0; i < seedSize; ++i) {
            instance.add(() => {});
          }

          expect(instance.get(index)).toBeNull();
        });
      });

      describe('using negative index', () => {
        it('should return the function on the index starting from the end if it exists', () => {
          let fn;
          const index = -3;

          for (let i = 0; i < seedSize; ++i) {
            const _fn = () => {};
            if (i === (seedSize + index)) {
              fn = _fn;
            }
            instance.add(_fn);
          }

          expect(instance.get(index)).not.toBeNull();
          expect(instance.get(index)).toBe(fn);
        });

        it('should return null if the index does not exists', () => {
          const index = -(seedSize + 5);

          for (let i = 0; i < seedSize; ++i) {
            instance.add(() => {});
          }

          expect(instance.get(index)).toBeNull();
        });
      });
    });

    describe('indexOf', () => {
      const seedSize = 5;

      beforeEach(() => {
        instance = FunctionExecutor.create();
      });

      it('should return the index if func is on the list', () => {
        const index = 3;
        let fn;

        for (let i = 0; i < seedSize; ++i) {
          const _fn = () => {};
          if (i === index) {
            fn = _fn;
          }
          instance.add(_fn);
        }

        expect(instance.indexOf(fn)).toBe(index);
      });

      it('should return the -1 if func is not on the list', () => {
        const fn = () => {};

        for (let i = 0; i < seedSize; ++i) {
          instance.add(() => {});
        }

        expect(instance.indexOf(fn)).toBe(-1);
      });
    });

    describe('remove', () => {
      beforeEach(() => {
        instance = FunctionExecutor.create();
      });

      it('should remove the function from the list', () => {
        const fn = () => {};
        instance.add(fn);
        expect(instance.contains(fn)).toBeTruthy();
        instance.remove(fn);
        expect(instance.contains(fn)).toBeFalsy();
      });

      it('should not remove anything if the func to be remove not in the list', () => {
        const fnToRemove = () => {};
        const fnToAdd = () => {};
        instance.add(fnToAdd);
        expect(instance.count()).toBe(1);
        expect(instance.get(0)).toBe(fnToAdd);
        instance.remove(fnToRemove);
        expect(instance.count()).toBe(1);
        expect(instance.get(0)).toBe(fnToAdd);
      });
    });
  });
});
