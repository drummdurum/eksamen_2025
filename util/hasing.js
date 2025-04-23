import bcrypt from 'bcryptjs';

const saltRounds = 10; // Number of rounds to use when generating the salt

const password = 'guest1234'; // Password skal være en streng
const hashedPassword = bcrypt.hashSync(password, saltRounds); // Hash the password

console.log('Hashed Password:', hashedPassword); // Log the hashed password

// Simuler login
bcrypt.compare(password, hashedPassword).then((isSame) => {
    console.log('Password match:', isSame); // Log the result of the comparison (true or false)
});