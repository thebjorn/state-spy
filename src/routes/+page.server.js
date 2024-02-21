
export const load = event => {
    event.locals.hello = {
        hello: 'world',
        fortytwo: 42,
        arr: [1, 2, 3],
        long_array: Array(20).fill(0),
        obj: {
            foo: 'bar',
            baz: 'qux'
        },
        arr_of_obj: [
            {foo: 'bar'},
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
        level1: Array(20).fill(0),
        locals: event.locals
    }
}