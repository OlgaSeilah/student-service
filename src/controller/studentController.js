import * as repo from "../repository/studentRepository.js";

export const addStudent = (req, res) => {
    const success = repo.addStudent(req.body);
    if (success) {
        res.status(204).send();
    } else {
        res.status(409)
            .write('').send();
    }
}

export const findStudent = (req, res) => {
    const student = repo.findStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.status(200).json(studentWithoutPassword);
    } else {
        res.status(404).write('not found').send();
    }
}

export const updateStudent = (req, res) => {
    //todo update student name / password
}

export const deleteStudent = (req, res) => {
    //todo delete student
}

export const addScore = (req, res) => {
    //todo add score to student
}

export const findByName = (req, res) => {
    //todo find student by name
}

export const countByNames = (req, res) => {
    //todo count students by names
}

export const findByMinScore = (req, res) => {

}