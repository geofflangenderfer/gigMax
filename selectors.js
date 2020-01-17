const SELECTORS = {
  pickupAddress:  [
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div.dg > div:nth-child(2)',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dy.dz > div > div.e8 > div.db > div:nth-child(2)',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.e2.e3 > div > div.ec > div.dg > div:nth-child(2)',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.ds.dt > div > div.e3 > div.db > div:nth-child(2)',
  ],
  dropoffAddress:  [
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div:nth-child(2) > div:nth-child(2)',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dy.dz > div > div.e8 > div:nth-child(2) > div:nth-child(2)',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.e2.e3 > div > div.ec > div:nth-child(2) > div:nth-child(2)',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.ds.dt > div > div.e3 > div:nth-child(2) > div:nth-child(2)',
  ],
  pickupTime:  [
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div.dg > div.e8.cr.cn.co',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dy.dz > div > div.e8 > div.db > div.e9.cr.cn.co',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.e2.e3 > div > div.ec > div.dg > div.ed.cr.cn.co',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.ds.dt > div > div.e3 > div.db > div.e4.cr.cn.co',
  ],
  dropoffTime:  [ 
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dx.dy > div > div.e7 > div:nth-child(2) > div.e8.cr.cn.co',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.dy.dz > div > div.e8 > div:nth-child(2) > div.e9.cr.cn.co',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.e2.e3 > div > div.ec > div:nth-child(2) > div.ed.cr.cn.co',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div.ds.dt > div > div.e3 > div:nth-child(2) > div.e4.cr.cn.co',
  ],
  duration:  [
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(3) > div > div > div.ed.ee.ef > div.dh.eg.eh',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(3) > div > div > div.ed.ee.ef > div.dc.eg.eh',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(3) > div > div > div.eh.ei.ej > div.dh.ek.el',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(3) > div > div > div.e9.ea.eb > div.dc.ec.ed',
  ],
  distance:  [
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(3) > div > div > div.ed.ee.ei > div.dh.eg.eh',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(3) > div > div > div.ed.ee.ei > div.dc.eg.eh',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(3) > div > div > div.eh.ei.em > div.dh.ek.el',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(3) > div > div > div.e9.ea.ee > div.dc.ec.ed',
  ],
  licensePlate:  [
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(5) > div.dh.eg.eh',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(5) > div.dc.eg.eh',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(5) > div.dh.ek.el',
'#root > div > div > div > div > div.ae > div > div > div.c1.c2.c3 > div.al.cc.c5.cd.c7.ce.c9.cf.cb > div > div > div:nth-child(2) > div > div.by > div:nth-child(5) > div.dc.ec.ed',
  ],
};

module.exports = {
  SELECTORS,
};
