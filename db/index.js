const pg = require('pg');

const client = new pg.Client('postgres://localhost/nfl');

// setup syncAndSeed with a query Var and then query it before closing
const syncAndSeed = async() => {
  const SQL = `
  DROP TABLE IF EXISTS players;
  DROP TABLE IF EXISTS teams;
  DROP TABLE IF EXISTS divisions;
  CREATE TABLE divisions (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL
  );
  CREATE TABLE teams (
    team_id INTEGER PRIMARY KEY NOT NULL,
    div_id INTEGER REFERENCES divisions(id),
    team_name VARCHAR(50) NOT NULL,
    coach VARCHAR(50) NOT NULL,
    qb VARCHAR(50) NOT NULL,
    off_rank INTEGER NOT NULL,
    def_rank INTEGER NOT NULL,
    last_playoffs BOOLEAN NOT NULL,
    probowlers INTEGER NOT NULL
  );
  CREATE TABLE players (
    id INTEGER PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    team_id INTEGER REFERENCES teams(team_id),
    position VARCHAR(50) NOT NULL
  );

  INSERT INTO divisions(id, name) VALUES(1, 'AFC West');
  INSERT INTO divisions(id, name) VALUES(2, 'AFC East');
  INSERT INTO divisions(id, name) VALUES(3, 'AFC North');
  INSERT INTO divisions(id, name) VALUES(4, 'AFC South');

  INSERT INTO teams(team_id, div_id, team_name, coach, qb, off_rank, def_rank, last_playoffs, probowlers) VALUES(1, 1, 'Kansas City Chiefs', 'Andy Reid', 'Patrick Mahomes', 2, 13, true, 5);
  INSERT INTO teams(team_id, div_id, team_name, coach, qb, off_rank, def_rank, last_playoffs, probowlers) VALUES(2, 1, 'Los Angeles Chargers', 'Brandon Staley', 'Justin Herbert', 13, 10, true, 4);

  INSERT INTO teams(team_id, div_id, team_name, coach, qb, off_rank, def_rank, last_playoffs, probowlers) VALUES(3, 2, 'Buffalo Bills', 'Sean McDermott', 'Josh Allen', 1, 3, true, 5);
  INSERT INTO teams(team_id, div_id, team_name, coach, qb, off_rank, def_rank, last_playoffs, probowlers) VALUES(4, 2, 'New York Jets', 'Robert Saleh', 'Zach Wilson', 22, 8, false, 3);

  INSERT INTO teams(team_id, div_id, team_name, coach, qb, off_rank, def_rank, last_playoffs, probowlers) VALUES(5, 3, 'Baltimore Ravens', 'John Harbaugh', 'Lamar Jackson', 6, 14, false, 5);
  INSERT INTO teams(team_id, div_id, team_name, coach, qb, off_rank, def_rank, last_playoffs, probowlers) VALUES(6, 3, 'Pittsburgh Steelers', 'Mike Tomlin', 'Kenny Picket', 17, 11, false, 4);

  INSERT INTO teams(team_id, div_id, team_name, coach, qb, off_rank, def_rank, last_playoffs, probowlers) VALUES(7, 4, 'Tennessee Titans', 'Mike Vrable', 'Ryan Tannehill', 7, 12, true, 5);
  INSERT INTO teams(team_id, div_id, team_name, coach, qb, off_rank, def_rank, last_playoffs, probowlers) VALUES(8, 4, 'Indianapolis Colts', 'Frank Reich', 'Matt Ryan', 23, 16, false, 3);

  INSERT INTO players(id, player_name, age, team_id, position) VALUES (1, 'Patrick Mahomes', 26, 1, 'QB');
  INSERT INTO players(id, player_name, age, team_id, position) VALUES (2, 'Travis Kelce', 30, 1, 'TE');

  INSERT INTO players(id, player_name, age, team_id, position) VALUES (3, 'Justin Herbert', 24, 2, 'QB');
  INSERT INTO players(id, player_name, age, team_id, position) VALUES (4, 'Joey Bosa', 27, 2, 'DE');

  INSERT INTO players(id, player_name, age, team_id, position) VALUES (5, 'Josh Allen', 24, 3, 'QB');
  INSERT INTO players(id, player_name, age, team_id, position) VALUES (6, 'Stephon Diggs', 27, 3, 'WR');

  INSERT INTO players(id, player_name, age, team_id, position) VALUES (7, 'Zach Wilson', 22, 4, 'QB');
  INSERT INTO players(id, player_name, age, team_id, position) VALUES (8, 'Sauce Gardner', 22, 4, 'CB');

  INSERT INTO players(id, player_name, age, team_id, position) VALUES (9, 'Lamar Jackson', 26, 5, 'QB');
  INSERT INTO players(id, player_name, age, team_id, position) VALUES (10, 'JK Dobbins', 23, 5, 'RB');

  INSERT INTO players(id, player_name, age, team_id, position) VALUES (11, 'Kenny Picket', 23, 6, 'QB');
  INSERT INTO players(id, player_name, age, team_id, position) VALUES (12, 'TJ Watt', 25, 6, 'DE');

  INSERT INTO players(id, player_name, age, team_id, position) VALUES (13, 'Ryan Tannehill', 29, 7, 'QB');
  INSERT INTO players(id, player_name, age, team_id, position) VALUES (14, 'Derek Henry', 28, 7, 'RB');

  INSERT INTO players(id, player_name, age, team_id, position) VALUES (15, 'Matt Ryan', 36, 8, 'QB');
  INSERT INTO players(id, player_name, age, team_id, position) VALUES (16, 'Jonathon Taylor', 25, 8, 'RB');

  

  `;
  await client.query(SQL);
}

module.exports = {
  client,
  syncAndSeed
};
