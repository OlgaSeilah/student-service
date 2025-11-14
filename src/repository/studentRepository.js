let collection;

export const initDb = (db) => {
    collection = db.collection('colleague');
}

export const addStudent = async ({id, name, password}) => {
    const isStudentExists = await findStudent(id);
    if (isStudentExists) {
        return false;
    }
    await collection.insertOne({_id: id, name, password, scores: {}});
    return true;
}

export const findStudent = async (id) => {
    return await collection.findOne({_id: id});
};


export const editStudent = async (id, data) => {
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: data},
        {returnDocument: 'after'}
    )
}

export const deleteStudent = async (id) => {
    const currentStudent = await findStudent(id);
    if (currentStudent) {
        collection.deleteOne({_id: id});
        return true;
    }
    return false;
};

export const addSubjectAndScore = async (id, data) => {
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: {[`scores.${data.examName}`]: data.score}},
    )
}

export const findStudentsByName = async (name) => {
    return await collection.find({name: name}).toArray();
}

export const countByNames = async (names) => {
    return await collection.countDocuments({name: {$in: names}});
}

export const findByMinScoreForExam = async (examName, minScore) => {
    return await collection.find({[`scores.${examName}`]: {$gte: minScore}}).toArray();
}