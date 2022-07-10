const pause = document.querySelector('.controls .pause');
const snap = document.querySelector('.controls .snap');

pause.addEventListener('click',(e)=>{
  if((pause.children[0].classList[1]==='fa-pause')){
      noLoop();
      pause.children[0].classList.remove('fa-pause');
      pause.children[0].classList.add('fa-play');
  }else{
      loop();
      pause.children[0].classList.add('fa-pause');
      pause.children[0].classList.remove('fa-play');
  }
})

snap.addEventListener('click',(e)=>{
  saveCanvas('flowfile','png');
})