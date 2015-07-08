function cloneCopyEvent(d, e) {
    var b, f, a, c;
    var _1 = a;
    if (1 === e.nodeType) {
        if (dataPriv.hasData(d) && (c = dataPriv.access(d), b = dataPriv.set(e, c), c = c.events)) {
            for (a in delete b.handle, b.events = {}, c) {
                for (b = 0, f = c[a].length; b < f; b++) {
                    jQuery.event.add(e, a, c[a][b]);
                }
            }
        }
        dataUser.hasData(d) && (_1 = dataUser.access(d), _1 = jQuery.extend({}, _1), dataUser.set(e, _1));
    }
}

