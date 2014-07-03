

// global audio variables
var audioContext;
var arraybuffer;
var fftObject;
var audioSource;
var samples = 1024;

// global svg variable
var svg;

//Audio Handling here

function loadFile(mp3file){
  var request = new XMLHttpRequest();
  request.open("GET", mp3file, true);
  request.responseType = "arraybuffer";
  request.onload = function(){
    audioContext.decodeAudioData(request.response, function(buffer){
      audioBuffer = buffer;
      setAudioHandlers();
    });
  };
  request.send();
}


function setAudioHandlers() {

  var audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  fftObject = audioContext.createAnalyser();
  fftObject.fftSize = samples;
  audioSource.connect(fftObject);
  fftObject.connect(audioContext.destination);
  audioSource.noteOn(0);//Start playing now

  var data = new Uint8Array(samples);

  setInterval(function(){
    fftObject.getByteFrequencyData(data);
    d3Project(data)
  }, 10)//repeat rendering project
}

var colorGradient = d3.scale.linear()
    .domain([0.5, 0.75, 1])
    .range(['#ff0000','#0000ff','#00ff00']);

function d3Project(data){

  svg.selectAll('circle')
      .data(data)
      .enter()
        .append('circle');

  svg.selectAll('circle')
      .data(data)
        .attr('r', function(d){ return d/15 +'px'})
        .attr('cx', function(y, x){ return (100-(data.length/(x+1)))+'%'})
        .attr('cy', function(d){ return Math.abs(500-d*2) +'px'})
        .attr('class','bubble')
        .style('fill',function(d){ return colorGradient(120/d) })
        .style('opacity', function(d){ return d/200 });

    return svg;
}

// **** on load ****
window.onload = function(){

  svg = d3.select('body')
          .append('svg')
            .attr('width', '100%')
            .attr('height', '80%');

  audioContext = new webkitAudioContext();
  loadFile('audio/aeroPlane.m4a');
}


