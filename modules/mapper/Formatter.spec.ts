import { describe, expect, test } from "vitest";
import { ClosedFormatted, ClosedUnformatted, Format, Formatter, OpenFormatted, OpenUnformatted } from "./Formatter";

test("Initialise state machine", () => {
    let formatter = new Formatter;

    expect(formatter.state()).toBeInstanceOf(ClosedUnformatted)
})

describe("When Closed", () => {
    let formatter = new Formatter;

    test("Open", () => {
        let newState = formatter.state().open();
    
        expect(newState.state()).toBeInstanceOf(OpenUnformatted)
    })

    describe("cannot ⛔️", () => {
        test("close", () => {
            expect(() => formatter.state().close()).toThrow()
        })

        test("remove format", () => {
            expect(() => formatter.state().removeFormat()).toThrow()
        })

        test("selectFormat", () => {
            expect(() => formatter.state().selectFormat(Format.Date)).toThrow()
        })
    })
})

describe("When Open", () => {

    let formatter = new Formatter;
    formatter = formatter.state().open()

    test("Close", () => {
        let newState = formatter.state().close();

        expect(newState.state()).toBeInstanceOf(ClosedUnformatted)
    })

    test("Select format", () => {
        let newState = formatter.state().selectFormat(Format.Date)

        expect(newState.format).toEqual(Format.Date)
        expect(newState.state()).toBeInstanceOf(OpenFormatted)
    })

    describe("cannot ⛔️", () => {
        test("open", () => {
            expect(() => formatter.state().open()).toThrow()
        })

        test("remove format", () => {
            expect(() => formatter.state().removeFormat()).toThrow()
        })
    })
})

describe("When Open and Formatted", () => {
    let formatter = new Formatter;
    formatter = formatter.state().open()
    formatter = formatter.state().selectFormat(Format.Date)

    test("Select format", () => {
        let newState = formatter.state().selectFormat(Format.Email)

        expect(newState.format).toEqual(Format.Email)
        expect(newState.state()).toBeInstanceOf(OpenFormatted)
    })

    test("Remove format", () => {
        let newState = formatter.state().removeFormat()

        expect(newState.state()).toBeInstanceOf(OpenUnformatted)
        expect(newState.format).toBeUndefined()
    })

    test("Close", () => {
        let newState = formatter.state().close()

        expect(newState.state()).toBeInstanceOf(ClosedFormatted)
    })

    describe("cannot ⛔️", () => {
        test("open", () => {
            expect(() => formatter.state().open()).toThrow()
        })
    })
})

describe("When closed and formatted", () => {
    let formatter = new Formatter;
    formatter = formatter.state().open()
    formatter = formatter.state().selectFormat(Format.Date)
    formatter = formatter.state().close()

    test("open", () => {
        let newState = formatter.state().open()

        expect(newState.state()).toBeInstanceOf(OpenFormatted)
    })

    describe("cannot ⛔️", () => {
        test("close", () => {
            expect(() => formatter.state().close()).toThrow()
        })

        test("selectFormat", () => {
            expect(() => formatter.state().selectFormat(Format.Date)).toThrow()
        })

        test("removeFormat", () => {
            expect(() => formatter.state().removeFormat()).toThrow()
        })
    })
})