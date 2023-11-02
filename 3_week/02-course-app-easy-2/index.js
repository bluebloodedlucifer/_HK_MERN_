const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "Sup3rS3cr3tK3y"

const generateJwtToken = (user) => {
  const payload = {username: user.username};
  return jwt.sign(payload, secretKey, {expiresIn: '1h'});
}

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization

  if(authHeader){
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if(err){
        res.status(403).json({message: "Invalid token"});
      }else{
        req.user = user
        next();
      }
    })
  }else{
    res.status(401).json({message: "No authorization token"});
  }
}
// ------------------------------------------------------------------


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const newAdmin = req.body;
  const alreadyExistingAdmin = ADMINS.find(a => a.username === newAdmin.username);
  if(alreadyExistingAdmin){
    res.status(403).json({message: "Admin with this username already exits"})
  }else{
    ADMINS.push(newAdmin);
    const token = generateJwtToken(newAdmin)
    res.json({ message: "Admin Created sucessfully", token})
  }
  
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if(admin){
    const token = generateJwtToken(admin);
    res.json({message: "Admin Logged in sucessfully", token});
  }else{
    res.status(403).json({message: "Admin authentication failed"})
  }
});

app.post('/admin/courses', authenticateJwt, (req, res) => {
  // logic to create a course
  const newCourse = req.body;
  newCourse.id = Math.floor(Math.random()*100000000);
  COURSES.push(newCourse);
  res.json({message: "Course Created Successfully", courseId: newCourse.id})
  
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
  const id = parseInt(req.params.courseId);
  const course = COURSES.find(a => a.id === id);
  if(course){
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  }else{
    res.status(404).json({message: "course with this id not found"})
  }
});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  // logic to get all courses
  res.json({courses: COURSES});
});



// ---------------------------------------------------------------

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const newUser = req.body;
  const alreadyExistingUser = USERS.find(a => a.username === newUser.username)
  if(alreadyExistingUser){
    res.status(403).json({message: "User already Exitsts"})
  }else{
    USERS.push(newUser);
    const token = generateJwtToken(newUser);
    res.json({message: "User created Successfully", token});
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  const user = USERS.find(a => a.username === username && a.password === password)
  if(user){
    USERS.push(user);
    const token = generateJwtToken(user);
    res.json({message: "User Logged in Successuflly", token});
  }else{
    res.status(403).json({message: "User authentication failed"});
  }

});

app.get('/users/courses', authenticateJwt, (req, res) => {
  // logic to list all courses
  const publishedCourses = COURSES.filter(a => a.published);
  res.json({courses: publishedCourses});
});

app.post('/users/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);
  const course = COURSES.find(a => a.id === id && a.published);
  if(course){
    const user = USERS.find(a => a.username === req.user.username);
    if(user){
      if(!user.purchasedCourses) user.purchasedCourses = [];
      user.purchasedCourses.push(course);
      res.json({message: "Course Purchased Successfully"});
    }else{
      res.status(404).json({message: "User not found"})
    }
  }else{
    res.status(404).json({message: "Course not found"});
  }

});

app.get('/users/purchasedCourses', authenticateJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find(a => a.username === req.user.username);
  if (user && user.purchasedCourses) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: 'No courses purchased' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
