import {Student} from "../model/student.js";

const students = new Map();

export const addStudent = ({id, name, password}) => {
    if (students.has(id)) {
        return false;
    }
    students.set(id, new Student(id, name, password));
    return true;
}

export const findStudent = (id) => {
    return students.get(id)
};


export const editStudent = ({id, name, password}) => {
    const currentStudent = findStudent(id);
    if (currentStudent) {
        currentStudent.name = name;
        currentStudent.password = password; //todo handle empty strings
        return true;
    } else {
        return false;
    }
}

export const deleteStudent = (id) => {
    const currentStudent = findStudent(id);
    if (currentStudent) {
        students.delete(id);
        return true;
    } else {
        return false;
    }
};

export const addSubjectAndScore = (id, {examName, score}) => {
    const currentStudent = findStudent(id);
    if (currentStudent) {
        currentStudent.scores[examName] = score;
        return true;
    } else {
        return false;
    }
}

export const findStudentsByName = (name) => {
    const studentsArray = [];
    for (const student of students.values()) {
        if (student.name === name) {
            const {password, ...studentWithoutPassword} = student;
            studentsArray.push(studentWithoutPassword);
        }
    }
    return studentsArray;
}

export const countByNames = (names) => {
    const studentsArray=[];
    for (const name of names) {
        const studentsByName = findStudentsByName(name);
        studentsArray.push(...studentsByName);
    }
    return studentsArray.length;
}

export const findByMinScoreForExam = (examName, minScore) => {
    const studentsArray = [];

    for (const student of students.values()) {
        const score = student.scores[examName];
        if (score >= minScore) {
            const {password, ...studentWithoutPassword} = student;
            studentsArray.push(studentWithoutPassword);
        }
    }
    return studentsArray;
}