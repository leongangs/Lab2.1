const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Sample student data
let students = [
    { id: 1, name: "Thanapond Buadeang", age: 19, major: "ITD", email: "s6787812666942@email.knutnb.ac.th" },
    { id: 2, name: "Jane Smith", age: 21, major: "Mathematics", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", age: 22, major: "Physics", email: "bob@example.com" },
    { id: 4, name: "Alice Brown", age: 19, major: "Chemistry", email: "alice@example.com" },
    { id: 5, name: "Charlie Wilson", age: 23, major: "Biology", email: "charlie@example.com" }
];

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to Student Management API');
});

// 1. GET all students
app.get('/api/students', (req, res) => {
    res.json(students);
});

// 2. GET student by ID
app.get('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);
    
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

// 3. POST - Create new student
app.post('/api/students', (req, res) => {
    const { name, age, major, email } = req.body;
    
    // Validation
    if (!name || !age || !major || !email) {
        return res.status(400).json({ error: 'All fields are required: name, age, major, email' });
    }
    
    const newStudent = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name,
        age: parseInt(age),
        major,
        email
    };
    
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// 4. PUT - Update student by ID
app.put('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    const { name, age, major, email } = req.body;
    const updatedStudent = {
        id: studentId,
        name: name || students[studentIndex].name,
        age: age ? parseInt(age) : students[studentIndex].age,
        major: major || students[studentIndex].major,
        email: email || students[studentIndex].email
    };
    
    students[studentIndex] = updatedStudent;
    res.json(updatedStudent);
});

// 5. DELETE - Delete student by ID
app.delete('/api/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    const deletedStudent = students.splice(studentIndex, 1)[0];
    res.json({ 
        message: 'Student deleted successfully',
        student: deletedStudent 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Student API running on port ${PORT}`);
    console.log(`📚 Endpoints available at http://localhost:${PORT}/api/students`);
});