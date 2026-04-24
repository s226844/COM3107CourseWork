
let schoolName = ["School of Business"
    ,"School of Communication"
    ,"School of Decision Science"
    ,"School of Humanities and Social Science"
    ,"School of Translation and Foreign Languages"
    ,"School of Transdisciplinary Studies"
    ,"Graduate School"];

let schoolLink = ["https://sbus.hsu.edu.hk",
    "https://scom.hsu.edu.hk",
    "https://sdsc.hsu.edu.hk",
    "https://shss.hsu.edu.hk",
    "https://stfl.hsu.edu.hk",
    "https://sts.hsu.edu.hk",
    "https://gs.hsu.edu.hk"
];

let discography = [
    {name: "Kasuga Mirai", songs:[
        {
            songNameEN: "Suteki na Kiseki",
            songNameJP: "素敵なキセキ",
            jacket: "/asset/ML/jacket/Mri001.png",
            spotify: "https://open.spotify.com/track/7cLygNHUCosY98igc5zxZZ",
            youtube: "https://music.youtube.com/watch?v=QNqNXKXir9E",
            iTunes: "https://music.apple.com/us/album/suteki-na-kiseki/1719936095?i=1719936100"

        },
        {
            songNameEN: "Mirai Hikou",
            songNameJP: "未来飛行",
            jacket: "/asset/ML/jacket/Mri002.png",
            spotify: "https://open.spotify.com/track/7ihZqv40nxJfBRDQiCeiCN",
            youtube: "https://music.youtube.com/watch?v=k_-cxBHMIFo&list=OLAK5uy_lLTcP0kxqOkPtaAzrKCg9Zi14Ff3m0Ab4",
            iTunes: "https://music.apple.com/jp/song/%E6%9C%AA%E6%9D%A5%E9%A3%9B%E8%A1%8C/1718503369"

        },
        {
            songNameEN: "Miraikei Dreamer",
            songNameJP: "未来系ドリーマ",
            jacket: "/asset/ML/jacket/Mri003.png",
            spotify: "https://open.spotify.com/track/6U65AxjJPG9y1hOYaN7G3f",
            youtube: "https://music.youtube.com/watch?v=NclM40X9U-s&list=OLAK5uy_lLTcP0kxqOkPtaAzrKCg9Zi14Ff3m0Ab4",
            iTunes: "https://music.apple.com/tw/song/%E6%9C%AA%E6%9D%A5%E7%B3%BB%E3%83%89%E3%83%AA%E3%83%BC%E3%83%9E%E3%83%BC/1720336486"

        },
    ]},
    {name: "Mogami Shizuka", songs:[
        {
            songNameEN: "Precious Grain",
            songNameJP: "Precious Grain",
            jacket: "/asset/ML/jacket/Shi001.png",
            spotify: "https://open.spotify.com/track/7tRxBAiPkFOR18Kxk0afxn",
            youtube: "https://music.youtube.com/watch?v=EKt7Ngdn3vQ",
            iTunes: "https://music.apple.com/jp/album/precious-grain/1718502609?i=1718502616"

        },
        {
            songNameEN: "Catch my dream",
            songNameJP: "Catch My Dream",
            jacket: "/asset/ML/jacket/Shi002.png",
            spotify: "https://open.spotify.com/track/6ClAkRafg3XE1hhYlVdBnh",
            youtube: "https://music.apple.com/jp/album/catch-my-dream/1718503136?i=1718503142",
            iTunes: "https://music.apple.com/jp/album/catch-my-dream/1718503136?i=1718503142"

        },
        {
            songNameEN: "SING MY SONG",
            songNameJP: "SING MY SONG",
            jacket: "/asset/ML/jacket/Shi003.png",
            spotify: "https://open.spotify.com/track/1jdq8Q283VASBufqUWWldk",
            youtube: "https://music.youtube.com/watch?v=Rs-hgpJzhmo",
            iTunes: "https://music.apple.com/jp/album/sing-my-song/1718881135?i=1718881140"

        },
    ]},
    {name: "Ibuki Tsubasa", songs:[
        {
            songNameEN: "Koi no Lesson Shokyuuhen",
            songNameJP: "恋のLesson初級編",
            jacket: "/asset/ML/jacket/Tbs001.png",
            spotify: "https://open.spotify.com/track/6eHKNXZ60n9kL8dXpugDTz",
            youtube: "https://music.youtube.com/watch?v=yhxuQGGWHTM",
            iTunes: "https://music.apple.com/us/album/suteki-na-kiseki/1719936095?i=1719936100"

        },
        {
            songNameEN: "Believe my change!",
            songNameJP: "Believe my change!",
            jacket: "/asset/ML/jacket/Tbs002.png",
            spotify: "https://open.spotify.com/track/3PY9PSUGrsUeFZ2NQCsAt2",
            youtube: "https://music.youtube.com/watch?v=9-7PvOMZXEA",
            iTunes: "https://music.apple.com/jp/album/believe-my-change/1718503122?i=1718503368"

        },
        {
            songNameEN: "Rocket Star☆",
            songNameJP: "ロケットスター☆",
            jacket: "/asset/ML/jacket/Tbs003.png",
            spotify: "https://open.spotify.com/track/1e0DHXLeziWJjICQSapDYx",
            youtube: "https://music.youtube.com/watch?v=pz7Gvs9zSBk",
            iTunes: "https://music.apple.com/jp/album/%E3%83%AD%E3%82%B1%E3%83%83%E3%83%88%E3%82%B9%E3%82%BF%E3%83%BC/1718881029?i=1718881032"

        },
    ]},

]

function draw(){
    // console.log(infoList.length);
    let index = Math.floor(Math.random() * schoolName.length);
    // console.log(index);
    // console.log(schoolName[index]);
    document.getElementById("result").innerText = schoolName[index];
    // setTimeout(() => {alert("Taking you to the school...");}, 5000);
    window.open(schoolLink[index], '_blank');
    // window.focus();
};

function showCharacterDetail(characterTitle){
    console.log(characterTitle);
}

function loadGlossaryDB(){
    GlossaryDB.init('glossary', {
        title: 'Game Character Glossary',
        searchPlaceholder: 'Search Character',
        noResultsText: 'No character found!',
        showStats: true, 
        theme: 'dark',
        columns: ['image', 'name', 'role', 'description'],
        data: [
            {name: 'Kasuga Mirai', role: 'idol', description: `Mirai Kasuga (春日未来 Kasuga Mirai) is an idol available in THE iDOLM@STER Million Live! Theater Days and originally debuted in the mobile game THE iDOLM@STER Million Live!.
She is seen as the protagonist and face of the Million Live! branch, as well as the main red representative of it. She forms the Million Live! main trio along with Shizuka Mogami and Tsubasa Ibuki as the unit Strawberry Pop Moon.
She is voiced by Haruka Yamazaki (山崎はるか Yamazaki Haruka).`, image: '/asset/ML/fullSize/Mi02_095.png'},
            {name: 'Mogami Shizuka', role: 'idol', description: ``, image: '/asset/ML/fullSize/Mi02_097.png'},
            {name: 'Ibuki Tsubasa', role: 'Angel', description: ``, image: '/asset/ML/fullSize/Mi02_099.png'},
        ]
    });
}

function swapModal(character, platform){
    console.log(platform);
    // modalDisc.classList.add('show');
    // document.body.style.overflow = 'hidden';
    loadDiscography(character, platform)
}

function loadDiscography(character, platform){
    songListTable = document.getElementById("tBody");
    songListTable.innerHTML = ``;
    console.log(character);
    console.log(platform);
    characterDisc = discography.find((element) => element.name == character);
    for (let i=0; i<discography.length; i++){
        
        songListTable.innerHTML += 
        `
        <tr>
            <th scope="row">${i}</th>
            <td><img src="${characterDisc.songs[i].jacket}"></td>
            <td>${characterDisc.songs[i].songNameEN}</td>
            <td>${characterDisc.songs[i].songNameJP}</td>
            <td><a href="${characterDisc.songs[i][platform]}"><button type="button" class="btn btn-primary" id="${platform}">${platform}  <i class="fa-brands fa-${platform}"></i></button></a></td>
        </tr>
        `
        console.log(`added ${i}`);
    };


}