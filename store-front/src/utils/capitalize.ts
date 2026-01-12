export function capitalizeWords(original: string): string | void {
    return original
        .split(/[\s_-]+/)
        .map((s) => capitalize(s))
        .join();
}

export function capitalize(original: string): string | void {
    if (original.length == 0) return;
    let returnString: string = "";

    for (let i = 0; i < original.length; i++) {
        if (i == 0 || isWhiteSpaceOrSeperator(original[i - 1])) {
            returnString += original[i].toUpperCase();
        }
        returnString += original[i].toLowerCase();
    }
    const firstLetterCapitalized = original[0].toUpperCase();
    const restOfString = original.substring(1).toLowerCase();
    return firstLetterCapitalized + restOfString;
}

function isWhiteSpaceOrSeperator(str: string): boolean {
    if (str.length != 1) throw new Error(`ERROR: capitalize.ts: This function "isWhiteSpaceOrSeperator" only takes single characters`);

    const isWhitespace = str[0] == ` ` || str[0] == `\t` || str[0] == `\n` || str[0] == `\r` || str[0] == `\v` || str[0] == `\f`;
    const isSepearator = str[0] == "-" || str[0] == "_";
    return isWhitespace || isSepearator;
}
