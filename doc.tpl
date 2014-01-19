<div class="page-header">
	<h1>DateTimePicker <small>jQuery plugin select date and time</small></h1>
</div>
<?php echo $this->parse('right250x250',array('link'=>"https://github.com/xdan/datetimepicker/archive/master.zip"))?>
<p>
Use this plugin to unobtrusively add a datetimepicker, datepicker or timepicker dropdown to your forms. It's easy to customize options. <a href="https://github.com/xdan/datetimepicker">Source code on GitHub</a> or <a href="https://github.com/xdan/datetimepicker/archive/master.zip">download (zip)</a>.
</p>

<h3>DateTimepicker</h3>
<input type="text" value="2014/03/15 05:06" id="datetimepicker"/><br/>
<h3>Use mask DateTimepicker</h3>
<input type="text" value="" id="datetimepicker_mask"/><br/>
<h3>TimePicker</h3>
<input type="text" id="datetimepicker1"/><br/>
<h3>DatePicker</h3>
<input type="text" id="datetimepicker2"/><br/>
<h3>Inline DateTimePicker</h3>
<input type="text" id="datetimepicker3"/><br/>
<script>
$(function(){
$('#datetimepicker_mask').datetimepicker({
	mask:'9999/19/39 29:59',
});
$('#datetimepicker').datetimepicker();
$('#datetimepicker').datetimepicker({value:'2015/04/15 05:06'});
$('#datetimepicker1').datetimepicker({
	datepicker:false,
	format:'H:i',
	value:'12:00'
});
$('#datetimepicker2').datetimepicker({
	timepicker:false,
	format:'d/m/Y'
});
$('#datetimepicker3').datetimepicker({
	inline:true
});
});
</script>
</p>
<h2>How do I use it?</h2>
<p>
First include to page css and js files
<pre><code data-language="html">&lt;!-- this should go after your &lt;/body&gt; --&gt;
&lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;jquery.datetimepicker.css&quot;/ &gt;
&lt;script src=&quot;jquery.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;jquery.datetimepicker.js&quot;&gt;&lt;/script&gt;</code></pre>
</p>
<h2>Examples</h2>

<hr id="Simple"/>
<h4>Simple init DateTimePicker Example <a href="#Simple">#</a></h4>
<p>HTML</p>
<pre><code data-language="html">&lt;input id=&quot;datetimepicker&quot; type=&quot;text&quot; &gt;</code></pre>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$('#datetimepicker').datetimepicker();</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker" type="text" value="2014/03/15 05:06" /></p>
<script>
$(function(){$('#_datetimepicker').datetimepicker();});
</script>

<hr id="i18n"/>
<h4>i18n DatePicker Example  <a href="#i18n">#</a></h4>
<p>All supported languages <a href="#lang">here</a></p>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker1&#39;).datetimepicker({
 lang:&#39;de&#39;,
 i18n:{
  de:{
   months:[
    &#39;Januar&#39;,&#39;Februar&#39;,&#39;M&auml;rz&#39;,&#39;April&#39;,
    &#39;Mai&#39;,&#39;Juni&#39;,&#39;Juli&#39;,&#39;August&#39;,
    &#39;September&#39;,&#39;Oktober&#39;,&#39;November&#39;,&#39;Dezember&#39;,
   ],
   dayOfWeek:[
    &quot;So.&quot;, &quot;Mo&quot;, &quot;Di&quot;, &quot;Mi&quot;, 
    &quot;Do&quot;, &quot;Fr&quot;, &quot;Sa.&quot;,
   ]
  }
 },
 timepicker:false,
 format:&#39;d.m.Y&#39;
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker1" type="text" value="15.08.2013" /></p>
<script>$(function(){
$('#_datetimepicker1').datetimepicker({
 lang:'de',
 i18n:{de:{
  months:[
   'Januar','Februar','Marz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'
  ],
  dayOfWeek:["So.", "Mo", "Di", "Mi", "Do", "Fr", "Sa."]
 }},
timepicker:false,
format:'d.m.Y'
});
});
</script>

<hr id="TimePicker"/>
<h4>Only TimePicker Example <a href="#TimePicker">#</a></h4>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker2&#39;).datetimepicker({
	datepicker:false,
	format:&#39;H:i&#39;
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker2" type="text" value="23:16" /></p>
<script>$(function(){
$('#_datetimepicker2').datetimepicker({
  datepicker:false,
  format:'H:i'
});
});
</script>

<hr id="Inline"/>
<h4>Inline DateTimePicker Example <a href="#Inline">#</a></h4>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker3&#39;).datetimepicker({
  format:&#39;d.m.Y H:i&#39;,
  inline:true,
  lang:&#39;ru&#39;
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker3" type="text" value="10.12.2013 23:45" /></p>
<script>$(function(){
$('#_datetimepicker3').datetimepicker({
 format:'d.m.Y H:i',
 inline:true,
 lang:'en'
});
});
</script>

<hr id="trigger"/>
<h4>Icon trigger <a href="#trigger">#</a></h4>
<p>Click the icon next to the input field to show the datetimepicker</p>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker4&#39;).datetimepicker({
  format:&#39;d.m.Y H:i&#39;,
  lang:&#39;ru&#39;
});</code></pre>
and handler onclick event
<pre><code data-language="javascript">$(&#39;#image_button&#39;).click(function(){
  $(&#39;#datetimepicker4&#39;).datetimepicker(&#39;show&#39;); //support hide,show and destroy command
});</code></pre>
<p><strong>Result</strong></p>
<div class="row">
  <div class="col-lg-6">
    <div class="input-group">
      <input id="_datetimepicker4" type="text" value="10.12.2013 23:45" class="form-control">
      <span class="input-group-btn">
        <button id="image_button" class="btn btn-default" type="button"><span class="glyphicon glyphicon-calendar"></span></button>
      </span>
    </div><!-- /input-group -->
  </div><!-- /.col-lg-6 -->
</div><!-- /.row -->
<script>$(function(){
$('#_datetimepicker4').datetimepicker({
  format:'d.m.Y H:i',
  lang:'en'
});
$('#image_button').click(function(){
	$('#_datetimepicker4').datetimepicker('show'); 
});
});

</script>

<hr id="allowTimes"/>
<h4>allowTimes options TimePicker Example <a href="#allowTimes">#</a></h4>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker5&#39;).datetimepicker({
 datepicker:false,
 allowTimes:[
  &#39;12:00&#39;, &#39;13:00&#39;, &#39;15:00&#39;, 
  &#39;17:00&#39;, &#39;17:05&#39;, &#39;17:20&#39;, &#39;19:00&#39;, &#39;20:00&#39;
 ]
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker5" type="text" value="23:45" /></p>
<script>$(function(){
$('#_datetimepicker5').datetimepicker({
	datepicker:false,
	allowTimes:['12:00','13:00','15:00','17:00','17:05','17:20','19:00','20:00']
});
});
</script>

<hr id="onChangeDateTime"/>
<h4>handler onChangeDateTime Example <a href="#onChangeDateTime">#</a></h4>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker6&#39;).datetimepicker({
	timepicker:false,
	onChangeDateTime:function(dp,$input){
		alert($input.val())
	}
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker6" type="text" value="" /></p>
<script>$(function(){
$('#_datetimepicker6').datetimepicker({
 timepicker:false,
 onChangeDateTime:function(current_time,$input){
	alert($input.val())
 }
});
});
</script>

<hr id="mindate"/>
<h4>minDate and maxDate Example <a href="#mindate">#</a></h4>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker7&#39;).datetimepicker({
 timepicker:false,
 formatDate:&#39;Y/m/d&#39;,
 minDate:&#39;-1970/01/02&#39;,//yesterday is minimum date(for today use 0 or -1970/01/01)
 maxDate:&#39;+1970/01/02&#39;//tommorow is maximum date calendar
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker7" type="text" value="" /></p>
<script>$(function(){
$('#_datetimepicker7').datetimepicker({
	timepicker:false,
	formatDate:'Y/m/d',
	minDate:'-1970/01/02', // yesterday is minimum date
	maxDate:'+1970/01/02' // and tommorow is maximum date calendar
});
});
</script>

<hr id="mask"/>
<h4>Use mask input Example <a href="#mask">#</a></h4>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker_mask&#39;).datetimepicker({
 timepicker:false,
 mask:true, // &#39;9999/19/39 29:59&#39; - digit is the maximum possible for a cell
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker_mask" type="text" value="" /></p>
<script>$(function(){
$('#_datetimepicker_mask').datetimepicker({
	timepicker:false,
	mask:'9999/19/39',
	format:'Y/m/d'
});
});
</script>

<hr id="runtime_options"/>
<h4>Set options runtime DateTimePicker <a href="#runtime_options">#</a></h4>
<p>If select day is Saturday, the minimum set 11:00, otherwise 8:00</p>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">var logic = function( currentDateTime ){
	// &#39;this&#39; is jquery object datetimepicker
	if( currentDateTime.getDay()==6 ){
		this.setOptions({
			minTime:&#39;11:00&#39;
		});
	}else
		this.setOptions({
			minTime:&#39;8:00&#39;
		});
};
$(&#39;#datetimepicker_rantime&#39;).datetimepicker({
	onChangeDateTime:logic,
	onShow:logic
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker_runtime" type="text" value="" /></p>
<script>$(function(){
var logic = function( currentDateTime ){
	if( currentDateTime.getDay()==6 ){
		this.setOptions({
			minTime:'11:00'
		});
	}else
		this.setOptions({
			minTime:'8:00'
		});
};
$('#_datetimepicker_runtime').datetimepicker({
	onChangeDateTime:logic,
	onShow:logic
});
});
</script>
<hr id="ongenerate"/>
<h4>After generating a calendar called the event onGenerate <a href="#ongenerate">#</a></h4>
<p>Invert settings minDate and maxDate</p>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker8&#39;).datetimepicker({
	onGenerate:function( ct ){
		$(this).find(&#39;.xdsoft_date&#39;)
			.toggleClass('xdsoft_disabled');
	},
	minDate:&#39;-1970/01/2&#39;,
	maxDate:&#39;+1970/01/2&#39;,
	timepicker:false
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker_ongenerate" type="text" value="" /></p>
<script>$(function(){
$('#_datetimepicker_ongenerate').datetimepicker({
	onGenerate:function( ct ){
		$(this).find('.xdsoft_date')
			.toggleClass('xdsoft_disabled');
	},
	minDate:'-1970/01/2',
	maxDate:'+1970/01/2',
	timepicker:false
});
});
</script>
<hr id="weekends_disable"/>
<h4>disable all weekend <a href="#weekends_disable">#</a></h4>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(&#39;#datetimepicker9&#39;).datetimepicker({
	onGenerate:function( ct ){
		$(this).find(&#39;.xdsoft_date.xdsoft_weekend&#39;)
			.addClass('xdsoft_disabled');
	},
	weekends:[&#39;01.01.2014&#39;,&#39;02.01.2014&#39;,&#39;03.01.2014&#39;,&#39;04.01.2014&#39;,&#39;05.01.2014&#39;,&#39;06.01.2014&#39;],
	timepicker:false
});</code></pre>
<p><strong>Result</strong></p>
<p><input id="_datetimepicker_weekends_disable" type="text" value="" /></p>
<script>$(function(){
$('#_datetimepicker_weekends_disable').datetimepicker({
	onGenerate:function( ct ){
		$(this).find('.xdsoft_date.xdsoft_weekend')
			.addClass('xdsoft_disabled');
	},
	weekends:['01.01.2014','02.01.2014','03.01.2014','04.01.2014','05.01.2014','06.01.2014'],
	timepicker:false
});
});
</script>
<hr id="range"/>
<h4>Range between date<a href="#range">#</a></h4>
<p><strong>javaScript</strong></p>
<pre><code data-language="javascript">$(function(){
 $(&#39;#date_timepicker_start&#39;).datetimepicker({
  format:&#39;Y/m/d&#39;,
  onShow:function( ct ){
   this.setOptions({
    maxDate:$(&#39;#date_timepicker_end&#39;).val()?$(&#39;#date_timepicker_end&#39;).val():false
   })
  },
  timepicker:false
 });
 $(&#39;#date_timepicker_end&#39;).datetimepicker({
  format:&#39;Y/m/d&#39;,
  onShow:function( ct ){
   this.setOptions({
    minDate:$(&#39;#date_timepicker_start&#39;).val()?$(&#39;#date_timepicker_start&#39;).val():false
   })
  },
  timepicker:false
 });
});</code></pre>
<p><strong>Result</strong></p>
<p>
	Start <input id="date_timepicker_start" type="text" value="" placeholder="start" />&nbsp;
	End <input id="date_timepicker_end" type="text" value="" placeholder="end" />
</p>
<script>$(function(){
	$('#date_timepicker_start').datetimepicker({
		format:'Y/m/d',
		onShow:function( ct ){
			this.setOptions({
				maxDate:$('#date_timepicker_end').val()?$('#date_timepicker_end').val():false
			})
		},
		timepicker:false
	});
	$('#date_timepicker_end').datetimepicker({
		format:'Y/m/d',
		onShow:function( ct ){
			this.setOptions({
				minDate:$('#date_timepicker_start').val()?$('#date_timepicker_start').val():false
			})
		},
		timepicker:false
	});
});
</script>
<h2>Full options list</h2>
<table class="table table-condensed table-bordered table-striped">
	<thead>
		<tr>
			<th style="text-align: center;"><strong>Name</strong></th>
			<th style="text-align: center;"><strong>&nbsp;default</strong></th>
			<th style="text-align: center;"><strong>Descr</strong></th>
			<th style="width:200px;text-align: center;"><strong>Ex.</strong></th>
		</tr>
	</thead>
	<tbody>
		<tr id="value">
			<td><a href="#value">value</a></td>
			<td>null</td>
			<td>Current value datetimepicker. If it is set, ignored input.value</td>
			<td>
			<pre><code data-language="javascript">{value:&#39;12.03.2013&#39;,
 format:&#39;d.m.Y&#39;}</code></pre>
			</td>
		</tr>
		<tr id="lang">
			<td><a href="#lang">lang</a></td>
			<td>en</td>
			<td>Language i18n<br>
			<strong>en</strong> - English<br>
			<strong>ru</strong> - Russian<br>
			<strong>de</strong> - German<br>
			<strong>nl</strong> - Dutch<br>
			<strong>tr</strong> - Turkish<br>
			<strong>fr</strong> - French<br>
			<strong>es</strong> - Spanish<br>
			<strong>th</strong> - Thai<br>
			<strong>pl</strong> - Polish<br>
			<strong>pl</strong> - Polish<br>
			<strong>ch</strong> - Simplified Chinese<br>
			<td>
			<pre><code data-language="javascript">{lang:&#39;ru&#39;}</code></pre>
			</td>
		</tr>
		<tr id="format">
			<td><a href="#format">format</a></td>
			<td>Y/m/d H:i</td>
			<td>Format datetime. <a href="http://php.net/manual/ru/function.date.php" target="_blank">More</a>&nbsp;</td>
			<td>
			<pre><code data-language="javascript">{format:&#39;H&#39;}
{format:&#39;Y&#39;}</code></pre>
			</td>
		</tr>
		<tr id="formatDate">
			<td><a href="#formatDate">formatDate</a></td>
			<td>Y/m/d</td>
			<td>Format date for minDate and maxDate</td>
			<td><pre><code data-language="javascript">{formatDate:&#39;d.m.Y&#39;}</code></pre></td>
		</tr>
		<tr id="formatTime">
			<td><a href="#formatTime">formatTime</a></td>
			<td>H:i</td>
			<td>&nbsp;Similarly, formatDate . But for minTime and maxTime</td>
			<td><pre><code data-language="javascript">{formatTime:&#39;H&#39;}</code></pre></td>
		</tr>
		<tr id="step">
			<td><a href="#step">step</a></td>
			<td>60</td>
			<td>Step time</td>
			<td>
			<pre><code data-language="javascript">{step:5}</code></pre>
			</td>
		</tr>
		<tr id="closeOnDateSelect">
			<td><a href="#closeOnDateSelect">closeOnDateSelect</a></td>
			<td>0</td>
			<td>
			
			</td>
			<td><pre><code data-language="javascript">{closeOnDateSelect:true}</code></pre></td>
		</tr>
		<tr id="closeOnWithoutClick">
			<td><a href="#closeOnWithoutClick">closeOnWithoutClick</a></td>
			<td>true</td>
			<td></td>
			<td><pre><code data-language="javascript">{ closeOnWithoutClick :false}</code></pre></td>
		</tr>		
		<tr id="validateOnBlur">
			<td><a href="#validateOnBlur">validateOnBlur</a></td>
			<td>true</td>
			<td>Verify datetime value from input, when losing focus. If value is not valid datetime, then to value inserts the current datetime</td>
			<td><pre><code data-language="javascript">{ validateOnBlur:false}</code></pre></td>
		</tr>
		<tr id="timepicker">
			<td><a href="#timepicker">timepicker</a></td>
			<td>true</td>
			<td></td>
			<td><pre><code data-language="javascript">{timepicker:false}</code></pre></td>
		</tr>
		<tr id="datepicker">
			<td><a href="#datepicker">datepicker</a></td>
			<td>true</td>
			<td></td>
			<td><pre><code data-language="javascript">{datepicker:false}</code></pre></td>
		</tr>
		<tr id="minDate">
			<td><a href="#minDate">minDate</a></td>
			<td>false</td>
			<td></td>
			<td><pre><code data-language="javascript">{minDate:0} // today
{minDate:&#39;2013/12/03&#39;}
{minDate:&#39;-1970/01/02&#39;} // yesterday
{minDate:&#39;05.12.2013&#39;,formatDate:&#39;d.m.Y&#39;}</code></pre></td>
		</tr>
		<tr id="maxDate">
			<td><a href="#maxDate">maxDate</a></td>
			<td>false</td>
			<td></td>
			<td><pre><code data-language="javascript">{maxDate:0,}
{maxDate:&#39;2013/12/03&#39;}
{maxDate:&#39;+1970/01/02&#39;} // tommorrow
{maxDate:&#39;05.12.2013&#39;,formatDate:&#39;d.m.Y&#39;}</code></pre></td>
		</tr>
		<tr id="minTime">
			<td><a href="#minTime">minTime</a></td>
			<td>false</td>
			<td></td>
			<td><pre><code data-language="javascript">{minTime:0,}// now
{minTime:&#39;12:00&#39;}
{minTime:&#39;13:45:34&#39;,formatTime:&#39;H:i:s&#39;}</code></pre></td>
		</tr>
		<tr id="maxTime">
			<td><a href="#maxTime">maxTime</a></td>
			<td>false</td>
			<td></td>
			<td><pre><code data-language="javascript">{maxTime:0,}
{maxTime:&#39;12:00&#39;}
{maxTime:&#39;13:45:34&#39;,formatTime:&#39;H:i:s&#39;}</code></pre></td>
		</tr>
		<tr id="allowTimes">
			<td><a href="#allowTimes">allowTimes</a></td>
			<td>[]</td>
			<td></td>
			<td><pre><code data-language="javascript">{allowTimes:[
	&#39;09:00&#39;,
	&#39;11:00&#39;,
	&#39;12:00&#39;,
	&#39;21:00&#39;
]}</code></pre></td>
		</tr>
		<tr id="mask">
			<td><a href="#mask">mask</a></td>
			<td>false</td>
			<td>Use mask for input. true - automatically generates a mask on the field &#39;format&#39;, Digit from 0 to 9, set the highest possible digit for the value. For example: the first digit of hours can not be greater than 2, and the first digit of the minutes can not be greater than 5</td>
			<td><pre>{mask:&#39;9999/19/39&#39;,format:&#39;Y/m/d&#39;}
{mask:true,format:&#39;Y/m/d&#39;} // automatically generate a mask 9999/99/99
{mask:&#39;29:59&#39;,format:&#39;H:i&#39;} //
{mask:true,format:&#39;H:i&#39;} //automatically generate a mask 99:99</pre></td>
		</tr>
		<tr id="opened">
			<td><a href="#opened">opened</a></td>
			<td>false</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="yearoffset">
			<td><a href="#yearoffset">yearOffset</a></td>
			<td>0</td>
			<td>Year offset for Buddhist era</td>
			<td>&nbsp;</td>
		</tr>
		<tr id="inline">
			<td><a href="#inline">inline</a></td>
			<td>false</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="todayButton">
			<td><a href="#todayButton">todayButton</a></td>
			<td>true</td>
			<td>Show button "Go To Today"</td>
			<td>&nbsp;</td>
		</tr>
		<tr id="defaultSelect">
			<td><a href="#defaultSelect">defaultSelect</a></td>
			<td>true</td>
			<td>Highlight the current date even if the input is empty</td>
			<td>&nbsp;</td>
		</tr>
		<tr id="allowBlank">
			<td><a href="#allowBlank">allowBlank</a></td>
			<td>false</td>
			<td>Allow field to be empty even with the option <a href="#validateOnBlur">validateOnBlur</a> in true</td>
			<td>&nbsp;</td>
		</tr>		
		<tr id="timepickerScrollbar">
			<td><a href="#timepickerScrollbar">timepickerScrollbar</a></td>
			<td>true</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="onSelectDate">
			<td><a href="#onSelectDate">onSelectDate</a></td>
			<td>function(){}</td>
			<td></td>
			<td><pre><code data-language="javascript">onSelectDate:function(current_time,$input){
  alert(current.dateFormat(&#39;d/m/Y&#39;))
}</code></pre></td>
		</tr>
		<tr id="onSelectTime">
			<td><a href="#onSelectTime">onSelectTime</a></td>
			<td>function(){}</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="onChangeMonth">
			<td><a href="#onChangeMonth">onChangeMonth</a></td>
			<td>function(){}</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="onChangeDateTime">
			<td><a href="#onChangeDateTime">onChangeDateTime</a></td>
			<td>function(){}</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="onShow">
			<td><a href="#onShow">onShow</a></td>
			<td>function(){}</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="onClose">
			<td><a href="#onClose">onClose</a></td>
			<td>function(){}</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="onGenerate">
			<td><a href="#onGenerate">onGenerate</a></td>
			<td>function(){}</td>
			<td>trigger after construct calendar and timepicker</td>
			<td>&nbsp;</td>
		</tr>
		<tr ="withoutCopyright">
			<td>withoutCopyright</td>
			<td>true</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="inverseButton">
			<td><a href="#inverseButton">inverseButton</a></td>
			<td>false</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="scrollMonth">
			<td><a href="#scrollMonth">scrollMonth</a></td>
			<td>true</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>		
		<tr id="scrollTime">
			<td><a href="#scrollTime">scrollTime</a></td>
			<td>true</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="scrollInput">
			<td><a href="#scrollInput">scrollInput</a></td>
			<td>true</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="hours12">
			<td><a href="#hours12">hours12</a></td>
			<td>false</td>
			<td></td>
			<td>&nbsp;</td>
		</tr>
		<tr id="yearStart">
			<td><a href="#yearStart">yearStart</a></td>
			<td>1950</td>
			<td>Start value for fast Year selector</td>
			<td>&nbsp;</td>
		</tr>
		<tr id="yearEnd">
			<td><a href="#yearEnd">yearEnd</a></td>
			<td>2050</td>
			<td>End value for fast Year selector</td>
			<td>&nbsp;</td>
		</tr>
		<tr id="roundTime">
			<td><a href="#roundTime">roundTime</a></td>
			<td>round</td>
			<td>Round time in timepicker, possible values: round, ceil, floor</td>
			<td><pre><code data-language="javascript">{roundTime:&#39;floor&#39;}</code></pre></td>
		</tr>
		<tr id="dayOfWeekStart">
			<td><a href="#dayOfWeekStart">dayOfWeekStart</a></td>
			<td>0</td>
			<td>
			<p>Star week DatePicker. Default Sunday - 0.</p>

			<p>Monday - 1 ...</p>
			</td>
			<td>&nbsp;</td>
		</tr>
		<tr id="className"><td>className</td><td></td><td></td><td></td></tr>
		<tr id="weekends"><td><a href="#weekends">weekends</a></td><td>[]</td><td></td><td><pre><code data-language="javascript">[&#39;01.01.2014&#39;,&#39;02.01.2014&#39;,&#39;03.01.2014&#39;,&#39;04.01.2014&#39;,&#39;05.01.2014&#39;,&#39;06.01.2014&#39;]</code></pre></td></tr>
		<tr id="id"><td>id</td><td></td><td></td><td></td></tr>
		<tr id="style"><td>style</td><td></td><td></td><td></td></tr>
	</tbody>
</table>
