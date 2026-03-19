/* Biaxial Character Plot — shared script for the Gender & Modernization cluster */
(function () {
    'use strict';
    var BASE_ICON_URL = 'https://faulkner.iath.virginia.edu/';
    var CHARACTERS = [
        { name: 'Elly',             alias: 'Elly',          icon: 'FWW-sq.png'   },  // White Female
        { name: 'Paul de Montigny', alias: 'Paul',          icon: 'mm-sm-sq.png' },  // Mixed White/Black Male
        { name: 'Emily Grierson',   alias: 'Emily',         icon: 'FWW-sq.png'   },  // White Female
        { name: 'Homer Barron',     alias: 'Homer',         icon: 'MWW-sq.png'   },  // White Male
        { name: 'Uncle Willy',      alias: 'Willy',         icon: 'MWW-sq.png'   },  // White Male
        { name: 'Mrs. Merridew',    alias: 'Mrs. Merridew', icon: 'FWW-sq.png'   },  // White Female
        { name: 'Quentin Compson',  alias: 'Quentin',       icon: 'MWW-sq.png'   },  // White Male
        { name: 'Boon Hogganbeck',  alias: 'Boon',          icon: 'MRW-sq.png'   }   // Mixed White/Native American Male
    ];
    var dragState = null;

    function findChar(name) {
        for (var i = 0; i < CHARACTERS.length; i++) {
            if (CHARACTERS[i].name === name) return CHARACTERS[i];
        }
        return { name: name, alias: name, icon: 'MWW-sq.png' };
    }

    function makeTokenContent(char, label) {
        var img = document.createElement('img');
        img.src = BASE_ICON_URL + char.icon;
        img.alt = char.name;
        img.className = 'biaxial-token-icon';
        var span = document.createElement('span');
        span.textContent = label;
        span.className = 'biaxial-token-label';
        var frag = document.createDocumentFragment();
        frag.appendChild(img);
        frag.appendChild(span);
        return frag;
    }

    function init() {
        var bank = document.getElementById('char-bank');
        var plot = document.getElementById('biaxial-plot');
        var saveBtn = document.getElementById('biaxial-save-btn');
        if (!bank || !plot || !saveBtn) return;

        CHARACTERS.forEach(function (char) {
            bank.appendChild(makeBankToken(char));
        });

        plot.addEventListener('dragover', function (e) { e.preventDefault(); });
        plot.addEventListener('drop', onDropToPlot);
        bank.addEventListener('dragover', function (e) { e.preventDefault(); });
        bank.addEventListener('drop', onDropToBank);
        saveBtn.addEventListener('click', saveAsImage);
    }

    function makeBankToken(char) {
        var el = document.createElement('div');
        el.dataset.name = char.name;
        el.className = 'biaxial-token biaxial-token-bank';
        el.appendChild(makeTokenContent(char, char.name));
        el.draggable = true;
        el.addEventListener('dragstart', function (e) {
            dragState = { name: char.name, source: 'bank', offsetX: 0, offsetY: 0 };
            e.dataTransfer.effectAllowed = 'move';
        });
        return el;
    }

    function makePlotToken(char) {
        var el = document.createElement('div');
        el.dataset.name = char.name;
        el.className = 'biaxial-token biaxial-token-plot';
        el.title = char.name;
        el.appendChild(makeTokenContent(char, char.alias));
        el.draggable = true;
        el.addEventListener('dragstart', function (e) {
            var rect = el.getBoundingClientRect();
            dragState = {
                name: char.name,
                source: 'plot',
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top
            };
            e.dataTransfer.effectAllowed = 'move';
        });
        el.addEventListener('dblclick', function () { returnToBank(char.name); });
        return el;
    }

    function onDropToPlot(e) {
        e.preventDefault();
        if (!dragState) return;
        var plot = document.getElementById('biaxial-plot');
        var rect = plot.getBoundingClientRect();
        var name = dragState.name;
        var source = dragState.source;
        var offsetX = dragState.offsetX;
        var offsetY = dragState.offsetY;
        dragState = null;

        var existing = plot.querySelector('.biaxial-token-plot[data-name="' + name + '"]');
        if (existing) existing.remove();

        var token = makePlotToken(findChar(name));
        plot.appendChild(token);

        var tokenW = token.offsetWidth;
        var tokenH = token.offsetHeight;
        var x, y;

        if (source === 'bank') {
            x = e.clientX - rect.left - tokenW / 2;
            y = e.clientY - rect.top  - tokenH / 2;
        } else {
            x = e.clientX - rect.left - offsetX;
            y = e.clientY - rect.top  - offsetY;
        }

        x = Math.max(0, Math.min(rect.width  - tokenW, x));
        y = Math.max(0, Math.min(rect.height - tokenH, y));

        token.style.left = (x / rect.width  * 100).toFixed(2) + '%';
        token.style.top  = (y / rect.height * 100).toFixed(2) + '%';

        if (source === 'bank') {
            var bankToken = document.querySelector('.biaxial-token-bank[data-name="' + name + '"]');
            if (bankToken) bankToken.style.visibility = 'hidden';
        }
    }

    function onDropToBank(e) {
        e.preventDefault();
        if (!dragState || dragState.source !== 'plot') return;
        returnToBank(dragState.name);
        dragState = null;
    }

    function returnToBank(name) {
        var plot = document.getElementById('biaxial-plot');
        var plotToken = plot.querySelector('.biaxial-token-plot[data-name="' + name + '"]');
        if (plotToken) plotToken.remove();
        var bankToken = document.querySelector('.biaxial-token-bank[data-name="' + name + '"]');
        if (bankToken) bankToken.style.visibility = '';
    }

    function saveAsImage() {
        var container = document.getElementById('biaxial-container');
        if (typeof html2canvas === 'undefined') {
            alert('Image export library not loaded. Try using your browser\'s screenshot tool instead (Windows: Win+Shift+S).');
            return;
        }
        html2canvas(container, { backgroundColor: '#ffffff', scale: 2, useCORS: true })
            .then(function (canvas) {
                var link = document.createElement('a');
                link.download = 'character-plot.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            })
            .catch(function () {
                alert('Could not save the image. Try using your browser\'s screenshot tool instead (Windows: Win+Shift+S).');
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
