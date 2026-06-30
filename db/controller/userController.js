const db = require('../db');

class UserController {
    async createUser(req, res) {
        try {
            const { fio, job_title, pass, laboratory, department, management } = req.body;
            
            const newPerson = await db.query(
                `INSERT INTO person (fio, job_title, pass, laboratory, department, management) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
                [fio, job_title, pass, laboratory, department, management]
            );
            
            console.log('Пользователь сохранен в БД');
            
            res.json(newPerson.rows[0]);
            
        } catch (error) {
            console.error('Ошибка:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async deleteUser(req,res) {

        const { fio } = req.body;
            
        if (!fio) {
            return res.status(400).json({ error: 'ID пользователя обязателен' });
        }
        
        const user = await db.query('SELECT * FROM person WHERE fio = $1', [fio]);
        
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        
        await db.query('DELETE FROM person WHERE fio = $1', [fio]);
        
        console.log(`Пользователь ${fio} удален`);
        
        res.json({ 
            success: true, 
            message: 'Пользователь успешно удален',
            deletedUser: user.rows[0] 
        });
    }

    // Временная отладочная версия
async updatePassword(req, res) {
    try {
        const { fio, newPassword } = req.body;
        console.log('🔧 Получены данные:', { fio, newPassword });
        
        const userCheck = await db.query('SELECT * FROM person WHERE fio = $1', [fio]);
        console.log('👤 Найден пользователь до обновления:', userCheck.rows[0]);
        
        if (userCheck.rows.length === 0) {
            return res.json({ success: false, error: 'Пользователь не найден' });
        }
        
        await db.query('UPDATE person SET pass = $1 WHERE fio = $2', [newPassword, fio]);
        console.log('✅ Пароль обновлен в БД');
        
        const updatedUser = await db.query('SELECT * FROM person WHERE fio = $1', [fio]);
        console.log('👤 Пользователь после обновления:', updatedUser.rows[0]);
        
        res.json({
            success: true,
            message: 'Пароль успешно обновлен',
            user: updatedUser.rows[0]  // Должен содержать новый пароль
        });
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
        res.json({ success: false, error: 'Ошибка сервера: ' + error.message });
    }
}
}

module.exports = UserController;