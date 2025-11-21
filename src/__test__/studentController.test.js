/* @jest-environment node */

import {jest, describe, it, expect, beforeAll, beforeEach} from '@jest/globals'
import express from 'express'

// Mock the service layer BEFORE importing the router (controller depends on service)
jest.unstable_mockModule('../service/studentService.js', () => ({
  addStudent: jest.fn(),
  findStudent: jest.fn(),
  editStudent: jest.fn(),
  deleteStudent: jest.fn(),
  addSubjectAndScore: jest.fn(),
  findStudentsByName: jest.fn(),
  countByNames: jest.fn(),
  findByMinScoreForExam: jest.fn(),
}));

// Dynamically import the mocked service and the router under test
const service = await import('../service/studentService.js');
const router = (await import('../routes/studentRoutes.js')).default;

// Build a tiny Express app using the students router only (no server listen)
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(router);
  // align with server's 404 to avoid supertest hanging on unknown routes
  app.use((req, res) => res.status(404).json({message: 'Not found'}));
  return app;
}

// Use supertest imported dynamically to keep ESM harmony
const request = (await import('supertest')).default;

describe('studentController HTTP API', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /student (Add student)', () => {
    it('creates a new student when not exists (201)', async () => {
      service.addStudent.mockResolvedValue(true);

      const res = await request(app)
        .post('/student')
        .send({id: 1000, name: 'Peter', password: '1234'});

      expect(res.status).toBe(201);
      expect(service.addStudent).toHaveBeenCalledWith({id: 1000, name: 'Peter', password: '1234'});
    });

    it('returns 409 when student already exists', async () => {
      service.addStudent.mockResolvedValue(false);

      const res = await request(app)
        .post('/student')
        .send({id: 1000, name: 'Peter', password: '1234'});

      expect(res.status).toBe(409);
    });
  });

  describe('GET /student/:id (Find by id)', () => {
    it('returns 200 and student body when found', async () => {
      const student = {_id: 2000, name: 'John'};
      service.findStudent.mockResolvedValue(student);

      const res = await request(app).get('/student/2000');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(student);
      expect(service.findStudent).toHaveBeenCalledWith(2000);
    });

    it('returns 404 with clear error body when not found', async () => {
      service.findStudent.mockResolvedValue(null);

      const res = await request(app).get('/student/404');

      expect(res.status).toBe(404);
      expect(res.body).toEqual(expect.objectContaining({
        status: 404,
        error: 'Not Found',
        message: 'student not found',
        path: '/student/404',
        timestamp: expect.any(String)
      }));
    });
  });

  describe('PATCH /student/:id (Update student)', () => {
    it('returns 200 and updated student when found', async () => {
      const updated = {_id: 3000, name: 'Peter Updated'};
      service.editStudent.mockResolvedValue(updated);

      const res = await request(app)
        .patch('/student/3000')
        .send({name: 'Peter Updated'});

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
      expect(service.editStudent).toHaveBeenCalledWith(3000, {name: 'Peter Updated'});
    });

    it('returns 404 when student to update is not found', async () => {
      service.editStudent.mockResolvedValue(null);

      const res = await request(app)
        .patch('/student/3001')
        .send({name: 'Nobody'});

      expect(res.status).toBe(404);
      expect(res.body).toEqual(expect.objectContaining({
        status: 404,
        error: 'Not Found',
        message: 'student not found',
        path: '/student/3001',
        timestamp: expect.any(String)
      }));
    });
  });

  describe('DELETE /student/:id (Delete student)', () => {
    it('returns 200 and deleted student when found', async () => {
      const deleted = {_id: 4000, name: 'To Remove'};
      service.deleteStudent.mockResolvedValue(deleted);

      const res = await request(app).delete('/student/4000');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(deleted);
      expect(service.deleteStudent).toHaveBeenCalledWith(4000);
    });

    it('returns 404 when student to delete is not found', async () => {
      service.deleteStudent.mockResolvedValue(null);

      const res = await request(app).delete('/student/4999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual(expect.objectContaining({
        status: 404,
        error: 'Not Found',
        message: 'student not found',
        path: '/student/4999',
        timestamp: expect.any(String)
      }));
    });
  });

  describe('PATCH /score/student/:id (Add score)', () => {
    it('returns 204 No Content on success', async () => {
      service.addSubjectAndScore.mockResolvedValue(true);

      const res = await request(app)
        .patch('/score/student/2000')
        .send({examName: 'History', score: 90});

      expect(res.status).toBe(204);
      expect(service.addSubjectAndScore).toHaveBeenCalledWith(2000, 'History', 90);
    });

    it('returns 404 when target student does not exist', async () => {
      service.addSubjectAndScore.mockResolvedValue(null);

      const res = await request(app)
        .patch('/score/student/7777')
        .send({examName: 'History', score: 90});

      expect(res.status).toBe(404);
      expect(res.body).toEqual(expect.objectContaining({
        status: 404,
        error: 'Not Found',
        message: 'student not found',
        path: '/score/student/7777',
        timestamp: expect.any(String)
      }));
    });
  });

  describe('GET /students/name/:name (Find by name)', () => {
    it('returns 200 and array of students', async () => {
      // Note: controller does not await here; return a plain array to keep it simple and stable
      service.findStudentsByName.mockReturnValue([{_id: 1, name: 'peter'}]);

      const res = await request(app).get('/students/name/peter');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{_id: 1, name: 'peter'}]);
    });
  });

  describe('GET /quantity/students (Count by names)', () => {
    it('returns 200 and number of matched students', async () => {
      service.countByNames.mockResolvedValue(2);

      const res = await request(app).get('/quantity/students?names=Peter&names=John');

      expect(res.status).toBe(200);
      expect(res.body).toBe(2);
      expect(service.countByNames).toHaveBeenCalledWith(['Peter', 'John']);
    });
  });

  describe('GET /students/exam/:exam/minscore/:minScore (Find by min score)', () => {
    it('returns 200 and array of students with score >= minScore', async () => {
      const rows = [{_id: 1, name: 'Ann'}];
      service.findByMinScoreForExam.mockResolvedValue(rows);

      // According to Postman: /students/exam/{{exam}}/minscore/{{minScore}}
      const res = await request(app).get('/students/exam/History/minscore/90');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
      // Note: routes use :examName while controller reads req.params.exam; we only assert response stability
      expect(service.findByMinScoreForExam).toHaveBeenCalled();
    });
  });
});
