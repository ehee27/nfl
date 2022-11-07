const { client, syncAndSeed } = require('./db');

const express = require('express');

const app = express();

app.use(express.static('public'));

// primary get runs a try/catch - get the response from db (SELECT) and store in a varibale '.rows', which is an array of objects

//////////////////////////////////////////////////////////////////////

app.get('/', async (req, res, next) => {
  try {
    const response = await client.query('SELECT * FROM divisions;');
    // the results are stored in the .rows array
    const divisions = response.rows;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="style.css"></link>
          <title>NFL App</title>
          
        </head>
        <body>

        <header>
          <div id="logo">
          <div class="logo"><img src="logo.png" alt="nfl-logo" width="80px"></div>  
          </div>

            <nav>
              <div class="nav-button"><a href="/">HOME</a></div>
              <div class="nav-button"><a href="/page">PAGE2</a></div>
            </nav>

        </header>

          <div id="home-content">
            
            ${divisions.map(division => `
            <button>
            <a href="/divisions/${division.id}">${division.name}</a>
            </button>
            `).join('')}
            
          </div>

          <div id="content2">
            <div>CONTENT</div>
          </div>
  
        </body>
      </html>
    `);

  } catch (error) {
    next(error)
    console.log(error)
  }
});

app.get('/divisions/:id', async (req, res, next)=> {
  // tag id va with 'the requested id' of the route
  const id = req.params.id;
  try {
    // we use $1 as a placeholder, and then define the PH with [], in this case it's saying use the route 'id', so query whatever Table matches the route 'id'.
    
    const response = await client.query('SELECT * FROM divisions WHERE id = $1;', [req.params.id]);
    const divisions = response.rows[0];
    // now that we have the division per [0], we can query based off that matching 'league_id'. In this case we're saying query ALL TEAMS from teams that match the division id.
    
    const teamsRes = await client.query('SELECT * FROM teams WHERE div_id = $1;', [req.params.id]);
    // the matched teams are stored in the .rows array, now we can iterate down in the code
    const teams = teamsRes.rows;

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css"></link>
        <title>NFL App</title>
      </head>
      <body>

      <header>
        <div id="logo">
        <div>LOGO</div>
          
        </div>

          <nav>
            <div class="nav-button"><a href="/">HOME</a></div>
            <div class="nav-button"><a href="/page">PAGE2</a></div>
          </nav>

      </header>

      <div id="page-content">
      ${teams.map(team => `
      <div id="teams">

        <div id="team-profile">
        <div>${team.team_name}</div>
        <br>
        <div>Head Coach: ${team.coach}</div>
        <br>
        <div><button><a href="/teams/${team.team_id}">ROSTER</a></button></div>
        </div>
        
      </div>

    `).join('')}
      
    </div>

        <div id="content2">
          <div>CONTENT</div>
        </div>

      </body>
    </html>
  `)
    
  } catch (error) {
    next(error)
    console.log(error)
  }
});

//////////////////////////////////////////////////////////////////////

app.get('/teams/:id', async (req, res, next)=> {
  // tag id va with 'the requested id' of the route
  const id = req.params.id;
  try {
    // we use $1 as a placeholder, and then define the PH with [], in this case it's saying use the route 'id', so query whatever Table matches the route 'id'.
    const response = await client.query('SELECT * FROM teams WHERE team_id = $1;', [req.params.id]);
    const teams = response.rows[0];
    // now that we have the division per [0], we can query based off that matching 'league_id'. In this case we're saying query ALL TEAMS from teams that match the division id.
    const playersRes = await client.query('SELECT * FROM players WHERE team_id = $1;', [req.params.id]);
    // the matched teams are stored in the .rows array, now we can iterate down in the code
    const players = playersRes.rows;
    // to grab the team data
    const teamsRes = await client.query('SELECT * FROM teams WHERE team_id = $1;', [req.params.id]);
    // the matched teams are stored in the .rows array, now we can iterate down in the code
    const teams2 = teamsRes.rows;

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css"></link>
        <title>NFL App</title>
      </head>
      <body>

      <header>
        <div id="logo">
        <div>LOGO</div>
          
        </div>

          <nav>
            <div class="nav-button"><a href="/">HOME</a></div>
            <div class="nav-button"><a href="/page">PAGE2</a></div>
          </nav>

      </header>

      <div id="content">
      ${players.map(player => `
      <div>
      ${player.player_name} - 
      POS: ${player.position} -
      AGE: ${player.age}
      </div>


      `).join('')}
      
    </div>

        <div id="content2">
          <div>CONTENT</div>
        </div>

      </body>
    </html>
  `)
    
  } catch (error) {
    next(error)
    console.log(error)
  }
});
//////////////////////////////////////////////////////////////////////


const port = process.env.PORT || 3000;

const setUp = async () => {
  try {
    await client.connect();
    console.log('connected to db')
    app.listen(port, () => console.log(`listening on port ${port}`));
    await syncAndSeed();
    
  } catch (error) {
    console.log(error)
    
  }
}

setUp();



/* <link rel="stylesheet" href="style.css"></link> */

/* <div class="logo"><img src="" alt="nfl-logo" width="80px"></div> */

