// ╔══════════════════════════════════════════════════════════════╗
// ║  PRONAV.JS — Declarative HTML Site Framework                ║
// ║  Version 1.1 — Save this file as "pronav.js"               ║
// ║                                                             ║
// ║  THEME / COLOR OPTIONS (set on <body>):                     ║
// ║    theme="blue|green|red|orange|purple|teal|pink|indigo|…"  ║
// ║    accent="#hex"  — primary accent color                    ║
// ║    dark="#hex"    — navbar & footer background               ║
// ║    gray="#hex"    — muted text color                        ║
// ║    bg="#hex"      — page background color                   ║
// ║                                                             ║
// ║  Examples:                                                  ║
// ║    <body theme="purple">                                    ║
// ║    <body accent="#f59e0b">                                  ║
// ║    <body accent="#22c55e" dark="#0a1f15">                   ║
// ╚══════════════════════════════════════════════════════════════╝
(function () {
    'use strict';

    // ── Default Colors ──
    var A = '#3b82f6', P = '#1e293b', G = '#64748b', BG = '#f8fafc';
    var AH = '', AR = '';

    // ── Preset Themes ──
    var THEMES = {
        blue:   { accent: '#3b82f6', dark: '#1e293b', gray: '#64748b', bg: '#f8fafc' },
        green:  { accent: '#22c55e', dark: '#14332a', gray: '#64748b', bg: '#f7fdf9' },
        red:    { accent: '#ef4444', dark: '#2d1519', gray: '#64748b', bg: '#fef7f7' },
        orange: { accent: '#f59e0b', dark: '#2d2011', gray: '#64748b', bg: '#fffbf5' },
        purple: { accent: '#a855f7', dark: '#211535', gray: '#64748b', bg: '#faf5ff' },
        teal:   { accent: '#14b8a6', dark: '#152e2b', gray: '#64748b', bg: '#f0fdfa' },
        pink:   { accent: '#ec4899', dark: '#2d1224', gray: '#64748b', bg: '#fdf2f8' },
        indigo: { accent: '#6366f1', dark: '#1e1b4b', gray: '#64748b', bg: '#f5f5ff' },
        rose:   { accent: '#f43f5e', dark: '#2d1219', gray: '#64748b', bg: '#fff1f2' },
        cyan:   { accent: '#06b6d4', dark: '#133a42', gray: '#64748b', bg: '#f0fcff' }
    };

    var _m = null, _mr = false, _md = [], _leafletReady = false;

    // ──────────────────────────────────
    //  1. COLOR HELPERS
    // ──────────────────────────────────
    function normHex(h) {
        h = h.replace('#', '');
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        return '#' + h;
    }

    function darken(hex, pct) {
        hex = normHex(hex).replace('#', '');
        var r = parseInt(hex.substring(0, 2), 16),
            g = parseInt(hex.substring(2, 4), 16),
            b = parseInt(hex.substring(4, 6), 16);
        r = Math.max(0, Math.floor(r * (1 - pct)));
        g = Math.max(0, Math.floor(g * (1 - pct)));
        b = Math.max(0, Math.floor(b * (1 - pct)));
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function hexRgb(hex) {
        hex = normHex(hex).replace('#', '');
        return [
            parseInt(hex.substring(0, 2), 16),
            parseInt(hex.substring(2, 4), 16),
            parseInt(hex.substring(4, 6), 16)
        ];
    }

    function readTheme() {
        var body = document.body;
        var tn = (body.getAttribute('theme') || '').toLowerCase();
        if (tn && THEMES[tn]) {
            var t = THEMES[tn];
            A  = t.accent;
            P  = t.dark;
            G  = t.gray;
            BG = t.bg;
        }
        // Individual attributes override preset
        if (body.getAttribute('accent')) A  = normHex(body.getAttribute('accent'));
        if (body.getAttribute('dark'))   P  = normHex(body.getAttribute('dark'));
        if (body.getAttribute('gray'))   G  = normHex(body.getAttribute('gray'));
        if (body.getAttribute('bg'))     BG = normHex(body.getAttribute('bg'));

        // Derived values
        AH = darken(A, 0.15);
        var rgb = hexRgb(A);
        AR = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',.15)';
    }

    // ──────────────────────────────────
    //  2. INJECT <head> DEPENDENCIES
    // ──────────────────────────────────
    (function injectHead() {
        var head = document.head || document.getElementsByTagName('head')[0];

        if (!document.querySelector('meta[charset]')) {
            var mc = document.createElement('meta');
            mc.setAttribute('charset', 'UTF-8');
            head.insertBefore(mc, head.firstChild);
        }

        if (!document.querySelector('meta[name="viewport"]')) {
            var mv = document.createElement('meta');
            mv.setAttribute('name', 'viewport');
            mv.setAttribute('content', 'width=device-width, initial-scale=1.0');
            head.appendChild(mv);
        }

        var bs = document.createElement('style');
        bs.textContent = 'body{opacity:0;transition:opacity .3s}';
        head.appendChild(bs);

        if (!document.querySelector('link[href*="font-awesome"]')) {
            var fa = document.createElement('link');
            fa.rel = 'stylesheet';
            fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
            head.appendChild(fa);
        }

        if (!document.querySelector('link[href*="leaflet"]')) {
            var lc = document.createElement('link');
            lc.rel = 'stylesheet';
            lc.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            head.appendChild(lc);
        }

        if (!window.L && !document.querySelector('script[src*="leaflet"]')) {
            var ls = document.createElement('script');
            ls.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            ls.onload = function () { _leafletReady = true; };
            head.appendChild(ls);
        } else {
            _leafletReady = true;
        }
    })();

    // ──────────────────────────────────
    //  3. WAIT FOR DOM, THEN BUILD
    // ──────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        readTheme();
        injectCSS();
        proc('nav', bNav);
        proc('hero', bHero);
        proc('stats', bStats);
        proc('heading', bHead);
        proc('card', bCard);
        proc('team', bTeam);
        proc('services', bSvc);
        proc('map', bMap);
        proc('contact', bContact);
        proc('footer', bFoot);
        wrapPages();
        wire();
        document.body.style.opacity = '1';
    });

    // ──────────────────────────────────
    //  4. HELPERS
    // ──────────────────────────────────
    function proc(t, fn) {
        document.querySelectorAll('[pn="' + t + '"]').forEach(fn);
    }

    function qi(el) {
        return [].slice.call(el.querySelectorAll('i'));
    }

    // ──────────────────────────────────
    //  5. COMPONENT BUILDERS
    // ──────────────────────────────────

    // NAV
    function bNav(el) {
        var b = el.getAttribute('brand') || 'Site',
            p = b.split('|'),
            lk = [].slice.call(el.querySelectorAll('a')),
            h = '';
        lk.forEach(function (a, i) {
            h += '<li><a href="#" class="pn-tab' + (i === 0 ? ' active' : '') +
                '" data-page="' + a.getAttribute('to') + '">' +
                '<i class="fas fa-' + (a.getAttribute('icon') || 'circle') + '"></i> ' +
                '<span>' + a.textContent + '</span></a></li>';
        });
        el.className = 'pn-navbar';
        el.innerHTML = '<div class="pn-c pn-nf">' +
            '<a class="pn-brand" href="#">' + p[0] + (p[1] ? '<span>' + p[1] + '</span>' : '') + '</a>' +
            '<ul class="pn-tabs">' + h + '</ul></div>';
    }

    // HERO
    function bHero(el) {
        el.className = 'pn-hero';
        el.innerHTML = '<h1>' + (el.getAttribute('title') || '') + '</h1>' +
            '<p>' + (el.getAttribute('subtitle') || '') + '</p>';
    }

    // STATS
    function bStats(el) {
        var items = qi(el), h = '<div class="pn-sg">';
        items.forEach(function (it) {
            h += '<div class="pn-card pn-sc"><div class="pn-sv">' +
                it.getAttribute('value') + '</div><p>' + it.textContent + '</p></div>';
        });
        el.innerHTML = h + '</div>';
    }

    // HEADING
    function bHead(el) { el.className = 'pn-sh'; }

    // CARD
    function bCard(el) {
        el.className = 'pn-card';
        el.innerHTML = '<p>' + el.innerHTML + '</p>';
    }

    // TEAM
    function bTeam(el) {
        var m = qi(el), h = '<div class="pn-tg">';
        m.forEach(function (x) {
            var n = x.getAttribute('name'),
                ini = n.split(' ').map(function (w) { return w[0]; }).join('');
            h += '<div class="pn-card pn-tc">' +
                '<div class="pn-av" style="background:' + (x.getAttribute('color') || A) + '">' + ini + '</div>' +
                '<h5>' + n + '</h5><p>' + (x.getAttribute('role') || '') + '</p></div>';
        });
        el.innerHTML = h + '</div>';
    }

    // SERVICES
    function bSvc(el) {
        var items = qi(el), h = '<div class="pn-vg">';
        items.forEach(function (it) {
            h += '<div class="pn-card pn-vc">' +
                '<div class="pn-ib" style="background:' + (it.getAttribute('color') || A) + '">' +
                '<i class="fas fa-' + (it.getAttribute('icon') || 'star') + '"></i></div>' +
                '<h5>' + (it.getAttribute('title') || '') + '</h5>' +
                '<p>' + it.textContent + '</p></div>';
        });
        el.innerHTML = h + '</div>';
    }

    // MAP
    function bMap(el) {
        var markers = qi(el);
        _md = markers.map(function (m) {
            return {
                lat: +m.getAttribute('lat'),
                lng: +m.getAttribute('lng'),
                name: m.textContent,
                flag: m.getAttribute('flag') || '📍'
            };
        });
        var h = '<div class="pn-lb">';
        _md.forEach(function (d, i) {
            h += '<button class="pn-lbtn' + (i === 0 ? ' active' : '') +
                '" data-idx="' + i + '">' + d.flag + ' ' + d.name + '</button>';
        });
        el.innerHTML = h + '</div><div id="pn-mc"></div>';
    }

    // CONTACT
    function bContact(el) {
        var fe = el.querySelector('[pn="form"]'),
            ie = el.querySelector('[pn="info"]'),
            fh = '', ih = '';
        if (fe) {
            fh = '<div class="pn-card"><form class="pn-fm" id="pn-cf">' +
                '<div class="pn-fgr"><div><label>Name</label>' +
                '<input type="text" placeholder="Your name" required></div>' +
                '<div><label>Email</label>' +
                '<input type="email" placeholder="you@email.com" required></div></div>' +
                '<div><label>Message</label>' +
                '<textarea rows="4" placeholder="Your message..." required></textarea></div>' +
                '<button type="submit"><i class="fas fa-paper-plane"></i> Send</button>' +
                '</form></div>';
        }
        if (ie) {
            var items = qi(ie);
            ih = '<div class="pn-card">';
            items.forEach(function (it) {
                ih += '<div class="pn-ir">' +
                    '<i class="fas fa-' + (it.getAttribute('icon') || 'info') + ' pn-ii"></i>' +
                    '<div><strong>' + (it.getAttribute('label') || '') + '</strong><br>' +
                    '<span>' + it.textContent + '</span></div></div>';
            });
            ih += '</div>';
        }
        el.className = 'pn-cg';
        el.innerHTML = '<div>' + fh + '</div><div>' + ih + '</div>';
    }

    // FOOTER
    function bFoot(el) { el.className = 'pn-ft'; }

    // ──────────────────────────────────
    //  6. PAGE SYSTEM
    // ──────────────────────────────────
    function wrapPages() {
        document.querySelectorAll('[pn="page"]').forEach(function (pg) {
            pg.id = 'pn-p-' + pg.getAttribute('name');
            pg.className = 'pn-pg' + (pg.hasAttribute('active') ? ' active' : '');
            var w = document.createElement('div');
            w.className = 'pn-pi';
            while (pg.firstChild) w.appendChild(pg.firstChild);
            pg.appendChild(w);
        });
    }

    // ──────────────────────────────────
    //  7. EVENT WIRING
    // ──────────────────────────────────
    function wire() {
        document.querySelectorAll('.pn-tab').forEach(function (tab) {
            tab.addEventListener('click', function (e) {
                e.preventDefault();
                var pg = tab.dataset.page;
                document.querySelectorAll('.pn-tab').forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');
                document.querySelectorAll('.pn-pg').forEach(function (p) { p.classList.remove('active'); });
                var t = document.getElementById('pn-p-' + pg);
                if (t) t.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (t && t.querySelector('#pn-mc')) {
                    if (!_mr) waitForLeafletThenInit();
                    else if (_m) setTimeout(function () { _m.invalidateSize(); }, 100);
                }
            });
        });

        document.querySelectorAll('.pn-lbtn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.pn-lbtn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                if (_m && _md.length) {
                    var d = _md[+btn.dataset.idx];
                    _m.flyTo([d.lat, d.lng], 12, { duration: 1.2 });
                    _m.eachLayer(function (l) {
                        if (l instanceof L.Marker) {
                            var p = l.getLatLng();
                            if (Math.abs(p.lat - d.lat) < 0.02 && Math.abs(p.lng - d.lng) < 0.02)
                                setTimeout(function () { l.openPopup(); }, 600);
                        }
                    });
                }
            });
        });

        var form = document.getElementById('pn-cf');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                form.reset();
                var t = document.createElement('div');
                t.className = 'pn-toast';
                t.innerHTML = '<i class="fas fa-check"></i> Sent!';
                document.body.appendChild(t);
                setTimeout(function () { t.classList.add('show'); }, 10);
                setTimeout(function () {
                    t.classList.remove('show');
                    setTimeout(function () { t.remove(); }, 300);
                }, 2500);
            });
        }
    }

    // ──────────────────────────────────
    //  8. LEAFLET MAP
    // ──────────────────────────────────
    function waitForLeafletThenInit() {
        if (_leafletReady && window.L) {
            setTimeout(initMap, 150);
        } else {
            var check = setInterval(function () {
                if (_leafletReady && window.L) {
                    clearInterval(check);
                    setTimeout(initMap, 150);
                }
            }, 100);
        }
    }

    function initMap() {
        var c = document.getElementById('pn-mc');
        if (!c || !_md.length || !window.L) return;
        _m = L.map(c).setView([_md[0].lat, _md[0].lng], 3);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OSM'
        }).addTo(_m);
        _md.forEach(function (d) {
            var ic = L.divIcon({
                html: '<div style="background:' + A + ';color:#fff;width:28px;height:28px;border-radius:50%;' +
                    'display:flex;align-items:center;justify-content:center;font-size:8px;' +
                    'border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.2)">●</div>',
                className: '', iconSize: [28, 28], iconAnchor: [14, 14]
            });
            L.marker([d.lat, d.lng], { icon: ic }).addTo(_m)
                .bindPopup('<strong>' + d.name + '</strong>');
        });
        _mr = true;
    }

    // ──────────────────────────────────
    //  9. CSS INJECTION (uses theme colors)
    // ──────────────────────────────────
    function injectCSS() {
        var s = document.createElement('style');
        s.textContent =
            '*{margin:0;padding:0;box-sizing:border-box}' +
            'body{font-family:"Segoe UI",system-ui,sans-serif;background:' + BG + ';color:' + P + ';min-height:100vh;display:flex;flex-direction:column}' +
            '.pn-navbar{background:' + P + ';padding:.7rem 0;position:sticky;top:0;z-index:1000}' +
            '.pn-c{max-width:1100px;margin:0 auto;padding:0 1.2rem}' +
            '.pn-nf{display:flex;align-items:center;justify-content:space-between}' +
            '.pn-brand{color:#fff;font-weight:700;font-size:1.3rem;text-decoration:none}' +
            '.pn-brand span{color:' + A + '}' +
            '.pn-tabs{list-style:none;display:flex;gap:4px}' +
            '.pn-tab{color:rgba(255,255,255,.6);text-decoration:none;padding:.5rem 1rem;border-radius:8px;font-weight:500;font-size:.88rem;transition:.2s;display:flex;align-items:center;gap:6px}' +
            '.pn-tab:hover{color:#fff;background:rgba(255,255,255,.1)}' +
            '.pn-tab.active{color:#fff;background:' + A + '}' +
            '.pn-pg{display:none;flex:1;animation:pnF .3s ease}' +
            '.pn-pg.active{display:block}' +
            '@keyframes pnF{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +
            '.pn-pi{max-width:1100px;margin:0 auto;padding:2rem 1.2rem}' +
            '.pn-hero{background:linear-gradient(135deg,' + P + ',' + A + ');color:#fff;padding:3rem 2rem;border-radius:12px;text-align:center;margin-bottom:1.5rem}' +
            '.pn-hero h1{font-size:2rem;font-weight:700;margin-bottom:.4rem}' +
            '.pn-hero p{opacity:.85;font-size:1rem}' +
            '.pn-card{background:#fff;border-radius:12px;padding:1.5rem;box-shadow:0 1px 12px rgba(0,0,0,.06);transition:transform .2s;margin-bottom:1rem}' +
            '.pn-card:hover{transform:translateY(-3px)}' +
            '.pn-card p{color:' + G + ';font-size:.88rem;margin:0;line-height:1.5}' +
            '.pn-card h5{font-weight:700;font-size:1rem;margin-bottom:.3rem}' +
            '.pn-sg{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem}' +
            '.pn-sc{text-align:center}' +
            '.pn-sv{font-size:1.8rem;font-weight:800;color:' + A + '}' +
            '.pn-sh{font-size:1.4rem;font-weight:700;margin-bottom:1.2rem}' +
            '.pn-tg{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}' +
            '.pn-tc{text-align:center}' +
            '.pn-av{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.2rem;margin:0 auto .6rem}' +
            '.pn-vg{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}' +
            '.pn-ib{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1rem;margin-bottom:.8rem}' +
            '#pn-mc{width:100%;height:450px;border-radius:12px;box-shadow:0 1px 12px rgba(0,0,0,.06)}' +
            '.pn-lb{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1rem}' +
            '.pn-lbtn{padding:.4rem .9rem;border-radius:8px;border:2px solid #e2e8f0;background:#fff;font-size:.82rem;font-weight:600;cursor:pointer;transition:.2s;color:' + P + '}' +
            '.pn-lbtn:hover,.pn-lbtn.active{border-color:' + A + ';background:' + A + ';color:#fff}' +
            '.pn-cg{display:grid;grid-template-columns:1.4fr 1fr;gap:1rem}' +
            '.pn-fm label{display:block;font-weight:600;font-size:.85rem;margin-bottom:.3rem}' +
            '.pn-fm input,.pn-fm textarea{width:100%;border:2px solid #e2e8f0;border-radius:10px;padding:.65rem .9rem;font-size:.9rem;font-family:inherit;transition:.2s;margin-bottom:.8rem;outline:none}' +
            '.pn-fm input:focus,.pn-fm textarea:focus{border-color:' + A + ';box-shadow:0 0 0 3px ' + AR + '}' +
            '.pn-fm textarea{resize:vertical}' +
            '.pn-fgr{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}' +
            '.pn-fm button{background:' + A + ';color:#fff;border:none;border-radius:10px;padding:.7rem 1.5rem;font-weight:600;cursor:pointer;transition:.2s;width:100%;font-size:.9rem}' +
            '.pn-fm button:hover{background:' + AH + '}' +
            '.pn-ir{display:flex;align-items:center;gap:12px;margin-bottom:1rem}' +
            '.pn-ir:last-child{margin-bottom:0}' +
            '.pn-ii{color:' + A + ';font-size:1.1rem;width:20px;text-align:center}' +
            '.pn-ft{background:' + P + ';color:rgba(255,255,255,.5);text-align:center;padding:1rem;font-size:.8rem;margin-top:auto}' +
            '.pn-toast{position:fixed;bottom:24px;right:24px;background:#22c55e;color:#fff;padding:.8rem 1.2rem;border-radius:10px;font-weight:600;font-size:.9rem;z-index:9999;box-shadow:0 4px 20px rgba(34,197,94,.4);transform:translateY(20px);opacity:0;transition:.3s}' +
            '.pn-toast.show{transform:translateY(0);opacity:1}' +
            '@media(max-width:768px){' +
            '.pn-hero{padding:2rem 1.2rem}' +
            '.pn-hero h1{font-size:1.5rem}' +
            '.pn-tab span{display:none}' +
            '.pn-tab{padding:.5rem .7rem}' +
            '.pn-sg{grid-template-columns:repeat(2,1fr)}' +
            '.pn-tg,.pn-vg{grid-template-columns:1fr}' +
            '.pn-cg{grid-template-columns:1fr}' +
            '#pn-mc{height:300px}' +
            '.pn-fgr{grid-template-columns:1fr}' +
            '}';
        document.head.appendChild(s);
    }

})();
