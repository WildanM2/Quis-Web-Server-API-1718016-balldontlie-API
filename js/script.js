const baseUrl = "https://www.balldontlie.io/api/v1/";
const playerEndPoin = `${baseUrl}players`;
const teamEndPoin = `${baseUrl}teams`;
const matchEndPoin = `${baseUrl}games`;


const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");


function getListTeams(){
    title.innerHTML = "Daftar Tim NBA";
    fetch(teamEndPoin) 
    .then(response => response.json())
    .then(resJson=>{
        console.log(resJson.data);
        let data = "";
        resJson.data.forEach(dat => {
            data += `
                <li class="collection-item avatar">
                <img src="img/logo/${dat.abbreviation}.png" alt="" class="circle"> 
                   <p>Nama Klub: ${dat.full_name}<br>
                       Singkatan: ${dat.abbreviation}<br>
                        Kota: ${dat.city}<br>
                        Wilayah: ${dat.conference}<br>
                        Divisi: ${dat.division}
                    </p>
                    <a href="#modal" data-id="${dat.id}" class="secondary-content modal-trigger"><i class="material-icons " data-id="${dat.id}">info</i></a>
                   </li>
            `
        });
        contents.innerHTML = '<ul class="collection">' + data + '</ul>'
        const detail = document.querySelectorAll('.secondary-content');
        detail.forEach(btn => {
            btn.onclick = (event) => {
                let url = baseUrl + "teams/" + event.target.dataset.id;
                fetch(url)
                    .then(response => response.json())
                    .then(resDetail => {
                        dataModal = `
                        
                        <img src="img/logo/${resDetail.abbreviation}.png"  alt="" width="100px" align="center">
                       
                        <br><p>Nama Klub : ${resDetail.full_name}<br>
                        Kota : ${resDetail.city} <br>
                        Nama  : ${resDetail.name} <br>
                        Singkatan  : ${resDetail.abbreviation} <br>
                        Wilayah : ${resDetail.conference} <br>
                        Divisi : ${resDetail.division} <br>
                        </p>`
                        console.log(resDetail);
                        document.getElementById("nama-tim").innerHTML = resDetail.name;
                        document.getElementById("isi-info").innerHTML = dataModal;
                    })
                console.log(event.target.dataset.id);
                
            }
        })
    }).catch(err=>{
        console.error(err);
    })
}

function getListPlayers(){
    title.innerHTML = "Daftar Pemain NBA";
    fetch(playerEndPoin) 
    .then(response => response.json())
    .then(resJson=>{
        console.log(resJson.data);
        let data = "";
        resJson.data.forEach(dat => {
            data += `
                <li class="collection-item avatar">
                <img src="img/logo/${dat.team.abbreviation}.png" alt="" class="circle">
                    <p>Nama Pemain: ${dat.first_name} ${dat.last_name} <br>
                       Posisi: ${dat.position}<br>
                        Tim: ${dat.team.full_name}<br>
                        Wilayah: ${dat.team.conference}<br>
                        Divisi: ${dat.team.division}
                    </p>
                   </li>
            `
        });
        contents.innerHTML = '<ul class="collection">' + data + '</ul>'
    }).catch(err=>{
        console.error(err);
    })
}

function getListMatches(){
    title.innerHTML = "Hasil Pertandingan NBA";
    fetch(matchEndPoin)
    .then(response => response.json())
    .then(resJson=>{
        console.log(resJson.data);
        let data = "";
        let i = 1;
        resJson.data.forEach(match => {
            let d = new Date(match.date).toLocaleDateString("id");
            let scoreHomeTeam = (match.home_team_score==null?0:match.home_team_score);
            let scoreAwayTeam = (match.visitor_team_score==null?0:match.visitor_team_score);
            data += `
            <tr>
                <td style="padding-left:20px;">${i}.</td>
                <td><img src="img/logo/${match.home_team.abbreviation}.png" height="30" width="30" class="circle"<br>
                ${match.home_team.full_name} vs 
                ${match.visitor_team.full_name} <img src="img/logo/${match.visitor_team.abbreviation}.png" height="30" width="30" class="circle"<br></td>
                <td>${d}</td>
                <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
            </tr>
            `;
            i++;
        });
        contents.innerHTML = `
        <div class="card">
            <table class="stripped responsive-table">
                <thead> 
                    <th></th>
                    <th>Peserta</th>
                    <th>Tanggal</th>
                    <th>Skor Akhir</th>
                </thead>
                <tbody>
                    ${data}
                </tbody>
            </table>
        </div>
        `
    }).catch(err=>{
        console.error(err);
    })
}


function loadPage(page){
    switch(page){
        case "teams":
            getListTeams();
            break;
        case "matches":
            getListMatches();
            break;
        case "players":
            getListPlayers();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() { 
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(elm =>{
        elm.addEventListener("click", evt => {
            let sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        })
    })
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "teams";
    loadPage(page);
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var modalDetail = M.Modal.init(elems);
});
