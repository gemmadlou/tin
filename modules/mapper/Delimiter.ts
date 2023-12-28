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
    selectedText: string | undefined;
    delimiter : string | undefined;
    delimiterIndex: number | undefined;
    choiceOfIndices: number[] | undefined;

    constructor (
        text: string,
        state?: State,
        delimiter?: string,
        delimiterIndex?: number,
        choiceOfIndices?: number[],
        selectedText?: string
    ) {
        this._state = state || this._state
        this.text = text;
        this.delimiter = delimiter;
        this.delimiterIndex = delimiterIndex;
        this.choiceOfIndices = choiceOfIndices;
        this.selectedText = selectedText
    }

    state () : Delimiter | never {
        switch ([this._state.display, this._state.delimited].toString()) {
            case [DisplayState.OPENED, DelimitedState.UNDELIMITED].toString(): return new OpenUndelimited(this.text, this._state, this.delimiter, this.delimiterIndex, this.choiceOfIndices, this.selectedText);
            case [DisplayState.CLOSED, DelimitedState.UNDELIMITED].toString(): return new ClosedUndelimited(this.text, this._state, this.delimiter, this.delimiterIndex, this.choiceOfIndices, this.selectedText);
            case [DisplayState.OPENED, DelimitedState.DELIMITED].toString(): return new OpenDelimited(this.text, this._state, this.delimiter, this.delimiterIndex, this.choiceOfIndices, this.selectedText);
            case [DisplayState.CLOSED, DelimitedState.DELIMITED].toString(): return new ClosedDelimited(this.text, this._state, this.delimiter, this.delimiterIndex, this.choiceOfIndices, this.selectedText);
            /* c8 ignore next */ 
            default: throw new Error("Invalid state")
        }
    } 

    open(): Delimiter | never { throw new Error('Cannot do'); }
    close(): Delimiter | never { throw new Error('Cannot do'); }
    updateDelimiter(delimiter: string): Delimiter | never { throw new Error('Cannot do'); }
    selectDelimiterIndex(delimiterIndex : number): Delimiter | never { throw new Error('Cannot do'); }
    removeDelimiter() : Delimiter | never { throw new Error('Cannot do'); }
}

export class ClosedUndelimited extends Delimiter {
    open() : Delimiter {
        this._state.display = DisplayState.OPENED
        return this
    }
}

export class OpenUndelimited extends Delimiter {
    updateDelimiter(delimiter: string): Delimiter {
        this._state.delimited = DelimitedState.DELIMITED
        this.delimiter = delimiter
        this.choiceOfIndices = this.text.split(delimiter).map((key, index) => index)
        this.selectedText = this.text.split(delimiter)[this.delimiterIndex ?? 0]
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
        this.selectedText = this.text.split(delimiter)[this.delimiterIndex ?? 0]
        return this
    }

    selectDelimiterIndex(delimiterIndex: number): Delimiter {
        this.delimiterIndex = delimiterIndex
        this.selectedText = this.text.split(this.delimiter || "")[this.delimiterIndex]
        return this
    }

    removeDelimiter() : Delimiter {
        this._state.delimited = DelimitedState.UNDELIMITED
        this.delimiter = undefined
        this.delimiterIndex = undefined
        this.choiceOfIndices = undefined
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