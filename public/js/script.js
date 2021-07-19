/*
*This is to change the frosted window text from the original color 
*to a given color for and it will stay for 3 seconds .
*/
setTimeout(() => {
    let title = document.getElementById('frosted');
    title.style.color = "#fff";
    console.log(title);
}, 3000);

// const registerForm = document.querySelector('.register')
// registerForm.addEventListener('click', function(e){
//   e.preventDefault()
//   const email = registerForm['email'].value
//   const password = registerForm['password'].value
//   firebase.auth().createUserWithEmailAndPassword(email, password)
//   .then(() =>  window.location.assign('/profile'))
//   .then(() => registerForm.reset())  
// })


