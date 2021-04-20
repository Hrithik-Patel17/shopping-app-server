// npm i express-jwt -> ExpressJWT library is used to protect the API in our servers

const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret, // for comparing the secret and API Auth
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] }, // (.*) -> means it will take the all the url of uploads like -> uploads/feautured/3 
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] }, // that means api should to user have only access the GET methods only   
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] }, // /\/api\/v1\/products(.*)/ -> is regular expression with API url
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
}

async function isRevoked(req, payload, done) { // Payload defines a data inside the token
    if(!payload.isAdmin) { // not payload then it will reject the token
        done(null, true)
    }

    done(); // if admin it will alow u to access 
}



module.exports = authJwt