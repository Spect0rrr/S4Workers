const db = require('../db');

class AuthController{
    async authUser(req,res) {
        const {fio, pass} = req.body;
        const user = await db.query('SELECT * FROM person WHERE fio = $1 AND pass = $2', [fio, pass]);
        if (user.rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: 'Неверные ФИО или пароль' 
            });
        }
        res.json({
            success: true,
            message: 'Пользователь найден',
            authUser: user.rows[0],
            laboratory: user.laboratory,
            department: user.department,
            management: user.management,
            job_title: user.job_title
        });

    }
}

module.exports = AuthController;