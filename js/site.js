
//GET DATA
//var sentimentColor= {'strength':'#004d00','weakness':'#990000','neutral':'#004080'};
var sentimentColor= {'strength':'#66ff99','weakness':'#ff6699','neutral':'#66ccff'};
var sentimentColorScale = {
	'strength': d3.scaleLinear().range(['#ccffcc', '#004d00']).domain([0, 5]),
	'weakness': d3.scaleLinear().range(['#ffcccc', '#990000']).domain([0, 5]),
	'neutral': d3.scaleLinear().range(['#e6f2ff', '#004080']).domain([0, 5])
}

var all_idea_units = {};
var number_of_providers=0;

var visual_status = {};
//var topicName=['image','layout'];
var sentimentName=['strength','neutral', 'weakness'];
var topicArray={};
var topics=[];
var selectedFigure=[];

var actionPanel;
var actionflag=false;
//handle actions
//available actions
var assign_groups = ['must-do', 'consider','not-sure', 'disagree', 'strength'];


$(function(){
	all_idea_units=labeled;	
	number_of_providers=getTotalProviders();
	
	//finishAnnoate();
	//SelectFeedback();
	//generate all feedback view
	showAll();
	finishAnnoate();
	createActionPanel();
	
//Enable toggled tab view	
	$('#myTab a').on('click', function (e) {
  		e.preventDefault()
  		$(this).tab('show')
	})



	$('[name="topic-element"]').on('shown.bs.collapse', function () {
   		var getTopic=$(this).attr("id").split("-")[1];
   		$('#ctrl-'+getTopic).html("<span class='fas fa-minus-square' name='collapse-ctrl'></span>")
   		
	});

	$('[name="topic-element"]').on('hidden.bs.collapse', function () {
   		var getTopic=$(this).attr("id").split("-")[1];

   		$('#ctrl-'+getTopic).html("<span class='fas fa-plus-square' name='collapse-ctrl'></span>")
   		
	});

	calculateAction();
//page 3


// Page 2



	$(document).on('input', '.filter-attibute', function() {
		//alert("haha");
	    filterResult();
	});



	$("div#page-2").on('click','.tableelement', function() {
		
		var span_id = $(this).attr("id").split('-');
		var topic= span_id[0];
		var sentiment=span_id[1];
		var people_id=span_id[2];

		var feedbackText='';
		//todo
		for(var key in all_idea_units){
			//console.log(tmp);
			var tmp_id=key.split('-');
			if( (tmp_id[0] == people_id)&&(sentiment==all_idea_units[key]['sentiment'])&&(topic == all_idea_units[key]['topic']))
			{				
				console.log(key);
		//todo
				all_idea_units[key].visited=true;
				feedbackText+= feedbackText+ all_idea_units[key]['content'];
				//$(".tableelement#"+key+" > span", "#page-2").css("color","blue");
			}//all_idea_units[currentIdeaLists[i].id].visited=true; 
		}


		if(visual_status[$(this).attr("id")] == false){
			$(this).addClass("selectElement");
			visual_status[$(this).attr("id")]=true;
			//alert(visual_status[$(this).attr("id")]);
		}else{
			$(this).removeClass("selectElement");
				visual_status[$(this).attr("id")]=false;
		}


		SelectFeedback(visual_status);
		var feedbackCell= $("<tr class='feedback-cell'></tr>");
		$(this).clone().appendTo(feedbackCell);
		$("<td class='vis-content'>"+feedbackText+"</td>").appendTo(feedbackCell);

		feedbackCell.appendTo(actionPanel);
		//$(this).clone().appendTo(actionPanel);
		

	})


	$('.action-record-row').on('mouseenter', function(){
		var span_id = $(this).attr("id").split('-');
	});

	$("div#page-2").on('mouseenter','.tableelement', function() {
		

		var span_id = $(this).attr("id").split('-');
		var topic= span_id[0];
		var sentiment=span_id[1];
		var people_id=span_id[2];
		console.log(span_id);
		//todo
		for(var key in all_idea_units){
			//console.log(tmp);
			var tmp_id=key.split('-');
			if( (tmp_id[0] == people_id)&&(sentiment==all_idea_units[key]['sentiment'])&&(topic == all_idea_units[key]['topic']))
			{				
				$("span.idea-unit#"+key, "#page-2").addClass("active-text");
				//all_idea_units[key].visited=true; 
				//$(".tableelement#"+key+" > span", "#page-2").css("color","blue");
			}//all_idea_units[currentIdeaLists[i].id].visited=true; 
		}

	});

	$("div#page-2").on('mouseleave','.tableelement', function() {
		
	    $("span.idea-unit", "#page-2").removeClass("active-text");
	    
	  
	});


	//$("div#page-1").on('click','.add-btn', addOption);

	
	$("span.idea-unit", "page-2").hover(

		 	function() {
		 		
  				var span_id = $(this).attr("id");
  				var people_id=span_id.split('-');
  				console.log(span_id);
				for(var i=0; i<topicArray.length;i++)// lopping the topic
				{				
					for(var sentiment=0; sentiment < topicArray[i].length;sentiment++)
					{
						var currentArray=topicArray[i][sentiment];
						for(var idx_unit=0; idx_unit<currentArray.length;idx_unit++)// lopping the topic
						{
							
							if(span_id == currentArray[idx_unit].id){
								console.log("get it");
								$(".tableelement#"+topicName[i]+'-'+sentiment+'-'+people_id[0]+" > span").addClass("active-icon");	
				
							}
							
						}		
					}

				}
						
			},
			function() {
				$(".tableelement > span").removeClass("active-icon");
			}
	);


});

function getTotalProviders()
{
	var total_provider=0;
	

	for(var key in all_idea_units){
		var tmp_id=key.split('-');
		if(tmp_id[0]>total_provider) 
			total_provider=tmp_id[0];
	}
	return total_provider;
}


function markSolved(ele){
	//console.log("in mark sovle->"+$(ele).parent('.action-record-row').attr('id'));
	$(ele).closest('.action-record-row').css("background-color","#00ffcc");
	$(ele).val("Unmarked");
}

function createActionPanel(){

	assign_groups.forEach(function(element){
		//add to the sunmary board
		$("<li class='list-group-item' id='count-"+element+"'>"+element.replace('-',' ') +"<span class='action-number'>0</span></li>").appendTo('#summary .list-group-flush');
		//add a section in page 3
		var current_action_panel= $($('#action-template').html());

		$('.card-header',current_action_panel).attr('id', 'actionHeading-'+element); 
		$('button',current_action_panel).attr('data-target','#actionContent-'+element );
		$('button',current_action_panel).html(element.replace('-',' ')+" ("+"<span class='count'></span> elements)");
		$('button',current_action_panel).attr('aria-controls','actionContent-'+element );
		$('.collapse',current_action_panel).attr('id', 'actionContent-'+element);
		$('.collapse',current_action_panel).attr('aria-labelledby', 'actionHeading-'+element); 
		$('#action-panel').append(current_action_panel);
	});

}

function calculateAction(){

	var count_action={};
	console.log(count_action);

	for(var key in all_idea_units){

		var current_group=all_idea_units[key]['group_name'];
		if(!(current_group in count_action))
			count_action[current_group]=1;
		else{
			count_action[current_group]++;
		}
		
	}

	console.log(count_action);

	assign_groups.forEach(function(element)
	{
		$('#count-'+element+' .action-number').html(count_action[element] || '0');
		$('#actionHeading-'+element+' .count').html(count_action[element] || '0');
		//$('#count-'+element+' .action-number').html(count_action[element] || '0');	
		
	})
	// console.log(all)
}



function renderElement(){

	$("#paneltest").empty();

	for (var topicKey in topicArray) {
	
		var currentTopic=topicArray[topicKey];
		//create header middle td
		var inser_header="";//header human figures	
		var inser_html="";//body content	
		
		//Render human icons
		for(var index=1; index<=number_of_providers;index++)// lopping the topic
		{
			inser_header=inser_header+"<th><span class='fa fa-user human-figure' id='human-"+topicKey+"-"+index+"'></span></th>";
		}
		
		//Render content
		for (var sentimentKey in currentTopic) {
			
			inser_html+="<tr id='sentiment"+sentimentKey+"'><td width='20%' style='color:grey; text-align:right;'><b>"+sentimentKey+'</b></td>';
			people_id=1;
			for(var index=0; index<number_of_providers;index++)// lopping the topic
			{
				var currentID=topicKey+'-'+sentimentKey+'-'+people_id;
				var associated_idea_units = getIdeaUnits(topicKey, sentimentKey, people_id);
				var associated_idea_units_html_string = IdeaUnits2TooltipHTML(associated_idea_units);
				//var associated_idea_units_string = ('<ul>' + associated_idea_units.map(text => '<li>' + text + '</li>').join('') + '</ul>').replace('"', '\''); // convert " to '
				
				$td = $('<td>').append(
				          $('<div>')
				          .attr('data-toggle', associated_idea_units.length? 'tooltip' : '')
				          .attr('title', associated_idea_units_html_string)
				          .attr('class', 'tableelement')
				          .attr('id', currentID)
				      );
				inser_html += $td.prop("outerHTML");

				// inser_html=inser_html+"<td><div data-toggle='tooltip' title=\""+associated_idea_units_string+"\" class='tableelement' id='"+currentID+"'></div></td>";
				people_id++;

				visual_status[currentID]=false;
			}
			inser_html+="</tr>";
			
		}
		inser_html+="</table>";
		

		var current_collapsed_table = $($('template#collapseTable').html());

		//render table headaer
		$('.topic-name', current_collapsed_table).html(topicKey);
		$('.human-headers', current_collapsed_table).replaceWith(inser_header);//new
		
		//assign collapse
		$('button', current_collapsed_table).attr('data-target','#content-'+topicKey);
		$('button', current_collapsed_table).attr('aria-controls','content-'+topicKey);

		$('[name=topic-element]', current_collapsed_table).attr('id','content-'+topicKey );		
		$('[name=topic-element]', current_collapsed_table).html(inser_html);
		
		$("#paneltest").append(current_collapsed_table);
	}

	// enable tooltips
	$('#paneltest div[data-toggle]').each(function() {
		var manual = false;
		$(this)
			.on('mouseenter', function() {
				// $(this).tooltip('show'); 
				if (!manual) { $(this).tooltip('show'); };
			})
			.on('mouseleave', function() { 
				if (!manual) { $(this).tooltip('hide'); };
			})
			.on('click', function() { manual = !manual;})
			.tooltip({'html': true, 'trigger': 'manual'});
	});
		
}

function renderFactual(){

	for (var key in all_idea_units) {
		var people_id=key.split('-');
		var tmp_sentiment=all_idea_units[key]['sentiment'];
		var associated_idea_units = getIdeaUnits(all_idea_units[key]['topic'], all_idea_units[key]['sentiment'], parseInt(people_id[0]));

		$("#"+all_idea_units[key]['topic']+'-'+all_idea_units[key]['sentiment']+'-'+people_id[0])
		 	.css('background',sentimentColor[tmp_sentiment]);	
		    //.css('background-color', sentimentColorScale[tmp_sentiment](associated_idea_units.length));
		    // .css('background',sentimentColor[tmp_sentiment]);	
	}


	
		for (var topic in topicArray) {
			
			for(var people=1; people<=number_of_providers;people++)
			{	
				var count_ideas=0;	
				sentimentName.forEach(function(element) {
				
					var num=getIdeaUnits(topic, element ,people).length;
					count_ideas+= num;
				});	

				if(count_ideas>0)
					$("#human-"+topic+"-"+people).css("color","grey");
			}
		}
	}



function renderFactualbk(){

	for (var key in all_idea_units) {
		var people_id=key.split('-');
		var tmp_sentiment=all_idea_units[key]['sentiment'];
		var associated_idea_units = getIdeaUnits(all_idea_units[key]['topic'], all_idea_units[key]['sentiment'], parseInt(people_id[0]));

		$("#"+all_idea_units[key]['topic']+'-'+all_idea_units[key]['sentiment']+'-'+people_id[0])
		 	.css('background',sentimentColor[tmp_sentiment]);	
		    //.css('background-color', sentimentColorScale[tmp_sentiment](associated_idea_units.length));
		    // .css('background',sentimentColor[tmp_sentiment]);	
	}

}

	

function renderFeedbackTable(){
	for(var key in all_idea_units){
			var tmp_id=key.split('-');
			if( (tmp_id[0] == people_id)&&(sentiment==all_idea_units[key]['sentiment'])&&(topic == all_idea_units[key]['topic']))
			{				
				$("span.idea-unit#"+key, "#page-2").addClass("active-text");
				//all_idea_units[key].visited=true; 
				//$(".tableelement#"+key+" > span", "#page-2").css("color","blue");
			}//all_idea_units[currentIdeaLists[i].id].visited=true; 
		}
}


function getIdeaUnits(topic_key, sentiment_key, people_id) {
	// convert people_id from string to int for convenience
	if (typeof(people_id) === 'string') { people_id = parseInt(people_id)};
	// console.log(topic_key, sentiment_key, people_id);
	var idea_units = [];
	for (idea_unit_key in all_idea_units) {
		var idea_unit = all_idea_units[idea_unit_key];
		var idea_people_id = parseInt(idea_unit_key.split('-')[0]);
		if (idea_people_id === people_id && idea_unit['topic'] === topic_key && idea_unit['sentiment'] === sentiment_key) {
			idea_units.push(idea_unit);
		}
	}
	return idea_units;
}

function IdeaUnits2TooltipHTML(idea_units) {
	var $tooltip_div = $('<ul class="list-group list-group-flush">');
	idea_units.forEach(function(idea_unit) {
		var $unit_div = $('<li class="list-group-item idea-list">').html('<p style="margin:2px;"><span class="badge badge-secondary"># '+idea_unit['id']+'</span> '+idea_unit['content'] + '</p>');
		$tooltip_div.append($unit_div);
		$assign_button_group = $('<div>').attr('class', 'btn-group btn-group-toggle action-bn').attr('data-toggle', 'buttons');
		
		assign_groups.forEach(function(group_name){
			$label = $('<label>')
				.attr('class', 'btn btn-outline-info action-bn')
				.attr('onclick', 'assign_label_onclick(this)')
				.attr('group_name', group_name)
				.attr('idea_unit_id', idea_unit['id'])
				.addClass(idea_unit.group_name === group_name? 'active' : '')
				.html(group_name)
				.append(
					$('<input>').attr(
						{'type': 'radio', 'name': 'options', 'autocomplete': 'off'}
					)
				);
			$assign_button_group.append($label);
		});
		
		$unit_div.append($assign_button_group);
	});
	return $tooltip_div.prop('outerHTML');
}

function IdeaUnits2TooltipHTMLbk(idea_units) {
	var $tooltip_div = $('<ul>');
	idea_units.forEach(function(idea_unit) {
		var $unit_div = $('<li>').html(idea_unit['content'] + '<br>');
		$tooltip_div.append($unit_div);
		$assign_button_group = $('<div>').attr('class', 'btn-group btn-group-toggle action-bn').attr('data-toggle', 'buttons');
		assign_groups.forEach(function(group_name){
			$label = $('<label>')
				.attr('class', 'btn btn-light')
				.attr('onclick', 'assign_label_onclick(this)')
				.attr('group_name', group_name)
				.attr('idea_unit_id', idea_unit['id'])
				.addClass(idea_unit.group_name === group_name? 'active' : '')
				.html(group_name)
				.append(
					$('<input>').attr(
						{'type': 'radio', 'name': 'options', 'autocomplete': 'off'}
					)
				);
			$assign_button_group.append($label);
		});
		
		$unit_div.append($assign_button_group);
	});
	return $tooltip_div.prop('outerHTML');
}

// assume global variable all_idea_units
function assign_label_onclick(element) {
	$this = $(element);
	var idea_unit_id = $this.attr('idea_unit_id');
	var group_name = $this.attr('group_name');
	all_idea_units[idea_unit_id]['group_name'] = group_name;
	console.log(idea_unit_id,all_idea_units[idea_unit_id]);
	calculateAction();
	// update the tooltip content to the title attribute for UI update
	var people_id = idea_unit_id.split('-')[0];
	var topicKey = all_idea_units[idea_unit_id]['topic'];
	var sentimentKey = all_idea_units[idea_unit_id]['sentiment'];
	var tableelement_id = all_idea_units[idea_unit_id]['topic'] + '-' + all_idea_units[idea_unit_id]['sentiment'] + '-' + people_id;
	var table_element =  $('div.tableelement#' + tableelement_id);
	// there might be multiple tooltips opened, the attribute 'aria-describedby' on table_element matches the tooltip id
	// abandoned. reason: the tooltip html found now is not the correct one, perhaps because there is some animation that the 'active' attribute is not applied directly
	// table_element.attr('data-original-title', ($('.tooltip#'+table_element.attr('aria-describedby')).find('div.tooltip-inner').html()));

	// solution: re-create the html from data
	var currentID = topicKey+'-'+sentimentKey+'-'+people_id;
	var associated_idea_units = getIdeaUnits(topicKey, sentimentKey, people_id);
	var associated_idea_units_html_string = IdeaUnits2TooltipHTML(associated_idea_units);
	table_element.attr('data-original-title', associated_idea_units_html_string);

	assignIdeaUnit2Group(idea_unit_id, group_name);
	
}


function assignIdeaUnit2Group(idea_idx, gp) {

	var current_action_record = $($('template#action-record').html());
	current_action_record.attr('id', 'action-'+idea_idx);
	$('[name="topic-name"]', current_action_record).html(all_idea_units[idea_idx]['topic']);
	$('[name="content"]', current_action_record).html(all_idea_units[idea_idx]['content']);
	$('#action-'+idea_idx).remove();
	$('#actionContent-'+gp+' table').append(current_action_record);
			
}

//var topics=[];


function SelectFeedback(){

	$(".feedback-cell").hide();	
	for (var key in visual_status) {
			var person= key.split('-')[2];
			var sentiment= key.split('-')[1];
			var topic= key.split('-')[0];

		if(visual_status[key]==true){

			$(".feedback-cell#person"+person).show();

			for(var idea in all_idea_units){
			//console.log(tmp);
			var tmp_id=idea.split('-');
			if( (tmp_id[0] == person)&&(sentiment==all_idea_units[idea]['sentiment'])&&(topic == all_idea_units[idea]['topic']))
			{				
				$("span.idea-unit#"+idea, "#page-2").css("background",sentimentColor[sentiment]);		
			}//all_idea_units[currentIdeaLists[i].id].visited=true; 
			}
		}else
		{
			for(var idea in all_idea_units){
				//console.log(tmp);
				var tmp_id=idea.split('-');
				if( (tmp_id[0] == person)&&(sentiment==all_idea_units[idea]['sentiment'])&&(topic == all_idea_units[idea]['topic']))
				{				
					$("span.idea-unit#"+idea, "#page-2").css("background","");		
				} 
			}
		}
		
	}

}




function getWholeFeedback(reviewer_id){
	var text_vis_table=''; 
	$.each(all_idea_units, function(key, value) { 
  		var provider=key.split('-')[0];
  		if(provider==reviewer_id)
  		{
  			text_vis_table=text_vis_table+	"<span class='idea-unit' data-toggle='modal' data-target='#annotate' id='" + key + "'>" + value['content'] + "</span>";
		
  		}
	
	});
			
	return text_vis_table;
}

function showAll()
{
	
	for(var index=1;index <= number_of_providers; index++)
	{
			$('#feedback-list', "div#all-feedback").append("<tr class='feedback-cell' id='person"+index+"'><td><strong>#"+index+"</strong></td><td class='vis-content'>"+ getWholeFeedback(index)+"</td></tr>");
	}
	//$("div#page-2").hide();
	//$(".feedback-cell","div#all-feedback").show();	
	//$("div#all-feedback").show();
}


function smartView(){
	finishAnnoate();
	//SelectFeedback();
	//$("div#page-2").show();
	//$("div#all-feedback").hide();
}


function finishAnnoate(){

	createTopicArray();
	renderElement();
	renderFactual();

}

//For page 2
    
function createTopicArray()
{
	//all_idea_units=labeled;

	topicArray={};
	//var number_of_idea= Object.keys(all_idea_units).length;
	for (var key in all_idea_units) {
    // check if the property/key is defined in the object itself, not in parent
    //console.log(all_idea_units[key]['topic']);
    var current_topic=all_idea_units[key]['topic'];
    var current_sentiment=all_idea_units[key]['sentiment'];
    //console.log(current_topic,current_sentiment );	
    	if(current_topic!=null && current_sentiment!=0){
	    	if(!(current_topic in topicArray))
	    	{
	    		var currentArray={};
	    		sentimentName.forEach(function(element) {
  					currentArray[element] =new Array();
				});

	    		topicArray[current_topic] = currentArray;
	    	}
	    	topicArray[current_topic][current_sentiment].push(all_idea_units[key]);
	    	//console.log(JSON.stringify(topicArray));
		}


		

    }
}




function renderElement(){

	$("#paneltest").empty();

	for (var topicKey in topicArray) {
	
		var currentTopic=topicArray[topicKey];
		//create header middle td
		var inser_header="";//header human figures	
		var inser_html="";//body content	
		
		//Render human icons
		for(var index=1; index<=number_of_providers;index++)// lopping the topic
		{
			inser_header=inser_header+"<th><span class='fa fa-user human-figure' id='human-"+topicKey+"-"+index+"'></span></th>";
		}
		
		//Render content
		for (var sentimentKey in currentTopic) {
			
			inser_html+="<tr id='sentiment"+sentimentKey+"'><td width='20%' style='color:grey; text-align:right;'><b>"+sentimentKey+'</b></td>';
			people_id=1;
			for(var index=0; index<number_of_providers;index++)// lopping the topic
			{
				var currentID=topicKey+'-'+sentimentKey+'-'+people_id;
				var associated_idea_units = getIdeaUnits(topicKey, sentimentKey, people_id);
				var associated_idea_units_html_string = IdeaUnits2TooltipHTML(associated_idea_units);
				//var associated_idea_units_string = ('<ul>' + associated_idea_units.map(text => '<li>' + text + '</li>').join('') + '</ul>').replace('"', '\''); // convert " to '
				
				$td = $('<td>').append(
				          $('<div>')
				          .attr('data-toggle', associated_idea_units.length? 'tooltip' : '')
				          .attr('title', associated_idea_units_html_string)
				          .attr('class', 'tableelement')
				          .attr('id', currentID)
				      );
				inser_html += $td.prop("outerHTML");

				// inser_html=inser_html+"<td><div data-toggle='tooltip' title=\""+associated_idea_units_string+"\" class='tableelement' id='"+currentID+"'></div></td>";
				people_id++;

				visual_status[currentID]=false;
			}
			inser_html+="</tr>";
			
		}
		inser_html+="</table>";
		

		var current_collapsed_table = $($('template#collapseTable').html());

		//render table headaer
		$('.topic-name', current_collapsed_table).html(topicKey);
		$('.human-headers', current_collapsed_table).replaceWith(inser_header);//new
		
		//assign collapse
		$('button', current_collapsed_table).attr('data-target','#content-'+topicKey);
		$('button', current_collapsed_table).attr('aria-controls','content-'+topicKey);

		$('[name=topic-element]', current_collapsed_table).attr('id','content-'+topicKey );		
		$('[name=topic-element]', current_collapsed_table).html(inser_html);
		
		$("#paneltest").append(current_collapsed_table);
	}

	// enable tooltips
	$('#paneltest div[data-toggle]').each(function() {
		var manual = false;
		$(this)
			.on('mouseenter', function() {
				// $(this).tooltip('show'); 
				if (!manual) { $(this).tooltip('show'); };
			})
			.on('mouseleave', function() { 
				if (!manual) { $(this).tooltip('hide'); };
			})
			.on('click', function() { manual = !manual;})
			.tooltip({'html': true, 'trigger': 'manual'});
	});
		
}

function renderFactual(){

	for (var key in all_idea_units) {
		var people_id=key.split('-');
		var tmp_sentiment=all_idea_units[key]['sentiment'];
		var associated_idea_units = getIdeaUnits(all_idea_units[key]['topic'], all_idea_units[key]['sentiment'], parseInt(people_id[0]));

		$("#"+all_idea_units[key]['topic']+'-'+all_idea_units[key]['sentiment']+'-'+people_id[0])
		 	.css('background',sentimentColor[tmp_sentiment]);	
		    //.css('background-color', sentimentColorScale[tmp_sentiment](associated_idea_units.length));
		    // .css('background',sentimentColor[tmp_sentiment]);	
	}


	
		for (var topic in topicArray) {
			
			for(var people=1; people<=number_of_providers;people++)
			{	
				var count_ideas=0;	
				sentimentName.forEach(function(element) {
				
					var num=getIdeaUnits(topic, element ,people).length;
					count_ideas+= num;
				});	

				if(count_ideas>0)
					$("#human-"+topic+"-"+people).css("color","grey");
			}
		}
	}



function renderFactualbk(){

	for (var key in all_idea_units) {
		var people_id=key.split('-');
		var tmp_sentiment=all_idea_units[key]['sentiment'];
		var associated_idea_units = getIdeaUnits(all_idea_units[key]['topic'], all_idea_units[key]['sentiment'], parseInt(people_id[0]));

		$("#"+all_idea_units[key]['topic']+'-'+all_idea_units[key]['sentiment']+'-'+people_id[0])
		 	.css('background',sentimentColor[tmp_sentiment]);	
		    //.css('background-color', sentimentColorScale[tmp_sentiment](associated_idea_units.length));
		    // .css('background',sentimentColor[tmp_sentiment]);	
	}

}


function renderFactualbk(){

	for (var key in all_idea_units) {
		var people_id=key.split('-');
		var tmp_sentiment=all_idea_units[key]['sentiment'];
		var associated_idea_units = getIdeaUnits(all_idea_units[key]['topic'], all_idea_units[key]['sentiment'], parseInt(people_id[0]));

		$("#"+all_idea_units[key]['topic']+'-'+all_idea_units[key]['sentiment']+'-'+people_id[0])
		 	.css('background',sentimentColor[tmp_sentiment]);	
		    //.css('background-color', sentimentColorScale[tmp_sentiment](associated_idea_units.length));
		    // .css('background',sentimentColor[tmp_sentiment]);	
	}

}

//*NOT IN USE*//
function renderInterpretation(){

	var selectedID=[];
	var numToString=['low','low','low','medium','high','high'];
	
	var checked_effort = [];
	var checked_criticality = [];
	var need_discussion = [];
	var agreement = [];


	$('input[name=effort]:checked').each(function() {checked_effort.push($(this).attr('value'));});
	$('input[name=criticality]:checked').each(function() {checked_criticality.push($(this).attr('value'));});
	$('input[name=discussion]:checked').each(function() {need_discussion.push($(this).attr('value'));});
	$('input[name=agree]:checked').each(function() {agreement.push($(this).attr('value'));});
//if nothing is selected 
if( checked_effort.length > 0 || checked_criticality.length>0 || need_discussion.length>0 || agreement.length>0 )
{


	for (var key in all_idea_units) {
		var people_id=key.split('-')[0];

		var current_topic = all_idea_units[key]['topic'];
		var current_sentiment = all_idea_units[key]['sentiment'];

		var current_effort = all_idea_units[key]['effort'];
		var current_criticality = all_idea_units[key]['criticality'];

		var current_discussion = all_idea_units[key]['discussion'];
		var current_agreement = all_idea_units[key]['agree'];


		if( (checked_effort.length>0 == checked_effort.indexOf(current_effort)>-1) 
			&& (checked_criticality.length>0 == checked_criticality.indexOf(current_criticality)>-1 )
			&& (need_discussion.length>0 == need_discussion.indexOf(current_discussion)>-1 )
			&& (agreement.length>0 == agreement.indexOf(current_agreement)>-1))
		{
			selectedID.push(key);
			$(".tableelement#"+current_topic+'-'+current_sentiment+'-'+people_id+" > span").addClass('highlight');	
		}
		else
		{
			$(".tableelement#"+current_topic+'-'+current_sentiment+'-'+people_id+" > span").removeClass('highlight');	
		}		
	}
	
}else{
	$('.tableelement span').removeClass('highlight');
}

	SelectFeedback(selectedID);

}
