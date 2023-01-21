require("dotenv").config();
const Sequelize = require("sequelize");

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  getAllAlbums: (req, res) => {
    sequelize
      .query(
        `
            SELECT album_id, imageURL, artist, title, format, release_year, description, date, rating, listenurl
            FROM albums
            ORDER BY artist, release_year, title;
        `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  createAlbum: (req, res) => {
    let {
      imageURL,
      artist,
      title,
      format,
      release_year,
      description,
      date,
      rating,
      listenurl,
    } = req.body;
    sequelize
      .query(
        `
        INSERT INTO albums (imageURL, artist, title, format, release_year, description, date, rating, listenurl)
        VALUES ('${imageURL}', '${artist}', '${title}', '${format}', ${release_year},'${description}', '${date}', ${rating}, '${listenurl}');
        `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  updateRating: (req, res) => {
    let { id } = req.params;
    let { type } = req.body;
    if (type === "minus") {
      sequelize
        .query(
          `
            UPDATE albums
            SET rating = rating - 1
            WHERE album_id = ${id};

            SELECT album_id, imageURL, artist, title, format, release_year, description, date, rating, listenurl
            FROM albums
            ORDER BY artist, release_year, title;
        `
        )
        .then((dbRes) => res.status(200).send(dbRes[0]))
        .catch((err) => console.log(err));
    } else {
      sequelize
        .query(
          `
            UPDATE albums
            SET rating = rating + 1
            WHERE album_id = ${id};

            SELECT album_id, imageURL, artist, title, format, release_year, description, date, rating, listenurl
            FROM albums
            ORDER BY artist, release_year, title;
        `
        )
        .then((dbRes) => res.status(200).send(dbRes[0]))
        .catch((err) => console.log(err));
    }
  },

  deleteAlbum: (req, res) => {
    let { id } = req.params;
    sequelize
      .query(
        `
            DELETE
            FROM albums
            WHERE album_id = ${id};
        `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  getSuggestion: (req, res) => {
    sequelize
      .query(
        `
            SELECT album_id, artist, title
            FROM albums
            ORDER BY RANDOM()
            LIMIT 1;
        `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },

  seed: (req, res) => {
    sequelize
      .query(
        `
        drop table if exists albums;

        create table albums (
            album_id serial primary key, 
            imageURL text,
            artist varchar(100) NOT NULL, 
            title varchar(100) NOT NULL, 
            format varchar(50), 
            release_year integer,
            description varchar(400), 
            date text,
            rating integer check (rating between 0 and 10),
            listenurl varchar(400)
        );
        
        insert into albums (imageURL, artist, title, format, release_year, description, date, rating, listenurl)
        values ('https://media.pitchfork.com/photos/5929c55513d197565213bfb6/1:1/w_600/0245d93c.jpg', 'Mulatu Astatke', 'Mulatu Of Ethiopia', 'LP', 1972, 'Ethio Jazz classic', '2022-12-22', 10, 'https://open.spotify.com/album/2FBK03r5TaxQmWMqLuOdF7?si=aVju8OsoSRu15Dk7XWy_Zw');
        `
      )
      .then(() => {
        console.log("DB seeded!");
        res.sendStatus(200);
      })
      .catch((err) => console.log("error seeding DB", err));
  },
};
