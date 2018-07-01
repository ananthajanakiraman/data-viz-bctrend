      !(function (d3) {
	      
      $("acontent").empty();
	      
      $(document).ready(function() {
         console.log("Hello world.")
        });

	document.getElementById("BFYR").checked = true;
	      
	var val = d3.select('input[name="BTHY"]:checked').node().value;
	      
       var margin = {
         top: 20,
         right: 80,
         bottom: 30,
         left: 50
       },
       width = 1140 - margin.left - margin.right,
       height = 520 - margin.top - margin.bottom;
	      
       var parseDate1 = d3.timeFormat("%Y-%m-%d").parse;
       var parseDate  = d3.timeParse("%Y-%m-%d"),
	   bisectDate = d3.bisector(function(d) { return d.date; }).left;
       var formatTime = d3.timeFormat("%e %B %Y");

       var div = d3.select("body").append("div")
                   .attr("class", "tooltip")
                   .style("opacity", 0);

       var x = d3.scaleTime()
                 .range([0, width]);

       var y = d3.scaleLinear()
                 .range([height, 0]);
        
       //Color exists as a Scale. 
       var color = d3.scaleOrdinal(d3.schemeCategory10);

       var xAxis = d3.axisBottom(x);

       var yAxis = d3.axisLeft(y);
       
       var line = d3.line()
                    .curve(d3.curveCardinal)
                    .x(function(d) {
                       return x(d.date);
                     })
                    .y(function(d) {
                       return y(d.price);
                     });

        var area = d3.area()
	             .curve(d3.curveCardinal)
                    .x(function(d) {
                       return x(d.date);
                     })
                    .y1(function(d) {
                       return y(d.price);
                     });
        
        var svg = d3.select("acontent").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        var labels = {
            "BITCOIN"  : "Bitcoin"
        }
        
       d3.tsv("databit"+val+".tsv", function(error, data) {
             if (error) throw error; 
            
             data.forEach(function(d) {
                  d.date = parseDate(d.Date);
		  d.price = +d.BITCOIN;
           });

         data.sort(function(a, b) {
              return a.date - b.date;
           });

       x.domain(d3.extent(data, function(d) {
             return d.date;
           }));
	       
        y.domain([
                0,
		d3.max(data, function(d) {return d.price;})
          ]);
	area.y0(y(0));
	       
	svg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis);
           
        svg.append("g")
             .attr("transform", "translate(0,0)")
             .attr("class", "y axis")
             .call(yAxis);
          
	 svg.append("g")
	     .append("text")
	     .attr("transform", "rotate(0)")
             .attr("y", 6)
             .attr("dx", "8em")
             .style("text-anchor", "end")
             .text("Closing Price ($)");

	  svg.append("path")
	      .data([data])
	      .attr("class", "line")
              .attr("d", line);
	
	  svg.append("path")
	      .data([data])
	      .attr("class","area")
              .attr("d", area);
	       
	   var focus = svg.append("g")
	        .attr("opacity",0)
		.attr("class", "focus");
	
	   focus.append("circle")
	        .attr("class","circle")
	        .attr("r", 3);
	
	   focus.append("line").attr("class", "x--line")
 	        .style("stroke", "#777")
		.style("shape-rendering", "crispEdges")
		.style("stroke-dasharray", "1,1")
		.style("opacity", 0.8)
		.attr("y1",-height)
		.attr("y2",0);
	       
	   focus.append("line").attr("class", "y--line")
 	        .style("stroke", "#777")
		.style("shape-rendering", "crispEdges")
		.style("stroke-dasharray", "1,1")
		.style("opacity", 0.8)
		.attr("x1",-width)
		.attr("x2",0);

	   focus.append("text").attr("class", "y1--text")
		.style("stroke", "white")
		.style("stroke-width", "3px")
		.style("opacity", 0.8)
		.attr("dx", 8)
		.attr("dy", "0em");
	       
	   focus.append("text").attr("class", "y2--text")
		.attr("fill","#000")
		.attr("dx", 8)
		.attr("dy", "0em");
	
	focus.append("text").attr("class", "y3--text")
		.style("stroke", "white")
		.style("stroke-width", "3px")
		.style("opacity", 0.8)
		.attr("dx", 8)
		.attr("dy", "1em");
		
	focus.append("text").attr("class", "y4--text")
		.attr("fill","#000")
		.attr("dx", 8)
		.attr("dy", "1em");
	       
	svg.append("rect")
	   .attr("class", "overlay")
	   .attr("width",width)
	   .attr("height",height)
	   .on("mouseover", function() { focus.style("opacity", 1); })
	   .on("mouseout", function() { focus.style("display","none"); })
	   .on("mousemove", mousemove); 

	    function mousemove() {
		var x0 = x.invert(d3.mouse(this)[0]),
	            i = bisectDate(data, x0, 1),
		    d0 = data[i - 1],
		    d1 = data[i],
		    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
		focus.style("display", null);
	         focus.select("text.y3--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus.select("text.y4--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus.select("text.y1--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
	         focus.select("text.y2--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
                 focus.select(".circle").attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");
	         focus.select(".x--line").attr("transform", "translate(" + x(d.date) + "," + height + ")");
	         focus.select(".y--line").attr("transform", "translate(" + width + "," + y(d.price) + ")");
				      }
	       
        svg.selectAll(".dot")
             .data(data)
             .enter().append("circle")
             .attr("class", "dot")
             .attr("cx", function(d) {
                   return x(d.date); 
                 })
             .attr("cy", function(d) {
                   return y(d.price); 
                 })
             .attr("r", 5)
	        .on("mouseover", function() {focus.style("display", null);})
	        .on("mousemove", function(d) {
		 focus.style("display", null);
                 focus.select("text.y3--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus.select("text.y4--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 6) + ")")
	              .text(formatTime(d.date));
	         focus.select("text.y1--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
	         focus.select("text.y2--text").attr("transform", "translate(" + x(d.date) + "," + (height/2 - 16) + ")")
	              .text("$" + d.price);
                 focus.select(".circle").attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");
	         focus.select(".x--line").attr("transform", "translate(" + x(d.date) + "," + height + ")");
	         focus.select(".y--line").attr("transform", "translate(" + width + "," + y(d.price) + ")");		
	
	      });
	       
               var maximum1 = d3.max(data, function(d) {return d.price;});
 	       var maximumObj = data.filter(function(d) {return d.price == maximum1;})[0];
	       
               var minimum1 = d3.min(data, function(d) {return d.price;});
 	       var minimumObj = data.filter(function(d) {return d.price == minimum1;})[0];  	       
	       
	       var maxCircle = svg.append("circle")
                                  .attr("class", "maxCircle")
  	                          .attr("cx", x(maximumObj.date))
                                  .attr("cy", y(maximumObj.price))
                                  .attr("r", 10)
                                  .attr("fill", "none")
                                  .attr("stroke", "Lime")
                                  .attr("stroke-width", "2px");
                repeat();
	       
                var minCircle = svg.append("circle")
	                          .attr("class", "minCircle")
  	                          .attr("cx", x(minimumObj.date))
                                  .attr("cy", y(minimumObj.price))
                                  .attr("r", 10)
                                  .attr("fill", "none")
                                  .attr("stroke", "red")
                                  .attr("stroke-width", "2px");
	       

	        repeat1();
	       
		function repeat() {
			 maxCircle.transition()
				  .duration(2000)
			          .attr("r", 2)
				  .transition()
				  .duration(1000)
				  .attr("r", 16)
				  .on("end", repeat);
			};
	       
	        function repeat1() {
			          minCircle.transition()
				  .duration(2000)
			          .attr("r", 2)
				  .transition()
				  .duration(1000)
				  .attr("r", 16)
				  .on("end", repeat1);
		        };
	       
	       	svg.append("text")
	        .attr("class","maxValue")
		.attr("x",width/2-100)
		.attr("y",y(maximum1))
		.text('Peak: ' + '$' + maximum1)
	        .style("font-size","10px")
	        .style("font-weight", "bold")
	        .style("font-family","sans-serif")
	       
	       	svg.append("text")
	        .attr("class","minValue")
		.attr("x",width/2+10)
		.attr("y",y(maximum1))
		.text('Lowest: ' + '$' + minimum1)
	        .style("font-size","10px")
	        .style("font-weight", "bold")
	        .style("font-family","sans-serif")
	       	       
	         svg.append("text")
	        .attr("class","text1")
		.attr("x",width/2-200)
		.attr("y",height/2-50)
		.text("From Steady Increase in 2012 to Big Ride in 2013 and Big Downfall in 2014")
	        .style("font-size","14px")
	        .style("font-weight", "bold")
	        .style("font-family","sans-serif")  
	       
       d3.selectAll('input[name="BTHY"]').on("change", change);
	       
       function change() {
       
	       var val1 = d3.select('input[name="BTHY"]:checked').node().value;
	       
	       d3.tsv("databit"+val1+".tsv", function(error, data) {
                  if (error) throw error; 
            
                  data.forEach(function(d) {
                  d.date = parseDate(d.Date);
		  d.price = +d.BITCOIN;

                  });
		
                  data.sort(function(a, b) {
                       return a.date - b.date;
                  });

                  x.domain(d3.extent(data, function(d) {
                       return d.date;
                  }));
	       
                  y.domain([
                      0,
	       	      d3.max(data, function(d) {return d.price;})
                  ]);
	          area.y0(y(0));		       
		  
	          var maximum1 = d3.max(data, function(d) {return d.price;});
 	          var maximumObj = data.filter(function(d) {return d.price == maximum1;})[0];
		       
	          var minimum1 = d3.min(data, function(d) {return d.price;});
 	          var minimumObj = data.filter(function(d) {return d.price == minimum1;})[0];	
		  
		  console.log(maximum1, minimum1, maximumObj, minimumObj);
		       
	          var svg = d3.select("acontent").transition().ease(d3.easeCubic).duration(1000);
		       
                  svg.select(".line")   // change the line
                     .duration(1000)
                     .attr("d", line(data));
                  svg.select(".area")		      
                     .duration(1000)
	             .attr("d",area(data));
                  svg.select(".x.axis") // change the x axis
                     .duration(1000)
                     .call(xAxis);
                  svg.select(".y.axis") // change the y axis
                     .duration(1000)
                     .call(yAxis);  	
		  svg.selectAll(".maxValue").attr("y",y(maximum1)).text('Peak: ' + '$' + maximum1)
	          svg.selectAll(".minValue").attr("y",y(maximum1)).text('Lowest: ' + '$' + minimum1);
		       
                  maxCircle.attr("cx", x(maximumObj.date))
	             .attr("cy", y(maximumObj.price));

                  minCircle.attr("cx", x(minimumObj.date))
	             .attr("cy", y(minimumObj.price));	

                if (val1 == "1YR") {	       
	         svg.selectAll(".text1")
		.attr("x",width/2-100)			
		.text("2016 - A Nail Biter")  };
		       

                if (val1 == "5YR") {	       
	         svg.selectAll(".text1")
		.attr("x",width/2-200)			
		.text("From Steady Increase in 2012 to Big Ride in 2013 and Big Downfall in 2014")  };		       
		       
                if (val1 == "3YR") {	       
	         svg.selectAll(".text1")
		.attr("x",width/2-200)				
		.text("Revived from 2014 downfall and ended strong in 2015")  };	
		       
                if (val1 == "6MO") {	       
	         svg.selectAll(".text1")
		.attr("x",width/2-100)			
		.text("2017 - All Time High Twice")  };
		       
                if (val1 == "1MO") {	       
	         svg.selectAll(".text1")
		.attr("x",width/2-100)			
		.text("2017 3rd Quarter Bubble is about to burst")  };		       
		       
		       
	       });
           }
	       
       }); 
      })(d3);
