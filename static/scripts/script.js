
// original image dimensions ('environment.png')
var width = 1000;
var height = 650;
var aspectRatio = width/height;

//get size of container:
var figContainer = document.getElementById("figure-container");
var containerWidth = figContainer.clientWidth;
var containerHeight = figContainer.clientHeight;
var renderWidth = containerWidth;
var renderHeight = renderWidth/aspectRatio;



// Matrix to store cell states to use.
var walkabilityMatrix = []

function preload(){
    img = loadImage("data/environment.png");  // Load the image
}

// Factors to rescale output of pathfinder
var factorWidth;
var factorHeight;

function setup() {
  var canvas = createCanvas(containerWidth, renderHeight);
//  img = loadImage("data/environment.png");  // Load the image
  canvas.parent('figure-container');
  //cater for Retina display
  pixelDensity(1);
  // preload image
  image(img, 0, 0, renderWidth, renderHeight);
  

  loadPixels();
  for (var row=0; row<height; row++){
      innerMatrix = [];
      for (var col=0; col<width; col++){
          idx = (col+(row*width))*4  
          pixelValue = pixels[idx];
          // 255 represents white pixels. We need to convert
          // to 0 (white) and 1(black) pixels
          pixelValue = Math.abs(1-parseInt(pixelValue/255));

          innerMatrix.push(pixelValue);
      };
    walkabilityMatrix.push(innerMatrix);


  };
};

var points_coord=[];


function draw() {
    // Render Image
    image(img, 0, 0, renderWidth, renderHeight);
    
    if (points_coord.length < 2){
        var s = 'Select starting point';
        fill(255, 0, 0);
    } 
    else if (points_coord.length < 4){
        var s = 'Select ending point';
        fill(0, 128, 0);
        
    
    }
    else{
        var s = "";  
    };
    // Write text
    textSize(14);
    
    text(s, 10, 10, 70, 80);

    // Draw starting and ending points
    fill(255, 0, 0);
    ellipse(points_coord[0], points_coord[1],10);
    fill(0, 128, 0);
    ellipse(points_coord[2], points_coord[3],10);

    // Define grid   
    var grid = new PF.Grid(walkabilityMatrix);

    console.log(walkabilityMatrix);

    // Use AStar
    var finder = new PF.BiAStarFinder({
        allowDiagonal: true,
        dontCrossCorners: true

        });

    if (points_coord.length == 4){
        // points_coord are in canvas coordinates. We need to scale them to image coordinates
        x1 = parseInt(points_coord[0]);
        y1 =parseInt(points_coord[1]);
        x2 = parseInt(points_coord[2]);
        y2 =  parseInt(points_coord[3]);
        console.log("Points in image coordinates")
        console.log(x1,y1,x2,y2);

        console.log(walkabilityMatrix);

        var path= finder.findPath(x1, y1, x2, y2, grid);
        console.log(path);
        var gridBackup = grid.clone();
        if (path.length >0){
        var newPath = PF.Util.smoothenPath(gridBackup, path);
        var finalPath = PF.Util.compressPath(newPath);
        };

        console.log(parseInt(points_coord[3]),parseInt(points_coord[4]));
        console.log(finalPath);
        startX = points_coord[0];
        startY = points_coord[1];

        if (path.length == 0){
            textSize(14);
            fill(255, 0, 0);
             text("There is no possible path", 10, 10, 70, 80);
        } else{
        finalPath.forEach((d)=>{
            
            strokeWeight(4);
            stroke(0, 0, 255);
            line(startX,startY,d[0],d[1]);
            startX = d[0];
            startY = d[1];
        })
    }};




};


function mouseClicked(){
    
    
    if (points_coord.length < 4){
        
        points_coord.push(mouseX,mouseY);
        if (points_coord.length == 2)
            {
            var s = 'Select ending point';
            text(s,10,10,70,80);
        }
    } else {
        console.log("Enough points");
    }
    console.log(points_coord);

};


var resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click",()=>{location.reload()});

