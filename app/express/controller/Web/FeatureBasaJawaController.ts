import { Request, Response } from "express";
import { detailJawa } from "../../../utils/basaJawa";

const nameApp = process.env.NAME_APP;
export class FeatureBasaJawaController {
    public static async detailJawa(req: Request, res: Response) {
        const ukara = req.params.ukara.replace(/\s/g, "-");
        const getting = await detailJawa(ukara);
        if (getting.data.status) {
            res.render('feature/basaJawa/detailBasaJawa', {
                titlePage: `${nameApp} | ${getting.data.name}  `,
                status: true,
                data: getting.data,
                message: req.flash('info'),
            })
        } else {
            res.render('feature/basaJawa/detailBasaJawa', {
                titlePage: `${nameApp} | Mboten Enten  `,
                status: false,
                message: req.flash('info'),
            })
        }
    }
}