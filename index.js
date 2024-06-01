const users = require('./user');
const express = require('express');
const { swaggerUi, swaggerDocs } = require('./swagger');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ruta de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios, opcionalmente ordenados por un atributo
 *     parameters:
 *       - in: query
 *         name: sortedBy
 *         schema:
 *           type: string
 *         required: false
 *         description: El atributo por el cual ordenar la lista de usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 123
 *                   email:
 *                     type: string
 *                     example: user1@mail.com
 *                   name:
 *                     type: string
 *                     example: user1
 *                   phone:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ['123', '456']
 */
app.get('/users', (req, res) => {
    const { sortedBy } = req.query;
    if (sortedBy) {
        const sortedUsers = [...users].sort((a, b) => {
            if (a[sortedBy] < b[sortedBy]) return -1;
            if (a[sortedBy] > b[sortedBy]) return 1;
            return 0;
        });
        return res.json(sortedUsers);
    }
    res.json(users);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 126
 *               email:
 *                 type: string
 *                 example: user4@mail.com
 *               name:
 *                 type: string
 *                 example: user4
 *               phone:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['987', '654']
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error de validación
 */
app.post('/users', (req, res) => {
    const newUser = req.body;
    const phoneExists = users.some(user =>
        user.phone.some(phone => newUser.phone.includes(phone))
    );

    if (phoneExists) {
        return res.status(400).json({ error: 'Phone numbers must be unique.' });
    }

    users.push(newUser);
    res.status(201).json(newUser);
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Actualizar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: updatedUser1@mail.com
 *               name:
 *                 type: string
 *                 example: updatedUser1
 *               phone:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['123', '456']
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 */
app.patch('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    const userIndex = users.findIndex(user => user.id == id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found.' });
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    res.json(users[userIndex]);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id == id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const deletedUser = users.splice(userIndex, 1);
    res.json(deletedUser[0]);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
