const Pusher = require('pusher');

const pusher = new Pusher({
    appId: '906816',
    key: '1584d8f85246e88b597f',
    secret: '5c17017797f0d3cf2557',
    cluster: 'eu',
    encrypted: true
});

exports.AuthenSalon = function (req, res) {
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
                console.log('Je suis ici', channel);

                if (users.length >= 2) {
                    res.status(500).send('Too many people');
                } else {
                    var auth = pusher.authenticate(socketId, channel, presenceData);
                    res.send(auth);
                }
            }
        });
}
