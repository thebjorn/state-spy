
export const load = event => {
    event.locals.hello = {
        hello: 'world',
        fortytwo: 42,
        xyzzy: {a: 1},
        arr: [1, 2, 3],
        points: [{"x":0,"y":1},{"x":0,"y":0.9},{"x":0.9,"y":0.4},{"x":0.9,"y":0.5},{"x":0.3,"y":1}],
        long_array: Array(20).fill(0).map((_, i) => i**i),
        obj: {
            foo: 'bar',
            baz: 'qux'
        },
        arr_of_obj: [
            {foo: 'bar', baz: 'qux', xyzzy: {a: 1}},
            {foo: 'bar'},
            {foo: 'bar'},
            {foo: 'bar'},
            {foo: 'bar'},
            {foo: 'bar'},
            {foo: 'bar'},
            {foo: 'bar'},
            {baz: 'qux'}
        ],
        long_string: `lorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor
         sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit 
         ametlorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsum dolor sit amet`,
    }
    return {
        empty: [],
        empty2: {},
        level1: Array(4).fill(0),

        locals: event.locals
    }
}