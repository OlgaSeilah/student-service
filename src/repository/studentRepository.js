let collection;

export const init = db => collection = db.collection('colleague');

export const addStudent = async ({id, name, password}) => {
    const existingStudent = await collection.findOne({_id: id});
    if (existingStudent) {
        return false;
    }
    await collection.insertOne({_id: id, name, password, scores: {}});
    return true;
}

export const findStudent = async id => {
    return await collection.findOne({_id: id});
}

export const deleteStudent = async id => {
    return await collection.findOneAndDelete({_id: id});
}

export const updateStudent = async (id, data) => {
    return await collection.findOneAndUpdate(
        {_id: id}, // ищем по ключу
        {$set: data}, // установить поля, которые переданы в объекте дата
        {returnDocument: 'after'} // опция - вернуть документ ДО апдейта или ПОСЛЕ. здесь - ПОСЛЕ
    );
}

export const addScore = async (id, exam, score) => {
    return await collection.findOneAndUpdate(
        {_id: id},
        {
            $set: {[`scores.${exam}`]: score} // в квадратных скобках - вычисляемое значение, см док-ю монго
        }
    )
}

export const findByName = async (name) => {
    return await collection.find({name}).toArray();
}

export const countByNames = async (names) => {
    return await collection.find({name: {$in: names}}).count();
}

export const findByMinScore = async (exam, minScore) => {
    return await collection.find({[`scores.${exam}`]: {$gte: minScore}}).toArray();
}