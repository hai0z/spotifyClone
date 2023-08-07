function randomCoolColorHex() {
    const blue = Math.floor(Math.random() * 128) + 128; // 128-255
    const green = Math.floor(Math.random() * 128) + 128; // 128-255
    const red = Math.floor(Math.random() * 128); // 0-127

    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
}
export default randomCoolColorHex;
