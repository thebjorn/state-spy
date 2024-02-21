
export const load = event => {
    event.locals.hello = {
        hello: 'world',
        fortytwo: 42,
        arr: [1, 2, 3],
        anobj: {
            foo: 'bar',
            baz: 'qux'
        },
        arr_of_obj: [
            {foo: 'bar'},
            {baz: 'qux'}
        ],
    }
    return {locals: event.locals}
}