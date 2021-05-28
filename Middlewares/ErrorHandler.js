module.exports = (err, req, res, next) => {
    console.log(err.name);
    if (err.name === 'SequelizeValidationError' ) {
        let arrErrors = [];
     
        err.errors.forEach(el => {
            arrErrors.push(el.message)
        });
        res.status(400).json(arrErrors)
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ message : "Email / Username already exist"})
    } else if (err.name === 'Unauthorized') {
        res.status(401).json({ message : "Invalid email / password"})
    } else if (err.name === "Cat not found") {
        res.status(404).json({ message: "error not found" });
    } else if (err.name === "not logged in"){
        res.status(401).json({ message: "please login first" });
    } else if (err.name === "Invalid JWT") {
        res.status(401).json({ message : 'Invalid JWT token'})
    } else if (err.name === 'SequelizeDatabaseError') {
        res.status(400).json({ message : "Invalid Input" })
    } else {
        res.status(500).json({ message:  err.message || "Internal server error" });
    }
}