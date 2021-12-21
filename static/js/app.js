






// function that populates the meta data
function demoInfo(sample)
{
    // console.log(sample)

    //use d3.json in order to get the data 
    d3.json("./samples.json").then((data) => { 
        
        // grab all metadata
        
        let metadata = data.metadata;
        //console.log(metadata);

        //filter based on value of the sample (should return 1 result in an array based on dataset)
        let result = metadata.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from array
        let resultData = result[0]
        // console.log(resultData);

        // clear metadata out
        d3.select("#sample-metadata").html(""); //clears the HTML out

        // use object.entries to get value key pairs. 
        Object.entries(resultData).forEach(([key, value]) => {
            // add to the sample data / demographics section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}
// function that builds the bar chart
function buildBarChart(sample)
{
    // console.log(sample);
    //let data = d3.json("./samples.json"); 
    //console.log(data)

    d3.json("./samples.json").then((data) => { 
        
        // grab all samples
        let sampleData = data.samples;
        console.log(sampleData);
        
        //filter based on value of the sample (should return 1 result in an array based on dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from array
        let resultData = result[0];

        // get the OTU IDs 
        let otu_ids = resultData.otu_ids; 
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values; 

        console.log(otu_ids);
        console.log(otu_labels);
        console.log(sample_values); 

        // build bar chart
        // get the yticks
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0,10);
        let textLabels = otu_labels.slice(0,10);
        
        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout); 

    });
}

//funciont that builds the bubble chart
function buildBubbleChart(sample)
{
// console.log(sample);
    //let data = d3.json("./samples.json"); 
    //console.log(data)

    d3.json("./samples.json").then((data) => { 
        
        // grab all samples
        let sampleData = data.samples;
        console.log(sampleData);
        
        //filter based on value of the sample (should return 1 result in an array based on dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from array
        let resultData = result[0];

        // get the OTU IDs 
        let otu_ids = resultData.otu_ids; 
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values; 

        console.log(otu_ids);
        console.log(otu_labels);
        console.log(sample_values); 

        // build bubble chart
        
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout); 

    });
}

// function that initializes the dashboard.
function initialize()
{

    //let data = d3.json("./samples.json"); 
    //console.log(data)

    //access the dropdown selector from the index.html file
    var select = d3.select("#selDataset");

    //use d3.json in order to get the data 
     d3.json("./samples.json").then((data) => { 
        let sampleNames = data.names; // made array of just names
        // console.log(sampleNames);

        // use a for each in order to create options for each sample
        // in the selector

        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
            
        });

        // when initialized, pass in the information for the first sample
        let sample1 = sampleNames[0];

        // call the function to build metadata
        demoInfo(sample1);

        // call function to build bar chart
        buildBarChart(sample1)

        // call function to build bubble chart
        buildBubbleChart(sample1);
     });

     
}

// function that updates the dashboard
function optionChanged(item)
{
    // call update to metadata
    demoInfo(item);
    // call function to build the bar chart
    buildBarChart(item);
    // call funtion to build the bubble chart
    buildBubbleChart(item)
}

// call the initialize function
initialize();