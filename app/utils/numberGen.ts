export const numberGen = (length: number = 6) => {
    const output = [];
    for(let i = 0; i < length; i++) {
        output.push(Math.floor(Math.random()*10))
    }
    return output.join("");
}