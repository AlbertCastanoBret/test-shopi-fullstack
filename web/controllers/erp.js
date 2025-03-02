import { ERPSettings } from "../models/index.js";

export const erpController = {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @description Retrieve ERP settings from MongoDB
     */
    async getSettings(req, res) {
        try {
            const settings = await ERPSettings.findOne();
            res.status(200).json(settings);
        } catch (error) {
            console.log(error);
            res.status(400).send();
        }
    },
    
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @description Save new ERP settings to MongoDB
     */
    async saveSettings(req, res) {
        try {
            const { body } = req;
            await ERPSettings.updateOne({}, body, { upsert: true });
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(400).send();
        }
    }
};