var test = require('tape').test;
var diff = require('./');

var a = [{
    ip_address: '10.0.0.9',
    remark: '',
    enabled: true,
    name: 'endpoint A'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint B'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint C'
}];

var ax = [{
    ip_address: '10.0.0.9',
    enabled: true,
    remark: '',
    name: 'endpoint A'
}, {
    ip_address: '10.0.0.10',
    name: 'endpoint B',
    remark: '',
    enabled: true
}, {
    ip_address: '10.0.0.10',
    enabled: true,
    remark: '',
    name: 'endpoint C'
}];

/* istanbul ignore next */
var af = [{
    ip_address: '10.0.0.9',
    remark: '',
    enabled: true,
    name: 'endpoint A',
    store: function() {}
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint B',
    store: function() {}
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint C',
    store: function() {}
}];

var a1 = [{
    ip_address: '10.0.0.9',
    remark: '',
    enabled: true,
    name: 'endpoint A+'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint B',
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint C'
}];

var a2 = [{
    ip_address: '10.0.0.9',
    remark: '',
    enabled: false,
    name: 'endpoint A'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    new_key: true,
    name: 'endpoint B'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    name: 'endpoint C'
}];

var a3 = [{
    enabled: true,
    name: 'endpoint A',
    remark: '',
    ip_address: '192.168.56.216'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
}];

var b = [{
    ip_address: '10.1.1.1',
    remark: 'bla',
    enabled: false,
    name: 'endpoint A'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint C'
}, {
    ip_address: '10.0.0.11',
    remark: '',
    enabled: true,
    name: 'endpoint D'
}];

var d = [{
    ip_address: '10.0.0.9',
    remark: '',
    enabled: true,
    name: 'endpoint A',
    _id: '567aa733007ef9887fb0d8b6'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint B',
    _id: '567aa733007ef9887fb0d8b7'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint C',
    _id: '567aa733007ef9887fb0d8b8'
}];

var d1 = [{
    _id: '567aa733007ef9887fb0d8b6',
    enabled: true,
    name: 'endpoint A',
    remark: '',
    ip_address: '192.168.56.216'
}, {
    ip_address: '10.0.0.10',
    remark: '',
    enabled: true,
    name: 'endpoint B',
    _id: '567aa733007ef9887fb0d8b7'
}];

//test cases
test('diff test', function(t) {
    t.deepEqual(diff(a, b, {
        key: 'name'
    }), {
        added: [{
            ip_address: '10.0.0.11',
            remark: '',
            enabled: true,
            name: 'endpoint D'
        }],
        removed: [{
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            name: 'endpoint B'
        }],
        modified: [{
            ip_address: '10.1.1.1',
            remark: 'bla',
            enabled: false,
            name: 'endpoint A'
        }],
        unchanged: [{
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            name: 'endpoint C'
        }]
    });

    t.deepEqual(diff(a, a2, {
        key: 'name'
    }), {
        added: [],
        removed: [],
        modified: [{
            ip_address: '10.0.0.9',
            remark: '',
            enabled: false,
            name: 'endpoint A',
        }, {
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            new_key: true,
            name: 'endpoint B',
        }, {
            ip_address: '10.0.0.10',
            remark: '',
            name: 'endpoint C',
        }],
        unchanged: []
    });

    t.equal(diff(a, a, {
        key: 'name',
        exclude: ['_id']
    }).unchanged.length, 3);
    t.equal(diff(a, a1, {
        key: 'name'
    }).unchanged.length, 2);
    t.equal(diff(af, af, {
        key: 'name',
        exclude: ['_id']
    }).unchanged.length, 3);
    t.equal(diff(a, af, {
        key: 'name',
        exclude: ['_id']
    }).unchanged.length, 3);
    t.equal(diff(a, ax, {
        key: 'name',
        exclude: ['_id']
    }).unchanged.length, 3);

    t.end();
});

test('diff exclude', function(t) {

    t.deepEqual(diff(a, d, {
        key: 'name',
        exclude: ['_id']
    }), {
        added: [],
        removed: [],
        modified: [],
        unchanged: [{
            ip_address: '10.0.0.9',
            remark: '',
            enabled: true,
            name: 'endpoint A',
            _id: '567aa733007ef9887fb0d8b6'
        }, {
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            name: 'endpoint B',
            _id: '567aa733007ef9887fb0d8b7'
        }, {
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            name: 'endpoint C',
            _id: '567aa733007ef9887fb0d8b8'
        }]
    });

    t.end();
});

test('diff keep', function(t) {
    t.deepEqual(diff(d, a, {
        key: 'name',
        exclude: ['x_id'],
        keep: ['_id']
    }), {
        added: [],
        removed: [],
        modified: [],
        unchanged: [{
            ip_address: '10.0.0.9',
            remark: '',
            enabled: true,
            name: 'endpoint A',
            _id: '567aa733007ef9887fb0d8b6'
        }, {
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            name: 'endpoint B',
            _id: '567aa733007ef9887fb0d8b7'
        }, {
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            name: 'endpoint C',
            _id: '567aa733007ef9887fb0d8b8'
        }]
    });

    t.deepEqual(diff(d, d1, {
            key: 'name',
            exclude: ['_id'],
            keep: ['_id']
        }), {
            added: [],
            removed: [{
                ip_address: '10.0.0.10',
                remark: '',
                enabled: true,
                name: 'endpoint C',
                _id: '567aa733007ef9887fb0d8b8'
            }],
            modified: [{
                _id: '567aa733007ef9887fb0d8b6',
                enabled: true,
                name: 'endpoint A',
                remark: '',
                ip_address: '192.168.56.216'
            }],
            unchanged: [{
                ip_address: '10.0.0.10',
                remark: '',
                enabled: true,
                name: 'endpoint B',
                _id: '567aa733007ef9887fb0d8b7'
            }]
        }

    );

    t.end();
});

test('diff empty', function(t) {
    t.deepEqual(diff(null, d1, {
        key: 'name',
        exclude: ['_id']
    }), {
        added: [{
            _id: '567aa733007ef9887fb0d8b6',
            enabled: true,
            name: 'endpoint A',
            remark: '',
            ip_address: '192.168.56.216'
        }, {
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            name: 'endpoint B',
            _id: '567aa733007ef9887fb0d8b7'
        }],
        removed: [],
        modified: [],
        unchanged: []
    });
    t.deepEqual(diff(undefined, d1, {
        key: 'name',
        exclude: ['_id']
    }), {
        added: [{
            _id: '567aa733007ef9887fb0d8b6',
            enabled: true,
            name: 'endpoint A',
            remark: '',
            ip_address: '192.168.56.216'
        }, {
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            name: 'endpoint B',
            _id: '567aa733007ef9887fb0d8b7'
        }],
        removed: [],
        modified: [],
        unchanged: []
    });
    t.deepEqual(diff([], d1, {
        key: 'name',
        exclude: ['_id']
    }), {
        added: [{
            _id: '567aa733007ef9887fb0d8b6',
            enabled: true,
            name: 'endpoint A',
            remark: '',
            ip_address: '192.168.56.216'
        }, {
            ip_address: '10.0.0.10',
            remark: '',
            enabled: true,
            name: 'endpoint B',
            _id: '567aa733007ef9887fb0d8b7'
        }],
        removed: [],
        modified: [],
        unchanged: []
    });
    t.deepEqual(diff([], [], {
        key: 'name'
    }), {
        added: [],
        removed: [],
        modified: [],
        unchanged: []
    });
    t.end();
});
