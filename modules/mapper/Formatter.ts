enum DisplayState {
    CLOSED = "closed",
    OPENED = "opened"
}

enum FormatState {
    FORMATTED = "formatted",
    UNFORMATTED = "unformatted"
}

export enum Format {
    Date = "date", // Add other JSON spec formats here
    Email = "email"
}

type State = {
    display: DisplayState,
    format: FormatState
}
interface FormatterInterface {
    open() : Formatter | never,
    close() : Formatter | never,
    selectFormat() : Formatter | never,
    removeFormat() : Formatter | never
}

export class Formatter {
    _state : State = {
        display: DisplayState.CLOSED,
        format: FormatState.UNFORMATTED
    }

    format : Format | undefined;

    constructor (state: State | undefined = undefined, format: Format | undefined = undefined) {
        this._state.display = state?.display || this._state.display
        this._state.format = state?.format || this._state.format
        this.format = format
    }

    state () : Formatter | undefined {
        switch ([this._state.display, this._state.format].toString()) {
            case [DisplayState.OPENED, FormatState.UNFORMATTED].toString(): return new OpenUnformatted(this._state, this.format);
            case [DisplayState.CLOSED, FormatState.UNFORMATTED].toString(): return new ClosedUnformatted(this._state, this.format);
            case [DisplayState.OPENED, FormatState.FORMATTED].toString(): return new OpenFormatted(this._state, this.format);
            case [DisplayState.CLOSED, FormatState.FORMATTED].toString(): return new ClosedFormatted(this._state, this.format);
        }
    } 

    open(): Formatter | never { throw new Error; }
    close(): Formatter | never { throw new Error; }
    selectFormat(format : Format): Formatter | never { throw new Error; }
    removeFormat(): Formatter | never { throw new Error; }
}

export class ClosedUnformatted extends Formatter {
    open(): Formatter {
        this._state.display = DisplayState.OPENED
        return this
    }
}

export class OpenUnformatted extends Formatter {
    selectFormat(format : Format): Formatter {
        this._state.format = FormatState.FORMATTED
        this.format = format
        return this
    }

    close(): Formatter {
        this._state.display = DisplayState.CLOSED
        return this
    }
}

export class OpenFormatted extends Formatter {
    removeFormat(): Formatter {
        this._state.format = FormatState.UNFORMATTED
        this.format = undefined;
        return this
    }

    selectFormat(format: Format): Formatter {
        this.format = format
        return this
    }

    close(): Formatter {
        this._state.display = DisplayState.CLOSED
        return this
    }
}

export class ClosedFormatted extends Formatter {
    open(): Formatter {
        this._state.display = DisplayState.OPENED
        return this
    }
}