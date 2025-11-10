import * as repo from "../repository/studentRepository.js";

export const addStudent = (req, res) => {
    const success = repo.addStudent(req.body);
    if (success) {
        res.status(204).send();
    } else {
        res.status(409)
            .json({message: 'conflict: student with this id already exists'});
    }
}

export const findStudent = (req, res) => {
    const student = repo.findStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.status(200).json(studentWithoutPassword);
    } else {
        res.status(404).json({message: 'student not found'});
    }
}

export const updateStudent = (req, res) => {
    const student = repo.findStudent(+req.params.id);
    if (student) {
        const dataForUpdate = {
            id: +req.params.id,
            name: req.body.name,
            password: req.body.password,
        }
        const changedStudent = repo.editStudent(dataForUpdate);
        if (changedStudent) {
            res.status(200).json({changedStudent});
        } else {
            res.status(400).json({message: 'incorrect request'});
        }
    } else {
        res.status(404).json({message: 'student not found'});
    }

}

export const deleteStudent = (req, res) => {
    const success = repo.deleteStudent(+req.params.id);
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).json({message: 'student not found'});
    }
}

export const addScore = (req, res) => {
    const success = repo.addSubjectAndScore(+req.params.id, req.body)
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).json({message: 'student not found'});
    }
}

export const findByName = (req, res) => {
    const students = repo.findStudentsByName(req.params.name);
    if (students.length > 0) {

        res.status(200).json({students});
    } else {
        res.status(404).json({message: 'students not found'});
    }
}

export const countByNames = (req, res) => {
    const count = repo.countByNames(req.query.names); // req.query.names - array of names
    if (count > 0) {
        res.status(200).json({count});
    } else {
        res.status(404).json({message: 'students not found'});
    }
}

export const findByMinScore = (req, res) => {
    const examName = req.params.examName;
    const minScore = req.params.minScore;

    const students = repo.findByMinScoreForExam(examName, minScore);
    if (students.length > 0) {
        res.status(200).json({students});
    } else {
        res.status(404).json({message: 'students not found'});
    }
}