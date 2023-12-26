enum DisplayState {
    CLOSED = "closed",
    OPENED = "opened"
}

enum DelimitedState {
    DELIMITED = "delimited",
    UNDELIMITED = "undelimited"
}

type State = {
    display: DisplayState,
    delimited: DelimitedState
}


export class Delimiter {
    _state : State = {
        display: DisplayState.CLOSED,
        delimited: DelimitedState.UNDELIMITED
    }

    text : string;
    delimiter : string | undefined;
    delimiterIndex: number | undefined;
    choiceOfIndices: number[] | undefined;

    constructor (
        text: string,
        state?: State | undefined, 
        delimiter?: string | undefined,
        delimiterIndex?: number | undefined,
        choiceOfIndices?: number[] | undefined
    ) {
        this._state = state || this._state
        this.text = text;
        this.delimiter = delimiter
        this.delimiterIndex = delimiterIndex
        this.choiceOfIndices = choiceOfIndices
    }

    open(): Delimiter | never { throw new Error('Cannot do'); }
    close(): Delimiter | never { throw new Error('Cannot do'); }
    updateDelimiter(delimiter: string): Delimiter | never { throw new Error('Cannot do'); }
    selectDelimiterIndex(delimiterIndex : number): Delimiter | never { throw new Error('Cannot do'); }
    removeDelimiter() : Delimiter | never { throw new Error('Cannot do'); }
}

export class ClosedUnDelimited extends Delimiter {
    open() : Delimiter {
        this._state.display = DisplayState.OPENED
        return this
    }
}

export class OpenUndelimited extends Delimiter {
    updateDelimiter(delimiter: string): Delimiter {
        this._state.delimited = DelimitedState.DELIMITED
        this.delimiter = delimiter
        this.delimiterIndex = 0
        this.choiceOfIndices = this.text.split(delimiter).map((key, index) => index)
        return this
    }

    close(): Delimiter {
        this._state.display = DisplayState.CLOSED
        return this
    }
}

export class OpenDelimited extends Delimiter {
    updateDelimiter(delimiter: string): Delimiter {
        this._state.delimited = DelimitedState.DELIMITED
        this.delimiter = delimiter
        this.choiceOfIndices = this.text.split(delimiter).map((key, index) => index)
        return this
    }

    selectDelimiterIndex(delimiterIndex: number): Delimiter {
        this.delimiterIndex = delimiterIndex
        return this
    }

    removeDelimiter() : Delimiter {
        this._state.delimited = DelimitedState.UNDELIMITED
        this.delimiter = undefined
        this.delimiterIndex = undefined
        this.choiceOfIndices = []
        return this;
    }

    close() {
        this._state.display = DisplayState.CLOSED
        return this
    }
}

export class ClosedDelimited extends Delimiter {
    open() : Delimiter {
        this._state.display = DisplayState.OPENED
        return this
    }
}