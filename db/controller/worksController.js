const db = require('../db');

class WorksController{

    async addWorks(req, res) {
        const { content, subcontent, user_fio } = req.body;

        console.log(user_fio);

        const user = await db.query('SELECT * FROM person WHERE fio = $1', [user_fio]);

        if (user.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Пользователь не найден' 
            });
        }

        const person_id = user.rows[0].id 

        console.log(person_id);

        const result = await db.query('INSERT INTO works (content, subcontent, person_id) VALUES ($1, $2, $3) RETURNING *',
            [content, subcontent, person_id]
        );

        console.log('Работа сохранена в БД');
            
        res.json({
            success: true,
            message: 'Работа найдена',
            authUser: result.rows[0]
        });
    }

    async getContentForSelect(req, res) {
        const contents = await db.query('SELECT DISTINCT content FROM works WHERE content IS NOT NULL ORDER BY content');

        res.json({
            success: true,
            contents: contents.rows
        });
    }

    async getSubcontentForSelect(req, res) {
        const subcontents = await db.query('SELECT * FROM works WHERE subcontent IS NOT NULL ORDER BY subcontent');

        res.json({
            success: true,
            subcontents: subcontents.rows
        });
    }

    async getUpdatedSubcontent(req, res) {
        const { content_select } = req.body;
        const subcontent = await db.query('SELECT * FROM works WHERE content = $1 AND subcontent IS NOT NULL ORDER BY subcontent', [content_select]);

        res.json({
            success: true,
            subcontent: subcontent.rows
        });
    }

    async deleteWorks(req, res) {
        const {content, subcontent} = req.body;

        if (content != 'nothing' && subcontent != 'nothing') {
            const works = await db.query('SELECT * FROM works WHERE content = $1 AND subcontent = $2', [content, subcontent]);

            if (works.rows.length === 0) {
                return res.status(404).json({ error: 'Работа и/или подробности о ней не найдены'});
            }

            await db.query('DELETE FROM works WHERE content = $1 AND subcontent = $2', [content, subcontent]);
            
            res.json({
                success: true,
                message: 'Работа и подробности о ней удалены',
                deleteWorks: works.rows
            })
        }

        if (content != 'nothing' && subcontent == 'nothing') {
            const works = await db.query('SELECT * FROM works WHERE content = $1', [content]);

            if (works.rows.length === 0) {
                return res.status(404).json({ error: 'Работа не найдена'});
            }

            await db.query('DELETE FROM works WHERE content = $1', [content]);
            
            res.json({
                success: true,
                message: 'Работа и все подробности о ней удалены',
                deleteWorks: works.rows
            })
        }

        if (content == 'nothing' && subcontent != 'nothing') {
            const works = await db.query('SELECT * FROM works WHERE subcontent = $1', [subcontent]);

            if (works.rows.length === 0) {
                return res.status(404).json({ error: 'Подробности о работе не найдены'});
            }

            await db.query('DELETE FROM works WHERE subcontent = $1', [subcontent]);
            
            res.json({
                success: true,
                message: 'Подробности о работе удалены',
                deleteWorks: works.rows
            })
        }
    }

    async addEnterWorks(req, res) {
        const {content, subcontent, start_time, end_time} = req.body;

        const work_check = await db.query('SELECT * FROM works WHERE content = $1 AND subcontent = $2', 
            [content, subcontent]);
        
        if (work_check.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Работа и подробности о ней не найдены' 
            });
        }
        res.json({
            success: true,
            message: 'Данная работа есть в базе данных'
        });

    }
}

module.exports = WorksController;