let canvas = document.querySelector('canvas');
let dpi = window.devicePixelRatio;
let ctx = canvas.getContext('2d');




    let x = 50;
    let y = 50;
    let r = 10;
   let speed = 1;

    function animate(){
        ctx.beginPath();
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.stroke();
        ctx.strokeStyle = '#000';
        if(x > canvas.width -r/2 || x < 0 +r/2){
            speed = -speed;
        }
        x += speed;


        requestAnimationFrame(animate);
    }


    animate();
    
    

