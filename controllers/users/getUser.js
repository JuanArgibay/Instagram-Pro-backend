const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');

const getUser = async (req, res, next) => {
    try {
        const { idUser } = req.params;
        const user = await selectUserByIdQuery(idUser);

        res.send({
            status: 'ok',
            data: {
                user,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getUser;
