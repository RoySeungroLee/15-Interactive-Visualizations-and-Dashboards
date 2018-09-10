function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(`/metadata/${sample}`).then(function(data){
    var sampleMetaData = data;
    // Use `.html("") to clear any existing metadata
    d3.select('#sample-metadata').html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleMetaData).forEach(([key,value])=>{
      var metaData=d3.select('#sample-metadata').append('div')
      metaData.append('p').text(`${key}: ${value}`)
    });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then(function(data){
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
      var ids_list=[];
      var labels_list=[];
      var values_list=[];
      ids_list=data.otu_ids.slice(0,10);
      labels_list=data.otu_labels.slice(0,10);
      values_list=data.sample_values.slice(0,10);
    // @TODO: Build a Bubble Chart using the sample data
    d3.select("#bubble").html("")
    var bubble_layout= {
      xaxis: {title:"otu_ids"}
    }

    Plotly.newPlot(
      'bubble',
      [{x:data.otu_ids,
      y:data.sample_values,
      mode:'markers',
      marker:{
        size:data.sample_values,
        color:data.otu_ids
      },
      text:data.otu_labels
      }],
      bubble_layout
    );
    
    // @TODO: Build a Pie Chart
      // Data
    var pie_chart_data = [{
      values: values_list,
      labels:ids_list,
      type:'pie'
    }];
      // Layout
     var layout = {};
      // Build Plot
    Plotly.newPlot("pie", pie_chart_data, layout);
    })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
