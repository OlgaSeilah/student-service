import * as repo from "../repository/studentRepository.js";
import {ErrorBodyNotFound} from "../errorBodyNotFound.js";

export const addStudent = async (req, res) => {
    const success = await repo.addStudent(req.body);
    if (success) {
        res.status(204).send();
    } else {
        res.status(409)
            .json({message: 'conflict: student with this id already exists'});
    }
}

export const findStudent = async (req, res) => {
    const student = await repo.findStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.status(200).json(studentWithoutPassword);
    } else {
        res.status(404).json(new ErrorBodyNotFound(

        ));
    }
}

export const updateStudent = async (req, res) => {
    const student = await repo.findStudent(+req.params.id);
    if (student) {
        const changedStudent = await repo.editStudent(+req.params.id, req.body);
        if (changedStudent) {
            const {password, ...studentWithoutPassword} = changedStudent;
            res.status(200).json({studentWithoutPassword});
        } else {
            res.status(400).json({message: 'incorrect request'});
        }
    } else {
        res.status(404).json(new ErrorBodyNotFound(
            new Date().toISOString(),
            req.path
        ));
    }

}

export const deleteStudent = async (req, res) => {
    const success = await repo.deleteStudent(+req.params.id);
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).json(new ErrorBodyNotFound(
            new Date().toISOString(),
            req.path
        ));
    }
}

export const addScore = async (req, res) => {
    const success = await repo.addSubjectAndScore(+req.params.id, req.body)
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).json(new ErrorBodyNotFound(
            new Date().toISOString(),
            req.path
        ));
    }
}

export const findByName = async (req, res) => {
    const students = await repo.findStudentsByName(req.params.name);
    if (students.length > 0) {
        res.status(200).json({students});
    } else {
        res.status(404).json(new ErrorBodyNotFound(
            new Date().toISOString(),
            req.path
        ));
    }
}

export const countByNames = async (req, res) => {
    let params = req.query.names;
    if (typeof params === 'string') {
        params = Array.of(params);
    }
    const count = await repo.countByNames(params);

    if (count > 0) {
        res.status(200).json({count});
    } else {
        res.status(404).json(new ErrorBodyNotFound(
            new Date().toISOString(),
            req.path
        ));
    }
}

export const findByMinScore = async (req, res) => {
    const examName = req.params.examName;
    const minScore = +req.params.minScore;

    const students = await repo.findByMinScoreForExam(examName, minScore);
    if (students.length > 0) {
        res.status(200).json({students});
    } else {
        res.status(404).json(new ErrorBodyNotFound(
            new Date().toISOString(),
            req.path
        ));
    }
}