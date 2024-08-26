// https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
// Fetch data from the API

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    const dataset = data.data;

    // Set up chart dimensions
    const width = 800;
    const height = 400;
    const padding = 40;

    // Create SVG element
    const svg = d3
      .select(".visHolder")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Update yScale domain to go from 0 to 18000
    const yScale = d3
      .scaleLinear()
      .domain([0, 18000])
      .range([height - padding, padding]);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain([
        new Date(dataset[0][0]),
        new Date(dataset[dataset.length - 1][0]),
      ])
      .range([padding, width - padding]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - padding})`)
      .style("font-size", "14px")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis)
      .style("font-size", "8px");

    // Create bars
    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(new Date(d[0])))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", (width - 2 * padding) / dataset.length)
      .attr("height", (d) => height - padding - yScale(d[1]))
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        // Change bar color
        d3.select(this).attr("fill", "red");

        // Generate random colors for the gradient
        const color1 = d3.rgb(
          Math.random() * 255,
          Math.random() * 255,
          Math.random() * 255
        );
        const color2 = d3.rgb(
          Math.random() * 255,
          Math.random() * 255,
          Math.random() * 255
        );

        // Create and apply the gradient to the body
        const gradient = `linear-gradient(to right, ${color1}, ${color2})`;
        d3.select("#body").style("background", gradient);

        // Create and show tooltip
        const [x, y] = d3.pointer(event);
        const tooltip = d3
          .select(".visHolder")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background-color", "gray")
          .style("border", "1px solid #ddd")
          .style("padding", "10px")
          .style("opacity", 0);

        tooltip.transition().duration(200).style("opacity", 0.9);

        tooltip
          .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
          .style("left", x + 10 + "px")
          .style("top", y - 28 + "px");
      })
      .on("mouseout", function () {
        // Reset bar color
        d3.select(this).attr("fill", "steelblue");
        // Remove tooltip
        d3.select(".tooltip").remove();
        // Reset body background (optional, remove if you want to keep the gradient)
        d3.select("#body").style("background", "");
      });

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", padding)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")

      .text("United States GDP");
  })
  .catch((error) => console.error("Error fetching data:", error));
