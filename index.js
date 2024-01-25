

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}



let canvas = document.getElementById('backgroundCanvas');
let ctx = canvas.getContext('2d');

// Create an off-screen canvas (buffer)
var bufferCanvas = document.createElement('canvas');
bufferCanvas.width = canvas.width;
bufferCanvas.height = canvas.height;
var bufferCtx = bufferCanvas.getContext('2d');


let w = window.innerWidth;
let h = window.innerHeight;

resizeCanvas();

// Resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
window.onscroll = function() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    document.querySelector('.banner-image').style.top = -(scrollTop * 0.7) + 'px';
};


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bufferCanvas.width = window.innerWidth;
    bufferCanvas.height = window.innerHeight;
    
    w = canvas.width;
    h = canvas.height;
}

var mouseX = 0;
var mouseY = 0;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Event listener for mouse move
window.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    mouseX = mousePos.x;
    mouseY = mousePos.y;
    // You can also call a function here to do something with the mouse coordinates
}, false);

////////////////////////////////////////


class Particle
{
    x;
    y;
    vx;
    vy;
    color;

    constructor(x, y, vx, vy, color)
    {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
    }
}

let particles = [];
let count = 100;
let dist_connect = 150;
let speed = 1;
let max_speed = 2;

for (let i=0; i<count; i++)
{
    particles.push(new Particle(Math.random()*w,Math.random()*h,(Math.random()-0.5)*speed*2, (Math.random()-0.5)*speed*2, 'rgba(100,100,100,1)'));
}

bufferCtx.lineWidth = 0.5;

bufferCtx.lineCap = "round"

function update()
{
    bufferCtx.fillStyle = 'rgba(35,30,60,1)'
    bufferCtx.fillRect(0, 0, w, h);

    

    for (let i=0; i<count; i++)
    {
        let particle = particles[i];

        let dx = particle.x - mouseX;
        let dy = particle.y - mouseY;
        let d = Math.sqrt(dx*dx + dy*dy);

        if (d < 100)
        {
            let angle = Math.atan2(dy, dx);
            particle.vx -= Math.cos(angle) * 0.1;
            particle.vy -= Math.sin(angle) * 0.1;
        }

        if (particle.vx > max_speed) particle.vx = max_speed;
        if (particle.vx < -max_speed) particle.vx = -max_speed;
        if (particle.vy > max_speed) particle.vy = max_speed;
        if (particle.vy < -max_speed) particle.vy = -max_speed;

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -100) particle.x += w+200;
        else if (particle.x > w+100) particle.x -= w+200;
        if (particle.y < -100) particle.y += h+200;
        else if (particle.y > h+100) particle.y -= h+200;


        for (let j=i; j<count; j++)
        {
            if (i == j) continue;
            let particle2 = particles[j];

            dx = particle2.x - particle.x;
            dy = particle2.y - particle.y;
            let d2 = Math.sqrt(dx*dx + dy*dy);

            if (d2 < dist_connect)
            {
                let nearness = (dist_connect - d2) / dist_connect;
                //bufferCtx.strokeStyle = 'rgba('+ ((d < dist_connect) ? 100 : 150) +',' + ((d < dist_connect) ? 50 : 150) + ','+((d < dist_connect) ? 255 : 150)+',' + nearness +  ')';
                bufferCtx.strokeStyle = 'rgba(255,255,255,'+nearness+')';
                bufferCtx.beginPath();
                bufferCtx.moveTo(particle.x, particle.y);
                bufferCtx.lineTo(particle2.x, particle2.y);
                bufferCtx.stroke();
            }
        }


        bufferCtx.fillStyle = (d < 100) ? 'white' : 'white'; //particle.color;
        //ctx.fillStyle = particle.color;
        bufferCtx.beginPath();
        bufferCtx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
        bufferCtx.fill();
    }

    // Draw the buffer onto the main canvas
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(bufferCanvas, 0, 0);

    requestAnimationFrame(update);
}





/////////////////////////////////////////

update();

