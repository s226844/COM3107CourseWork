/**
 * GlossaryDB v1.0
 * A lightweight, customizable glossary/database card library
 * 
 * Usage:
 *   <div id="myGlossary"></div>
 *   <script src="glossarydb.js"></script>
 *   <script>
 *     GlossaryDB.init('myGlossary', { title: 'My Database', data: [...] });
 *   </script>
 */
const GlossaryDB = (function() {
    'use strict';

    const themes = {
        dark: {
            bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            textPrimary: '#fff',
            textSecondary: '#ccc',
            cardBg: '#fff',
            cardTitle: '#1a1a2e',
            cardSubtitle: '#666',
            cardText: '#444',
            hoverGlow: 'rgba(100,200,255,0.4)',
            modalBg: 'rgba(0,0,0,0.9)'
        },
        light: {
            bgGradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            textPrimary: '#333',
            textSecondary: '#666',
            cardBg: '#fff',
            cardTitle: '#1a1a2e',
            cardSubtitle: '#666',
            cardText: '#444',
            hoverGlow: 'rgba(100,150,255,0.3)',
            modalBg: 'rgba(0,0,0,0.85)'
        },
        ocean: {
            bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            textPrimary: '#fff',
            textSecondary: '#a0d2db',
            cardBg: 'rgba(255,255,255,0.95)',
            cardTitle: '#203a43',
            cardSubtitle: '#2c5364',
            cardText: '#444',
            hoverGlow: 'rgba(160,210,219,0.5)',
            modalBg: 'rgba(15,32,39,0.95)'
        },
        sunset: {
            bgGradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
            textPrimary: '#4a2c2a',
            textSecondary: '#6b4442',
            cardBg: '#fff',
            cardTitle: '#4a2c2a',
            cardSubtitle: '#8b5a5a',
            cardText: '#5a3a3a',
            hoverGlow: 'rgba(238,156,167,0.5)',
            modalBg: 'rgba(74,44,42,0.9)'
        },
        forest: {
            bgGradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
            textPrimary: '#fff',
            textSecondary: '#d4edda',
            cardBg: 'rgba(255,255,255,0.95)',
            cardTitle: '#134e5e',
            cardSubtitle: '#2d6a4f',
            cardText: '#444',
            hoverGlow: 'rgba(113,178,128,0.5)',
            modalBg: 'rgba(19,78,94,0.95)'
        },
        purple: {
            bgGradient: 'linear-gradient(135deg, #360033 0%, #0b8793 100%)',
            textPrimary: '#fff',
            textSecondary: '#e0aaff',
            cardBg: 'rgba(255,255,255,0.95)',
            cardTitle: '#360033',
            cardSubtitle: '#7b2cbf',
            cardText: '#444',
            hoverGlow: 'rgba(224,170,255,0.5)',
            modalBg: 'rgba(54,0,51,0.95)'
        }
    };

    function injectStyles(theme) {
        if (document.getElementById('glossarydb-styles')) {
            document.getElementById('glossarydb-styles').remove();
        }
        
        const c = themes[theme] || themes.dark;

        const style = document.createElement('style');
        style.id = 'glossarydb-styles';
        style.textContent = `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            .gdb-container {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                background: ${c.bgGradient};
                min-height: 100vh;
                padding: 20px;
            }
            .gdb-title {
                text-align: center;
                color: ${c.textPrimary};
                margin-bottom: 25px;
                font-size: 2.2rem;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .gdb-search-box {
                max-width: 500px;
                margin: 0 auto 30px;
                position: relative;
            }
            .gdb-search {
                width: 100%;
                padding: 15px 20px 15px 50px;
                font-size: 18px;
                border: none;
                border-radius: 30px;
                background: #fff;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                outline: none;
                transition: box-shadow 0.3s, transform 0.3s;
            }
            .gdb-search:focus {
                box-shadow: 0 6px 25px ${c.hoverGlow};
                transform: translateY(-2px);
            }
            .gdb-search-icon {
                position: absolute;
                left: 18px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 20px;
                opacity: 0.5;
            }
            .gdb-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                gap: 25px;
                max-width: 1400px;
                margin: 0 auto;
                padding: 10px;
            }
            .gdb-card {
                background: ${c.cardBg};
                border-radius: 16px;
                padding: 25px 20px;
                text-align: center;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                cursor: default;
            }
            .gdb-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 15px 40px ${c.hoverGlow};
            }
            .gdb-card.hidden { display: none; }
            .gdb-avatar {
                width: 130px;
                height: 130px;
                margin: 0 auto 18px;
                border-radius: 50%;
                object-fit: cover;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 4px solid #f0f0f0;
                background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
            }
            .gdb-avatar:hover {
                transform: scale(1.12);
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            }
            .gdb-card-title {
                color: ${c.cardTitle};
                margin-bottom: 6px;
                font-size: 1.25rem;
                font-weight: 700;
            }
            .gdb-card-subtitle {
                color: gdb-card-subtitlec.cardSubtitle};
                font-gdb-card-subtitle: 14px;
                margin-bottom: 12px;
                font-weight: 600;
                // text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .gdb-card-text {
                color: ${c.cardText};
                font-size: 14px;
                line-height: 1.6;
            }
            .gdb-no-results {
                text-align: center;
                color: ${c.textPrimary};
                font-size: 22px;
                padding: 60px 20px;
                display: none;
            }
            .gdb-no-results.show { display: block; }
            .gdb-no-results-icon { font-size: 50px; margin-bottom: 15px; }
            .gdb-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${c.modalBg};
                z-index: 10000;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                padding: 20px;
                backdrop-filter: blur(5px);
            }
            .gdb-modal.show { display: flex; }
            .gdb-modal-img {
                max-width: 90%;
                max-height: 55vh;
                border-radius: 12px;
                box-shadow: 0 10px 50px rgba(255,255,255,0.15);
                background: #fff;
                object-fit: contain;
            }
            .gdb-modal-title {
                color: #fff;
                font-size: 2rem;
                margin-top: 25px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                font-weight: 700;
            }
            .gdb-modal-subtitle {
                color: #ccc;
                margin-top: 8px;
                font-size: 1.1rem;
                // text-transform: uppercase;
                letter-spacing: 1px;
            }
            .gdb-modal-text {
                color: #bbb;
                margin-top: 15px;
                font-size: 15px;
                max-width: 600px;
                text-align: center;
                line-height: 1.7;
            }
            .gdb-modal-close {
                position: absolute;
                top: 20px;
                right: 30px;
                color: #fff;
                font-size: 45px;
                cursor: pointer;
                transition: color 0.3s, transform 0.3s;
                line-height: 1;
                font-weight: 300;
            }
            .gdb-modal-close:hover {
                color: #ff6b6b;
                transform: scale(1.15) rotate(90deg);
            }
            .gdb-stats {
                text-align: center;
                color: ${c.textSecondary};
                margin-bottom: 20px;
                font-size: 14px;
            }
            @media (max-width: 768px) {
                .gdb-title { font-size: 1.6rem; }
                .gdb-search { font-size: 16px; padding: 12px 16px 12px 45px; }
                .gdb-grid { gap: 18px; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
                .gdb-card { padding: 18px 15px; }
                .gdb-avatar { width: 100px; height: 100px; }
                .gdb-card-title { font-size: 1.1rem; }
                .gdb-modal-title { font-size: 1.5rem; }
                .gdb-modal-close { top: 15px; right: 20px; font-size: 35px; }
            }
        `;
        document.head.appendChild(style);
    }

    function createPlaceholder(text, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const charCode = text.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const hue = charCode % 360;
        
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, `hsl(${hue}, 70%, 65%)`);
        gradient.addColorStop(1, `hsl(${(hue + 40) % 360}, 70%, 55%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${size * 0.4}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2);
        
        return canvas.toDataURL();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function init(containerId, config) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('GlossaryDB: Container "' + containerId + '" not found');
            return null;
        }

        const settings = Object.assign({
            title: 'Glossary',
            searchPlaceholder: 'Search...',
            noResultsText: 'No results found!',
            showStats: true,
            theme: 'dark',
            columns: ['image', 'title', 'subtitle', 'description', 'type', 'agency'],
            data: []
        }, config);

        injectStyles(settings.theme);

        const statsHtml = settings.showStats 
            ? `<div class="gdb-stats">${settings.data.length} characters</div>
               <div class="gdb-stats">共有${settings.data.length}名各角色</div>` 
            : '';

        container.innerHTML = `
            <div class="gdb-container">
                <h1 class="gdb-title">${escapeHtml(settings.title)}</h1>
                <div class="gdb-search-box">
                    <span class="gdb-search-icon">🔍</span>
                    <input type="text" class="gdb-search" placeholder="${escapeHtml(settings.searchPlaceholder)}">
                </div>
                ${statsHtml}
                <div class="gdb-grid"></div>
                <div class="gdb-no-results">
                    <div class="gdb-no-results-icon">😕</div>
                    ${escapeHtml(settings.noResultsText)}
                </div>
                <div class="gdb-modal">
                    <span class="gdb-modal-close">&times;</span>
                    <img class="gdb-modal-img" src="" alt="">
                    <div class="gdb-modal-title"></div>
                    <div class="gdb-modal-subtitle"></div>
                    <div class="gdb-modal-text"></div>
                    <div class="modal-body gdb-modal-text">
                    <p>Solo Discography : </p>
                    <a href="#songList"><button type="button" class="btn btn-primary" id="spotify" onlclick="swapModal('spotify')">Spotify  <i class="fa-brands fa-spotify"></i></button></a>
                    <a href="#songList"><button type="button" class="btn btn-primary" id="youtube" onlclick="swapModal('youtube')">Youtube  <i class="fa-brands fa-youtube"></i></button></a>
                    <a href="#songList"><button type="button" class="btn btn-primary" id="iTunes" onlclick="swapModal('itunes')">iTunes  <i class="fa-brands fa-itunes"></i></button></a>
                  </div>
                </div>
            </div>
        `;

        const grid = container.querySelector('.gdb-grid');
        const searchInput = container.querySelector('.gdb-search');
        const noResults = container.querySelector('.gdb-no-results');
        const statsEl = container.querySelector('.gdb-stats');
        const modal = container.querySelector('.gdb-modal');
        const modalDisc = container.querySelector('.modalDisc');
        const modalImg = container.querySelector('.gdb-modal-img');
        const modalTitle = container.querySelector('.gdb-modal-title');
        const modalSubtitle = container.querySelector('.gdb-modal-subtitle');
        const modalText = container.querySelector('.gdb-modal-text');
        const closeBtn = container.querySelector('.gdb-modal-close');

        const [imgCol, titleCol, subtitleCol, descCol, typeCol, agencyCol] = settings.columns;

        settings.data.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'gdb-card';
            
            const imgSrc = item[imgCol] || '';
            const title = item[titleCol] || '';
            const subtitle = `Voiced by: ` + item[subtitleCol] || '';
            const description = item[descCol] || '';
            // const type = item[typeCol] || '';
            // const agency = item[agencyCol] || '';

            card.innerHTML = `
                <img class="gdb-avatar"
                     src="${imgSrc || createPlaceholder(title || '?', 130)}" 
                     alt="${escapeHtml(title)}">
                <div class="gdb-card-title">${escapeHtml(title)}</div>
                ${subtitle ? `<div class="gdb-card-subtitle">${escapeHtml(subtitle)}</div>` : ''}
                ${description ? `<div class="gdb-card-text">${escapeHtml(description)}</div>` : ''}
                `;
                
                // ${type ? `<div class="gdb-card-subtitle">${escapeHtml(type)}</div>` : ''}
                // ${agency ? `<div class="gdb-card-subtitle">${escapeHtml(agency)}</div>` : ''}
            card.dataset.search = `${title} ${subtitle} ${description}`.toLowerCase();
            card.dataset.title = title;
            card.dataset.subtitle = subtitle;
            card.dataset.description = description;

            const img = card.querySelector('.gdb-avatar');
            img.onerror = function() {
                this.src = createPlaceholder(title || '?', 130);
            };


            
            
            img.onclick = function() {
                modalImg.src = this.src;
                modalTitle.textContent = title;
                modalSubtitle.textContent = subtitle;
                modalText.textContent = description;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
                // console.log(title);
                showCharacterDetail(title);
            };
            
            grid.appendChild(card);
        });
        
        const discBtn = modal.getElementsByClassName('btn btn-primary');
        for (let i=0; i<discBtn.length; i++){
            discBtn[i].onclick = function(){

                closeModal();
                swapModal(modalTitle.innerText, this.id);
            };
        }

        // discBtn.forEach((btn) => {
        // })

        function performSearch() {
            const term = searchInput.value.toLowerCase().trim();
            const cards = grid.querySelectorAll('.gdb-card');
            let found = 0;

            cards.forEach(card => {
                if (card.dataset.search.includes(term)) {
                    card.classList.remove('hidden');
                    found++;
                } else {
                    card.classList.add('hidden');
                }
            });

            noResults.classList.toggle('show', found === 0);
            if (statsEl) {
                statsEl.textContent = term 
                    ? `${found} of ${settings.data.length} characters` 
                    : `${settings.data.length} characters`;
            }
        }

        searchInput.addEventListener('input', performSearch);

        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

        function closeDiscModal() {
            modalDisc.classList.remove('show');
            document.body.style.overflow = '';
        }

        closeBtn.onclick = closeModal;
        modal.onclick = function(e) {
            if (e.target === modal) closeModal();
        };
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

        return {
            search: function(term) {
                searchInput.value = term;
                performSearch();
            },
            clear: function() {
                searchInput.value = '';
                performSearch();
            },
            getCount: function() {
                return settings.data.length;
            },
            refresh: function(newData) {
                settings.data = newData;
                init(containerId, settings);
            }
        };
    }

    return { 
        init: init,
        version: '1.0.0',
        themes: Object.keys(themes)
    };
})();

// Support for module exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlossaryDB;
}
