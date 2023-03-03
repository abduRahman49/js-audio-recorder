// formulaire, au cas où c'est utilisé
let form = document.getElementById('form');
// bouton pour enregistrer
let startRecord = document.getElementById('startRecord');
// bouton pour arrêter enregistrement
let stopRecord = document.getElementById('stopRecord');
// la div prévue pour contenir l'audio après enregistrement
let audioDiv = document.getElementById('audio');
// segments de données audio
let chunks = [];
// configuration liée au format que devra avoir le fichier audio après synthétisation
const opts = {
  type: "audio/mp3; codecs=opus"
};


// récupère l'élément input du formulaire et supprime son affichage
let inputFile = document.querySelector('#myFile');
inputFile.style.display = "none";
// récupère l'élément audio de la div en dessous du formulaire et supprime son affichage
let myAudio = document.querySelector('#myAudio');
myAudio.style.display = "none";

startRecord.addEventListener('click', (e) => {
  navigator.mediaDevices.getUserMedia({audio: true})
  .then(res => {
    /* après click sur le boutton enregister, crée un objet promise qui lorsqu'il est résolu retourne un objet 'res' de type MediStream qui
      sera utilisé pour créer un enregistreur avec la classe MediaRecorder
    */
    let recorder = new MediaRecorder(res);
    // l'enregistreur nommé recorder détient une méthode nommée start() permettant de démarrer un enregistrement
    if(recorder.state === "inactive"){
      // si l'utilisateur clique sur le bouton enregistrer la liste chunks sera vidée pour préparer un nouvel enregistrement
      chunks = [];
      recorder.start();
      console.log('Enregistrement a démarré...');
      e.target.style.cssText = 'background: red; color: black';

      /* l'objet recorder dispose d'un event listener qui écoute si des données son disponibles en entrée standard et les ajoute à la liste 
        dédiée à l'enregistrement des portions de données audio 'chunks'
      */
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      }
    }

    stopRecord.addEventListener('click', (e) => {
      /* lorsque l'utilisateur clique sur le bouton arrêt enregistrement, cela appelle la méthode stop() de l'objet recorder qui arrête 
        l'enregistrement
      */
      if(recorder.state === "recording" || recorder.state === "paused"){
        recorder.stop();
        e.target.style.cssText = 'background: ""; color: ""';
      }

    });

    /* l'objet recorder dispose d'un event listener qui écoute si l'enregistrement a cessé. Au cas échéant préparer l'audio pour l'afficher
      sur la page et l'écouter
    */
    recorder.onstop = () => {
      myAudio.setAttribute('controls', true);
      /* crée un fichier audio en passant en au constructeur Blob un array de données brutes (binaires) ainsi que le type de fichier que l'on
        souhaite obtenir
      */
      let blob = new Blob(chunks, opts);
      
      let audioUrl = URL.createObjectURL(blob);
      myAudio.setAttribute('src', audioUrl);
      myAudio.style.display = "initial";

      console.log('Enregistrement arrêté...');
      // création d'un objet de type fichier différent du blob qui sera utilisé pour alimenter la balise input
      const file = new File(chunks, "vocal.mp3", opts);
      // DataTransfer permet de récupérer les fichiers qui ont été déposé comme contenu web
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputFile.files = dataTransfer.files;
      inputFile.style.display = "initial";
    }

  })
  .catch(e => {
    // affiche un message à l'utilisateur dans le div si le périphérique audio n'a pas pu être capturé
    let message = document.createElement('span');
    message.textContent = e;
    audioDiv.appendChild(message);
  });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
})