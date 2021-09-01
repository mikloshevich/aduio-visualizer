const ctx = new AudioContext();
const analyser = ctx.createAnalyser();
const body = document.querySelector('body');

const num = 128;
const width = 0.2;

let barHeight;

for(let i = 0 ; i < num ; i++){
    bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.background = 'white';
    // bar.style.backgroundColor = 'hsl('+ i +',100%,50%)';
    bar.style.minWidth = width + 'vw';
    // bar.style.minHeight = 2 + 'px';
    body.appendChild(bar);
}

let bars = document.getElementsByClassName('bar');
// console.log(bars);

setupContext()
drawVisualizer()

/*create source*/
async function setupContext() {
    const input = await getInput()
    if(ctx.state === 'suspended'){
        await ctx.resume()
    }
    // console.log(ctx.state)
    const src = ctx.createMediaStreamSource(input)
    src.connect(analyser)
}

/*get sound from user*/
function getInput() {
    return navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancelation: false,
            autoGainControl: false,
            noiseSuppresion: false,
            latency: 0
        }
    })
}

/*drawing bars*/
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer)

    const array = new Uint8Array(num)
    analyser.getByteFrequencyData(array)
    // console.log(array)
    for(let i = 0; i < num; i++){
        barHeight = array[i];
        // console.log(barHeight);
        // bars[i].style.minHeight = barHeight + 'px';
        bars[i].style.transform = 'scaleY('+ barHeight / 100 + ')';
        // bars[i].style.backgroundColor = 'hsl('+ barHeight * 3 +',100%,50%)';
        bars[i].style.opacity = 0.008 * barHeight;
    }
}