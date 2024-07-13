export default function getColorFromLineNo(lineNo: number) {
    const map: Record<number, string> = {
        1: "#c0282c",   // Red
        2: "#f6d71a",   // Yellow
        3: "#3b76c0",   // Blue - Noida Electronic City
        4: "#3b76c0",   // Blue - Vaishali
        5: "#54ab55",   // Green
        6: "#8115ff",   // Violet
        7: "#ed91c9",   // Pink
        8: "#f300f3",   // Magenta
        9: "#808080",   // Grey
        10: "#f46808",  // Airport Express
        11: "#015b97",  // Rapid - Gurgaon
    }

    return map[lineNo];
}