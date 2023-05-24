/*!
* © by Sitsanlis Ilias
* This notice shall be included in all copies or substantial portions of the Software.
* Creative Commons 4.0/CC BY - NC - SA 4.0. 
*/
var Emin=.1,Emax=15;function updateValue_energy(e,n){Ep=Number(n),positions()}$(function(){$("#firePhoton").button({text:!0,icons:{}}).mousedown(function(){}).mouseup(function(){fireParticle()}),$("#energyCh").button({text:!1}).click(function(){energyContainer.visible=$("#energyCh").is(":checked"),stage.update()}),$("#clearCopy").button().click(function(){drawColorBox(),count=0,energyVectors.removeAllChildren(),restart()})}),$(function(){$("#energySpinner").spinner({min:Emin,max:Emax,step:.01,numberFormat:"n",spin:function(e,n){updateValue_energy(e,n.value)},change:function(e){updateValue_energy(e,this.value)}}).val(Ep),$("#energySpinner").keypress(function(e){13==e.which&&($(this).val()>Emax?$(this).val(Emax):$(this).val()<Emin&&$(this).val(Emin),e.preventDefault(),updateValue_energy(e,this.value))})});