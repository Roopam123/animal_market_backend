import { app } from "./app.js";
import { connectDB } from "./db/connectDB.js";
const PORT = 8080;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("App is successfully connected at port", PORT);
    })
}).catch((error) => {
    console.log("Error on the db connection", error);
})