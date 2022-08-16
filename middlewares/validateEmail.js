const validateEmail = (email) => {
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/i;
    return emailRegex.test(email);
}

module.exports = validateEmail;