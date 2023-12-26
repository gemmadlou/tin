enum DisplayState {
    CLOSED,
    OPENED
}

enum FormatState {
    FORMATTED,
    UNFORMATTED
}

enum Format {
    Date
}

abstract class Formatter {
    state = {
        display: DisplayState.CLOSED,
        format: FormatState.UNFORMATTED
    }

    format : Format | undefined;

    open() { throw new Error; }
    close() { throw new Error; }
    selectFormat(format : Format) { throw new Error; }
    removeFormat() { throw new Error; }
}

class ClosedUnformatted extends Formatter {
    open() {
        this.state.display = DisplayState.OPENED
    }
}

class OpenUnformatted extends Formatter {
    selectFormat(format : Format) {
        this.state.format = FormatState.FORMATTED
        this.format = format
    }

    close() {
        this.state.display = DisplayState.CLOSED
    }
}

class OpenFormatted extends Formatter {
    removeFormat(): void {
        this.state.format = FormatState.UNFORMATTED
        this.format = undefined;
    }

    selectFormat(format: Format): void {
        this.format = format
    }

    closed() {
        this.state.display = DisplayState.CLOSED
    }
}

class ClosedFormatted extends Formatter {
    open() {
        this.state.display = DisplayState.OPENED
    }
}