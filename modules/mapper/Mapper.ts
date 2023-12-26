// Describe DataHeading - Single Item

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
    state: {
        display: DisplayState,
        format: FormatState
    } = {
        display: DisplayState.CLOSED,
        format: FormatState.UNFORMATTED
    }

    format : Format | undefined;

    open() { throw new Error; }
    close() { throw new Error; }
    updateFormat() { throw new Error; }
}