const express = require('express');
const app = express();
const users = require('./user');

const PORT = process.env.PORT || 3000;

/**
 * Middleware para parsear el cuerpo de las solicitudes como JSON.
 * @middleware
 */
app.use(express.json());

/**
 * Obtiene la lista de usuarios.
 * @route GET /users
 * @returns {Object[]} Lista de usuarios.
 */
app.get('/users', (req, res) => {
    res.json(users);
});

/**
 * Obtiene la lista de usuarios, opcionalmente ordenados por un atributo.
 * @route GET /users?sortedBy={attribute}
 * @param {string} sortedBy - El atributo por el cual ordenar la lista de usuarios.
 * @returns {Object[]} Lista de usuarios ordenada.
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
 * Almacena un nuevo usuario en la lista de usuarios.
 * @route POST /users
 * @param {Object} req.body - Los datos del nuevo usuario.
 * @returns {Object} El usuario almacenado.
 * @throws {Error} Si algún número de teléfono ya existe en la lista de usuarios.
 */
app.post('/users', (req, res) => {
    const newUser = req.body;
    const phoneExists = users.some(user =>
        user.phone.some(phone => newUser.phone.includes(phone))
    );

    if (phoneExists) {
        return res.status(400).json({ error: 'Los números de teléfono deben ser únicos' });
    }

    users.push(newUser);
    res.status(201).json(newUser);
});

/**
 * Actualiza un atributo de un usuario por su ID.
 * @route PATCH /users/:id
 * @param {string} req.params.id - El ID del usuario a actualizar.
 * @param {Object} req.body - Los datos actualizados del usuario.
 * @returns {Object} El usuario actualizado.
 * @throws {Error} Si el usuario no se encuentra.
 */
app.patch('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    const userIndex = users.findIndex(user => user.id == id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser };
    res.json(users[userIndex]);
});

/**
 * Elimina un usuario por su ID.
 * @route DELETE /users/:id
 * @param {string} req.params.id - El ID del usuario a eliminar.
 * @returns {Object} El usuario eliminado.
 * @throws {Error} Si el usuario no se encuentra.
 */
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id == id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const deletedUser = users.splice(userIndex, 1);
    res.json(deletedUser[0]);
});

/**
 * Inicia el servidor en el puerto especificado.
 */
app.listen(PORT, () => {
    console.log(`El servidor se está ejecutando en el puerto ${PORT}`);
});
