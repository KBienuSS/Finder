import {select, templates} from '../settings.js';

class Finder{
  constructor(element){
    const thisFinder = this;

    thisFinder.element = element;
    thisFinder.getElements();
    thisFinder.createData();
    thisFinder.render();
  }

  createData(){
    const thisFinder = this;
    thisFinder.grid = {};
    for(let row = 1; row <= 10; row++) {
      thisFinder.grid[row] = {};
      for(let col = 1; col <= 10; col++) {
        thisFinder.grid[row][col] = false;
      }
    }
    thisFinder.startAndFinishPoints = {};
    thisFinder.step = 1;
  }

  getElements(){
    const thisFinder = this;
    thisFinder.table = thisFinder.element.querySelector(select.finder.table);
    thisFinder.summaryWrapper = document.querySelector(select.containerOf.summary);
  }

  render(){
    const thisFinder = this;
    let pageData = null;
    
    switch(thisFinder.step) {
    case 1:
      pageData = { title: 'Draw routes', buttonText: 'Finish drawing' };
      break;
    case 2:
      pageData = { title: 'Pick start and finish', buttonText: 'Compute' };
      break;
    case 3:
      pageData = { title: 'The best route is', buttonText: 'Start again' };
      break;
    }
    const generatedHTML = templates.finder(pageData);
    thisFinder.element.innerHTML = generatedHTML;

    let table = '';
    table += '<tbody>';
    for(let row = 1; row <= 10; row++) {
      table += '<tr>';
      for(let col = 1; col <= 10; col++) {
        table += '<td class=”field” data-row="' + row + '" data-col="' + col + '"></td>';
      }
      table += '</tr>';
    }
    table += '</tbody>';
    thisFinder.element.querySelector(select.finder.table).innerHTML = table;

    // [DONE] add checking if this.finder.grid is empty or not 
    if(thisFinder.grid != null){
      for(let i = 1; i<= 10; i++){
        for(let y = 1; y <= 10; y++){
          if(thisFinder.grid[i][y] == true){
            document.querySelector('td[data-row="' + i + '"][data-col="' + y + '"]').classList.add(select.finder.choosedSpot);
          }
        }
      }
    }

    thisFinder.chooseRoad();
  }

  changeStep(newStep) {
    const thisFinder = this;
    thisFinder.step = newStep;
    thisFinder.render();
  }

  chooseRoad(){
    const thisFinder = this;

    if(thisFinder.step === 1){
      thisFinder.element.querySelector(select.finder.table).addEventListener('click', function(event){
        event.preventDefault();
        const row = parseInt(event.target.getAttribute('data-row'));
        const col = parseInt(event.target.getAttribute('data-col'));
        // [DONE] pick a spot on click , if spot have already class choose-spot, take it back

        if(thisFinder.grid[row][col] == true){
          // [DONE] if you want to take back class choose-spot, you have to check again if spot is somehow connected to other one
          if(thisFinder.canRemoveSpot(row,col) == true){
            // [DONE] deleting from object and removing class
            event.target.classList.remove(select.finder.choosedSpot);
            thisFinder.grid[row][col] = false;
            thisFinder.showPotentialSpots();
          } else {
            alert('You cannot unclick this spot because it will split path');
            return;
          }
        } else {
          // [DONE] change object to array
          const gridValues = Object.values(thisFinder.grid)
            .map(col => Object.values(col))
            .flat();

          if(gridValues.includes(true)){
            // [DONE] Add class to all spots which are available too pick (next to others one)
            thisFinder.showPotentialSpots();
            // [DONE] check if new spot is connected with already existing one if not show "X"
            if( col < 10 && thisFinder.grid[row][col+1] == true ||
               col > 1 && thisFinder.grid[row][col-1] == true ||
               row < 10 && thisFinder.grid[row+1][col] == true ||
               row > 1 && thisFinder.grid[row-1][col] == true ||
               row < 10 && col < 10 && thisFinder.grid[row+1][col+1] == true ||
               row < 10 && col > 1 && thisFinder.grid[row+1][col-1] == true ||
               row > 1 && col < 10 && thisFinder.grid[row-1][col+1] == true ||
               row > 1 && col > 1 && thisFinder.grid[row-1][col-1] == true){

              event.target.classList.add(select.finder.choosedSpot);
              thisFinder.grid[row][col] = true;
            } else {
              alert('Pick spot which is next to already picked spot');
              return;
            }
            
          }
          // [DONE] if this is first spot add class and add to object
          event.target.classList.add(select.finder.choosedSpot);
          thisFinder.grid[row][col] = true;
          thisFinder.showPotentialSpots();
        }
        
      });
      // [DONE] on click finish drawing, save picked spots and change button name on "compute"
      thisFinder.element.querySelector(select.finder.button).addEventListener('click', function(event){
        // [DONE] Check if at least 2 points are picked
        let count = 0;
  
        for(let row = 1; row <= 10; row++) {
          for(let col = 1; col <= 10; col++) {
            if(thisFinder.grid[row][col] === true) {
              count++;
            }
          }
        }

        event.preventDefault();
        if(count >= 2){
          thisFinder.changeStep(2);
        } else {
          alert('You have to pick at least 2 spots');
        }
      });

    } else if(thisFinder.step === 2){

      // [DONE] add new class to spots which are not picked (block cursos and hide hover color)
      for(let row = 1; row <= 10; row++) {
        for(let col = 1; col <= 10; col++) {
          if(thisFinder.grid[row][col] === false) {
            document.querySelector('td[data-row="' + row + '"][data-col="' + col + '"]').classList.add(select.finder.unavailable);
          }
        }
      }
      
      thisFinder.changeHoverColor('#2ECC71');

      thisFinder.element.querySelector(select.finder.table).addEventListener('click', function(event){
        event.preventDefault();
        const row = parseInt(event.target.getAttribute('data-row'));
        const col = parseInt(event.target.getAttribute('data-col'));

        // [DONE] first clicked spot after this should be green and second one should be red 
        if(thisFinder.grid[row][col] == true){
          if(thisFinder.startAndFinishPoints['start'] == null){

            thisFinder.startAndFinishPoints['start'] = {'row': row, 'col': col};
            event.target.classList.add(select.finder.startColor);
            thisFinder.changeHoverColor('#E74C3C');
          
          } else if (thisFinder.startAndFinishPoints['start'] != null && thisFinder.startAndFinishPoints['finish'] == null){
          
            thisFinder.startAndFinishPoints['finish'] = {'row': row, 'col': col};
            event.target.classList.add(select.finder.finishColor);
            thisFinder.changeHoverColor('#C24E00');
          } else {
            alert('You already picked start and finish point');
            return;
          }
        } else {
          alert('Mark a point on an existing route');
          return;
        }
      });

      thisFinder.element.querySelector(select.finder.button).addEventListener('click', function(event){
        event.preventDefault();
        // [DONE] Check if start and finish are picked
        if(thisFinder.startAndFinishPoints['finish'] != null && thisFinder.startAndFinishPoints['start'] != null){
          thisFinder.changeStep(3);
        } else {
          alert('Pick start and finish first!');
          return;
        }
      });
    } else if(thisFinder.step === 3){
      // [DONE] program should find the shortest way and display it on green spots
      thisFinder.countAllRouteFields();
      thisFinder.findLongestPath(thisFinder.startAndFinishPoints['start'],thisFinder.startAndFinishPoints['finish']);
      thisFinder.findShortestPath(thisFinder.startAndFinishPoints['start'],thisFinder.startAndFinishPoints['finish']);
      
      let summaryData = {
        fullRoute: thisFinder.pathFields,
        longestRoute: thisFinder.longestPath,
        shortestRoute: thisFinder.shortestPath,
      };

      const generatedHTML = templates.summary(summaryData);
      thisFinder.summaryWrapper.innerHTML = generatedHTML;

      thisFinder.summaryWrapper.classList.add(select.finder.summaryActive);
      document.querySelector(select.summary.mainDiv).classList.add(select.finder.summaryActive);
      document.querySelector(select.summary.summaryContainer).classList.add(select.finder.summaryActive);

      document.querySelector('.close-tab').addEventListener('click', function(){
        thisFinder.summaryWrapper.classList.remove(select.finder.summaryActive);
      });

      // [DONE] add new class to all spots (block cursos and hide hover color)
      for(let row = 1; row <= 10; row++) {
        for(let col = 1; col <= 10; col++) {
          document.querySelector('td[data-row="' + row + '"][data-col="' + col + '"]').classList.add(select.finder.unavailable);
        }
      }

      // [DONE] After clicking button, program should restart
      thisFinder.element.querySelector(select.finder.button).addEventListener('click', function(event){
        event.preventDefault();

        thisFinder.createData();
        thisFinder.changeStep(1);
      });  
    }
  }

  changeHoverColor(color){
    document.querySelectorAll('td').forEach(td => {
      td.addEventListener('mouseenter', (event) => {
        event.target.style.backgroundColor = color;
      });
      
      td.addEventListener('mouseleave', (event) => {
        event.target.style.backgroundColor = '';
      });
    });
  }

  findShortestPath(start, end) {

    const queue = [];
    const visited = {};
    
    for(let row = 1; row <= 10; row++) {
      visited[row] = {};
    }

    queue.push(Object.assign({}, start, {distance: 0}));  
    visited[start['row']][start['col']] = {parent: null, distance: 0};
    
    const directions = [
      {dr: -1, dc: 0}, 
      {dr: 1, dc: 0},   
      {dr: 0, dc: -1}, 
      {dr: 0, dc: 1},
      {dr: -1, dc: -1}, 
      {dr: 1, dc: 1},   
      {dr: 1, dc: -1}, 
      {dr: -1, dc: 1}  
    ];
   
    while(queue.length > 0) {
      const thisFinder = this;
      const current = queue.shift();
      
      if(current.row === end['row'] && current.col === end['col']) {
        return thisFinder.reconstructPath(visited, end);
      }
      
      for(const dir of directions) {
        const newRow = current.row + dir.dr;
        const newCol = current.col + dir.dc;
        
        if(newRow >= 1 && newRow <= 10 && 
          newCol >= 1 && newCol <= 10 &&
          thisFinder.grid[newRow][newCol] === true &&
          !visited[newRow][newCol]) {
          
          visited[newRow][newCol] = {
            parent: {row: current.row, col: current.col},
            distance: current.distance + 1
          };
          
          queue.push({row: newRow, col: newCol, distance: current.distance + 1});
        }
      }
    }
    
    return null;
  }

  findLongestPath(start, end) {
    const thisFinder = this;
    
    let longestPath = [];
    let maxLength = 0;
    
    const visited = {};
    for(let r = 1; r <= 10; r++) {
      visited[r] = {};
    }
    
    const directions = [
      {dr: -1, dc: 0},  
      {dr: 1, dc: 0},  
      {dr: 0, dc: -1},  
      {dr: 0, dc: 1},   
      {dr: -1, dc: -1}, 
      {dr: -1, dc: 1},  
      {dr: 1, dc: -1},
      {dr: 1, dc: 1}   
    ];
    
    function dfs(current, path) {
      visited[current.row][current.col] = true;

      path.push({
        row: current.row,
        col: current.col
      });
      
      if(current.row === end.row && current.col === end.col) {
        if(path.length > maxLength) {
          maxLength = path.length;
          longestPath = path.map(p => ({row: p.row, col: p.col}));
        }
      } else {
        for(const dir of directions) {
          const newRow = current.row + dir.dr;
          const newCol = current.col + dir.dc;
          
          if(newRow >= 1 && newRow <= 10 && 
            newCol >= 1 && newCol <= 10 &&
            thisFinder.grid[newRow][newCol] === true &&
            !visited[newRow][newCol]) {
            
            dfs({
              row: newRow,
              col: newCol
            }, path);
          }
        }
      }
      
      visited[current.row][current.col] = false;
      path.pop();
    }
    
    dfs({
      row: start.row,
      col: start.col
    }, []);
    
    thisFinder.longestPath = maxLength;
    return longestPath;
  }

  reconstructPath(visited, end) {
    const thisFinder = this;
    const path = [];
    let current = end;
    
    while(current) {
      path.unshift({row: current.row, col: current.col});
      const parent = visited[current.row] && 
               visited[current.row][current.col] && 
               visited[current.row][current.col].parent;
      current = parent;
    }
    
    thisFinder.shortestPath = path.length;
    
    for(let i = 0; i < path.length; i++) {
      const point = path[i]; 
      document.querySelector('td[data-row="' + point.row + '"][data-col="' + point.col + '"]').classList.add('shortest-way');
    }
  }

  countAllRouteFields(){
    const thisFinder = this;
    let pathFields = 0;
    for(let row = 1; row <= 10; row++) {
      for(let col = 1; col <= 10; col++) {
        if(thisFinder.grid[row][col] === true){
          pathFields++;
        }
      }
    }
    thisFinder.pathFields = pathFields;
  }
  canRemoveSpot(row,col){
    const thisFinder = this;
    
    let totalFields = 0;
    for(let r = 1; r <= 10; r++) {
      for(let c = 1; c <= 10; c++) {
        if(thisFinder.grid[r][c] === true) {
          totalFields++;
        }
      }
    }
    
    if(totalFields <= 2) {
      return true;
    }
    
    thisFinder.grid[row][col] = false;
    
    let startPoint = null;
    outer: for(let r = 1; r <= 10; r++) {
      for(let c = 1; c <= 10; c++) {
        if(thisFinder.grid[r][c] === true) {
          startPoint = {row: r, col: c};
          break outer;
        }
      }
    }
    
    if(!startPoint) {
      thisFinder.grid[row][col] = true;
      return true;
    }
    
    const visited = {};
    for(let r = 1; r <= 10; r++) {
      visited[r] = {};
    }
    
    const queue = [];
    queue.push(startPoint);
    visited[startPoint.row][startPoint.col] = true;
    let visitedCount = 1;
    
    const directions = [
      {dr: -1, dc: 0},
      {dr: 1, dc: 0}, 
      {dr: 0, dc: -1},
      {dr: 0, dc: 1},
      {dr: -1, dc: -1},
      {dr: -1, dc: 1},
      {dr: 1, dc: -1},
      {dr: 1, dc: 1}
    ];
    
    while(queue.length > 0) {
      const current = queue.shift();
      
      for(const dir of directions) {
        const newRow = current.row + dir.dr;
        const newCol = current.col + dir.dc;
        
        if(newRow >= 1 && newRow <= 10 && 
          newCol >= 1 && newCol <= 10 &&
          thisFinder.grid[newRow][newCol] === true &&
          !visited[newRow][newCol]) {
          
          visited[newRow][newCol] = true;
          queue.push({row: newRow, col: newCol});
          visitedCount++;
        }
      }
    }
    
    thisFinder.grid[row][col] = true;
    
    return visitedCount === (totalFields - 1);
  }

  showPotentialSpots(){
    const thisFinder = this;
    document.querySelectorAll('.potential-pick-spot').forEach(cell => {
      cell.classList.remove('potential-pick-spot');
    });


    for(let row = 1; row <= 10; row++) {
      for(let col = 1; col <= 10; col++) {
        if(thisFinder.grid[row][col] == true){
          if(col < 10 && thisFinder.grid[row][col+1] !== true){
            document.querySelector('td[data-row="' + row + '"][data-col="' + (col+1) + '"]').classList.add('potential-pick-spot');
          }
          if(col > 1 && thisFinder.grid[row][col-1] !== true){
            document.querySelector('td[data-row="' + row + '"][data-col="' + (col-1) + '"]').classList.add('potential-pick-spot');
          }
          if(row < 10 && thisFinder.grid[row+1][col] !== true){
            document.querySelector('td[data-row="' + (row+1) + '"][data-col="' + col + '"]').classList.add('potential-pick-spot');
          }
          if(row > 1 && thisFinder.grid[row-1][col] !== true){
            document.querySelector('td[data-row="' + (row-1) + '"][data-col="' + col + '"]').classList.add('potential-pick-spot');
          }
          if(row < 10 && col < 10 && thisFinder.grid[row+1][col+1] !== true){
            document.querySelector('td[data-row="' + (row+1) + '"][data-col="' + (col+1) + '"]').classList.add('potential-pick-spot');
          }
          if(row > 1 && col > 1 && thisFinder.grid[row-1][col-1] !== true){
            document.querySelector('td[data-row="' + (row-1) + '"][data-col="' + (col-1) + '"]').classList.add('potential-pick-spot');
          }
          if(row > 1 && col < 10 && thisFinder.grid[row-1][col+1] !== true){
            document.querySelector('td[data-row="' + (row-1) + '"][data-col="' + (col+1) + '"]').classList.add('potential-pick-spot');
          }
          if(row < 10 && col > 1 && thisFinder.grid[row+1][col-1] !== true){
            document.querySelector('td[data-row="' + (row+1) + '"][data-col="' + (col-1) + '"]').classList.add('potential-pick-spot');
          }
        }
      }
    }
  }

}

export default Finder;