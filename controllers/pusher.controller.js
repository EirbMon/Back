const Pusher = require('pusher');

const pusher = new Pusher({
    appId: '906816',
    key: '1584d8f85246e88b597f',
    secret: '5c17017797f0d3cf2557',
    cluster: 'eu',
    encrypted: true
});

exports.AuthenSalon = function (req, res) {
    pusher.get({ path: '/channels/presence-my-channel/users', params: {} },
        function (error, request, response) {
            if (response.statusCode === 200) {
                var result = JSON.parse(response.body);
                var users = result.users;

                if (users.length >= 2) {
                    res.status(500).send('Too many people');
                } else {
                    var socketId = req.body.socket_id;
                    var channel = req.body.channel_name;
                    var presenceData = {
                        user_id: socketId,
                        user_info: {
                            name: req.body.param1,
                        }
                    };
                    var auth = pusher.authenticate(socketId, channel, presenceData);
                    res.send(auth);
                }
            }
        });
}
