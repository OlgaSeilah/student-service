import {ErrorBodyNotFound} from "../errorBodyNotFound.js";
import {scoreSchema, studentBaseSchema, updateStudentSchema} from "../validator/studentValidator.js";
import * as service from "../service/studentService.js";

/** controller is between business logic & repository. Is responsible for HTTP requests, error handling, etc **/


export const addStudent = async (req, res) => {
    const {error} = studentBaseSchema.validate(req.body);
    if (error) {
        res.status(400).json({error: error.details[0].message})
    }
    const success = await service.addStudent(req.body);
    res.sendStatus(success ? 201 : 409);

}

export const findStudent = async (req, res) => {
    const student = await service.findStudent(+req.params.id);
    if (student) {
        res.status(200).json(student);
    } else {
        res.status(404).json(new ErrorBodyNotFound(new Date().toISOString(), req.path
        ));
    }
}

export const updateStudent = async (req, res) => {
    const {error} = updateStudentSchema.validate(req.body);
    if (error) {
        res.status(400).json({error: error.details[0].message})
    }
    const student = await service.editStudent(+req.params.id, req.body);
    if (student) {
        res.status(200).json(student);
    } else {
        res.status(404).json(new ErrorBodyNotFound(new Date().toISOString(), req.path))
    }
}

export const deleteStudent = async (req, res) => {
    const student = await service.deleteStudent(+req.params.id);
    if (student) {
        res.status(200).json(student);
    } else {
        res.status(404).json(new ErrorBodyNotFound(
            new Date().toISOString(),
            req.path
        ));
    }
}

export const addScore = async (req, res) => {
    const {error} = scoreSchema.validate(req.body);
    if (error) {
        res.status(400).json({error: error.details[0].message})
    }
    const success = await service.addSubjectAndScore(+req.params.id, req.body.examName, +req.body.score);
    if (success) {
        res.sendStatus(204);
    } else {
        res.status(404).json(new ErrorBodyNotFound(new Date().toISOString(), req.path));
    }

}

export const findByName = async (req, res) => {
    const students = service.findStudentsByName(req.params.name);
    res.json(students);
}

export const countByNames = async (req, res) => {
    const names = Array.isArray(req.query.names) ? req.query.names : [req.query.names];
    const count = await service.countByNames(names);
    res.json(count)
}

export const findByMinScore = async (req, res) => {
    const students = await service.findByMinScoreForExam(req.params.exam, +req.params.minScore);
    res.json(students);
}