import mongoose from "mongoose";

export const dbConnect = ()=>{
    mongoose.connect('mongodb+srv://uneedinfo:utoKXUDl5G3LB7pQ@kubotapp.6lrox.mongodb.net/youNeedInfo?retryWrites=true&w=majority').then(()=>console.log("Connected to DB"))
}

const noticeSchema = new mongoose.Schema({
    id: Number,
    title: String,
    body: String
})

export const Notice = mongoose.model("Notice", noticeSchema)