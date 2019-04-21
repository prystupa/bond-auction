import order from '.';

describe('Order reducer', () => {
    let given, actual;

    beforeEach(() => {
        given = undefined;
        actual = order(given, {type: 'test-message'});
    });

    it('Then reflects the initial state', () => {
        expect(actual).toEqual({"error": null, "fetching": false, "order": null});
    });
});
