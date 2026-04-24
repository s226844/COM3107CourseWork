document.addEventListener('DOMContentLoaded', () => {

    // =======================================================================
    //  PART 0: CONFIGURATION & PAGE SETUP
    // =======================================================================
    const defaultConfig = {
        title: "Default Title",
        subtitle: "Default subtitle."
    };
    const config = { ...defaultConfig, ...window.pageConfig };

    function injectMetaAndTitle() {
        document.title = config.title;
        if (!document.querySelector('meta[charset]')) {
            const charset = document.createElement('meta');
            charset.setAttribute('charset', 'UTF-8');
            document.head.appendChild(charset);
        }
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.setAttribute('name', 'viewport');
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            document.head.appendChild(viewport);
        }
    }

    function buildHTMLStructure() {
        const mainContainer = document.createElement('div');
        mainContainer.className = 'container';
        mainContainer.innerHTML = `
            <h1>${config.title}</h1>
            <p class="subtitle">${config.subtitle}</p>
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="🔍 Search by English or Chinese name...">
            </div>
            <div id="character-grid"></div>
        `;
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal';
        modalContainer.id = 'characterModal';
        // NEW: Added a <p> tag with an id of "modalIntro" to hold the introduction text.
        modalContainer.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" id="modalClose">&times;</span>
                <img id="modalImg" src="" alt="Character Image">
                <h2 id="modalEnglishName"></h2>
                <p id="modalChineseName" class="modal-chinese-name"></p>
                <p id="modalIntro" class="modal-intro"></p>
            </div>
        `;
        document.body.append(mainContainer, modalContainer);
    }

    injectMetaAndTitle();
    buildHTMLStructure();

    // =======================================================================
    //  PART 1: DYNAMICALLY INJECT STYLES
    // =======================================================================
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
        :root { --bg-color: #1a1a1d; --card-color: #2c2c34; --text-color: #f0f0f0; --accent-color: #00aaff; --shadow-color: rgba(0, 0, 0, 0.5); }
        body { font-family: 'Poppins', sans-serif; background-color: var(--bg-color); color: var(--text-color); margin: 0; padding: 2rem; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { text-align: center; font-size: 2.5rem; color: var(--accent-color); margin-bottom: 1rem; font-weight: 600; }
        p.subtitle { text-align: center; margin-top: -1rem; margin-bottom: 3rem; color: #aaa; }
        .search-container { margin-bottom: 2rem; }
        #searchInput { width: 100%; padding: 15px 20px; font-size: 1rem; background-color: var(--card-color); border: 2px solid #444; border-radius: 8px; color: var(--text-color); box-sizing: border-box; transition: border-color 0.3s ease; }
        #searchInput:focus { outline: none; border-color: var(--accent-color); }
        #character-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
        .character-card { background-color: var(--card-color); border-radius: 12px; overflow: hidden; cursor: pointer; box-shadow: 0 5px 15px var(--shadow-color); transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative; }
        .character-card:hover { transform: scale(1.05); box-shadow: 0 10px 25px var(--shadow-color); }
        .character-card img { width: 100%; height: 250px; object-fit: cover; display: block; }
        .character-card .name-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%); padding: 2rem 1rem 1rem 1rem; text-align: center; }
        .character-card h3 { margin: 0; font-size: 1.1rem; font-weight: 600; color: #fff; }
        .character-card .chinese-name { font-size: 0.9rem; color: #ccc; }
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.85); display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; z-index: 1000; padding: 1rem; box-sizing: border-box; }
        .modal.active { opacity: 1; visibility: visible; }
        .modal-content { background-color: var(--card-color); padding: 2rem; border-radius: 15px; max-width: 90%; width: 600px; text-align: center; position: relative; transform: scale(0.9); transition: transform 0.3s ease; }
        .modal.active .modal-content { transform: scale(1); }
        .modal-close { position: absolute; top: 15px; right: 20px; font-size: 2rem; color: #aaa; cursor: pointer; line-height: 1; transition: color 0.3s ease; }
        .modal-close:hover { color: var(--text-color); }
        .modal-content img { width: 100%; max-height: 350px; object-fit: contain; border-radius: 10px; margin-bottom: 1.5rem; }
        .modal-content h2 { font-size: 2rem; margin: 0; color: var(--accent-color); }
        .modal-content .modal-chinese-name { font-size: 1.2rem; color: #ccc; margin-top: 0.5rem; margin-bottom: 1.5rem; }
        /* NEW: Styles for the introduction text. */
        .modal-intro { font-size: 1rem; color: #ddd; text-align: left; line-height: 1.6; border-top: 1px solid #444; padding-top: 1.5rem; margin-top: 1.5rem; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // =======================================================================
    //  PART 2: SCRIPT LOGIC
    // =======================================================================
    if (typeof window.characterDatabase === 'undefined') {
        document.body.innerHTML = `<h1 style="color: red; text-align: center; padding: 2rem;">Database Error: 'characterDatabase' is not defined in index.html.</h1>`;
        return;
    }
    const grid = document.getElementById('character-grid');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('characterModal');
    const modalImg = document.getElementById('modalImg');
    const modalEnglishName = document.getElementById('modalEnglishName');
    const modalChineseName = document.getElementById('modalChineseName');
    const modalClose = document.getElementById('modalClose');
    const modalIntro = document.getElementById('modalIntro'); // NEW: Get the intro element.

    function renderCharacters(characters) {
        grid.innerHTML = '';
        if (!characters || characters.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #aaa;">No characters found.</p>`;
            return;
        }
        characters.forEach(char => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <img src="${char.picUrl}" alt="${char.englishName}" loading="lazy">
                <div class="name-overlay"><h3>${char.englishName}</h3><p class="chinese-name">${char.chineseName}</p></div>
            `;
            card.addEventListener('click', () => openModal(char));
            grid.appendChild(card);
        });
    }

    function openModal(character) {
        modalImg.src = character.picUrl;
        modalEnglishName.textContent = character.englishName;
        modalChineseName.textContent = character.chineseName;
        // NEW: Set the intro text. If a character has no intro, it will be blank.
        modalIntro.textContent = character.intro || "";
        modal.classList.add('active');
    }

    function closeModal() { modal.classList.remove('active'); }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCharacters = window.characterDatabase.filter(char => 
            char.englishName.toLowerCase().includes(searchTerm) ||
            char.chineseName.toLowerCase().includes(searchTerm)
        );
        renderCharacters(filteredCharacters);
    });
    
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    
    renderCharacters(window.characterDatabase);
});