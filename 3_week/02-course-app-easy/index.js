const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];


app.get('/admin', (req, res) => {
  res.json(ADMINS);
})
app.get('/users', (req, res) => {
  res.json(USERS);
})

// Admin Auth

const adminAuth = (req, res, next) => {
  
  const { username, password } = req.headers;

  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
}

// User Auth

const userAuth = (req, res, next) => {
  const {username, password} = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if(user){
    req.user = user;
    next();
  }
  else res.status(403).json({message: "User authentication failed"});
}

const findIndex = (id, arr) => {
  for(let i = 0; i<arr.length; i++){
    if(id === arr[i].id) return i;
  }
  return -1;
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin

  const newAdmin = {
    username: req.body.username,
    password: req.body.password
  }

  const admin = ADMINS.find(a => a.username === newAdmin.username);
  if(admin) res.status(409).json({message: "Admin with this username already Exists"});
  else{
    ADMINS.push(newAdmin)
    res.json({
      message: "New Admin Created Successfully"
    })
  }

});

app.post('/admin/login', adminAuth, (req, res) => {
  // logic to log in admin
  res.json({
    message: "Logged in successfully"
  })
});

app.post('/admin/courses', adminAuth, (req, res) => {
  // logic to create a course
  const newCourse = {
    id: Math.floor(Math.random()*1000000),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
    published: req.body.published
  }
  
  COURSES.push(newCourse);
  res.json({
    message: `Course Created Successfully, couserID ${newCourse.id}`
  });

});

app.put('/admin/courses/:courseId', adminAuth, (req, res) => {
  // logic to edit a course
  courseIndex = findIndex(parseInt(req.params.courseId), COURSES);
  if(courseIndex === -1)    res.status(404).json({ message: 'course with the given id not found' });
  else{
    COURSES[courseIndex].title = req.body.title;
    COURSES[courseIndex].description = req.body.description;
    COURSES[courseIndex].price = req.body.price;
    COURSES[courseIndex].imageLink = req.body.imageLink;
    COURSES[courseIndex].published = req.body.published;

    res.json({message: "course updated successfully"});
  }
});

app.get('/admin/courses', adminAuth, (req, res) => {
  // logic to get all courses
  res.json(COURSES);
});












// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: []
  }
  USERS.push(newUser);
  res.json({message: "User created successfully"})
});

app.post('/users/login', userAuth, (req, res) => {
  // logic to log in user
  res.json({message: "User Logged in Successfully"})
});

app.get('/users/courses', userAuth, (req, res) => {
  // logic to list all courses
  const publishedCourses = COURSES.filter(c => c.published === true);
  res.json({courses: publishedCourses});

});

app.post('/users/courses/:courseId', userAuth, (req, res) => {
  // logic to purchase a course
  const id = parseInt(req.params.courseId);
  const course = COURSES.find(a => a.id === id && a.published);
  if(course){
    req.user.purchasedCourses.push(id);
    res.json({message: "Course purchased successfully"});
  }else res.status(404).json({message: "course with this id doesn't exits"});

});

app.get('/users/purchasedCourses', userAuth, (req, res) => {
  // logic to view purchased courses
  // const {username} = req.headers;

  // const user = USERS.find(u => u.username === username);
  const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
  res.json({courses: purchasedCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
