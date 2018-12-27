var canvas = document.getElementById("iasClockCanvas");
ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90;
minutes_flag=false;
meetingArr=[];
function drawLines(ctx,radius){
	ctx.beginPath();
	ctx.strokeStyle="#eee";
	ctx.lineWidth=1;
	ctx.arc(0,0,radius+4,0,2*Math.PI);
	ctx.arc(0,0,radius-2,0,2*Math.PI);
	ctx.stroke();
}
function clearMeetingArea(ctx,radius){
	ctx.beginPath();
	ctx.strokeStyle="white";
	ctx.lineWidth=5;
	ctx.arc(0,0,radius+4,0,2*Math.PI);
	ctx.arc(0,0,radius-2,0,2*Math.PI);
	ctx.stroke();
}
function drawClock() {
  drawFace(ctx, radius);
  if(minutes_flag){
  drawMins(ctx,radius);
  }
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
alarm();
}

function drawFace(ctx, radius) {
  ctx.beginPath();
  ctx.shadowBlur=0;
  ctx.shadowOffsetX= 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#CCC';
  ctx.arc(0, 0, radius*0.95, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx.fillStyle = '#000';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius*0.15 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  for(num = 1; num < 13; num++){
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
}
function drawMins(ctx,radius){
	var i=3;
	for(i=0;i<60;i++){
		if(i%5!=0){
			ctx.beginPath();
			ctx.shadowBlur=0;
			ctx.shadowOffsetX= 0;
			ctx.shadowOffsetY = 0;
			ctx.lineWidth = 5;
			ctx.lineCap="square";
			ctx.arc(0,0,radius*0.87,i*(0.5/15)*Math.PI,i*(0.5/15)*Math.PI);
			ctx.stroke();
		}
	}
}
function drawTime(ctx, radius){
    ctx.beginPath();
	var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    ctx.shadowBlur=0;
	ctx.shadowOffsetX= 0;
    ctx.shadowOffsetY = 0;
	//hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
	ctx.strokeStyle="#333";
    drawHand(ctx, hour, radius*0.5, radius*0.07);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.8, radius*0.07);
    // second
    second=(second*Math.PI/30);
    drawHand(ctx, second, radius*0.9, radius*0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
	ctx.shadowBlur=0;
	ctx.shadowOffsetX= 0;
    ctx.shadowOffsetY = 0;
	ctx.strokeStyle="#333";
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

function meetingArea(ctx,radius){
	ctx.lineWidth = radius*0.07;
	ctx.lineCap="square";
	//angle of every hr: (0.5/3)*Math.PI
	//angle of every section: (0.5/15)*Math.PI
	//angle of every min by day: angle of every section
	//angle of every min by hr: angle of every section/12 i.e 5/60
	//every hr has 5 sections
	for(i=0;i<meetingArr.length;i++){
		ctx.beginPath();
		ctx.lineWidth=4;
		start_arr=meetingArr[i][0].split(':');
		s_hr=parseInt(start_arr[0]);
		s_min=parseInt(start_arr[1]);
		
		end_arr=meetingArr[i][1].split(':');
		e_hr=parseInt(end_arr[0]);
		e_min=parseInt(end_arr[1]);
		if(e_hr==12 && e_min==0){
			loop=false;
		}
		else{
			loop=true;
		}
		
		if(s_hr<12 && e_hr>=12 && loop){
			grd=ctx.createLinearGradient(0,0,10,0);
			grd.addColorStop(0,"#c36a3e");
			grd.addColorStop(1,"#4b2a63");
			ctx.strokeStyle=grd;
			ctx.arc(0,0,radius+4,getStartingAngle(s_hr,s_min),getEndingAngle(e_hr,e_min));
		}else if(s_hr>12 && e_hr<12){
			grd=ctx.createLinearGradient(0,0,10,0);
			grd.addColorStop(0,"#4b2a63");
			grd.addColorStop(1,"#c36a3e");
			ctx.strokeStyle=grd;
			ctx.arc(0,0,radius-1.8,getStartingAngle(s_hr,s_min),getEndingAngle(e_hr,e_min));
		}else if(s_hr>11){
			ctx.strokeStyle="#4b2a63";
			ctx.arc(0,0,radius+4,getStartingAngle(s_hr,s_min),getEndingAngle(e_hr,e_min));
		}else{
			ctx.strokeStyle="#c36a3e";
			ctx.arc(0,0,radius-1.8,getStartingAngle(s_hr,s_min),getEndingAngle(e_hr,e_min));
		}
		ctx.stroke();
	}
}
function getStartingAngle(hr,min){
	if((hr-3)<0){hr=hr+12;}
	return ((hr-3)*5*(0.5/15)*Math.PI)+(min*(0.5/15)*Math.PI/12);
}
function getEndingAngle(hr,min){
	if((hr-3)<0){hr=hr+12;}
	return ((hr-3)*5*(0.5/15)*Math.PI)+(min*(0.5/15)*Math.PI/12);
}
var vis = (function(){
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();
var tab_visible = true;

function alarm(){
	vis(function(){
		if(vis()){
			tab_visible=true;
		}
		else{
			tab_visible=false;
		}
	});
	for(i=0;i<meetingArr.length;i++){
		var time_arr=meetingArr[i][0].split(':');
		var hr=parseInt(time_arr[0]);
		var min=parseInt(time_arr[1]);
		
		if(hr==(new Date()).getHours() && min==(new Date()).getMinutes()){
			if($('.meet_'+i).length==0 && meetingArr[i].length!=4){
				$('.iasClockDiv').prepend("<div class='meetingDisplay meet_"+i+"' style='max-width:"+canvas.width+";'><span style='        cursor: pointer;    position: absolute;    right: -8px;    background-color: red;    color: white;    padding: 0px 4px 1px 5px;    border-radius: 12px;    margin-top: -10px;' onclick='closePopUp("+i+");'>X</span>"+meetingArr[i][2]+"</div><div class='arrow-down meet_arrow_"+i+"'></div>");
				var audio = new Audio('quite-impressed.mp3');
				audio.play();
				/*if(!tab_visible){
					alert(meetingArr[i][2]);
				}*/
			}
		}
	}
}
function closePopUp(pos){
	var position=parseInt(pos);
	$('.meet_'+position).remove();
	$('.meet_arrow_'+pos).remove();
	meetingArr[pos][3]=true;
}
//success msg
function suceessMsg(){
	var ut=(+ new Date());
	$('body').prepend('<div class="iasSuccessMsgDiv iasUT_'+ut+'"><div class="iasSuccessMsg">Meeting has been added</div></div>');
	$(function() {
    setTimeout(function() {
        $(".iasUT_"+ut).remove();
    }, 5000);
});
}
//add meeting
function addMettingNow(){
	addMeeting($('#meeting_start_time').val(),$('#meeting_end_time').val(),$('#meeting_message').val(),ctx,radius);
	removeMeetingForm();
}
function addMeeting(start,end,msg,ctx,radius){
	meetingArr.push(Array(start,end,msg));
	clearMeetingArea(ctx,radius);
	drawLines(ctx,radius);
	meetingArea(ctx,radius);
	suceessMsg();
	/*Add your function call*/
}
//del meeting
function delMeeting(pos){
	var position=parseInt(pos);
	clearMeetingArea(ctx,radius);
	drawLines(ctx,radius);
	meetingArr.splice(position,1);
	meetingArea(ctx,radius);
	/*Add your function call*/
}
function delRow(obj,pos){
	if(confirm('Are you sure ?')){
		delMeeting(pos);
		refreshList();
	}
}
function listAll(){
	var table="<table>";
	if(meetingArr.length==0){
		table+="<tr><th>No meetings planned yet</th></tr>";
	}else{
		table+="<tr><th>Sr.</th><th>Start</th><th>End</th><th>Message</th><th></th></tr>";
	}
	for(i=0;i<meetingArr.length;i++){
		table+="<tr><td></td><td>"+meetingArr[i][0]+"</td><td>"+meetingArr[i][1]+"</td><td>"+meetingArr[i][2]+"</td><td><div class='delete-icon' onclick='delRow(this,\""+i+"\")'>x</div></td></tr>";
	}
	table+="</table>";
	$('body').prepend("<div class='shadow-box'></div><div class='listAll'><div class='closePopup' onclick='hideList();'>X</div>"+table+"</div>");
}
function refreshList(){
	var table="<table>";
	if(meetingArr.length==0){
		table+="<tr><th>No meetings planned yet</th></tr>";
	}else{
		table+="<tr><th>Sr.</th><th>Start</th><th>End</th><th>Message</th><th></th></tr>";
	}
	for(i=0;i<meetingArr.length;i++){
		table+="<tr><td></td><td>"+meetingArr[i][0]+"</td><td>"+meetingArr[i][1]+"</td><td>"+meetingArr[i][2]+"</td><td><div class='delete-icon' onclick='delRow(this,\""+i+"\")'>x</div></td></tr>";
	}
	table+="</table>";
	$('.listAll').html("<div class='closePopup' onclick='hideList();'>X</div>"+table+"");
}
function removeMeetingForm(){
	$('.shadow-box').remove();
	$('.c_form').remove();
}
function hideList(){
	$('.shadow-box').remove();
	$('.listAll').remove();
}
function startClock(meetingArr1,show_minutes){
  $('.shadow-element').css('width',$(canvas).attr('width'));
  $('.shadow-element').css('height',$(canvas).attr('height'));
  minutes_flag=show_minutes;
  meetingArr=meetingArr1;
  setInterval(drawClock, 1000);
  drawLines(ctx,radius);
  meetingArea(ctx,radius);
}

function createMeeting(){
$('body').prepend("<div class='shadow-box'></div><div class='c_form'><table><tr><td>Start time</td><td><input type='text' placeholder='hh:mm' id='meeting_start_time'/></td></tr><tr><td>End time</td><td><input type='text' placeholder='hh:mm' id='meeting_end_time'/></td></tr><tr><td>Details</td><td><input type='text' placeholder='Details' id='meeting_message' style='margin-bottom: 5px;'/></td></tr></table><button style='background: none;border: 1px solid green;' onclick='addMettingNow()'>Add</button><button style='    margin-left: 10px;    background: none;    border: 1px solid red;' onclick='removeMeetingForm();'>Cancel</button></div>");
}
