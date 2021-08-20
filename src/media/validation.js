import {body} from 'express-validator'

export const mediaValidations=[
    body("Title").exists().withMessage("Title is mandatory"),
    body("Year").exists().withMessage("Year is mandatory"),
    body("Type").exists().withMessage("Type value is mandatory"),
    body("Poster").exists().withMessage("Poster is mandatory")
]