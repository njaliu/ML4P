function cloneCopyEvent(d, e) {
    var b, f, a, c;
    var _1 = c;
    if (1 === e.nodeType) {
        if (dataPriv.hasData(d) && (c = dataPriv.access(d), b = dataPriv.set(e, c), c = c.events)) {
            for (a in delete b.handle, b.events = {}, _1) {
                for (b = 0, f = _1[a].length; b < f; b++) {
                    jQuery.event.add(e, a, _1[a][b]);
                }
            }
        }
        dataUser.hasData(d) && (a = dataUser.access(d), a = jQuery.extend({}, a), dataUser.set(e, a));
    }
}

