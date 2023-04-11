const a = 1 == 1;
function findXY() {
    let i = -1;
    while (a) {
        i++;
        let y = Math.sqrt(Math.pow(5, i) + 168);
        if (Number.isInteger(y)) {
            let x = Math.log(Math.pow(y, 2) - 168) / Math.log(5);
            if (Number.isInteger(x)) {
                console.log([x, y]);
            }
        }
    }
}

console.log(findXY());
