import FunctionExecutor from "./../src/index";

describe("Function Executor", () => {

  describe("creation", () => {

    it("should not throw an error on creation", () => {
      expect(() => new FunctionExecutor()).not.toThrowError();
    });

    it("should throw an error if directly called", () => {
      expect(() => FunctionExecutor()).toThrowError();
    });

    it("should set stopOnError to true if no argument is passed", () => {
      expect(new FunctionExecutor().stopOnError).toBeTruthy();
    });

    it("should set stopOnError to false if passed argument is falsy except undefined", () => {
      expect(new FunctionExecutor(0).stopOnError).toBeFalsy();
      expect(new FunctionExecutor(null).stopOnError).toBeFalsy();
      expect(new FunctionExecutor("").stopOnError).toBeFalsy();
      expect(new FunctionExecutor(false).stopOnError).toBeFalsy();
      expect(new FunctionExecutor(NaN).stopOnError).toBeFalsy();
    });

    it("should set stopOnError to true if passed argument is truthy or is undefined", () => {
      expect(new FunctionExecutor(1).stopOnError).toBeTruthy();
      expect(new FunctionExecutor(-1).stopOnError).toBeTruthy();
      expect(new FunctionExecutor("not empty").stopOnError).toBeTruthy();
      expect(new FunctionExecutor({}).stopOnError).toBeTruthy();
      expect(new FunctionExecutor(true).stopOnError).toBeTruthy();
      expect(new FunctionExecutor(void 0).stopOnError).toBeTruthy();
    });

  });

  describe("method testing", () => {

    /**
     * @type {FunctionExecutor}
     */
    let fexec;

    beforeEach(() => {
      fexec = new FunctionExecutor();
    });

    describe("adding functions", () => {

      it("should return true if argument is a function", () => {
        expect(fexec.add(() => {})).toBeTruthy();
      });

      it("should return false if argument is already added", () => {
        const fn = () => {};
        fexec.add(fn);
        expect(fexec.add(fn)).toBeFalsy();
      });

      it("should return false if argument is not a function", () => {
        expect(fexec.add(0)).toBeFalsy();
        expect(fexec.add("string")).toBeFalsy();
        expect(fexec.add({})).toBeFalsy();
        expect(fexec.add(null)).toBeFalsy();
        expect(fexec.add(void 0)).toBeFalsy();
        expect(fexec.add(false)).toBeFalsy();
      });

    });

    describe("removing function", () => {
      it("should return true if function is already added", () => {
        const fn = () => {};
        fexec.add(fn);
        expect(fexec.remove(fn)).toBeTruthy();
      });

      it("should return false if function already removed", () => {
        const fn = () => {};
        fexec.add(fn);
        fexec.remove(fn);
        expect(fexec.remove(fn)).toBeFalsy();
      });

      it("should return false if function is not added", () => {
        expect(fexec.remove(() => {})).toBeFalsy();
      });

      it("should return false if argument is not a function", () => {
        expect(fexec.remove(0)).toBeFalsy();
        expect(fexec.remove("string")).toBeFalsy();
        expect(fexec.remove({})).toBeFalsy();
        expect(fexec.remove(null)).toBeFalsy();
        expect(fexec.remove(void 0)).toBeFalsy();
        expect(fexec.remove(false)).toBeFalsy();
      });

    });

    describe("containing function", () => {
      it("should return true if function is already added", () => {
        const fn = () => {};
        fexec.add(fn);
        expect(fexec.contains(fn)).toBeTruthy();
      });

      it("should return false if function is not yet added", () => {
        expect(fexec.contains(() => {})).toBeFalsy();
      });

      it("should return false if argument is not a function", () => {
        expect(fexec.contains(0)).toBeFalsy();
        expect(fexec.contains("string")).toBeFalsy();
        expect(fexec.contains({})).toBeFalsy();
        expect(fexec.contains(null)).toBeFalsy();
        expect(fexec.contains(void 0)).toBeFalsy();
        expect(fexec.contains(false)).toBeFalsy();
      });

      it("should return false if function is removed", () => {
        const fn = () => {};
        fexec.add(fn);
        fexec.remove(fn);
        expect(fexec.contains(fn)).toBeFalsy();
      });
    });

    describe("executing functions", () => {

      describe("stopOnError is true", () => {

        beforeEach(() => {
          fexec.stopOnError = true;
        });

        describe("no error encountered", () => {

          const fns = [
            jest.fn(),
            jest.fn(),
            jest.fn(),
          ];

          beforeEach(() => {
            fns.forEach(fn => fexec.add(fn));
          });

          afterEach(() => {
            fns.forEach(fn => fn.mockClear());
          });

          it("should call all the functions", () => {
            fexec.execute();
            expect(fns[0]).toBeCalled();
            expect(fns[1]).toBeCalled();
            expect(fns[2]).toBeCalled();
          });

          it("should call all the functions with specified arguments", () => {
            const args = ["a", 1, null];
            fexec.execute(...args);
            expect(fns[0]).toBeCalledWith(...args);
            expect(fns[1]).toBeCalledWith(...args);
            expect(fns[2]).toBeCalledWith(...args);
          });

          it("should return undefined", () => {
            expect(fexec.execute()).toBeUndefined();
          });

        });

        describe("error encountered", () => {

          const fns = [
            jest.fn(),
            jest.fn(() => { throw new Error() }),
            jest.fn(),
          ];

          beforeEach(() => {
            fns.forEach(fn => fexec.add(fn));
          });

          afterEach(() => {
            fns.forEach(fn => fn.mockClear());
          });

          it("should throw an error", () => {
            expect(fexec.execute).toThrowError();
          });

          it("should only call the functions before and the error function itself", () => {
            try {
              fexec.execute();
            }
            catch(error) {}
            finally {
              expect(fns[0]).toBeCalled();
              expect(fns[1]).toBeCalled();
              expect(fns[2]).not.toBeCalled();
            }
          });

          it("should call all the functions before and the error function itself with specified arguments", () => {
            const args = ["a", 1, null];
            try {
              fexec.execute(...args);
            }
            catch(error) {}
            finally {
              expect(fns[0]).toBeCalledWith(...args);
              expect(fns[1]).toBeCalledWith(...args);
              expect(fns[2]).not.toBeCalledWith(...args);
            }
          });

        });

      });

      describe("stopOnError is false", () => {

        beforeEach(() => {
          fexec.stopOnError = false;
        });

        describe("no error encountered", () => {

          const fns = [
            jest.fn(),
            jest.fn(),
            jest.fn(),
          ];

          beforeEach(() => {
            fns.forEach(fn => fexec.add(fn));
          });

          afterEach(() => {
            fns.forEach(fn => fn.mockClear());
          });

          it("should call all the functions", () => {
            fexec.execute();
            expect(fns[0]).toBeCalled();
            expect(fns[1]).toBeCalled();
            expect(fns[2]).toBeCalled();
          });

          it("should call all the functions with specified arguments", () => {
            const args = ["a", 1, null];
            fexec.execute(...args);
            expect(fns[0]).toBeCalledWith(...args);
            expect(fns[1]).toBeCalledWith(...args);
            expect(fns[2]).toBeCalledWith(...args);
          });

          it("should return undefined", () => {
            expect(fexec.execute()).toBeUndefined();
          });

        });

        describe("error encountered", () => {

          const fns = [
            jest.fn(),
            jest.fn(() => { throw new Error() }),
            jest.fn(),
          ];

          beforeEach(() => {
            fns.forEach(fn => fexec.add(fn));
          });

          afterEach(() => {
            fns.forEach(fn => fn.mockClear());
          });

          it("should not throw an error", () => {
            expect(fexec.execute).not.toThrowError();
          });

          it("should call all the functions", () => {
            fexec.execute();
            expect(fns[0]).toBeCalled();
            expect(fns[1]).toBeCalled();
            expect(fns[2]).toBeCalled();
          });

          it("should call all the functions with specified arguments", () => {
            const args = ["a", 1, null];
            fexec.execute(...args);
            expect(fns[0]).toBeCalledWith(...args);
            expect(fns[1]).toBeCalledWith(...args);
            expect(fns[2]).toBeCalledWith(...args);
          });

          it("should return an array", () => {
            expect(Array.isArray(fexec.execute())).toBeTruthy();
          });

          it("should return an array with length of the number of errors encountered", () => {
            expect(fexec.execute()).toHaveLength(1);
          });

        });

      });

    });

  });

  describe("properties testing", () => {
    describe("stopOnError", () => {
      it("should set stopOnError to true if setting value is truthy", () => {
        let fexec = new FunctionExecutor(false);
        fexec.stopOnError = true;
        expect(fexec.stopOnError).toBeTruthy();

        fexec = new FunctionExecutor(false);
        fexec.stopOnError = 1;
        expect(fexec.stopOnError).toBeTruthy();

        fexec = new FunctionExecutor(false);
        fexec.stopOnError = -1;
        expect(fexec.stopOnError).toBeTruthy();

        fexec = new FunctionExecutor(false);
        fexec.stopOnError = "not empty";
        expect(fexec.stopOnError).toBeTruthy();

        fexec = new FunctionExecutor(false);
        fexec.stopOnError = {};
        expect(fexec.stopOnError).toBeTruthy();
      });

      it("should set stopOnError to false if setting value is falsy", () => {
        let fexec = new FunctionExecutor(true);
        fexec.stopOnError = false;
        expect(fexec.stopOnError).toBeFalsy();

        fexec = new FunctionExecutor(true);
        fexec.stopOnError = 0;
        expect(fexec.stopOnError).toBeFalsy();

        fexec = new FunctionExecutor(true);
        fexec.stopOnError = null;
        expect(fexec.stopOnError).toBeFalsy();

        fexec = new FunctionExecutor(true);
        fexec.stopOnError = "";
        expect(fexec.stopOnError).toBeFalsy();

        fexec = new FunctionExecutor(true);
        fexec.stopOnError = NaN;
        expect(fexec.stopOnError).toBeFalsy();
      });
    });
  });

});