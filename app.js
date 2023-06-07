const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");
const app = express();
app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB ERROR: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertMovieNameToPascalCase = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getAllMovieQuery = `
      SELECT 
        movie_name
      FROM 
        movie;`;
  const moviesArray = await db.all(getAllMoviesQuery);
  response.send(
    moviesArray.map((eachPlayer) => convertMovieNameToPascalCase(moviename))
  );
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
    INSERT INTO
        cricket_team (director_id, movie_name, lead_actor)
         
        VALUES
          ( ${directorId}, '${movieName}', '${leadActor}') ;`;
  const dbResponse = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT *
        FROM
         movie
        WHERE
          movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  console.log(movieId);
  response.send(convertDbObjectToResponseObject(movie));
});

app.put("/movies/:movieId/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const { movieId } = request.params;
  const updateMovieQuery = `
     UPDATE
        movie
     SET 
        director_id= ${directorId},
        movie_name = '${movieName}',
        lead_actor = '${leadActor}'     
     WHERE
          movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
      DELETE FROM
        movie
       WHERE
          movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

const convertDirectorDetailsToPascalsCase = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

app.get("/directors/", async (request, response) => {
  const getAllDirectorQuery = `
      SELECT 
        *
      FROM 
        director;`;
  const moviesArray = await db.all(getAllDirectorQuery);
  response.send(
    moviesArray.map((director) => convertDirectorDetailsToPascalsCase(director))
  );
});

const convertMovieNameToPascalsCase = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMovieQuery = `
    SELECT 
       movie_name
        FROM
         director INNER JOIN movie
         ON director.director_id = movie.director_id
        WHERE
          director.director_id = ${directorId};`;
  const movies = await db.all(getDirectorMovieQuery);
  console.log(directorId);
  response.send(
    movies.map((movienames) => convertMovieNameToPascalsCase(movienames))
  );
});
module.exports = app;
