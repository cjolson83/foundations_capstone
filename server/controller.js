require('dotenv').config()
const Sequelize = require('sequelize')

const {CONNECTION_STRING} = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect:'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})


module.exports = {
    getAllAlbums: (req, res) => {
        sequelize.query(`
            SELECT album_id, imageURL, artist, title, format, description, date, rating
            FROM albums
            ORDER BY artist, title
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    createAlbum: (req, res) => {
        let {imageURL, artist, title, format, description, date, rating} = req.body
        sequelize.query(`
        INSERT INTO albums (imageURL, artist, title, format, description, date, rating)
        VALUES ('${imageURL}', '${artist}', '${title}', '${format}', '${description}', '${date}', ${rating});
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
        },

    updateRating: (req, res) => {
        let { id } = req.params;
        let { type } = req.body;
        if (type === 'minus'){
        sequelize.query(`
            UPDATE albums
            SET rating = rating - 1
            WHERE album_id = ${id};
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
        } else {
        sequelize.query(`
            UPDATE albums
            SET rating = rating + 1
            WHERE album_id = ${id};
        `).then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
        }

    },
    
    
    deleteAlbum: (req,res) => {
        let { id } = req.params
        sequelize.query(`
            DELETE
            FROM albums
            WHERE album_id = ${id};
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    seed: (req, res) => {
        sequelize.query(`
        drop table if exists albums;

        create table albums (
            album_id serial primary key, 
            imageURL text,
            artist varchar(100) NOT NULL, 
            title varchar(100) NOT NULL, 
            format varchar(50), 
            description varchar(255), 
            date text,
            rating integer check (rating between 0 and 10)
        );
        
        insert into albums (imageURL, artist, title, format, description, date, rating)
        values ('https://media.pitchfork.com/photos/5929c55513d197565213bfb6/1:1/w_600/0245d93c.jpg', 'Mulatu Astatke', 'Mulatu Of Ethiopia', 'LP', 'Ethio Jazz classic', '2022-12-22', 10);
        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    }
    }

