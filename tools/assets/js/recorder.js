let record_btn = document.querySelector(".record-btn")
let stop_btn = document.querySelector(".stop-btn")

record_btn.addEventListener("click", async function () {

  try {

    window.stream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    })

    stop_btn.onclick = () => {
      stream.getTracks().forEach(track => track.stop());
      document.querySelector('.stop-btn').classList.toggle('hide');
      document.querySelector('.record-btn').classList.toggle('hide');
    };

    //needed for better browser support
    const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9") 
               ? "video/webm; codecs=vp9" 
               : "video/webm"
      let mediaRecorder = new MediaRecorder(stream, {
          mimeType: mime
      })

      let chunks = []
      mediaRecorder.addEventListener('dataavailable', function(e) {
          chunks.push(e.data)
      })

      mediaRecorder.addEventListener('stop', function(){
        let blob = new Blob(chunks, {
            type: chunks[0].type
        })
        let url = URL.createObjectURL(blob)

        let video = document.querySelector("#video")
        video.src = url

        video.style.display = 'block';

        let a = document.createElement('a')
        a.href = url
        a.download = 'video.webm'
        a.click()
    })

    mediaRecorder.start()
    document.querySelector('.record-btn').classList.toggle('hide');
    document.querySelector('.stop-btn').classList.toggle('hide');
    
  } catch(err) {
    console.error("Error: " + err);
  }
});