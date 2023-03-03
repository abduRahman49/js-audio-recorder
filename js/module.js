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

const opts = {
  type: "audio/mp3; codecs=opus"
};



startRecord.addEventListener('click', (e) => {
  navigator.mediaDevices.getUserMedia({audio: true})
  .then(res => {
    /* après click sur le boutton enregister, crée un objet promise qui lorsqu'il est résolu retourne un objet 'res' de type MediStream qui
      sera utilisé pour créer un enregistreur avec la classe MediaRecorder
    */
    let recorder = new MediaRecorder(res);
    // l'enregistreur nommé recorder détient une méthode nommée start() permettant de démarrer un enregistrement
    recorder.start();
    console.log('Enregistrement a démarré...');
    e.target.style.cssText = 'background: red; color: black';

    /* l'objet recorder dispose d'un event listener qui écoute si des données son disponibles en entrée standard et les ajoute à la liste 
      dédiée à l'enregistrement des portions de données audio 'chunks'
    */
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    }

    stopRecord.addEventListener('click', (e) => {
      /* lorsque l'utilisateur clique sur le bouton arrêt enregistrement, cela appelle la méthode stop() de l'objet recorder qui arrête 
        l'enregistrement
      */
      recorder.stop();
      e.target.style.cssText = 'background: ""; color: ""';

    });

    /* l'objet recorder dispose d'un event listener qui écoute si l'enregistrement a cessé. Au cas échéant préparer l'audio pour l'afficher
      sur la page et l'écouter
    */
    recorder.onstop = () => {
      let audio = document.createElement('audio');
      audio.setAttribute('controls', true);
      /* crée un fichier audio en passant en au constructeur Blob un array de données brutes (binaires) ainsi que le type de fichier que l'on
        souhaite obtenir
      */
      let blob = new Blob(chunks, opts);
      
      let audioUrl = URL.createObjectURL(blob);
      audio.setAttribute('src', audioUrl);
      audioDiv.appendChild(audio);

      console.log('Enregistrement arrêté...');
      // création d'un objet de type fichier différent du blob qui sera utilisé pour alimenter la balise input
      const file = new File(chunks, "test.mp3", opts);
      // DataTransfer permet de récupérer les fichiers qui ont été déposé comme contenu web
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      // création de la balise input qui sera alimentée grâce à l'objet dataTransfer
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('id', 'myFile');
      input.files = dataTransfer.files;
      form.appendChild(input);
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