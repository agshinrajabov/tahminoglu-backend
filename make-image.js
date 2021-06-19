
module.exports = function(date, time, home, away, bet) {

    var fs = require('fs')
    var path = require('path')
    var Canvas = require('canvas')
    
    function fontFile (name) {
      return path.join(__dirname, '/fonts/', name)
    }
    
Canvas.registerFont(fontFile('OpenSans-SemiBold.ttf'), {family: 'OpenSans'})
Canvas.registerFont(fontFile('OpenSans-Bold.ttf'), {family: 'OpenSansBold'})

var canvas = Canvas.createCanvas(1080, 1080)
var ctx = canvas.getContext('2d')
var ctx2 = canvas.getContext('2d');
var ctx3 = canvas.getContext('2d');
var ctx4 = canvas.getContext('2d');

var Image = Canvas.Image;
var img = new Image();
img.src = 'post.jpg';

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#d7d7d7';
ctx.textAlign = 'left';
ctx.font = '22pt OpenSans'
ctx.fillText(date, 70, 337)

ctx2.fillStyle = '#525252';
ctx2.textAlign = 'right';
ctx2.font = '42pt OpenSansBold'
ctx2.fillText(time, 990, 362);

ctx3.fillStyle = '#525252';
ctx3.textAlign = 'left';
ctx3.font = '45pt OpenSansBold'
ctx3.fillText(home, 70, 457);

ctx4.fillStyle = '#525252';
ctx4.textAlign = 'left';
ctx4.font = '45pt OpenSansBold'
ctx4.fillText(away,70, 540);

ctx4.fillStyle = 'white';
ctx4.textAlign = 'right';
ctx4.font = '40pt OpenSansBold'
ctx4.fillText(bet,990, 856);

canvas.createJPEGStream().pipe(fs.createWriteStream(path.join(__dirname, 'dist/' + home + '_' + away + '.jpg')))
}