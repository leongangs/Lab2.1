const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// normalize incoming API paths (support /api prefix, common duplicates, and misspellings)
app.use((req, res, next) => {
    // remove leading /api or /API
    req.url = req.url.replace(/^\/api/i, '');

    // collapse duplicate '/users/users' -> '/users'
    req.url = req.url.replace(/\/(users)\/\1(\/|$)/i, '/$1$2');

    // fix common misspelling '/heath' -> '/health'
    req.url = req.url.replace(/^\/heath(\/|$)/i, '/health$1');

    next();
});

//sample data
let users = [
    { id: 1, name: 'Alice' , email: 'alice@example.com'},
    { id: 2, name: 'Bob' , email: 'bob@example.com' },
];

//routes
//app.get("health", (req, res) => {
//res.status(200).send("Server is healthy");
// });

// check status route
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// get all users
app.get('/users', (req, res) => res.json(users));

// get user by id
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// create new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { id: newId, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

// update user
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    res.json(user);
});

// delete user
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    users.splice(index, 1);
    res.json({ message: 'User deleted' });
});

// root route
app.get('/', (req, res) => res.json({ service: 'user_service', status: 'running' }));

// start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});