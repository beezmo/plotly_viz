function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = '/metadata/' + sample
  d3.json(url).then(function(response) {
    console.log(response);
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var display = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    display.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(function([key, value]) {
      var row = display.append("p");
      console.log(key, value);
      row.text(key + " " + value);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = '/samples/' + sample
  d3.json(url).then(function(response) {

    var values = response.sample_values
    var ids = response.otu_ids
    var labels = response.otu_labels

    // @TODO: Build a Bubble Chart using the sample data
    var trace = {
      x: ids,
      y: values,
      mode: "markers",
      type: "scatter",
      hovertext: labels,
      hoverinfo: "text",
      marker: {
        size: values,
        color: ids,
      }
    };

    data = [trace];

    var layout = {
      xaxis: { title: "OTU ID"}
    };

    Plotly.plot("bubble", data, layout, {responsive: true});

    // @TODO: Build a Pie Chart

    var topValues = response.sample_values.slice(0,10);
    var topIds = response.otu_ids.slice(0,10);
    var topLabels = response.otu_labels.slice(0,10);

    data = [{
      "labels": topIds,
      "values": topValues,
      "hovertext": topLabels,
      "hoverinfo": "text",
      "type": "pie"
    }];

    var layout = {
      title: "Percentage of Top 10 Samples"}
      Plotly.plot('pie', data, layout, {responsive: true});

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
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
