const Pusher = require('pusher');
const Chatkit = require('@pusher/chatkit-server');

const pusher = new Pusher({
    appId: '906816',
    key: '1584d8f85246e88b597f',
    secret: '5c17017797f0d3cf2557',
    cluster: 'eu',
    encrypted: true
});

const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:e4efdafc-0767-447d-ba5c-9c77cea3fe19',
    key: '0ee65415-b8f1-4d60-8f8f-a7f2d471af19:it91zCY+L0hs6iDMDxggYcWK7RWqRQduc4Dcv7iG/kk=',
})

exports.AuthenSalonExchange = function (req, res) {
    var socketId = req.body.socket_id;
    var channel = req.body.channel_name;
    var presenceData = {
        user_id: socketId,
        user_info: {
            name: req.body.param1,
            accountAddress: req.body.param2,
        }
    };

    pusher.get({ path: `/channels/${channel}/users`, params: {} },
        function (error, request, response) {
            if (response.statusCode === 200) {
                var result = JSON.parse(response.body);
                var users = result.users;

                if (users.length >= 2) {
                    res.status(500).send('Too many people');
                } else {
                    var auth = pusher.authenticate(socketId, channel, presenceData);
                    res.send(auth);
                }
            }
        });
}


exports.AuthenSalonChat = function (req, res) {
    const authData = chatkit.authenticate({
        userId: req.query.user_id
    });

    res.status(authData.status).send(authData.body);
}

exports.CreateUser = function (req, res) {
    const { username } = req.body

    chatkit.createUser({
        id: username,
        name: username,
    })
        .then(() => {
            console.log('User created successfully');
            res.sendStatus(201)
        }).catch((err) => {
            console.log(err);
            if (err.error === 'services/chatkit/user_already_exists') {
                res.sendStatus(200)
            } else {
                res.status(err.status).json(err)
            }
        });
}