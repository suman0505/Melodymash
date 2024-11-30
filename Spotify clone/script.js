console.log('lets write js');
let currentSong = new Audio();
// const BASE_PATH = (`/Spotify clone/${currFolder/`);
let songs;
let currFolder;


function secondsToMinutes(seconds){
    if(isNaN(seconds)|| seconds<0){
        return "00:00";
    }
    const minutes= Math.floor(seconds/60);
    const remngsec= Math.floor(seconds%60);
    const formattedMinutes= String(minutes).padStart(2,'0');
    const formattedSeconds =  String(remngsec).padStart(2,'0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

//to get all the songs from the songs folder/directory,ideally when we will use backend then we will use api call method 
async function getSongs(folder){
    currFolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    // (`http://127.0.0.1:3000/Spotify%20clone/${folder}/`)
    let response= await a.text();
    console.log(response);
    let div= document.createElement("div")
    div.innerHTML=response;
    let as= div.getElementsByTagName("a")
    
    let songs= []
    
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`${folder}/`)[1]);
        }
        
    }

    //play the first song in the playlist

    //show all the songs in the playlist
let songUl= document.querySelector(".songList").getElementsByTagName("ul")[0]
songUl.innerHTML=""//when clicked on card , shows that folder songs do not append in the same list 

for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li> 
                         
                        <div class="info">
                           <div> ${song.replaceAll("%20"," ")}</div>
                           <div></div>
                        </div> 

                      <div class="playnow">
                        <span>
                            Play Now
                        </span>
                        <img class="invert" src="play.svg" alt="" srcset="">
                      </div>

                    </li>`;
}
//attach an event listener to each song
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        console.log( ( e.querySelector(".info").firstElementChild.innerHTML))
        playMusic( e.querySelector(".info").firstElementChild.innerHTML)
    })              
})
    
   return songs; 
}
const playMusic=(track,pause=false)=>{
    //let audio=new Audio("/songs/"+ track)
//     currentSong.src= "/Spotify clone/songs/"+ track;
//   currentSong.play()
      

const trimmedTrack = track.trim(); // Remove leading/trailing spaces
currentSong.src = `/${currFolder.replace(/^\/|\/$/g, '')}/` + encodeURIComponent(trimmedTrack);


console.log("Playing:", currentSong.src);

if(!pause){
currentSong.play().catch((error) => {
    play.src="pause.svg"
    console.error("Playback error:", error);
    alert("Could not play the audio. Check the file path or server configuration.");

});
}

document.querySelector(".songinfo").innerHTML=decodeURI( track)
document.querySelector(".songtime").innerHTML="00:00/00:00"


currentSong.onerror = () => {
    console.error("Error: Unable to play the audio file.");
    alert("Audio file not found: " + currentSong.src);
};


}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    // (`http://127.0.0.1:3000/Spotify%20clone/${folder}/`)
    let response= await a.text();
    let div= document.createElement("div")
    div.innerHTML=response;
   
    let cardContainer= document.querySelector(".cardContainer")
    
    
    let anchors = Array.from(div.getElementsByTagName("a"));
    for (let index = 0; index < anchors.length; index++) {
      const e=anchors[index];
      if(e.href.includes("/songs")){
        let folder =  e.href.split("/").slice(-2)[0]
        //get the metadata of folder
        let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
        let response= await a.json();
        cardContainer.innerHTML= cardContainer.innerHTML+ ` <div  data-folder="${folder}" class="card">
                         <div class="play">
                             <img src="play.svg" alt="Play">
                         </div>
                         <img src="/songs/${folder}/cover.jpg" alt="">
                         <h2>${response.title}</h2>
                         <p>${response.description}</p>
                     </div>`;
                     console.log("Card added with folder:", folder); // Debugging added

 
 
     }
     
    }
    console.log("Albums displayed. Cards added to DOM."); // Place the log here
    
    
    //load playlist whenever card is clicked
   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        const folder = item.currentTarget.dataset.folder;
        console.log("Clicked folder:", folder); // Debug
        songs= await getSongs(`songs/${ folder}`);
        if (songs.length > 0) {
            playMusic(songs[0]); // Play the first song
        } else {
            console.error("No songs found in the folder:", folder);
            alert("No songs available to play.");
        }
       
      
    })
})
    

        
    }
    
      

   



async function main(){
   
    //get the list of all songs
     songs = await getSongs( "songs/ncs");
    playMusic(songs[0],true);

    //display all the albums on the page
    displayAlbums()
   

    

    //attach an event listener to previous,next and play
    play.addEventListener("click",()=>{
        //if audio is playing then it will be paused and if paused then will be played
        if(currentSong.paused){
            currentSong.play()
            play.src="pause.svg"
        }
        else{
            currentSong.pause()
            play.src="play.svg"
        }

    })

    //listen for timeupdat eevent
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)*100 + "%";  //in percentage//
        
    })

    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent= (e.offsetX/e.target.getBoundingClientRect().width) *100 //to move the seekbar where you have clicked
        document.querySelector(".circle").style.left = percent +"%";
        currentSong.currentTime = (currentSong.duration * percent) /100// to change the time accordingly when you have moved the seekbar
    })

    //add an event listener for hamburger
   document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
   })

       //add an event listener for close button
       document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
       })

       //add an event listener to prev and next
       previous.addEventListener("click",()=>{
        currentSong.pause();
        console.log("prevs clicked");
        console.log(songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1))));
        

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]));
        if((index-1) >= 0 ){
        playMusic(songs[index-1])
      }
        
              

       })
       next.addEventListener("click",()=>{
        currentSong.pause();
        console.log("next clicked");
        
       let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]));
       if (index + 1 < songs.length) {
        playMusic(songs[index + 1]); // Play the next song
    } else {
        console.log("Already at the last song");
    }
})  

//add an event to volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log("setting volume to ",e.target.value,"/100");
    
   currentSong.volume = parseInt(e.target.value)/100
    
})

//add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src=  e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        currentSong.volume=0.1;
        e.target.src=  e.target.src.replace("mute.svg","volume.svg")
    }
})


}
main();