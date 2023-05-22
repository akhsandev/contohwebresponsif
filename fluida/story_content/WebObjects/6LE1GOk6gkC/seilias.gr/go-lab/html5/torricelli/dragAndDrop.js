/*!
* © by Sitsanlis Ilias
* This notice shall be included in all copies or substantial portions of the Software.
* Creative Commons 4.0/CC BY - NC - SA 4.0. 
*/


function mouseDownGen(e){var t=canvas.width,a=canvas.height;e.target.offset={x:e.target.x-e.stageX*(720/t),y:e.target.y-e.stageY*(420/a)},e.target.addEventListener("pressmove",pressMoveGen),cloneGraphs.removeAllChildren()}function pressMoveGen(e){var t=canvas.width,a=canvas.height,r=(e.stageX,e.target.offset.x,e.stageY*(420/a)+e.target.offset.y);if("ground"==e.target.name)360<r&&(r=360),r<Y0&&(r=Y0),xAxis.y=e.target.y=r,Hg=-(r-Y0)/yScale,restart();else if("liquid"==e.target.name){var g=Y0-Hg*yScale;Hg=-(g-r)/yScale,Hg<0&&(Hg=0,r=g),Y0=r,Y0<210&&(Y0=210,Hg=-(g-Y0)/yScale),initialize()}}function pressUpGen(e){if("ground"==e.target.name)Hg=Number(Hg.toFixed(1)),xAxis.y=e.target.y=Y0-Hg*yScale,restart();else if("liquid"==e.target.name){var t=Y0-Hg*yScale;Hg=Number(Hg.toFixed(1)),Y0=t+Hg*yScale,initialize()}e.target.removeEventListener("pressmove",pressMoveGen)}