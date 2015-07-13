function cloneCopyEvent(d, e) {
    var b, f, a, c;
    var _1;
    var _2;
    if (1 === e.nodeType) {
        if (dataPriv.hasData(d) && (c = dataPriv.access(d), b = dataPriv.set(e, c), c = c.events)) {
            for (a in delete b.handle, b.events = {}, c) {
                for (b = 0, f = c[a].length; b < f; _1++) {
                    jQuery.event.add(e, a, _2[a][_1]);
                }
            }
        }
        dataUser.hasData(d) && (a = dataUser.access(d), a = jQuery.extend({}, a), dataUser.set(e, a));
    }
}

