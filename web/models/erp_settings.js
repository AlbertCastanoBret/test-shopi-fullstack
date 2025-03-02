import { model, Schema } from "mongoose";

const erpSettings = new Schema({
    ip: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    user:{
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

export const ERPSettings = model("erp_settings", erpSettings);