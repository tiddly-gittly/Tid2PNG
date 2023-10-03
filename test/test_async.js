function himmel(gen) {
    const item = gen.next()
    if (item.done) {
        return item.value
    }

    const { value, done } = item
    if (value instanceof Promise) {
        value.then((e) => himmel(gen))
    } else {
        himmel(gen)
    }
}

function* baum() {
    yield delay(300).then(() => console.log(1))
    yield console.log(2)
    yield delay(300).then(() => console.log(3))
    yield console.log(4)
}

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}


const b = baum()
// b.next()
// b.next()
// b.next()
// b.next()


// console.log(b.next())

console.log(0);

b.next().value.then(() => {
    b.next()
})

console.log(5);

// 不能实现在当前代码时空中的顺序执行。
// 0
// 5
// 1
// 2


// b.next().value.then(() => { // 第一个 delay 函数返回的 promise
//     b.next()
//     b.next().value.then(() => { // 第二个 delay 函数返回的 promise
//         b.next()
//     })
// })


// himmel(baum())


// function* baum_canvas() {
//     yield html2canvas(tiddler_dom).then((canvas) => { console.log(canvas) });
//     yield console.log(2)
// }

// const bc = baum_canvas();

// bc.next().value.then(() => {
//     bc.next()
// })