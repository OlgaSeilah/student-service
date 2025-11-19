import * as repo from "../repository/studentRepository.js";

/** business logic is here **/

export const addStudent = async ({id, name, password}) => {
    const existingStudent = await findStudent(id);
    if (existingStudent) {
        return false;
    }
    await repo.createStudent({_id: id, name, password});
    return true;
}

export const findStudent = async (id) => {
    const student = await repo.findById(id);
    if (student) {
        student.password = undefined;
    }
    return student;
};


export const editStudent = async (id, data) => {
    const student = await repo.updateStudent(id, data);
    if (student) {
        student.password = undefined;
        student.scores = undefined; // todo ?
    }
    return student;

}

export const deleteStudent = async (id) => {
    const student = await repo.deleteStudentById(id);
    if (student) {
        student.password = undefined;
    }
    return student;
};

export const addSubjectAndScore = async (id, examName, score) => {
    const student = await findStudent(id);
    if (student) {
        await repo.updateStudentScores(id, examName, score);
    }
    return student;
}

export const findStudentsByName = async (name) => {
    return repo.findStudentByName(name);
}

export const countByNames = async (names) => {
    return repo.countStudentsByName(names);
}

export const findByMinScoreForExam = async (examName, minScore) => {
    return repo.findStudentsByMinScore(examName, minScore);
}