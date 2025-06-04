const userRegister = (req, res) => {
  try {
    
    const user =  {
        name: req.body.name,
        email : req.body.email,
        password: req.body.password,
        confpass: req.body.confpass
    }

    return res.status(201).json({ 
        message: 'User Registered  successfully' ,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(400).json({ 
        message: 'Error registering user' 
    });
  }
}

const loginUser =  (req, res) => {
  try {

    return res.status(200).json({ 
        message: 'User Signed in  successfully' ,
    });
  } catch (error) {
    return res.status(400).json({ 
        message: 'Error logging in user' 
    });
  }
};


export default userRegister = {
  userRegister, loginUser
};



// add a  console.error('Error registering user:', error); in catch to debug it.

//console.error("Error: ", error)