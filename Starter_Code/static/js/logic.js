const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain([100, 0]);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then((data) => {
    const earthquakes = data.features;
    
    let myMap = L.map("map", {
        center: [38.8053, -122.7808],
        zoom: 5
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(myMap);
      
      function markerSize(magnitude) {
        return magnitude * 10000;
      }
      
      earthquakes.forEach((earthquake) => {
        const [longitude, latitude, depth] = earthquake.geometry.coordinates;
        
        const color = colorScale(depth);
        // Use latitude and longitude to create a marker, ignoring depth if not needed.
        const marker = L.circle([latitude, longitude], {
            radius: markerSize(earthquake.properties.mag),
            color: color
        }); // Example for Leaflet
        marker.addTo(myMap).bindPopup(`Location: ${earthquake.properties.place} <br> Magnitude: ${earthquake.properties.mag} <br> Depth: ${depth} km`);
    });
      
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
      const div = L.DomUtil.create("div", "info legend");
      div.style.backgroundColor = "white";
      div.style.padding = "8px";
      div.style.borderRadius = "5px";
      div.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.2)";
  
      const depths = [0, 10, 30, 50, 70, 90, 100]; // Depth intervals
      const labels = [];
  
      // Generate a label for each depth interval
      for (let i = 0; i < depths.length - 1; i++) {
          const color = colorScale(depths[i]);
          
          labels.push(
              `<i style="background-color: ${color}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> 
               ${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] : "+"} km`
          );
      }
  
      div.innerHTML = "<h4>Depth (km)</h4>" + labels.join("<br>");
      return div;
  };
  
  

    legend.addTo(myMap);
});



